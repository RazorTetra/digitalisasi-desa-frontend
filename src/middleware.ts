import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./api/authApi";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLoginPath = path === "/login";
  const isRegisterPath = path === "/register";
  const isAdminPath = path.startsWith("/admin");

  const userDataString = request.cookies.get("userData")?.value;

  if (userDataString) {
    try {
      const userData: User = JSON.parse(userDataString);

      if (isLoginPath || isRegisterPath) {
        // Jika user sudah login dan mencoba mengakses halaman login atau register, redirect ke halaman utama
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isAdminPath && userData.role !== "ADMIN") {
        // Jika user bukan admin dan mencoba mengakses halaman admin, redirect ke unauthorized
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Jika ada error parsing, hapus cookie dan redirect ke root
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("userData");
      return response;
    }
  } else {
    if (isAdminPath || isRegisterPath) {
      // Jika tidak ada userData dan mencoba mengakses halaman admin atau register, redirect ke login
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isLoginPath) {
      // Mengizinkan akses ke halaman login
      return NextResponse.next();
    }
  }

  // Default behavior: izinkan akses untuk path lainnya
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
