import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { DishStatus, OrderStatus } from "@/constants/type";

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

export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  /**
   * Không nên đưa logic get access token và refresh token ra khỏi hàm 'checkRefreshToken'
   * Vì để mỗi lần mà hàm 'checkRefreshToken' chạy, nó sẽ luôn lấy được cái accessToken và refreshToken mới nhất
   * Nếu đưa ra ngoài, thì nó chỉ lấy được cái accessToken và refreshToken lúc đầu
   */
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Chưa đăng nhập thì cũng kh cho chạy
  if (!accessToken || !refreshToken) return;

  const decodeAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };

  //   Thời điểm hết hạn của token được tính theo epoch time(s)
  // Còn khi dùng cú pháp Date().getTime() thì nó trả về epoch time(ms)
  const now = new Date().getTime() / 1000 - 1;

  // Nếu refresh token hết hạn thì logout
  if (decodeRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError && param.onError();
  }

  //Ví dụ access token có thời gian hết hạn là 10s
  // Thì chúng ta sẽ kiểm tra còn 1/3 thời gian hết hạn của access token thì sẽ gửi request refresh token
  // Thời gian còn lại sẽ tính theo công thức: decodeAccessToken.exp - now
  //  Thời gian hết hạn của accessToken tính theo công thức: decodeAccessToken.exp - decodeAccessToken.iat
  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    // Nếu thời gian còn lại ít hơn 1/3 thời gian hết hạn của access token thì call api refreshToken
    try {
      const result =
        await authApiRequest.refreshTokenFromNextClientToNextServer();
      setAccessTokenToLocalStorage(result.payload.data.accessToken);
      setRefreshTokenToLocalStorage(result.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};
