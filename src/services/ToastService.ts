import { toast } from "react-toastify";

class ToastService {

  success(message: string): void {
    toast.success(message);
  }

  error(message: string): void {
    toast.error(message);
  }

  info(message: string): void {
    toast.info(message);
  }

  warning(message: string): void {
    toast.warning(message);
  }
}

export default new ToastService();