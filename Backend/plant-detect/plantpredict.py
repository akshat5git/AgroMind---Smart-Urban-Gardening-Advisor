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

# Use BEST weights for prediction
WEIGHTS_PATH = "best_plantvillage_weights.h5"
CLASS_NAMES_PATH = "plantvillage_class_names.json"

# 👉 Change this to your test image
IMAGE_PATH = "images (1).jpg"

# ============================================
# LOAD CLASS NAMES
# ============================================
if not os.path.exists(CLASS_NAMES_PATH):
    raise FileNotFoundError(f"❌ Class names file not found: {CLASS_NAMES_PATH}")

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print("✅ Loaded class names")
print(f"📦 Total classes: {len(class_names)}")

# ============================================
# BUILD SAME MODEL ARCHITECTURE
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

    if disease.lower() == "healthy":
        status = "Healthy"
    else:
        status = "Diseased"

    return crop, disease, status

# ============================================
# LOAD MODEL
# ============================================
print("\n🔄 Loading model...")
model = build_model(len(class_names))
model.load_weights(WEIGHTS_PATH)
print("✅ Model loaded successfully")

# ============================================
# PREDICTION FUNCTION
# ============================================
def predict_image(img_path):
    if not os.path.exists(img_path):
        print(f"❌ Image not found: {img_path}")
        return

    print(f"\n🖼 Predicting image: {img_path}")

    # Load image
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)

    # Expand dimensions
    img_array = np.expand_dims(img_array, axis=0)

    # Preprocess
    img_array = preprocess_input(img_array)

    # Predict
    preds = model.predict(img_array, verbose=0)[0]

    # Top prediction
    top_index = np.argmax(preds)
    top_conf = preds[top_index] * 100
    top_class = class_names[top_index]

    crop, disease, status = clean_class_name(top_class)

    print("\n==============================")
    print("🌿 PLANT DISEASE PREDICTION")
    print("==============================")
    print(f"🌱 Crop Name     : {crop}")
    print(f"🦠 Disease       : {disease}")
    print(f"📌 Status        : {status}")
    print(f"⭐ Confidence    : {top_conf:.2f}%")

    # Top 3 predictions
    print("\n📊 Top 3 Predictions:")
    top3_idx = np.argsort(preds)[-3:][::-1]

    for i, idx in enumerate(top3_idx, start=1):
        c_crop, c_disease, c_status = clean_class_name(class_names[idx])
        print(f"{i}. {c_crop} | {c_disease} | {preds[idx]*100:.2f}%")

# ============================================
# RUN
# ============================================
predict_image(IMAGE_PATH) 
