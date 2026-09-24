"use client";

import { useState } from "react";

type Room = {
  id: number | string;

  roomNumber?: string;
  room_number?: string;
  number?: string;
  name?: string;
};

type Props = {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
};

/* =========================================================
   HELPER
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

/* =========================================================
   DELETE ROOM
========================================================= */

export default function DeleteRoom({
  room,
  onClose,
  onSuccess,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     HAPUS
  ========================================================= */

  async function handleDelete() {
    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `/api/backend/rooms/${room.id}`,
          {
            method: "DELETE",

            headers: {
              Accept:
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      /* =======================================================
         ERROR RESPONSE
      ======================================================= */

      if (!response.ok) {
        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        let message = "";

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          const data =
            await response
              .json()
              .catch(() => null);

          message =
            Array.isArray(
              data?.message
            )
              ? data.message.join(
                  ", "
                )
              : data?.message ||
                "";
        } else {
          message =
            await response
              .text()
              .catch(() => "");
        }

        throw new Error(
          message ||
            `Gagal menghapus kamar (${response.status})`
        );
      }

      /* =======================================================
         SUCCESS
      ======================================================= */

      onSuccess();
      onClose();

    } catch (err: any) {
      console.error(
        "Delete room error:",
        err
      );

      setError(
        err?.message ||
          "Gagal menghapus kamar."
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

      <div className="w-full max-w-[380px] rounded-[12px] bg-white p-5 shadow-xl">

        {/* =================================================
            TITLE
        ================================================= */}

        <h2 className="font-serif text-[17px] font-bold text-[#29354a]">
          Hapus Kamar?
        </h2>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className="mt-2 text-[9px] leading-5 text-[#888]">

          Kamu yakin ingin menghapus kamar{" "}

          <strong>
            {getRoomNumber(room)}
          </strong>

          ? Data yang sudah dihapus
          tidak dapat dikembalikan.

        </p>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-3 rounded-md bg-[#fff3f0] px-3 py-2 text-[9px] text-[#a34d3c]">
            {error}
          </div>
        )}

        {/* =================================================
            BUTTON
        ================================================= */}

        <div className="mt-5 flex gap-2">

          {/* BATAL */}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-md border border-[#ddd] px-3 py-2 text-[9px] font-medium text-[#666] transition hover:bg-[#fafafa]"
          >
            Batal
          </button>

          {/* HAPUS */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex-1 rounded-md bg-[#b64c3d] px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-[#a44235] disabled:opacity-50"
          >
            {saving
              ? "Menghapus..."
              : "Ya, Hapus"}
          </button>

        </div>

      </div>

    </div>
  );
}