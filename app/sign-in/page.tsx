"use client";

import { useState } from "react";
import Link from "next/link";

type LoginRole = "admin" | "customer";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<LoginRole>("admin");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan password harus diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const text = await response.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Response bukan JSON:", text);

        setError(
          `Response server tidak valid. Status: ${response.status}`
        );

        return;
      }

      console.log("LOGIN RESPONSE:", data);

      // Login gagal
      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setError(data.message.join(", "));
        } else {
          setError(
            data.message ||
              `Login gagal. Status: ${response.status}`
          );
        }

        return;
      }

      // Ambil token dari berbagai kemungkinan response backend
      const token =
        data.token ||
        data.access_token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.access_token ||
        data.data?.accessToken;

      // Simpan token
      if (token) {
        localStorage.setItem("token", token);
      }

      // Ambil data user
      const user =
        data.user ||
        data.data?.user ||
        null;

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // Simpan role login
      localStorage.setItem("role", role);

      console.log("LOGIN BERHASIL");
      console.log("Role:", role);
      console.log("Token:", token);
      console.log("User:", user);

      if (!token) {
        console.warn(
          "Login berhasil tetapi token tidak ditemukan."
        );
      }

      // =========================
      // REDIRECT BERDASARKAN ROLE
      // =========================

      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/customer/dashboard";
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        "Tidak dapat terhubung ke server. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#182844] px-4">
      {/* Card Login */}
      <div className="w-full max-w-[330px] rounded-xl bg-[#f8f5ed] px-[18px] py-[18px] shadow-2xl">

        {/* Logo */}
        <div className="mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#bd8730]">
            <span className="font-serif text-xl font-bold text-white">
              K
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-4">
          <h1 className="font-serif text-[23px] font-bold leading-tight text-[#182844]">
            Selamat datang
          </h1>

          <p className="mt-1 text-[10px] text-gray-500">
            Masuk ke akun Anda
          </p>
        </div>

        {/* Role */}
        <div className="mb-4 grid grid-cols-2 gap-1">

          {/* Admin */}
          <button
            type="button"
            onClick={() => {
              setRole("admin");
              setError("");
            }}
            disabled={loading}
            className={`h-7 rounded-md border text-[9px] font-semibold transition ${
              role === "admin"
                ? "border-[#d5a04c] bg-[#fffaf0] text-[#9b6b21]"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            Admin
          </button>

          {/* Penyewa */}
          <button
            type="button"
            onClick={() => {
              setRole("customer");
              setError("");
            }}
            disabled={loading}
            className={`h-7 rounded-md border text-[9px] font-semibold transition ${
              role === "customer"
                ? "border-[#d5a04c] bg-[#fffaf0] text-[#9b6b21]"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            Penyewa
          </button>
        </div>

        {/* Role Info */}
        <div className="mb-3 rounded-md bg-[#fffaf0] px-2 py-2">
          <p className="text-[8px] text-[#9b6b21]">
            Login sebagai{" "}
            <span className="font-bold">
              {role === "admin"
                ? "Admin"
                : "Penyewa"}
            </span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-[9px] text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-3"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-[9px] font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder={
                role === "admin"
                  ? "admin@gmail.com"
                  : "customer@gmail.com"
              }
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              autoComplete="email"
              required
              className="h-7 w-full rounded-md border border-gray-300 bg-white px-2 text-[9px] text-gray-700 outline-none transition focus:border-[#bd8730] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-[9px] font-semibold text-gray-700"
            >
              Kata sandi
            </label>

            <div className="relative">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="current-password"
                required
                className="h-7 w-full rounded-md border border-gray-300 bg-white px-2 pr-12 text-[9px] text-gray-700 outline-none transition focus:border-[#bd8730] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-medium text-[#bd8730] hover:text-[#94691f]"
              >
                {showPassword
                  ? "Sembunyikan"
                  : "Lihat"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-7 w-full rounded-md bg-[#bd8730] text-[9px] font-bold text-white transition hover:bg-[#a97524] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Memproses..."
              : role === "admin"
              ? "Masuk sebagai Admin"
              : "Masuk sebagai Penyewa"}
          </button>
        </form>

        {/* Sign Up Customer */}
        {role === "customer" && (
          <div className="mt-3 text-center">
            <p className="text-[8px] text-gray-400">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#bd8730] hover:text-[#94691f]"
              >
                Daftar sebagai Penyewa
              </Link>
            </p>
          </div>
        )}

        {/* Forgot Password */}
        <div className="mt-2 text-center">
          <Link
            href="/forgot-password"
            className="text-[8px] text-gray-400 hover:text-[#bd8730]"
          >
            Lupa kata sandi?
          </Link>
        </div>
      </div>
    </main>
  );
}

