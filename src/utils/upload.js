export const uploadImage = async (file) => {
  const key = import.meta.env.VITE_IMGBB_KEY;

  if (!key) {
    throw new Error("Image upload is not configured (VITE_IMGBB_KEY missing).");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Each image must be smaller than 5 MB.");
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body,
  });
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || "Image upload failed.");
  }

  return json.data.url;
};
