export type ImageSource =
  | Blob
  | File
  | string
  | CanvasImageSource;

export async function extractImage(source: ImageSource): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Image extraction can only run in the browser environment.");
  }

  const resolvedSource = await resolveCanvasSource(source);

  try {
    const text = await detectText(resolvedSource);
    if (text) {
      return text;
    }
  } catch (error) {
    console.warn("Text detection failed", error);
  }

  return await summarizeImage(resolvedSource);
}

async function resolveCanvasSource(
  source: ImageSource
): Promise<CanvasImageSource> {
  if (source instanceof Blob) {
    return await loadImageFromBlob(source);
  }

  if (typeof source === "string") {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error("Unable to load image from the provided URL.");
    }

    const blob = await response.blob();
    return await loadImageFromBlob(blob);
  }

  if (isCanvasImageSource(source)) {
    return source;
  }

  throw new Error("Unsupported image source provided for extraction.");
}

async function detectText(source: CanvasImageSource): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  const detector = (window as Window & { TextDetector?: new () => any }).TextDetector;

  if (!detector) {
    return "";
  }

  const instance = new detector();
  const detections: Array<{ rawValue?: string; data?: string }> =
    await instance.detect(source);

  const text = detections
    .map((item) => item.rawValue ?? item.data ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return text;
}

async function summarizeImage(source: CanvasImageSource): Promise<string> {
  const canvas = await ensureCanvas(source);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Unable to analyze the image. Try uploading a PDF or a higher quality scan."
    );
  }

  const { data, width, height } = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  let darkPixels = 0;
  const totalPixels = width * height;

  for (let index = 0; index < data.length; index += 4) {
    const luminance =
      data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
    if (luminance < 140) {
      darkPixels += 1;
    }
  }

  const coverage = Math.min(100, (darkPixels / totalPixels) * 100);
  const formattedCoverage = Math.round(coverage * 10) / 10;

  return [
    "Automatic OCR isn't available in this browser.",
    `Resolution: ${canvas.width}×${canvas.height}px`,
    `Estimated ink coverage: ${formattedCoverage}%`,
    "Upload a clearer image or a PDF for the best AI results.",
  ].join("\n");
}

async function loadImageFromBlob(blob: Blob): Promise<CanvasImageSource> {
  if (typeof window === "undefined") {
    throw new Error("Image processing is only supported in the browser.");
  }

  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob);
    } catch (error) {
      console.warn("createImageBitmap failed, falling back to HTMLImageElement", error);
    }
  }

  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await loadImageElement(objectUrl);
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image for analysis."));
    image.src = src;
  });
}

function isCanvasImageSource(value: unknown): value is CanvasImageSource {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    value instanceof HTMLCanvasElement ||
    (typeof ImageBitmap !== "undefined" && value instanceof ImageBitmap) ||
    value instanceof HTMLImageElement
  );
}

async function ensureCanvas(source: CanvasImageSource): Promise<HTMLCanvasElement> {
  if (source instanceof HTMLCanvasElement) {
    return source;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a canvas context for image analysis.");
  }

  const width = getSourceWidth(source);
  const height = getSourceHeight(source);

  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  return canvas;
}

function getSourceWidth(source: CanvasImageSource): number {
  if (source instanceof HTMLCanvasElement) {
    return source.width;
  }

  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    return source.width;
  }

  if (source instanceof HTMLImageElement) {
    return source.naturalWidth || source.width;
  }

  return 0;
}

function getSourceHeight(source: CanvasImageSource): number {
  if (source instanceof HTMLCanvasElement) {
    return source.height;
  }

  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    return source.height;
  }

  if (source instanceof HTMLImageElement) {
    return source.naturalHeight || source.height;
  }

  return 0;
}
