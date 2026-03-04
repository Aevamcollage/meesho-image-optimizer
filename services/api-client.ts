/**
 * API Client Service
 * Handles all communication with the backend Flask API
 */

// API Base URL - use environment variable or default to Flask port 5000
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// Log API configuration
console.log("📡 API Base URL:", API_BASE_URL);

export interface ImageEditResponse {
  success: boolean;
  url: string;
  dimensions?: { width: number; height: number };
  file_size?: number;
  error?: string;
}

export interface ShippingEstimate {
  success: boolean;
  volume_reduction_percentage: number;
  estimated_reduction_inr: number;
  original_range: string;
  estimated_new_range: string;
  note: string;
  error?: string;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  imageUri: string,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    // Fetch the image file
    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);

    const result = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      const errorData = await result.json();
      return {
        success: false,
        url: "",
        error: errorData.error || `HTTP ${result.status}`,
      };
    }

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Resize image to specified dimensions
 */
export async function resizeImage(
  imageUri: string,
  width: number,
  height: number,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);
    formData.append("width", width.toString());
    formData.append("height", height.toString());

    const result = await fetch(`${API_BASE_URL}/api/resize`, {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      const errorData = await result.json();
      return {
        success: false,
        url: "",
        error: errorData.error || `HTTP ${result.status}`,
      };
    }

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Resize failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Rotate image by specified angle
 */
export async function rotateImage(
  imageUri: string,
  angle: number,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);
    formData.append("angle", angle.toString());

    const result = await fetch(`${API_BASE_URL}/api/rotate`, {
      method: "POST",
      body: formData,
    });

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Rotate failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Add padding around image
 */
export async function addPadding(
  imageUri: string,
  paddingPercentage: number,
  targetSize: number,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);
    formData.append("padding_percentage", paddingPercentage.toString());
    formData.append("target_size", targetSize.toString());

    const result = await fetch(`${API_BASE_URL}/api/add-padding`, {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      const errorData = await result.json();
      return {
        success: false,
        url: "",
        error: errorData.error || `HTTP ${result.status}`,
      };
    }

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Padding failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Adjust brightness, contrast, and saturation
 */
export async function adjustBrightness(
  imageUri: string,
  brightness: number,
  contrast: number,
  saturation: number,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);
    formData.append("brightness", brightness.toString());
    formData.append("contrast", contrast.toString());
    formData.append("saturation", saturation.toString());

    const result = await fetch(`${API_BASE_URL}/api/adjust-brightness`, {
      method: "POST",
      body: formData,
    });

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Brightness adjustment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Crop image to specified area
 */
export async function cropImage(
  imageUri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  filename: string,
): Promise<ImageEditResponse> {
  try {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", blob, filename);
    formData.append("x", x.toString());
    formData.append("y", y.toString());
    formData.append("width", width.toString());
    formData.append("height", height.toString());

    const result = await fetch(`${API_BASE_URL}/api/crop`, {
      method: "POST",
      body: formData,
    });

    return await result.json();
  } catch (error) {
    return {
      success: false,
      url: "",
      error: `Crop failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Estimate shipping cost reduction
 */
export async function estimateShipping(
  originalWidth: number,
  originalHeight: number,
  editedWidth: number,
  editedHeight: number,
  productCategory: string = "general",
): Promise<ShippingEstimate> {
  try {
    const result = await fetch(`${API_BASE_URL}/api/estimate-shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_width: originalWidth,
        original_height: originalHeight,
        edited_width: editedWidth,
        edited_height: editedHeight,
        product_category: productCategory,
      }),
    });

    return await result.json();
  } catch (error) {
    return {
      success: false,
      volume_reduction_percentage: 0,
      estimated_reduction_inr: 0,
      original_range: "",
      estimated_new_range: "",
      note: "",
      error: `Estimation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await fetch(`${API_BASE_URL}/api/health`);
    const data = await result.json();
    return data.status === "healthy";
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}
