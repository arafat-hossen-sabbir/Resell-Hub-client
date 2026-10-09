import Swal from "sweetalert2";

export const toast = (title, icon = "success") =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 1600,
  });

export const showError = (text, title = "Something went wrong") =>
  Swal.fire({ icon: "error", title, text, confirmButtonColor: "#059669" });

export const showSuccess = (title, text) =>
  Swal.fire({ icon: "success", title, text, confirmButtonColor: "#059669" });

export const confirmAction = async ({ title, text, confirmText }) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: "#dc2626",
  });

  return result.isConfirmed;
};
