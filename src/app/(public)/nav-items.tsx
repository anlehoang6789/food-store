"use client";

import { useAppContext } from "@/components/app-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // Hiển thị cả khi chưa | đã đăng nhập
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Chỉ hiển thị khi chưa đăng nhập
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Chỉ hiển thị khi đã đăng nhập
  },
];

// Sau khi fix được cái lỗi là kh lấy đc localStorage bên utils bằng cách check nó có là browser hay không
// thì bây giờ nó gặp 1 cái lỗi khác thường hay gặp là Text content did not match. Server: "Đơn hàng" Client: "Đơn hàng"
// Cái này là do cái server render và cái client render không khớp nhau nên nó bị lỗi này
// Đầu tiên Server sẽ render Món ăn và Đăng nhập do chưa biết đc user đã đăng nhập hay chưa
// Tiếp đó client nhận đc kết quả từ server trả về là Món ăn và Đăng nhập
// Nhưng sau đó thì client check đc đã đăng nhập nên sẽ render là Món ăn, Đơn hàng, Quản lý
// Và nó sẽ bị lỗi này
//Để fix thì chúng ta có thể dùng useEffect để render lại sau khi client đã lấy đc dữ liệu từ server

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();
  return menuItems.map((item) => {
    // Nếu item không cần auth và đã đăng nhập hoặc item cần auth và chưa đăng nhập thì không hiển thị
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;

    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
