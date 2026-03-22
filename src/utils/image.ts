export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: "image/jpeg" | "image/webp" | "image/png";
}

export async function uploadImage(imageFile: File): Promise<string> {
  // Resize the image and convert to jpeg before uploading
  const resizedImage = await modifyImage(imageFile, {
    maxWidth: 1500,
    maxHeight: 1500,
    quality: 1.0,
    outputFormat: "image/jpeg",
  });

  // POST the image to our upload endpoint @ /api/post/image:
  const formDataForImage = new FormData();
  formDataForImage.append("image", resizedImage);
  const imageUploadResponse = await fetch("/api/post/image", {
    method: "POST",
    body: formDataForImage,
  });

  if (!imageUploadResponse.ok) {
    throw new Error(`Image upload failed: ${imageUploadResponse.statusText}`);
  }

  return await imageUploadResponse.text();
}

function modifyImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    outputFormat = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("failed to get canvas context"));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("failed to compress image"));
            return;
          }

          // Create a new File object with the compressed data
          const compressedFile = new File([blob], file.name, {
            type: outputFormat,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        outputFormat,
        quality,
      );
    };

    img.onerror = () => {
      reject(new Error("failed to load image"));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}
