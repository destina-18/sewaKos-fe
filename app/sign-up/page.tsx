"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validasi input
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Semua data harus diisi.");
      return;
    }

    // Validasi password
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: "customer",
        }),
      });

      const text = await response.text();

      let data: any = {};

      // Cek apakah response berupa JSON
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Response bukan JSON:", text);

        setError(
          `Response server tidak valid. Status: ${response.status}`
        );

        return;
      }

      console.log("REGISTER RESPONSE:", data);

      // Jika register gagal
      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setError(data.message.join(", "));
        } else {
          setError(
            data.message ||
              `Registrasi gagal. Status: ${response.status}`
          );
        }

        return;
      }

      // Register berhasil
      console.log("REGISTER BERHASIL:", data);

      setSuccess(
        "Akun berhasil dibuat. Mengarahkan ke halaman login..."
      );

      // Kosongkan form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Pindah ke halaman login
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        "Tidak dapat terhubung ke server. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#182844] px-4">
      {/* Card */}
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
            Buat akun
          </h1>

          <p className="mt-1 text-[10px] text-gray-500">
            Daftar sebagai penyewa kos
          </p>
        </div>

        {/* Role */}
        <div className="mb-4 grid grid-cols-2 gap-1">
          <button
            type="button"
            disabled
            className="h-7 rounded-md border border-gray-200 bg-white text-[9px] text-gray-400"
          >
            Admin
          </button>

          <button
            type="button"
            className="h-7 rounded-md border border-[#d5a04c] bg-[#fffaf0] text-[9px] font-semibold text-[#9b6b21]"
          >
            Penyewa
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-[9px] text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-3 rounded-md border border-green-200 bg-green-50 px-2 py-2 text-[9px] text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-3"
        >
          {/* Nama */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-[9px] font-semibold text-gray-700"
            >
              Nama lengkap
            </label>

            <input
              id="name"
              type="text"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
              required
              className="h-7 w-full rounded-md border border-gray-300 bg-white px-2 text-[9px] text-gray-700 outline-none transition focus:border-[#bd8730] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
            />
          </div>

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
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                required
                className="h-7 w-full rounded-md border border-gray-300 bg-white px-2 pr-12 text-[9px] text-gray-700 outline-none transition focus:border-[#bd8730] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-medium text-[#bd8730] hover:text-[#94691f]"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-[9px] font-semibold text-gray-700"
            >
              Konfirmasi kata sandi
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="new-password"
                required
                className="h-7 w-full rounded-md border border-gray-300 bg-white px-2 pr-12 text-[9px] text-gray-700 outline-none transition focus:border-[#bd8730] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-medium text-[#bd8730] hover:text-[#94691f]"
              >
                {showConfirmPassword
                  ? "Sembunyikan"
                  : "Lihat"}
              </button>
            </div>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-7 w-full rounded-md bg-[#bd8730] text-[9px] font-bold text-white transition hover:bg-[#a97524] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Membuat akun..."
              : "Daftar sebagai Penyewa"}
          </button>
        </form>

        {/* Login */}
        <div className="mt-3 text-center">
          <p className="text-[8px] text-gray-400">
            Sudah punya akun?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#bd8730] hover:text-[#94691f]"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
