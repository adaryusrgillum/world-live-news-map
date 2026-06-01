"""
Local Parler-TTS server for the World Live News Map.

Serves a Southern-accented female voice over HTTP so the app's AI Anchor / Radio
can speak. First run downloads the model (~1 GB) from Hugging Face; after that it
works offline. CPU inference is slow (~10-30s per segment) — that's expected.

Run:  python tts/parler_server.py
Endpoints:
  GET  /health           -> {"ok": true, "device": "...", "ready": true}
  POST /tts  {text, description?}  -> audio/wav
"""

import io
import json
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import numpy as np
import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

MODEL_ID = "parler-tts/parler-tts-mini-v1"
HOST, PORT = "127.0.0.1", 5005

# The voice. Parler-TTS is *prompted* with a natural-language description, so this
# is where the "Southern girl" comes from — tweak it to taste.
DEFAULT_DESCRIPTION = (
    "A young woman with a warm, friendly Southern American accent speaks at a natural, "
    "relaxed pace with a soft, expressive tone. Very clear, high quality studio recording "
    "with no background noise."
)

print(f"[parler] loading {MODEL_ID} (first run downloads ~1GB)…")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL_ID).to(DEVICE)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
SAMPLE_RATE = model.config.sampling_rate
print(f"[parler] ready on {DEVICE}, sample rate {SAMPLE_RATE}")


def synthesize(text, description):
    desc_ids = tokenizer(description, return_tensors="pt").input_ids.to(DEVICE)
    prompt_ids = tokenizer(text, return_tensors="pt").input_ids.to(DEVICE)
    with torch.no_grad():
        generation = model.generate(input_ids=desc_ids, prompt_input_ids=prompt_ids)
    audio = generation.cpu().numpy().squeeze()
    audio = np.clip(audio, -1.0, 1.0)
    pcm = (audio * 32767.0).astype("<i2")
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    return buffer.getvalue()


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/health"):
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "device": DEVICE, "ready": True}).encode())
        else:
            self.send_response(404)
            self._cors()
            self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
            text = (body.get("text") or "").strip()[:1500]
            description = (body.get("description") or DEFAULT_DESCRIPTION).strip()
            if not text:
                raise ValueError("no text")
            wav_bytes = synthesize(text, description)
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(wav_bytes)))
            self.end_headers()
            self.wfile.write(wav_bytes)
        except Exception as error:  # noqa: BLE001
            self.send_response(500)
            self._cors()
            self.end_headers()
            self.wfile.write(str(error).encode())

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    print(f"[parler] serving on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
