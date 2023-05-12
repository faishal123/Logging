import { Records, FieldSet } from "airtable";
import { toast, ToastPosition } from "react-toastify";

type ShowToastParameterType = {
  type: "error" | "success" | "info" | "promise";
  message: string;
  id: string;
};

type ToastParameterType = {
  position?: ToastPosition;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: "dark" | "light" | "colored";
};

type ShowPromiseToastParameterType = {
  pending: string;
  success: string;
  error: string;
  promiseFunction: Promise<Records<FieldSet>>;
};

const toastParameters: ToastParameterType = {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const showPromiseToast = ({
  promiseFunction,
  pending,
  success,
  error,
}: ShowPromiseToastParameterType) => {
  return toast.promise(
    promiseFunction,
    { pending, success, error },
    toastParameters
  );
};

export const showToast = ({ type, message, id }: ShowToastParameterType) => {
  if (type === "error") {
    return toast.error(message, { ...toastParameters, toastId: id });
  }
  if (type === "success") {
    return toast.success(message, { ...toastParameters, toastId: id });
  }
  if (type === "info") {
    return toast.info(message, { ...toastParameters, toastId: id });
  }
};
