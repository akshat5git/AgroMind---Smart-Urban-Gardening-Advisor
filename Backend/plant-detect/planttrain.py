import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

# ============================================
# SETTINGS
# ============================================
DATASET_DIR = r"C:\Users\aksha\Desktop\AgroMind Project\backend\plant-detect\PlantVillageall\color"
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15
SEED = 123

WEIGHTS_SAVE_PATH = "plantvillage_weights.h5"
BEST_WEIGHTS_PATH = "best_plantvillage_weights.h5"
CLASS_NAMES_PATH = "plantvillage_class_names.json"

# ============================================
# CHECK GPU / DIRECTML
# ============================================
print("TensorFlow Version:", tf.__version__)
print("Available GPUs:", tf.config.list_physical_devices('GPU'))

# ============================================
# STEP 1: READ DATASET PATHS
# ============================================
def define_paths(data_dir):
    filepaths = []
    labels = []

    for class_name in os.listdir(data_dir):
        class_path = os.path.join(data_dir, class_name)

        if not os.path.isdir(class_path):
            continue

        for file_name in os.listdir(class_path):
            file_path = os.path.join(class_path, file_name)

            if file_name.lower().endswith((".jpg", ".jpeg", ".png")):
                filepaths.append(file_path)
                labels.append(class_name)

    return filepaths, labels


def define_df(files, classes):
    return pd.DataFrame({
        "filepaths": files,
        "labels": classes
    })


def split_data(data_dir):
    files, classes = define_paths(data_dir)
    df = define_df(files, classes)

    print(f"\nTotal Images Found: {len(df)}")
    print(f"Total Classes Found: {df['labels'].nunique()}")

    train_df, temp_df = train_test_split(
        df,
        train_size=0.8,
        shuffle=True,
        random_state=SEED,
        stratify=df["labels"]
    )

    valid_df, test_df = train_test_split(
        temp_df,
        train_size=0.5,
        shuffle=True,
        random_state=SEED,
        stratify=temp_df["labels"]
    )

    return train_df, valid_df, test_df


# ============================================
# STEP 2: CREATE GENERATORS
# ============================================
def create_gens(train_df, valid_df, test_df, batch_size):
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True
    )

    test_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input
    )

    train_gen = train_datagen.flow_from_dataframe(
        train_df,
        x_col="filepaths",
        y_col="labels",
        target_size=IMG_SIZE,
        class_mode="categorical",
        color_mode="rgb",
        batch_size=batch_size,
        shuffle=True,
        seed=SEED
    )

    valid_gen = test_datagen.flow_from_dataframe(
        valid_df,
        x_col="filepaths",
        y_col="labels",
        target_size=IMG_SIZE,
        class_mode="categorical",
        color_mode="rgb",
        batch_size=batch_size,
        shuffle=False
    )

    test_gen = test_datagen.flow_from_dataframe(
        test_df,
        x_col="filepaths",
        y_col="labels",
        target_size=IMG_SIZE,
        class_mode="categorical",
        color_mode="rgb",
        batch_size=batch_size,
        shuffle=False
    )

    return train_gen, valid_gen, test_gen


# ============================================
# STEP 3: BUILD MODEL
# ============================================
def build_model(num_classes):
    base_model = EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(224, 224, 3),
        pooling="avg"
    )

    base_model.trainable = False  # Freeze backbone

    model = Sequential([
        base_model,
        BatchNormalization(),
        Dense(256, activation="relu"),
        Dropout(0.3),
        Dense(num_classes, activation="softmax")
    ])

    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


# ============================================
# STEP 4: PLOT HISTORY
# ============================================
def plot_training(history):
    acc = history.history["accuracy"]
    val_acc = history.history["val_accuracy"]
    loss = history.history["loss"]
    val_loss = history.history["val_loss"]

    epochs_range = range(1, len(acc) + 1)

    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label="Train Accuracy")
    plt.plot(epochs_range, val_acc, label="Val Accuracy")
    plt.legend()
    plt.title("Training vs Validation Accuracy")

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label="Train Loss")
    plt.plot(epochs_range, val_loss, label="Val Loss")
    plt.legend()
    plt.title("Training vs Validation Loss")

    plt.tight_layout()
    plt.show()


# ============================================
# STEP 5: MAIN
# ============================================
def main():
    # ---------- Check dataset ----------
    if not os.path.exists(DATASET_DIR):
        print(f"\n❌ Dataset folder not found: {DATASET_DIR}")
        print("👉 Please set the correct DATASET_DIR in the code.")
        return

    # ---------- Split ----------
    train_df, valid_df, test_df = split_data(DATASET_DIR)

    # ---------- Generators ----------
    train_gen, valid_gen, test_gen = create_gens(
        train_df, valid_df, test_df, BATCH_SIZE
    )

    # ---------- Save class names ----------
    class_names = list(train_gen.class_indices.keys())
    with open(CLASS_NAMES_PATH, "w") as f:
        json.dump(class_names, f, indent=4)

    print("\n✅ Class names saved to:", CLASS_NAMES_PATH)
    print("Classes:")
    for i, c in enumerate(class_names):
        print(f"{i}: {c}")

    # ---------- Class weights ----------
    class_labels = train_gen.classes

    class_weights = compute_class_weight(
        class_weight="balanced",
        classes=np.unique(class_labels),
        y=class_labels
    )

    class_weights = dict(enumerate(class_weights))
    print("\n✅ Class Weights:")
    print(class_weights)

    # ---------- Build model ----------
    model = build_model(num_classes=len(class_names))
    model.summary()

    # ---------- Callbacks ----------
    callbacks = [
        EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=2,
            verbose=1
        ),
        ModelCheckpoint(
            BEST_WEIGHTS_PATH,
            monitor="val_accuracy",
            save_best_only=True,
            save_weights_only=True,
            verbose=1
        )
    ]

    # ---------- Train ----------
    print("\n🚀 Starting Training...\n")
    history = model.fit(
        train_gen,
        validation_data=valid_gen,
        epochs=EPOCHS,
        callbacks=callbacks,
        class_weight=class_weights,
        verbose=1
    )

    # ---------- Save final weights ----------
    model.save_weights(WEIGHTS_SAVE_PATH)

    print(f"\n✅ Final weights saved as: {WEIGHTS_SAVE_PATH}")
    print(f"✅ Best weights saved as: {BEST_WEIGHTS_PATH}")

    # ---------- Plot ----------
    plot_training(history)

    # ---------- Evaluate ----------
    print("\n📊 Evaluating on Test Set...")
    test_loss, test_acc = model.evaluate(test_gen, verbose=1)

    print(f"\n✅ Test Loss: {test_loss:.4f}")
    print(f"✅ Test Accuracy: {test_acc:.4f}")

    # ---------- Predictions ----------
    print("\n🔍 Generating Predictions...")
    preds = model.predict(test_gen, verbose=1)
    pred_classes = np.argmax(preds, axis=1)
    true_classes = test_gen.classes

    # ---------- Classification Report ----------
    print("\n📄 Classification Report:\n")
    print(classification_report(
        true_classes,
        pred_classes,
        target_names=class_names
    ))

    # ---------- Confusion Matrix ----------
    cm = confusion_matrix(true_classes, pred_classes)

    plt.figure(figsize=(14, 12))
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title("Confusion Matrix")
    plt.colorbar()

    tick_marks = np.arange(len(class_names))
    plt.xticks(tick_marks, class_names, rotation=90)
    plt.yticks(tick_marks, class_names)

    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.tight_layout()
    plt.show()

    print("\n🎉 Training Complete.")


# ============================================
# RUN
# ============================================
if __name__ == "__main__":
    main()
