import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing import image

# ============================================
# SETTINGS
# ============================================
IMG_SIZE = (224, 224)
WEIGHTS_PATH = "best_plantvillage_weights.h5"
CLASS_NAMES_PATH = "plantvillage_class_names.json"

# ============================================
# LOAD CLASS NAMES
# ============================================
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

# ============================================
# BUILD MODEL
# ============================================
def build_model(num_classes):
    base_model = EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(224, 224, 3),
        pooling="avg"
    )

    base_model.trainable = False

    model = Sequential([
        base_model,
        BatchNormalization(),
        Dense(256, activation="relu"),
        Dropout(0.3),
        Dense(num_classes, activation="softmax")
    ])

    return model

# ============================================
# CLEAN CLASS NAME
# ============================================
def clean_class_name(raw_name):
    parts = raw_name.split("___")

    if len(parts) == 2:
        crop = parts[0].replace("_", " ")
        disease = parts[1].replace("_", " ")
    else:
        crop = raw_name.replace("_", " ")
        disease = "Unknown"

    status = "Healthy" if disease.lower() == "healthy" else "Diseased"

    return crop, disease, status

# ============================================
# LOAD MODEL ONCE (IMPORTANT ⚡)
# ============================================
print("🔄 Loading model...")
model = build_model(len(class_names))
model.load_weights(WEIGHTS_PATH)
print("✅ Model loaded")

# ============================================
# MAIN FUNCTION (EXPORT THIS)
# ============================================
def predict_image_from_bytes(image_bytes):
    try:
        # Convert bytes → image
        img = image.load_img(
            tf.io.gfile.GFile(image_bytes, 'rb'),
            target_size=IMG_SIZE
        )

    except:
        # fallback (better way)
        import io
        img = image.load_img(io.BytesIO(image_bytes), target_size=IMG_SIZE)

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    preds = model.predict(img_array, verbose=0)[0]

    top_index = np.argmax(preds)
    confidence = float(preds[top_index] * 100)
    raw_class = class_names[top_index]

    crop, disease, status = clean_class_name(raw_class)

    return {
        "crop": crop,
        "disease": disease,
        "status": status,
        "confidence": round(confidence, 2)
    }