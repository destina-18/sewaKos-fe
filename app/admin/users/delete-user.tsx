"use client";

import { useState } from "react";

import type { Tenant } from "./page";

type Props = {
  tenant: Tenant;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteUser({
  tenant,
  onClose,
  onSuccess,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     DELETE
  ========================================================= */

  async function handleDelete() {
    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      console.log(
        "================================="
      );

      console.log(
        "DELETE PENYEWA"
      );

      console.log(
        "ID:",
        tenant.id
      );

      console.log(
        "================================="
      );

      const response =
        await fetch(
          `/api/tenants/${tenant.id}`,
          {
            method: "DELETE",

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
          }
        );

      const result =
        await response
          .json()
          .catch(() => null);

      console.log(
        "DELETE STATUS:",
        response.status
      );

      console.log(
        "DELETE RESPONSE:",
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
                `Gagal menghapus data (${response.status})`
        );
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus penyewa."
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

      <div className="w-full max-w-[380px] rounded-xl bg-white p-6 shadow-2xl">

        {/* TITLE */}

        <h2 className="font-serif text-[19px] font-bold text-[#172642]">
          Hapus Penyewa?
        </h2>

        {/* DESCRIPTION */}

        <p className="mt-2 text-[11px] leading-5 text-[#77736c]">

          Apakah kamu yakin ingin
          menghapus penyewa{" "}

          <strong className="text-[#393733]">
            {tenant.user?.name ||
              "-"}
          </strong>

          ?

          <br />

          Data penyewa yang sudah
          dihapus tidak dapat
          dikembalikan.

        </p>

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] text-red-600">
            {error}
          </div>
        )}

        {/* BUTTON */}

        <div className="mt-6 flex gap-2">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 h-9 rounded-md border border-[#d8d5ce] bg-white text-[10px] font-medium text-[#55514b] hover:bg-[#f7f5f0] disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={saving}
            className="flex-1 h-9 rounded-md bg-[#b64c3d] text-white text-[10px] font-semibold hover:bg-[#a44235] disabled:opacity-60"
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