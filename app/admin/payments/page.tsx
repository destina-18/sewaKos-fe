"use client";

import { useEffect, useState } from "react";

import PaymentDetailModal from "./PaymentDetailModal";
import PaymentFormModal from "./PaymentFormModal"; 

import {
  confirmPaymentApi,
  createPaymentApi,
  fetchPaymentDetailApi,
  fetchPaymentsApi,
  fetchTenantsApi,
} from "./api";

import {
  FilterType,
  Payment,
  PaymentForm,
  Tenant,
} from "./types";

import {
  formatMonth,
  formatRupiah,
} from "./utils";

const EMPTY_FORM: PaymentForm = {
  tenantId: "",
  month: "",
  amount: "",
  method: "transfer",
  status: "BELUM_BAYAR",
  paymentDate: "",
};

export default function PaymentAdminPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [tenants, setTenants] =
    useState<Tenant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingTenants, setLoadingTenants] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [confirming, setConfirming] =
    useState<number | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [filter, setFilter] =
    useState<FilterType>("SEMUA");

  const [form, setForm] =
    useState<PaymentForm>(EMPTY_FORM);

  // ================================
  // FETCH PAYMENTS
  // ================================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const data = await fetchPaymentsApi();

      setPayments(data);
    } catch (error) {
      console.error(
        "FETCH PAYMENTS ERROR:",
        error
      );

      setPayments([]);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pembayaran."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH TENANTS
  // ================================

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);

      const data = await fetchTenantsApi();

      setTenants(data);
    } catch (error) {
      console.error(
        "FETCH TENANTS ERROR:",
        error
      );

      setTenants([]);
    } finally {
      setLoadingTenants(false);
    }
  };

  // ================================
  // LOAD DATA
  // ================================

  useEffect(() => {
    fetchPayments();
    fetchTenants();
  }, []);

  // ================================
  // OPEN MODAL
  // ================================

  const openModal = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  // ================================
  // CLOSE MODAL
  // ================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
  };

  // ================================
  // SUBMIT PAYMENT
  // ================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.tenantId ||
      !form.month ||
      !form.amount ||
      !form.method ||
      !form.status ||
      !form.paymentDate
    ) {
      alert(
        "Semua data pembayaran harus diisi."
      );

      return;
    }

    const paymentDate = new Date(
      `${form.paymentDate}T00:00:00`
    );

    if (isNaN(paymentDate.getTime())) {
      alert(
        "Tanggal pembayaran tidak valid."
      );

      return;
    }

    try {
      setSaving(true);

      await createPaymentApi({
        tenantId: Number(form.tenantId),
        month: form.month,
        amount: Number(form.amount),
        method: form.method,
        status: form.status,
        paymentDate:
          paymentDate.toISOString(),
      });

      alert(
        "Pembayaran berhasil ditambahkan."
      );

      setShowModal(false);
      setForm(EMPTY_FORM);

      await fetchPayments();
    } catch (error) {
      console.error(
        "CREATE PAYMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan pembayaran."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // CONFIRM PAYMENT
  // ================================

  const handleConfirm = async (
    payment: Payment
  ) => {
    const confirmed = window.confirm(
      `Konfirmasi pembayaran ${
        payment.tenant?.user?.name ||
        "penyewa"
      } sebesar ${formatRupiah(
        payment.amount
      )}?`
    );

    if (!confirmed) return;

    try {
      setConfirming(payment.id);

      await confirmPaymentApi(
        payment.id
      );

      alert(
        "Pembayaran berhasil dikonfirmasi menjadi LUNAS."
      );

      await fetchPayments();
    } catch (error) {
      console.error(
        "CONFIRM PAYMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengonfirmasi pembayaran."
      );
    } finally {
      setConfirming(null);
    }
  };

  // ================================
  // DETAIL PAYMENT
  // ================================

  const handleDetail = async (
    payment: Payment
  ) => {
    try {
      const detail =
        await fetchPaymentDetailApi(
          payment.id
        );

      setSelectedPayment(detail);
    } catch (error) {
      console.error(
        "DETAIL PAYMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil detail pembayaran."
      );
    }
  };

  // ================================
  // FILTER
  // ================================

  const filteredPayments =
    payments.filter((payment) => {
      if (filter === "SEMUA") {
        return true;
      }

      return payment.status === filter;
    });

  // ================================
  // RENDER
  // ================================

  return (
    <div className="min-h-screen bg-[#f6f2ea] p-8">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#263650]">
            Pembayaran
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Catat, konfirmasi, dan pantau
            seluruh transaksi sewa.
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-[#bd8b36] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a87829]"
        >
          + Input Pembayaran
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-4 flex gap-2">

        <button
          type="button"
          onClick={() =>
            setFilter("SEMUA")
          }
          className={`rounded-full px-4 py-2 text-xs transition ${
            filter === "SEMUA"
              ? "bg-[#263650] text-white"
              : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Semua
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("LUNAS")
          }
          className={`rounded-full px-4 py-2 text-xs transition ${
            filter === "LUNAS"
              ? "bg-[#263650] text-white"
              : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Lunas
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("BELUM_BAYAR")
          }
          className={`rounded-full px-4 py-2 text-xs transition ${
            filter === "BELUM_BAYAR"
              ? "bg-[#263650] text-white"
              : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Belum dibayar
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b bg-white text-left text-xs uppercase text-gray-500">

                <th className="px-6 py-4">
                  ID
                </th>

                <th className="px-6 py-4">
                  Penyewa
                </th>

                <th className="px-6 py-4">
                  Kamar
                </th>

                <th className="px-6 py-4">
                  Bulan
                </th>

                <th className="px-6 py-4">
                  Nominal
                </th>

                <th className="px-6 py-4">
                  Metode
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Memuat data pembayaran...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Belum ada data pembayaran.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(
                  (payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-sm text-gray-600">
                        TR
                        {String(
                          payment.id
                        ).padStart(3, "0")}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {payment.tenant?.user
                            ?.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {payment.tenant?.user
                            ?.email || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.tenant?.room
                          ?.roomNumber || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatMonth(
                          payment.month
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {formatRupiah(
                          payment.amount
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize text-gray-600">
                        {payment.method || "-"}
                      </td>

                      <td className="px-6 py-4">

                        {payment.status ===
                        "LUNAS" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Lunas
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                            Belum
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-4">

                        {payment.status ===
                        "BELUM_BAYAR" ? (
                          <button
                            type="button"
                            disabled={
                              confirming ===
                              payment.id
                            }
                            onClick={() =>
                              handleConfirm(
                                payment
                              )
                            }
                            className="text-xs font-medium text-[#bd8b36] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {confirming ===
                            payment.id
                              ? "Memproses..."
                              : "Konfirmasi"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleDetail(
                                payment
                              )
                            }
                            className="text-xs font-medium text-[#bd8b36] hover:underline"
                          >
                            Detail
                          </button>
                        )}

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL INPUT */}
      <PaymentFormModal
        show={showModal}
        saving={saving}
        loadingTenants={loadingTenants}
        tenants={tenants}
        form={form}
        setForm={setForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* MODAL DETAIL */}
      <PaymentDetailModal
        payment={selectedPayment}
        onClose={() =>
          setSelectedPayment(null)
        }
      />

    </div>
  );
}