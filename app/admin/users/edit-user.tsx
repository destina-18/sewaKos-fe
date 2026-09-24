"use client";

import { useState } from "react";

import type {
  Room,
  Tenant,
  TenantForm,
} from "./page";

type Props = {
  tenant: Tenant;
  rooms: Room[];
  loadingRooms: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUser({
  tenant,
  rooms,
  loadingRooms,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] =
    useState<TenantForm>({
      name:
        tenant.user?.name ||
        "",

      email:
        tenant.user?.email ||
        "",

      password: "",

      nik:
        tenant.nik || "",

      phone:
        tenant.phone || "",

      gender:
        tenant.gender || "",

      address:
        tenant.address || "",

      roomId:
        tenant.roomId !==
          undefined &&
        tenant.roomId !== null
          ? String(
              tenant.roomId
            )
          : "",

      moveInDate:
        tenant.moveInDate
          ? tenant.moveInDate.substring(
              0,
              10
            )
          : "",
    });

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     INPUT
  ========================================================= */

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = e.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  function validateForm() {
    if (!form.name.trim()) {
      setError(
        "Nama penyewa wajib diisi."
      );
      return false;
    }

    /*
      Email TIDAK divalidasi
      untuk PATCH karena tidak
      dikirim ke backend.
    */

    if (
      form.password.trim() &&
      form.password.trim()
        .length < 6
    ) {
      setError(
        "Password minimal 6 karakter."
      );
      return false;
    }

    if (!form.nik.trim()) {
      setError(
        "NIK wajib diisi."
      );
      return false;
    }

    if (!form.phone.trim()) {
      setError(
        "No. HP wajib diisi."
      );
      return false;
    }

    if (!form.gender) {
      setError(
        "Jenis kelamin wajib dipilih."
      );
      return false;
    }

    if (!form.address.trim()) {
      setError(
        "Alamat wajib diisi."
      );
      return false;
    }

    if (!form.roomId) {
      setError(
        "Kamar wajib dipilih."
      );
      return false;
    }

    if (
      Number(form.roomId) <= 0
    ) {
      setError(
        "Kamar yang dipilih tidak valid."
      );
      return false;
    }

    if (!form.moveInDate) {
      setError(
        "Tanggal masuk wajib diisi."
      );
      return false;
    }

    return true;
  }

  /* =========================================================
     EDIT PENYEWA
  ========================================================= */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      /*
        Email TIDAK dikirim.
        Backend sebelumnya menolak
        property email pada PATCH.
      */

      const body: Record<
        string,
        unknown
      > = {
        name:
          form.name.trim(),

        nik:
          form.nik.trim(),

        phone:
          form.phone.trim(),

        gender:
          form.gender,

        address:
          form.address.trim(),

        roomId:
          Number(form.roomId),

        moveInDate:
          form.moveInDate,
      };

      /*
        Password hanya dikirim
        jika user mengisinya.
      */

      if (
        form.password.trim()
      ) {
        body.password =
          form.password.trim();
      }

      console.log(
        "================================="
      );

      console.log(
        "EDIT PENYEWA"
      );

      console.log(
        "METHOD: PATCH"
      );

      console.log(
        "URL:",
        `/api/tenants/${tenant.id}`
      );

      console.log(
        "BODY:",
        body
      );

      console.log(
        "================================="
      );

      const response =
        await fetch(
          `/api/tenants/${tenant.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            body: JSON.stringify(
              body
            ),
          }
        );

      const result =
        await response
          .json()
          .catch(() => null);

      console.log(
        "EDIT STATUS:",
        response.status
      );

      console.log(
        "EDIT RESPONSE:",
        result
      );

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          throw new Error(
            "Unauthorized (401). Token login admin tidak valid."
          );
        }

        if (
          response.status === 403
        ) {
          throw new Error(
            "Forbidden (403). Akun kamu tidak memiliki izin Admin."
          );
        }

        throw new Error(
          Array.isArray(
            result?.message
          )
            ? result.message.join(
                ", "
              )
            : result?.message ||
                result?.error ||
                `Gagal mengubah data (${response.status})`
        );
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error(
        "EDIT USER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah data penyewa."
      );

    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-[#eeeae1] bg-white">

          <div>

            <h2 className="font-serif text-[19px] font-bold text-[#172642]">
              Ubah Penyewa
            </h2>

            <p className="mt-1 text-[11px] text-[#8a857d]">
              Ubah informasi penyewa.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#77736c] hover:bg-[#f4f1eb] text-lg"
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="px-6 py-6"
        >

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-600">
              {error}
            </div>
          )}

          {/* NAMA */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Nama Penyewa
            </label>

            <input
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] text-[12px] outline-none focus:border-[#bc8430]"
            />

          </div>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                form.email
              }
              disabled
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] bg-[#f5f3ef] text-[12px] text-[#999] outline-none"
            />

            <p className="mt-1 text-[9px] text-[#99958e]">
              Email tidak diubah dari
              halaman ini.
            </p>

          </div>

          {/* PASSWORD */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">

              Password

              <span className="ml-1 font-normal text-[#99958e]">
                (kosongkan jika tidak diubah)
              </span>

            </label>

            <input
              type="password"
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Password baru"
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] text-[12px] outline-none focus:border-[#bc8430]"
            />

          </div>

          {/* NIK */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              NIK
            </label>

            <input
              type="text"
              name="nik"
              value={
                form.nik
              }
              onChange={
                handleChange
              }
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] text-[12px] outline-none focus:border-[#bc8430]"
            />

          </div>

          {/* PHONE */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              No. HP
            </label>

            <input
              type="text"
              name="phone"
              value={
                form.phone
              }
              onChange={
                handleChange
              }
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] text-[12px] outline-none focus:border-[#bc8430]"
            />

          </div>

          {/* GENDER */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Jenis Kelamin
            </label>

            <select
              name="gender"
              value={
                form.gender
              }
              onChange={
                handleChange
              }
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] bg-white text-[12px] outline-none focus:border-[#bc8430]"
            >

              <option value="">
                Pilih jenis kelamin
              </option>

              <option value="Laki-laki">
                Laki-laki
              </option>

              <option value="Perempuan">
                Perempuan
              </option>

            </select>

          </div>

          {/* ALAMAT */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Alamat
            </label>

            <textarea
              name="address"
              value={
                form.address
              }
              onChange={
                handleChange
              }
              disabled={saving}
              rows={3}
              className="w-full px-3 py-2.5 rounded-md border border-[#d8d5ce] text-[12px] outline-none resize-none focus:border-[#bc8430]"
            />

          </div>

          {/* KAMAR */}

          <div className="mb-4">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Kamar
            </label>

            <select
              name="roomId"
              value={
                form.roomId
              }
              onChange={
                handleChange
              }
              disabled={
                saving ||
                loadingRooms
              }
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] bg-white text-[12px] outline-none focus:border-[#bc8430]"
            >

              <option value="">
                {loadingRooms
                  ? "Memuat data kamar..."
                  : "Pilih kamar"}
              </option>

              {rooms.map(
                (room) => (
                  <option
                    key={
                      room.id
                    }
                    value={
                      room.id
                    }
                  >
                    {room.roomNumber ||
                      `Kamar ${room.id}`}
                    {room.type
                      ? ` - ${room.type}`
                      : ""}
                    {room.floor
                      ? ` - Lantai ${room.floor}`
                      : ""}
                    {room.status
                      ? ` (${room.status})`
                      : ""}
                  </option>
                )
              )}

            </select>

            <p className="mt-1 text-[9px] text-[#99958e]">
              Kamar saat ini tetap
              tersedia untuk dipilih.
            </p>

          </div>

          {/* TANGGAL */}

          <div className="mb-6">

            <label className="block mb-1.5 text-[11px] font-semibold text-[#393733]">
              Tanggal Masuk
            </label>

            <input
              type="date"
              name="moveInDate"
              value={
                form.moveInDate
              }
              onChange={
                handleChange
              }
              disabled={saving}
              className="w-full h-10 px-3 rounded-md border border-[#d8d5ce] bg-white text-[12px] outline-none focus:border-[#bc8430]"
            />

          </div>

          {/* BUTTON */}

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 px-4 rounded-md border border-[#d8d5ce] bg-white text-[11px] font-medium text-[#55514b] hover:bg-[#f7f5f0]"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-9 px-5 rounded-md bg-[#bc8430] text-white text-[11px] font-semibold hover:bg-[#a97326] disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}