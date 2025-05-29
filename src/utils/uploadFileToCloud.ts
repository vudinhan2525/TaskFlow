import axios from "axios";

const convertBase64ToFile = (base64: string, filename = "upload.png") => {
  const base64Type = base64.split(',')[0].split(':')[1].split(';')[0];
  const base64Data = base64.split(',')[1];
  const binaryString = window.atob(base64Data);

  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: base64Type });
};

export const uploadFileToCloudinary = async (base64?: string, fileUpload?: File) => {
  try {
    let file: File;

    if (base64) {
      file = convertBase64ToFile(base64);
    } else if (fileUpload) {
      file = fileUpload;
    } else {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    const result = await axios.post(
      "https://api.cloudinary.com/v1_1/dhyruxpgy/image/upload",
      formData
    );

    return result.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
