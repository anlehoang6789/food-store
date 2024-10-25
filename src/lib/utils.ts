import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  //Nếu cái error thuộc kiểu dữ liệu của HttpError và người dùng người dùng có truyền 1 cái setError
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((error) => {
      setError(error.field as "email" | "password", {
        type: "server",
        message: error.message,
      });
    });
  } else {
    toast({
      title: "Đã xảy ra lỗi",
      description: error?.payload?.message ?? "Đã xảy ra lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  isBrowser && localStorage.setItem("accessToken", accessToken);
};

export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  isBrowser && localStorage.setItem("refreshToken", refreshToken);
};
