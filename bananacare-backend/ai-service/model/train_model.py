from pathlib import Path
import json

import numpy as np
import tensorflow as tf

# =========================================================
# CONFIGURATION
# =========================================================

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 20
SEED = 42

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_DIR = BASE_DIR / "dataset" / "processed"

TRAIN_DIR = DATASET_DIR / "train"
VALIDATION_DIR = DATASET_DIR / "validation"
TEST_DIR = DATASET_DIR / "test"

MODEL_DIR = BASE_DIR / "model"

MODEL_PATH = MODEL_DIR / "banana_disease_model.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"


# =========================================================
# LOAD DATASETS
# =========================================================

print("\nLoading BananaCare dataset...")
print("=" * 60)

train_dataset = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED
)

validation_dataset = tf.keras.utils.image_dataset_from_directory(
    VALIDATION_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

test_dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = train_dataset.class_names
number_of_classes = len(class_names)

print("\nClasses detected:")
print(class_names)

print(
    f"\nNumber of classes: {number_of_classes}"
)


# =========================================================
# SAVE CLASS NAMES
# =========================================================

with open(
        CLASS_NAMES_PATH,
        "w",
        encoding="utf-8"
) as file:
    json.dump(
        class_names,
        file,
        indent=4
    )

print(
    f"Class names saved to: {CLASS_NAMES_PATH}"
)

# =========================================================
# CLASS WEIGHTS
# =========================================================

training_labels = []

for _, labels in train_dataset.unbatch():
    training_labels.append(
        int(labels.numpy())
    )

training_labels = np.array(training_labels)

# Count number of training images in each class
class_counts = np.bincount(
    training_labels,
    minlength=number_of_classes
)

total_samples = len(training_labels)

# Calculate balanced class weights manually
class_weights = {}

for class_id, class_count in enumerate(class_counts):

    if class_count == 0:
        raise ValueError(
            f"No training images found for class: "
            f"{class_names[class_id]}"
        )

    class_weights[class_id] = (
            total_samples
            / (number_of_classes * class_count)
    )

print("\nTraining class distribution:")

for class_id, class_count in enumerate(class_counts):

    print(
        f"{class_names[class_id]}: "
        f"{class_count} images"
    )

print("\nClass weights:")

for class_id, weight in class_weights.items():

    print(
        f"{class_names[class_id]}: "
        f"{weight:.4f}"
    )

# =========================================================
# PERFORMANCE OPTIMISATION
# =========================================================

AUTOTUNE = tf.data.AUTOTUNE

train_dataset = train_dataset.prefetch(
    buffer_size=AUTOTUNE
)

validation_dataset = validation_dataset.prefetch(
    buffer_size=AUTOTUNE
)

test_dataset = test_dataset.prefetch(
    buffer_size=AUTOTUNE
)


# =========================================================
# DATA AUGMENTATION
# =========================================================

data_augmentation = tf.keras.Sequential(
    [
        tf.keras.layers.RandomFlip(
            "horizontal"
        ),

        tf.keras.layers.RandomRotation(
            0.1
        ),

        tf.keras.layers.RandomZoom(
            0.1
        ),

        tf.keras.layers.RandomContrast(
            0.1
        )
    ],
    name="data_augmentation"
)


# =========================================================
# MOBILENETV2 BASE MODEL
# =========================================================

print("\nLoading MobileNetV2...")

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(
        IMAGE_SIZE[0],
        IMAGE_SIZE[1],
        3
    ),
    include_top=False,
    weights="imagenet"
)

# Freeze pretrained layers
base_model.trainable = False


# =========================================================
# BUILD MODEL
# =========================================================

inputs = tf.keras.Input(
    shape=(
        IMAGE_SIZE[0],
        IMAGE_SIZE[1],
        3
    )
)

x = data_augmentation(inputs)

x = tf.keras.applications.mobilenet_v2.preprocess_input(
    x
)

x = base_model(
    x,
    training=False
)

x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    number_of_classes,
    activation="softmax"
)(x)

model = tf.keras.Model(
    inputs,
    outputs
)


# =========================================================
# COMPILE MODEL
# =========================================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)

print("\nBananaCare AI Model")
print("=" * 60)

model.summary()


# =========================================================
# CALLBACKS
# =========================================================

callbacks = [

    tf.keras.callbacks.ModelCheckpoint(
        filepath=MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    ),

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.2,
        patience=2,
        min_lr=1e-6,
        verbose=1
    )
]


# =========================================================
# TRAIN MODEL
# =========================================================

print("\nStarting BananaCare AI training...")
print("=" * 60)

history = model.fit(
    train_dataset,

    validation_data=validation_dataset,

    epochs=EPOCHS,

    class_weight=class_weights,

    callbacks=callbacks
)


# =========================================================
# LOAD BEST MODEL
# =========================================================

print("\nLoading best model...")

best_model = tf.keras.models.load_model(
    MODEL_PATH
)


# =========================================================
# TEST EVALUATION
# =========================================================

print("\nEvaluating model on unseen test images...")
print("=" * 60)

test_loss, test_accuracy = best_model.evaluate(
    test_dataset
)

print("\nFINAL BANANACARE AI RESULTS")
print("=" * 60)

print(
    f"Test Loss     : {test_loss:.4f}"
)

print(
    f"Test Accuracy : "
    f"{test_accuracy * 100:.2f}%"
)

print("=" * 60)

print(
    f"\nModel saved to:\n{MODEL_PATH}"
)

print(
    f"\nClasses saved to:\n{CLASS_NAMES_PATH}"
)