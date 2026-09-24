import { Payment, Tenant } from "./types";
import {
  getErrorMessage,
  getToken,
  parseResponse,
} from "./utils";

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const requireToken = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Token login tidak ditemukan. Silakan login kembali."
    );
  }

  return token;
};

// GET PAYMENTS
export const fetchPaymentsApi = async (): Promise<Payment[]> => {
  const token = requireToken();

  const response = await fetch("/api/backend/payments", {
    method: "GET",
    headers: getHeaders(token),
    cache: "no-store",
  });

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        response,
        result,
        `Gagal mengambil pembayaran (${response.status})`
      )
    );
  }

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
};

// GET TENANTS
export const fetchTenantsApi = async (): Promise<Tenant[]> => {
  const token = requireToken();

  const response = await fetch("/api/backend/tenants", {
    method: "GET",
    headers: getHeaders(token),
    cache: "no-store",
  });

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        response,
        result,
        `Gagal mengambil penyewa (${response.status})`
      )
    );
  }

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
};

// CREATE PAYMENT
export const createPaymentApi = async (payload: {
  tenantId: number;
  month: string;
  amount: number;
  method: string;
  status: "LUNAS" | "BELUM_BAYAR";
  paymentDate: string;
}) => {
  const token = requireToken();

  const response = await fetch("/api/backend/payments", {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        response,
        result,
        `Gagal menambahkan pembayaran (${response.status})`
      )
    );
  }

  return result;
};

// CONFIRM PAYMENT
export const confirmPaymentApi = async (
  paymentId: number
) => {
  const token = requireToken();

  const response = await fetch(
    `/api/backend/payments/${paymentId}/confirm`,
    {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({
        paymentDate: new Date().toISOString(),
      }),
    }
  );

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        response,
        result,
        `Gagal mengonfirmasi pembayaran (${response.status})`
      )
    );
  }

  return result;
};

// DETAIL PAYMENT
export const fetchPaymentDetailApi = async (
  paymentId: number
): Promise<Payment> => {
  const token = requireToken();

  const response = await fetch(
    `/api/backend/payments/${paymentId}`,
    {
      method: "GET",
      headers: getHeaders(token),
      cache: "no-store",
    }
  );

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        response,
        result,
        "Gagal mengambil detail pembayaran."
      )
    );
  }

  return result?.data || result;
};