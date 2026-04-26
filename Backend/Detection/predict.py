import os
import json
import numpy as np
import tensorflow as tf
import io

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

CONFIDENCE_THRESHOLD = 70
UNCERTAINTY_THRESHOLD = 0.10

# ============================================
# LOAD CLASS NAMES
# ============================================
if not os.path.exists(CLASS_NAMES_PATH):
    raise FileNotFoundError(f"❌ Missing: {CLASS_NAMES_PATH}")

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print(f"✅ Classes loaded: {len(class_names)}")

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
# LOAD MODEL
# ============================================
if not os.path.exists(WEIGHTS_PATH):
    raise FileNotFoundError(f"❌ Missing weights: {WEIGHTS_PATH}")

print("🔄 Loading model...")
model = build_model(len(class_names))
model.load_weights(WEIGHTS_PATH)
print("✅ Model ready")

# ============================================
# CLEAN LABEL
# ============================================
def clean_class_name(raw):
    parts = raw.split("___")

    if len(parts) == 2:
        crop = parts[0].replace("_", " ")
        disease = parts[1].replace("_", " ")
    else:
        crop = raw
        disease = "Unknown"

    status = "Healthy" if disease.lower() == "healthy" else "Diseased"
    return crop, disease, status

# ============================================
# IMAGE VALIDATION (IMPROVED)
# ============================================
def validate_image(img_array):
    mean_val = img_array.mean()
    std_val = img_array.std()

    # Too dark / too bright
    if mean_val < 20 or mean_val > 240:
        return False, "Image too dark or too bright"

    # Too flat (blank / low detail)
    if std_val < 10:
        return False, "Image has very low detail"

    return True, None

# ============================================
# CORE PREDICTION
# ============================================
def predict_from_pil(img):
    try:
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # 🔥 Validate image
        valid, error_msg = validate_image(img_array)
        if not valid:
            return {"error": error_msg}

        img_array = preprocess_input(img_array)

        preds = model.predict(img_array, verbose=0)[0]

        top_index = np.argmax(preds)
        confidence = float(preds[top_index] * 100)

        # 🔥 Reject low confidence
        if confidence < CONFIDENCE_THRESHOLD:
            return {
                "error": "Low confidence",
                "message": f"Prediction confidence too low ({round(confidence,2)}%). Upload a clearer leaf image."
            }

        # 🔥 Reject uncertain predictions
        top3_vals = np.sort(preds)[-3:]
        if (top3_vals[2] - top3_vals[1]) < UNCERTAINTY_THRESHOLD:
            return {
                "error": "Uncertain prediction",
                "message": "Model is unsure. Try a clearer or closer leaf image."
            }

        raw_class = class_names[top_index]
        crop, disease, status = clean_class_name(raw_class)

        # Top 3 predictions
        top3_idx = np.argsort(preds)[-3:][::-1]
        top3 = []

        for idx in top3_idx:
            c_crop, c_disease, _ = clean_class_name(class_names[idx])
            top3.append({
                "crop": c_crop,
                "disease": c_disease,
                "confidence": round(float(preds[idx] * 100), 2)
            })

        return {
            "crop": crop,
            "disease": disease,
            "status": status,
            "confidence": round(confidence, 2),
            "top3": top3
        }

    except Exception as e:
        return {
            "error": "Prediction failed",
            "message": str(e)
        }

# ============================================
# FILE PATH PREDICTION
# ============================================
def predict_image(img_path):
    if not os.path.exists(img_path):
        return {"error": "Image not found"}

    try:
        img = image.load_img(img_path, target_size=IMG_SIZE)
        return predict_from_pil(img)
    except:
        return {"error": "Invalid image file"}

# ============================================
# BYTES (FASTAPI)
# ============================================
def predict_image_from_bytes(image_bytes):
    try:
        img = image.load_img(io.BytesIO(image_bytes), target_size=IMG_SIZE)
        return predict_from_pil(img)
    except:
        return {"error": "Invalid uploaded image"}

# ============================================
# TEST (LOCAL)
# ============================================
if __name__ == "__main__":
    test_img = "apple_scab.jpg"  # change this

    result = predict_image(test_img)

    if "error" in result:
        print("❌ ERROR:", result["error"])
        if "message" in result:
            print("ℹ️", result["message"])
    else:
        print("\n🌿 PLANT DISEASE PREDICTION")
        print("==========================")
        print(f"🌱 Crop       : {result['crop']}")
        print(f"🦠 Disease    : {result['disease']}")
        print(f"📌 Status     : {result['status']}")
        print(f"⭐ Confidence : {result['confidence']}%")

        print("\n📊 Top 3 Predictions:")
        for i, p in enumerate(result["top3"], 1):
            print(f"{i}. {p['crop']} | {p['disease']} | {p['confidence']}%")