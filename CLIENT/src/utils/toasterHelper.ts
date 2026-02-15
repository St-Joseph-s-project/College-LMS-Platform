import { toast, Flip } from 'react-toastify';
import { THEME_NAME } from '../constants/appConstants';

function getToastOptions() {
  return {
    position: "bottom-right" as const,
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: (localStorage.getItem(THEME_NAME) as "light" | "dark") || "light",
    transition: Flip,
  };
}

type toastState = {
  message: string,
  status: number
}

export default function toasterHelper(data: toastState) {
  if (data.status >= 500) {
    toasterError(data.message)
  } else if (data.status >= 400) {
    toasterWarn(data.message);
  } else {
    toasterSuccess(data.message)
  }
}

function toasterSuccess(message: string) {
  toast.success(message, getToastOptions());
}

function toasterWarn(message: string) {
  toast.warn(message, getToastOptions());
}

function toasterError(message: string) {
  toast.error(message, getToastOptions());
}
