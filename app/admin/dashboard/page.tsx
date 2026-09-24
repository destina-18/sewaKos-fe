"use client";

import { useCallback, useEffect, useState } from "react";

/* =========================================================
   API
   ========================================================= */

const PROXY_BASE_URL = "/api/backend";

const API_ENDPOINTS = {
  rooms: "/rooms",
  users: "/users",
  payments: "/payments",
};

/* =========================================================
   TYPES
   ========================================================= */

type Room = {
  id: number | string;

  roomNumber?: string;
  room_number?: string;
  number?: string;
  name?: string;

  status?: string;

  isOccupied?: boolean;
  occupied?: boolean;

  price?: number;
  rentPrice?: number;
  rent_price?: number;
};

type User = {
  id: number | string;

  name?: string;
  fullName?: string;
  full_name?: string;

  email?: string;
  role?: string;

  room?: {
    roomNumber?: string;
    room_number?: string;
    number?: string;
  };

  roomNumber?: string;
  room_number?: string;
};

type Payment = {
  id: number | string;

  tenantId?: number | string;

  month?: string;

  amount?: number | string;

  method?: string;

  paymentDate?: string;

  status?: string;

  proofUrl?: string | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;

  tenant?: {
    id?: number | string;

    user?: {
      id?: number | string;
      name?: string;
      email?: string;
    };

    room?: {
      id?: number | string;
      roomNumber?: string;
      room_number?: string;
      number?: string;
    };

    roomId?: number | string;
  };
};

type Activity = {
  id?: number | string;

  title?: string;
  description?: string;

  badge?: string;
  type?: string;

  createdAt?: string;
};

/* =========================================================
   RESPONSE HELPER
   ========================================================= */

function getArrayFromResponse(data: any): any[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

/* =========================================================
   FORMAT MONTH
   ========================================================= */

function formatPaymentMonth(payment: Payment) {
  if (payment.month) {
    const parts = payment.month.split("-");

    if (parts.length === 2) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);

      if (
        !Number.isNaN(year) &&
        !Number.isNaN(month) &&
        month >= 1 &&
        month <= 12
      ) {
        const date = new Date(year, month - 1, 1);

        return new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(date);
      }
    }

    return payment.month;
  }

  const fallbackDate =
    payment.paymentDate ||
    payment.updatedAt ||
    payment.updated_at ||
    payment.createdAt ||
    payment.created_at;

  if (!fallbackDate) {
    return "-";
  }

  const parsedDate = new Date(fallbackDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

/* =========================================================
   PAYMENT STATUS
   ========================================================= */

function isPaidPayment(payment: Payment) {
  const status = String(payment.status || "")
    .trim()
    .toUpperCase();

  return (
    status === "LUNAS" ||
    status === "PAID" ||
    status === "SUCCESS" ||
    status === "TERBAYAR"
  );
}

function isUnpaidPayment(payment: Payment) {
  const status = String(payment.status || "")
    .trim()
    .toUpperCase();

  return (
    status === "BELUM_BAYAR" ||
    status === "BELUM BAYAR" ||
    status === "UNPAID" ||
    status === "PENDING" ||
    status === "MENUNGGU"
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  accent,
  large = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
  large?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[10px] bg-white px-4 py-4">
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px]"
        style={{
          backgroundColor: accent,
        }}
      />

      <p className="text-[8px] text-[#777]">
        {title}
      </p>

      <p
        className={`mt-[2px] font-serif font-bold leading-none text-[#29354a] ${
          large ? "text-[17px]" : "text-[19px]"
        }`}
      >
        {value}
      </p>

      <p className="mt-[8px] text-[7px] text-[#999]">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

export default function AdminDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     GET TOKEN
  ======================================================= */

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken")
    );
  };

  /* =======================================================
     FETCH API
  ======================================================= */

  const fetchAPI = async (
    endpoint: string
  ): Promise<any | null> => {
    const token = getToken();

    try {
      const response = await fetch(
        `${PROXY_BASE_URL}${endpoint}`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!response.ok) {
        let message = "";

        if (contentType.includes("application/json")) {
          const result =
            await response
              .json()
              .catch(() => null);

          if (Array.isArray(result?.message)) {
            message = result.message.join(", ");
          } else {
            message =
              result?.message ||
              result?.error ||
              "";
          }
        } else {
          message =
            await response.text().catch(() => "");
        }

        console.warn(
          `API ${endpoint} mengembalikan ${response.status}.`,
          message
        );

        return null;
      }

      if (
        !contentType.includes("application/json")
      ) {
        console.warn(
          `API ${endpoint} tidak mengembalikan JSON.`
        );

        return null;
      }

      return await response
        .json()
        .catch(() => null);
    } catch (err) {
      console.warn(
        `API ${endpoint} tidak dapat diakses.`,
        err
      );

      return null;
    }
  };

  /* =======================================================
     CREATE ACTIVITIES FROM PAYMENTS
  ======================================================= */

  const createPaymentActivities = (
    paymentList: Payment[]
  ): Activity[] => {
    return [...paymentList]
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt ||
            a.updated_at ||
            a.paymentDate ||
            a.createdAt ||
            a.created_at ||
            0
        ).getTime();

        const dateB = new Date(
          b.updatedAt ||
            b.updated_at ||
            b.paymentDate ||
            b.createdAt ||
            b.created_at ||
            0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 10)
      .map((payment, index) => {
        const paid = isPaidPayment(payment);

        const tenantName =
          payment.tenant?.user?.name ||
          payment.tenant?.user?.email ||
          "Penyewa";

        const amount =
          Number(payment.amount) || 0;

        const month =
          formatPaymentMonth(payment);

        return {
          id:
            payment.id ??
            `payment-${index}`,

          title: paid
            ? "Pembayaran dikonfirmasi"
            : "Tagihan pembayaran",

          description:
            `${tenantName} • ` +
            `${formatRupiah(amount)} • ` +
            `${month}`,

          badge: paid
            ? "Lunas"
            : "Belum",

          type: paid
            ? "success"
            : "pending",

          createdAt:
            payment.updatedAt ||
            payment.updated_at ||
            payment.paymentDate ||
            payment.createdAt ||
            payment.created_at,
        };
      });
  };

  /* =======================================================
     FETCH ALL DASHBOARD DATA
  ======================================================= */

  const fetchDashboardData = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        setError("");

        const [
          roomsResponse,
          usersResponse,
          paymentsResponse,
        ] = await Promise.all([
          fetchAPI(API_ENDPOINTS.rooms),
          fetchAPI(API_ENDPOINTS.users),
          fetchAPI(API_ENDPOINTS.payments),
        ]);

        /* ===============================================
           CONVERT RESPONSE
        =============================================== */

        const roomsData =
          getArrayFromResponse(
            roomsResponse
          );

        const usersData =
          getArrayFromResponse(
            usersResponse
          );

        const paymentsData =
          getArrayFromResponse(
            paymentsResponse
          );

        /* ===============================================
           SET DATA
        =============================================== */

        setRooms(roomsData);
        setUsers(usersData);
        setPayments(paymentsData);

        /* ===============================================
           CREATE ACTIVITIES
        =============================================== */

        const paymentActivities =
          createPaymentActivities(
            paymentsData
          );

        setActivities(
          paymentActivities
        );

        /* ===============================================
           CHECK FAILED
        =============================================== */

        const allFailed =
          roomsResponse === null &&
          usersResponse === null &&
          paymentsResponse === null;

        if (allFailed) {
          setError(
            "Data backend belum dapat diakses. Dashboard tetap berjalan dengan data kosong."
          );
        }
      } catch (err) {
        console.warn(
          "Dashboard refresh gagal.",
          err
        );

        setError(
          "Data dashboard sementara tidak dapat diperbarui. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =======================================================
     INITIAL LOAD + REALTIME
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      if (mounted) {
        await fetchDashboardData(true);
      }
    };

    void loadInitial();

    /*
     * Dashboard diperbarui otomatis setiap 5 detik.
     */

    const interval = setInterval(() => {
      if (
        mounted &&
        !document.hidden
      ) {
        void fetchDashboardData(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  /* =======================================================
     ROOM STATISTICS
  ======================================================= */

  const totalRooms = rooms.length;

  const occupiedRooms = rooms.filter(
    (room) => {
      const status = String(
        room.status || ""
      ).toLowerCase();

      return (
        room.isOccupied === true ||
        room.occupied === true ||
        status === "occupied" ||
        status === "terisi"
      );
    }
  ).length;

  const emptyRooms = Math.max(
    totalRooms - occupiedRooms,
    0
  );

  const occupancy =
    totalRooms > 0
      ? Math.round(
          (occupiedRooms /
            totalRooms) *
            100
        )
      : 0;

  /* =======================================================
     CURRENT DATE
  ======================================================= */

  const currentDate = new Date();

  const currentMonthNumber =
    currentDate.getMonth() + 1;

  const currentYear =
    currentDate.getFullYear();

  /* =======================================================
     CURRENT MONTH PAYMENTS
  ======================================================= */

  const currentMonthPayments =
    payments.filter((payment) => {
      /*
       * Prioritas:
       * payment.month
       *
       * Contoh:
       * 2026-09
       */

      if (payment.month) {
        const parts =
          payment.month.split("-");

        if (parts.length === 2) {
          const year = Number(
            parts[0]
          );

          const month = Number(
            parts[1]
          );

          if (
            !Number.isNaN(year) &&
            !Number.isNaN(month)
          ) {
            return (
              year === currentYear &&
              month ===
                currentMonthNumber
            );
          }
        }
      }

      /*
       * Fallback:
       * paymentDate / createdAt
       */

      const date =
        payment.paymentDate ||
        payment.createdAt ||
        payment.created_at;

      if (!date) {
        return false;
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return false;
      }

      return (
        parsedDate.getFullYear() ===
          currentYear &&
        parsedDate.getMonth() ===
          currentMonthNumber - 1
      );
    });

  /* =======================================================
     PAID CURRENT MONTH
  ======================================================= */

  const paidPayments =
    currentMonthPayments.filter(
      (payment) =>
        isPaidPayment(payment)
    );

  /* =======================================================
     MONTHLY INCOME
  ======================================================= */

  const monthlyIncome =
    paidPayments.reduce(
      (total, payment) => {
        return (
          total +
          (Number(payment.amount) ||
            0)
        );
      },
      0
    );

  /* =======================================================
     UNPAID PAYMENTS
  ======================================================= */

  const unpaidPayments =
    payments.filter((payment) =>
      isUnpaidPayment(payment)
    );

  /* =======================================================
     PAYMENT NAME
  ======================================================= */

  const getPaymentName = (
    payment: Payment
  ) => {
    return (
      payment.tenant?.user?.name ||
      payment.tenant?.user?.email ||
      "Penyewa"
    );
  };

  /* =======================================================
     PAYMENT ROOM
  ======================================================= */

  const getPaymentRoom = (
    payment: Payment
  ) => {
    return (
      payment.tenant?.room
        ?.roomNumber ||
      payment.tenant?.room
        ?.room_number ||
      payment.tenant?.room?.number ||
      "-"
    );
  };

  /* =======================================================
     PAYMENT AMOUNT
  ======================================================= */

  const getPaymentAmount = (
    payment: Payment
  ) => {
    return Number(
      payment.amount || 0
    );
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(
      "access_token"
    );
    localStorage.removeItem(
      "accessToken"
    );
    localStorage.removeItem("user");

    window.location.href =
      "/sign-in";
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3]">
        <header className="flex h-[60px] items-center justify-between border-b border-[#eeeeee] bg-white px-5 md:px-8">
          <p className="text-[12px] font-medium text-[#777]">
            Dashboard
          </p>

          <div className="h-7 w-20 animate-pulse rounded-md bg-[#eeeeee]" />
        </header>

        <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-48 rounded bg-[#e5e5e5]" />

            <div className="mt-2 h-3 w-72 rounded bg-[#eeeeee]" />

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[95px] rounded-[10px] bg-white"
                  />
                )
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =======================================================
     BACKEND WARNING
  ======================================================= */

  const backendWarning = error ? (
    <div className="border-b border-[#f0e1dc] bg-[#fffaf8] px-5 py-2 text-center md:px-8">
      <p className="text-[9px] text-[#9b665b]">
        {error}
      </p>
    </div>
  ) : null;

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f6f3]">

      {/* ===================================================
          TOP HEADER
      ==================================================== */}

      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-[#eeeeee] bg-white px-5 md:px-8">

        <div>
          <p className="text-[12px] font-medium text-[#777]">
            Dashboard
          </p>

          {refreshing && (
            <p className="text-[7px] text-[#aaa]">
              Memperbarui data...
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">

          <span className="text-[11px] font-semibold text-[#222]">
            Admin
          </span>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#612626] text-[11px] font-bold text-white">
            A
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-[#ddd] bg-white px-2.5 py-1 text-[10px] font-medium text-[#333] transition hover:bg-[#f5f5f5]"
          >
            Keluar
          </button>

        </div>
      </header>

      {backendWarning}

      {/* ===================================================
          MAIN
      ==================================================== */}

      <main className="mx-auto w-full max-w-[1100px] px-5 py-8 md:px-8">

        {/* =================================================
            GREETING
        ================================================== */}

        <div className="mb-5">

          <h1 className="font-serif text-[18px] font-bold text-[#26334a]">
            Selamat datang, Admin
          </h1>

          <p className="mt-[3px] text-[10px] text-[#8b8b8b]">
            Berikut ringkasan kos Anda hari ini,{" "}
            {formatDate(new Date())}.
          </p>

        </div>

        {/* =================================================
            STATISTICS
        ================================================== */}

        <div className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL KAMAR */}

          <StatCard
            title="Total Kamar"
            value={String(
              totalRooms
            )}
            subtitle="Semua kamar"
            accent="#c8953e"
          />

          {/* KAMAR TERISI */}

          <StatCard
            title="Kamar Terisi"
            value={String(
              occupiedRooms
            )}
            subtitle={`${occupancy}% okupansi`}
            accent="#4f806b"
          />

          {/* KAMAR KOSONG */}

          <StatCard
            title="Kamar Kosong"
            value={String(
              emptyRooms
            )}
            subtitle="Siap disewa"
            accent="#b64c3d"
          />

          {/* PENDAPATAN */}

          <StatCard
            title="Pendapatan Bulan Ini"
            value={formatRupiah(
              monthlyIncome
            )}
            subtitle={`${paidPayments.length} tagihan lunas`}
            accent="#b64c3d"
            large
          />

        </div>

        {/* =================================================
            BOTTOM CONTENT
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">

          {/* =================================================
              TAGIHAN BELUM DIBAYAR
          ================================================== */}

          <section className="rounded-[10px] bg-white px-4 py-5">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="font-serif text-[12px] font-bold text-[#29354a]">
                Tagihan belum dibayar
              </h2>

              <span className="rounded-full bg-[#f8e5dc] px-2 py-[3px] text-[7px] font-semibold text-[#b95742]">
                {unpaidPayments.length}{" "}
                tertunda
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[500px] border-collapse">

                <thead>

                  <tr className="border-b border-[#e5e5e5]">

                    <th className="px-1 pb-2 text-left text-[7px] font-medium text-[#858585]">
                      PENYEWA
                    </th>

                    <th className="px-1 pb-2 text-left text-[7px] font-medium text-[#858585]">
                      KAMAR
                    </th>

                    <th className="px-1 pb-2 text-left text-[7px] font-medium text-[#858585]">
                      BULAN
                    </th>

                    <th className="px-1 pb-2 text-left text-[7px] font-medium text-[#858585]">
                      NOMINAL
                    </th>

                    <th className="px-1 pb-2 text-right text-[7px] font-medium text-[#858585]">
                      STATUS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {unpaidPayments.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-1 py-8 text-center text-[9px] text-[#999]"
                      >
                        Tidak ada tagihan tertunda 🎉
                      </td>

                    </tr>

                  ) : (

                    unpaidPayments
                      .slice(0, 10)
                      .map(
                        (payment) => (

                          <tr
                            key={
                              payment.id
                            }
                            className="border-b border-[#e9e9e9] last:border-b-0"
                          >

                            {/* PENYEWA */}

                            <td className="px-1 py-3 text-[8px] text-[#555]">
                              {getPaymentName(
                                payment
                              )}
                            </td>

                            {/* KAMAR */}

                            <td className="px-1 py-3 text-[8px] text-[#555]">
                              {getPaymentRoom(
                                payment
                              )}
                            </td>

                            {/* BULAN */}

                            <td className="px-1 py-3 text-[8px] text-[#555]">
                              {formatPaymentMonth(
                                payment
                              )}
                            </td>

                            {/* NOMINAL */}

                            <td className="px-1 py-3 text-[8px] text-[#555]">
                              {formatRupiah(
                                getPaymentAmount(
                                  payment
                                )
                              )}
                            </td>

                            {/* STATUS */}

                            <td className="px-1 py-3 text-right">

                              <span className="rounded-full bg-[#f8ddd4] px-2 py-[3px] text-[7px] font-semibold text-[#bd624c]">
                                Belum
                              </span>

                            </td>

                          </tr>

                        )
                      )

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* =================================================
              AKTIVITAS TERBARU
          ================================================== */}

          <section className="rounded-[10px] bg-white px-4 py-5">

            <div className="mb-3 flex items-center justify-between">

              <h2 className="font-serif text-[12px] font-bold text-[#29354a]">
                Aktivitas terbaru
              </h2>

              <span className="text-[7px] text-[#aaa]">
                Live
              </span>

            </div>

            <div>

              {activities.length ===
              0 ? (

                <div className="py-8 text-center">

                  <p className="text-[9px] text-[#999]">
                    Belum ada aktivitas.
                  </p>

                  <p className="mt-1 text-[7px] text-[#bbb]">
                    Aktivitas akan muncul dari data pembayaran.
                  </p>

                </div>

              ) : (

                activities
                  .slice(0, 10)
                  .map(
                    (
                      activity,
                      index
                    ) => (

                      <div
                        key={
                          activity.id ??
                          index
                        }
                        className="flex items-start justify-between gap-2 border-b border-[#e6e6e6] py-[7px] last:border-b-0"
                      >

                        <div className="min-w-0">

                          <p className="text-[8px] font-semibold leading-[13px] text-[#4a5565]">
                            {activity.title ||
                              "Aktivitas"}
                          </p>

                          <p className="text-[7px] leading-[11px] text-[#999]">
                            {activity.description ||
                              "-"}
                          </p>

                        </div>

                        {activity.badge && (

                          <span
                            className={`shrink-0 rounded-full px-2 py-[2px] text-[7px] font-semibold ${
                              activity.type ===
                              "success"
                                ? "bg-[#dceee4] text-[#57906f]"
                                : "bg-[#f8ddd4] text-[#bd624c]"
                            }`}
                          >
                            {activity.badge}
                          </span>

                        )}

                      </div>

                    )
                  )

              )}

            </div>

          </section>

        </div>

        {/* =================================================
            REAL TIME INFO
        ================================================== */}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-[7px] text-[#aaa]">
            Data diperbarui otomatis setiap 5 detik
          </p>

          <button
            type="button"
            onClick={() =>
              void fetchDashboardData(
                false
              )
            }
            disabled={refreshing}
            className="rounded-md border border-[#ddd] bg-white px-2.5 py-1 text-[8px] font-medium text-[#555] transition hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            {refreshing
              ? "Memuat..."
              : "Refresh"}
          </button>

        </div>

      </main>

    </div>
  );
}