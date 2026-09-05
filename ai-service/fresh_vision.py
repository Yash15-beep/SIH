"""Fresh Vision inference for KisanSetu listings.

Uses the trained models supplied in ``Fresh-Vision/``.  Models are loaded only
when a farmer submits a photo so the rest of the AI service stays lightweight.
"""
import io
import json
import os

import numpy as np
from PIL import Image

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import decode_predictions, preprocess_input
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.getenv("FRESH_VISION_MODEL_DIR", os.path.join(ROOT, "Fresh-Vision"))
FRESHNESS_LABELS = {0: "fresh", 1: "rotten", 2: "slightly_rotten", 3: "very_fresh", 4: "very_rotten"}
CALIBRATION = {2: 0.3, 1: 1.5, 4: 2.5}
FOOD_KEYWORDS = ("apple", "orange", "lemon", "strawberry", "pineapple", "banana", "fig", "jackfruit", "pomegranate", "squash", "pepper", "cucumber", "mushroom", "granny smith", "corn", "cabbage", "broccoli", "cauliflower", "zucchini", "artichoke", "food", "fruit", "vegetable", "grocery", "produce", "dish", "plate")
MODELS = {}


def _pretty(value):
    return value.replace("-", " ").replace("_", " ").title()


def _models():
    if MODELS:
        return MODELS
    files = {
        "identifier": "fruit_veg_identifier.h5",
        "freshness": "freshness_classifier_v2.h5",
        "classes": "class_indices.json",
    }
    missing = [filename for filename in files.values() if not os.path.exists(os.path.join(MODEL_DIR, filename))]
    if missing:
        raise FileNotFoundError("Fresh Vision model files are missing: " + ", ".join(missing))
    with open(os.path.join(MODEL_DIR, files["classes"])) as handle:
        classes = {value: key for key, value in json.load(handle).items()}
    MODELS.update(
        identifier=load_model(os.path.join(MODEL_DIR, files["identifier"])),
        freshness=load_model(os.path.join(MODEL_DIR, files["freshness"])),
        gatekeeper=MobileNetV2(weights="imagenet"),
        classes=classes,
    )
    return MODELS


def analyze_image(raw):
    """Return Fresh Vision's calibrated produce and freshness assessment."""
    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as exc:
        raise ValueError("Upload a valid JPG, PNG, or WebP image.") from exc

    models = _models()
    tensor = preprocess_input(np.expand_dims(keras_image.img_to_array(image.resize((224, 224))), axis=0))
    gatekeeper = decode_predictions(models["gatekeeper"].predict(tensor, verbose=0), top=5)[0]
    gatekeeper_label, gatekeeper_confidence = gatekeeper[0][1], float(gatekeeper[0][2]) * 100
    is_produce = any(any(keyword in label.lower() for keyword in FOOD_KEYWORDS) for _, label, _ in gatekeeper)

    produce_probabilities = models["identifier"].predict(tensor, verbose=0)[0]
    produce_index = int(np.argmax(produce_probabilities))
    produce_confidence = float(produce_probabilities[produce_index]) * 100
    freshness_probabilities = models["freshness"].predict(tensor, verbose=0)[0].astype(np.float64)
    for index, multiplier in CALIBRATION.items():
        freshness_probabilities[index] *= multiplier
    freshness_probabilities /= freshness_probabilities.sum()
    freshness_index = int(np.argmax(freshness_probabilities))
    freshness_key = FRESHNESS_LABELS[freshness_index]

    if not is_produce and gatekeeper_confidence > 20:
        return {"status": "rejected", "detail": f"This looks like {_pretty(gatekeeper_label)}. Please upload a fruit or vegetable."}
    if produce_confidence < 65:
        return {"status": "uncertain", "detail": "Image is unclear. Try a closer, well-lit photo.", "produce_confidence": round(produce_confidence, 2)}

    quality_grade = "Grade A" if freshness_key in ("very_fresh", "fresh") else "Grade B" if freshness_key == "slightly_rotten" else "Grade C"
    return {
        "status": "ok",
        "produce": _pretty(models["classes"][produce_index]),
        "freshness": _pretty(freshness_key),
        "freshness_key": freshness_key,
        "quality_grade": quality_grade,
        "produce_confidence": round(produce_confidence, 2),
        "freshness_confidence": round(float(freshness_probabilities[freshness_index]) * 100, 2),
        "shelf_life": {"very_fresh": "5-7 days", "fresh": "3-5 days", "slightly_rotten": "1-2 days", "rotten": "Discard", "very_rotten": "Discard"}[freshness_key],
    }


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        with open(sys.argv[1], "rb") as f:
            print(json.dumps(analyze_image(f.read())))

