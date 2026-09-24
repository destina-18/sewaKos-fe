"use client";

import { useState } from "react";

type Room = {
  id: number | string;

  roomNumber?: string;
  room_number?: string;
  number?: string;
  name?: string;

  floor?: number;
  type?: string;

  price?: number;
  rentPrice?: number;
  rent_price?: number;

  description?: string;
};

type Props = {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
};

/* =========================================================
   HELPERS
========================================================= */

function getRoomNumber(room: Room) {
  return (
    room.roomNumber ||
    room.room_number ||
    room.number ||
    room.name ||
    "-"
  );
}

function getRoomPrice(room: Room) {
  return (
    Number(room.price) ||
    Number(room.rentPrice) ||
    Number(room.rent_price) ||
    0
  );
}

/* =========================================================
   EDIT ROOM
========================================================= */

export default function EditRoom({
  room,
  onClose,
  onSuccess,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    roomNumber:
      getRoomNumber(room),

    floor:
      room.floor !== undefined &&
      room.floor !== null
        ? String(room.floor)
        : "",

    type:
      room.type ||
      "Standard",

    price:
      getRoomPrice(room) > 0
        ? String(
            getRoomPrice(room)
          )
        : "",

    description:
      room.description || "",
  });

  /* =========================================================
     EDIT
  ========================================================= */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    /* =======================================================
       VALIDATION
    ======================================================= */

    if (!form.roomNumber.trim()) {
      setError(
        "Nomor kamar wajib diisi."
      );
      return;
    }

    if (!form.price.trim()) {
      setError(
        "Harga kamar wajib diisi."
      );
      return;
    }

    const price =
      Number(form.price);

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      setError(
        "Harga kamar tidak valid."
      );
      return;
    }

    const floor =
      Number(form.floor);

    if (
      !form.floor.trim() ||
      !Number.isInteger(floor) ||
      floor < 0
    ) {
      setError(
        "Lantai harus diisi dengan angka bulat 0 atau lebih."
      );
      return;
    }

    if (!form.type.trim()) {
      setError(
        "Tipe kamar wajib diisi."
      );
      return;
    }

    /* =======================================================
       REQUEST
    ======================================================= */

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      const body = {
        roomNumber:
          form.roomNumber.trim(),

        floor,

        type:
          form.type.trim(),

        price,

        facilityIds: [],

        description:
          form.description.trim() ||
          undefined,
      };

      console.log(
        "Request edit kamar:",
        body
      );

      const response =
        await fetch(
          `/api/backend/rooms/${room.id}`,
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

      /* =======================================================
         RESPONSE
      ======================================================= */

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let responseData: any =
        null;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        responseData =
          await response
            .json()
            .catch(() => null);
      } else {
        responseData =
          await response
            .text()
            .catch(() => "");
      }

      /* =======================================================
         ERROR
      ======================================================= */

      if (!response.ok) {
        let message =
          responseData?.message;

        if (
          Array.isArray(message)
        ) {
          message =
            message.join(", ");
        }

        throw new Error(
          message ||
            `Gagal mengubah kamar (${response.status})`
        );
      }

      /* =======================================================
         SUCCESS
      ======================================================= */

      onSuccess();
      onClose();

    } catch (err: any) {
      console.error(
        "Edit room error:",
        err
      );

      setError(
        err?.message ||
          "Gagal mengubah kamar."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5">

      <div className="w-full max-w-[430px] rounded-[12px] bg-white p-5 shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between">

          <div>

            <h2 className="font-serif text-[17px] font-bold text-[#29354a]">
              Edit Kamar
            </h2>

            <p className="mt-1 text-[9px] text-[#999]">
              Ubah informasi kamar.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[18px] text-[#aaa] hover:text-[#555]"
          >
            ×
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >

          {/* NOMOR KAMAR */}

          <div>

            <label className="text-[9px] font-medium text-[#555]">
              Nomor Kamar
            </label>

            <input
              value={
                form.roomNumber
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  roomNumber:
                    e.target.value,
                })
              }
              placeholder="Contoh: A01"
              className="mt-1 w-full rounded-md border border-[#ddd] px-3 py-2 text-[10px] outline-none focus:border-[#8f6969]"
            />

          </div>

          {/* LANTAI */}

          <div>

            <label className="text-[9px] font-medium text-[#555]">
              Lantai
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={
                form.floor
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  floor:
                    e.target.value,
                })
              }
              placeholder="Contoh: 1"
              className="mt-1 w-full rounded-md border border-[#ddd] px-3 py-2 text-[10px] outline-none focus:border-[#8f6969]"
            />

          </div>

          {/* TIPE */}

          <div>

            <label className="text-[9px] font-medium text-[#555]">
              Tipe Kamar
            </label>

            <select
              value={
                form.type
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  type:
                    e.target.value,
                })
              }
              className="mt-1 w-full rounded-md border border-[#ddd] bg-white px-3 py-2 text-[10px] outline-none focus:border-[#8f6969]"
            >

              <option value="Standard">
                Standard
              </option>

              <option value="Deluxe">
                Deluxe
              </option>

              <option value="Premium">
                Premium
              </option>

            </select>

          </div>

          {/* HARGA */}

          <div>

            <label className="text-[9px] font-medium text-[#555]">
              Harga Sewa / Bulan
            </label>

            <input
              type="number"
              min="0"
              value={
                form.price
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  price:
                    e.target.value,
                })
              }
              placeholder="Contoh: 800000"
              className="mt-1 w-full rounded-md border border-[#ddd] px-3 py-2 text-[10px] outline-none focus:border-[#8f6969]"
            />

          </div>

          {/* DESKRIPSI */}

          <div>

            <label className="text-[9px] font-medium text-[#555]">
              Deskripsi
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  description:
                    e.target.value,
                })
              }
              rows={3}
              placeholder="Keterangan kamar..."
              className="mt-1 w-full resize-none rounded-md border border-[#ddd] px-3 py-2 text-[10px] outline-none focus:border-[#8f6969]"
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-md bg-[#fff3f0] px-3 py-2 text-[9px] text-[#a34d3c]">
              {error}
            </div>
          )}

          {/* BUTTON */}

          <div className="flex gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-md border border-[#ddd] px-3 py-2 text-[9px] font-medium text-[#666]"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-[#612626] px-3 py-2 text-[9px] font-semibold text-white disabled:opacity-50"
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