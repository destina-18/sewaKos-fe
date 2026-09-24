import { API_BASE } from "./config";
import { getToken } from "./helper"; 

export async function fetchAPI(
  endpoint: string
) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Token login tidak ditemukan. Silakan login kembali."
    );
  }

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      method: "GET",

      headers: {
        Accept:
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let result: any = null;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    result =
      await response
        .json()
        .catch(() => null);
  } else {
    const text =
      await response
        .text()
        .catch(() => "");

    result = {
      message: text,
    };
  }

  if (!response.ok) {
    let message =
      result?.message ||
      result?.error ||
      `Request gagal (${response.status})`;

    if (
      Array.isArray(message)
    ) {
      message =
        message.join(", ");
    }

    if (
      response.status === 401
    ) {
      message =
        "Sesi login sudah tidak valid. Silakan login kembali.";
    }

    if (
      response.status === 403
    ) {
      message =
        "Akses ditolak (403 Forbidden). Akun tidak memiliki izin untuk melihat laporan.";
    }

    throw new Error(message);
  }

  return result;
}