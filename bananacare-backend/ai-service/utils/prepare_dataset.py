from pathlib import Path
import random
import shutil

# Reproducible split
RANDOM_SEED = 42

TRAIN_RATIO = 0.70
VALIDATION_RATIO = 0.15
TEST_RATIO = 0.15

# Supported image formats
SUPPORTED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png"
}

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

RAW_DATASET_DIR = BASE_DIR / "dataset" / "raw"
OUTPUT_DATASET_DIR = BASE_DIR / "dataset" / "processed"


def get_image_files(folder):
    return [
        file
        for file in folder.iterdir()
        if file.is_file()
           and file.suffix.lower() in SUPPORTED_EXTENSIONS
    ]


def copy_images(images, destination):
    destination.mkdir(
        parents=True,
        exist_ok=True
    )

    for image in images:
        shutil.copy2(
            image,
            destination / image.name
        )


def prepare_dataset():

    if not RAW_DATASET_DIR.exists():
        raise FileNotFoundError(
            f"Raw dataset not found: {RAW_DATASET_DIR}"
        )

    # Start clean if script is run again
    if OUTPUT_DATASET_DIR.exists():
        shutil.rmtree(OUTPUT_DATASET_DIR)

    random.seed(RANDOM_SEED)

    class_folders = sorted(
        folder
        for folder in RAW_DATASET_DIR.iterdir()
        if folder.is_dir()
    )

    if not class_folders:
        raise RuntimeError(
            "No class folders found inside dataset/raw"
        )

    print("\nPreparing BananaCare Dataset")
    print("=" * 50)

    total_train = 0
    total_validation = 0
    total_test = 0

    for class_folder in class_folders:

        class_name = class_folder.name

        images = get_image_files(class_folder)

        random.shuffle(images)

        total_images = len(images)

        if total_images == 0:
            print(
                f"WARNING: No images found for {class_name}"
            )
            continue

        train_end = int(
            total_images * TRAIN_RATIO
        )

        validation_end = train_end + int(
            total_images * VALIDATION_RATIO
        )

        train_images = images[:train_end]

        validation_images = images[
            train_end:validation_end
        ]

        test_images = images[
            validation_end:
        ]

        copy_images(
            train_images,
            OUTPUT_DATASET_DIR
            / "train"
            / class_name
        )

        copy_images(
            validation_images,
            OUTPUT_DATASET_DIR
            / "validation"
            / class_name
        )

        copy_images(
            test_images,
            OUTPUT_DATASET_DIR
            / "test"
            / class_name
        )

        total_train += len(train_images)
        total_validation += len(validation_images)
        total_test += len(test_images)

        print(f"\nClass: {class_name}")
        print(f"Total      : {total_images}")
        print(f"Training   : {len(train_images)}")
        print(f"Validation : {len(validation_images)}")
        print(f"Testing    : {len(test_images)}")

    print("\n" + "=" * 50)

    print("Dataset preparation completed!")

    print(
        f"Training images   : {total_train}"
    )

    print(
        f"Validation images : {total_validation}"
    )

    print(
        f"Testing images    : {total_test}"
    )

    print(
        f"Total images      : "
        f"{total_train + total_validation + total_test}"
    )


if __name__ == "__main__":
    prepare_dataset()