import { PaymentForm, Tenant } from "./types";

interface PaymentFormModalProps {
  show: boolean;
  saving: boolean;
  loadingTenants: boolean;
  tenants: Tenant[];
  form: PaymentForm;
  setForm: React.Dispatch<React.SetStateAction<PaymentForm>>;
  onClose: () => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
}

export default function PaymentFormModal({
  show,
  saving,
  loadingTenants,
  tenants,
  form,
  setForm,
  onClose,
  onSubmit,
}: PaymentFormModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#263650]">
              Input Pembayaran
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Masukkan data pembayaran penyewa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >

          {/* PENYEWA */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Penyewa
            </label>

            <select
              value={form.tenantId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tenantId: e.target.value,
                }))
              }
              disabled={saving || loadingTenants}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f] disabled:bg-gray-100"
            >
              <option value="">
                {loadingTenants
                  ? "Memuat penyewa..."
                  : "Pilih penyewa"}
              </option>

              {tenants.map((tenant) => (
                <option
                  key={tenant.id}
                  value={tenant.id}
                >
                  {tenant.user?.name ||
                    `Penyewa #${tenant.id}`}

                  {tenant.room?.roomNumber
                    ? ` - ${tenant.room.roomNumber}`
                    : ""}
                </option>
              ))}
            </select>

            {tenants.length === 0 &&
              !loadingTenants && (
                <p className="mt-1 text-xs text-red-500">
                  Data penyewa tidak tersedia.
                </p>
              )}
          </div>

          {/* BULAN */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bulan
            </label>

            <input
              type="month"
              value={form.month}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  month: e.target.value,
                }))
              }
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f]"
            />
          </div>

          {/* NOMINAL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nominal
            </label>

            <input
              type="number"
              min="0"
              placeholder="700000"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f]"
            />
          </div>

          {/* METODE */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Metode Pembayaran
            </label>

            <select
              value={form.method}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  method: e.target.value,
                }))
              }
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f]"
            >
              <option value="transfer">
                Transfer
              </option>

              <option value="tunai">
                Tunai
              </option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status:
                    e.target.value as
                      | "LUNAS"
                      | "BELUM_BAYAR",
                }))
              }
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f]"
            >
              <option value="BELUM_BAYAR">
                Belum Dibayar
              </option>

              <option value="LUNAS">
                Lunas
              </option>
            </select>
          </div>

          {/* TANGGAL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tanggal Pembayaran
            </label>

            <input
              type="date"
              value={form.paymentDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  paymentDate: e.target.value,
                }))
              }
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#bd8b36] focus:ring-1 focus:ring-[#e6c98f]"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#bd8b36] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#a87829] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Menyimpan..."
                : "Simpan Pembayaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}