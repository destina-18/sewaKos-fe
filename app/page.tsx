import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Kos Management
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <a
              href="#about"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Tentang
            </a>

            <a
              href="#features"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Fitur
            </a>

            <a
              href="#flow"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Alur
            </a>

            <Link
              href="/sign-in"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-sky-500 py-24 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
          <h1 className="text-5xl font-bold leading-tight md:text-6xl">
            Sistem Manajemen Kos
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-blue-100">
            Kelola kamar, penyewa, pembayaran, dan laporan dalam satu aplikasi
            yang mudah digunakan oleh Admin maupun Penyewa.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-in"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
            >
              Login Admin
            </Link>

            <Link
              href="/customers/sign-in"
              className="rounded-lg border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-600"
            >
              Login Penyewa
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Tentang Aplikasi
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
            Sistem Manajemen Kos membantu pemilik kos dalam mengelola seluruh
            aktivitas operasional mulai dari data kamar, data penyewa,
            pembayaran bulanan hingga laporan pemasukan secara online.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
            Fitur Utama
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-4xl">🏠</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Kelola Kamar
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Tambah, edit, hapus, dan melihat status kamar kos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-4xl">👨‍💼</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Data Penyewa
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Mengelola data penyewa beserta kamar yang ditempati.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-4xl">💳</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Pembayaran
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Mengelola tagihan dan pembayaran sewa bulanan.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-4xl">📊</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Dashboard
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Melihat statistik kamar, penyewa, pemasukan, dan laporan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section id="flow" className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-bold text-gray-800">
            Alur Sistem
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {[
              "Login",
              "Dashboard",
              "Kelola Kamar",
              "Kelola Penyewa",
              "Pembayaran",
              "Laporan",
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {index + 1}
                </div>

                <p className="mt-4 font-semibold text-gray-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-4xl font-bold">
            Mulai Kelola Kos Anda Sekarang
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Aplikasi sederhana namun lengkap untuk membantu proses administrasi
            kos menjadi lebih cepat dan efisien.
          </p>

          <Link
            href="/sign-in"
            className="mt-10 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Login Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-gray-400">
        <h2 className="text-xl font-bold text-white">
          Kos Management System
        </h2>

        <p className="mt-3">© 2026 All Rights Reserved.</p>
      </footer>
    </main>
  );
}