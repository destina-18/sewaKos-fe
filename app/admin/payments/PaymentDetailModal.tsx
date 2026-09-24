import { Payment } from "./types";
import {
  formatDate,
  formatMonth,
  formatRupiah,
} from "./utils";

interface PaymentDetailModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export default function PaymentDetailModal({
  payment,
  onClose,
}: PaymentDetailModalProps) {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#263650]">
              Detail Pembayaran
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Informasi transaksi pembayaran.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              ID Transaksi
            </span>

            <span className="text-sm font-medium text-gray-700">
              TR{String(payment.id).padStart(3, "0")}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Penyewa
            </span>

            <span className="text-sm font-medium text-gray-700">
              {payment.tenant?.user?.name || "-"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Kamar
            </span>

            <span className="text-sm font-medium text-gray-700">
              {payment.tenant?.room?.roomNumber || "-"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Bulan
            </span>

            <span className="text-sm font-medium text-gray-700">
              {formatMonth(payment.month)}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Nominal
            </span>

            <span className="text-sm font-medium text-gray-700">
              {formatRupiah(payment.amount)}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Metode
            </span>

            <span className="text-sm font-medium capitalize text-gray-700">
              {payment.method || "-"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm text-gray-500">
              Tanggal
            </span>

            <span className="text-sm font-medium text-gray-700">
              {formatDate(payment.paymentDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Status
            </span>

            {payment.status === "LUNAS" ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Lunas
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                Belum Dibayar
              </span>
            )}
          </div>

          {payment.proofUrl && (
            <div className="pt-3">
              <a
                href={payment.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#bd8b36] hover:underline"
              >
                Lihat Bukti Pembayaran
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#263650] px-5 py-2 text-sm font-medium text-white hover:bg-[#1c2a40]"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}