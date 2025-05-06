export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload-img");
    formData.append("cloud_name", "dgapx1nvo");
    formData.append("folder", "products");
    formData.append("resource_type", "image");

    // console.log("Đang gửi yêu cầu upload tới Cloudinary:", {
    //   fileName: file.name,
    //   fileSize: file.size,
    //   fileType: file.type,
    //   uploadPreset: "upload-img",
    //   cloudName: "dgapx1nvo",
    // });

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dgapx1nvo/image/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Tải ảnh lên Cloudinary thất bại: ${
          data.error?.message || "Lỗi không xác định"
        }`
      );
    }

    if (!data.secure_url) {
      throw new Error("Phản hồi từ Cloudinary không chứa secure_url");
    }

    return {
      secure_url: data.secure_url,
      public_id: data.public_id || "",
    };
  } catch (error) {
    console.error("Lỗi trong uploadImageToCloudinary:", error.message);
    throw error;
  }
};
