from pathlib import Path
import io
import json

import numpy as np
import tensorflow as tf

from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image


# =========================================================
# CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
        BASE_DIR
        / "model"
        / "banana_disease_model.keras"
)

CLASS_NAMES_PATH = (
        BASE_DIR
        / "model"
        / "class_names.json"
)

IMAGE_SIZE = (224, 224)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png"
}


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="BananaCare AI Service",
    description="AI service for banana leaf disease detection",
    version="1.0.0"
)


# =========================================================
# LOAD MODEL
# =========================================================

print("Loading BananaCare AI model...")

try:

    model = tf.keras.models.load_model(
        MODEL_PATH
    )

    with open(
            CLASS_NAMES_PATH,
            "r",
            encoding="utf-8"
    ) as file:

        class_names = json.load(file)

    print("BananaCare AI model loaded successfully.")
    print("Classes:", class_names)

except Exception as error:

    print(
        "Failed to load BananaCare AI model:"
    )

    print(error)

    raise


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "service": "BananaCare AI",
        "status": "running",
        "modelLoaded": True,
        "classes": class_names
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "UP",
        "model": "banana_disease_model",
        "classes": class_names
    }


# =========================================================
# PREDICT DISEASE
# =========================================================

@app.post("/predict")
async def predict_disease(
        image: UploadFile = File(...)
):

    # -----------------------------------------------------
    # Validate file type
    # -----------------------------------------------------

    if image.content_type not in ALLOWED_CONTENT_TYPES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG and PNG "
                "images are allowed"
            )
        )

    try:

        # -------------------------------------------------
        # Read uploaded image
        # -------------------------------------------------

        image_bytes = await image.read()

        leaf_image = Image.open(
            io.BytesIO(image_bytes)
        )

        leaf_image = leaf_image.convert(
            "RGB"
        )

        # -------------------------------------------------
        # Resize image
        # -------------------------------------------------

        leaf_image = leaf_image.resize(
            IMAGE_SIZE
        )

        # -------------------------------------------------
        # Convert image to NumPy array
        # -------------------------------------------------

        image_array = np.array(
            leaf_image,
            dtype=np.float32
        )

        # Add batch dimension:
        #
        # (224, 224, 3)
        #       ↓
        # (1, 224, 224, 3)
        #
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # -------------------------------------------------
        # MODEL PREDICTION
        # -------------------------------------------------

        predictions = model.predict(
            image_array,
            verbose=0
        )

        prediction_scores = predictions[0]

        # Index with highest probability
        predicted_index = int(
            np.argmax(prediction_scores)
        )

        predicted_class = class_names[
            predicted_index
        ]

        confidence = float(
            prediction_scores[
                predicted_index
            ]
        )

        # -------------------------------------------------
        # All class probabilities
        # -------------------------------------------------

        probabilities = {}

        for index, class_name in enumerate(
                class_names
        ):

            probabilities[class_name] = round(
                float(prediction_scores[index]),
                4
            )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {
            "filename": image.filename,
            "predictedClass": predicted_class,
            "confidence": round(
                confidence,
                4
            ),
            "confidencePercentage": round(
                confidence * 100,
                2
            ),
            "probabilities": probabilities
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Prediction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyse banana leaf image"
        )