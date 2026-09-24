import {
  MONTHS,
  SHORT_MONTHS,
} from "./config";

import type { Payment } from "./types";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken")
  );
}

export function toNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

export function formatRupiah(
  value: number
) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export function getArray(
  data: any
): any[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(data?.data)
  ) {
    return data.data;
  }

  if (
    Array.isArray(data?.items)
  ) {
    return data.items;
  }

  if (
    Array.isArray(data?.results)
  ) {
    return data.results;
  }

  return [];
}

export function isLunas(
  payment: Payment
) {
  const status = String(
    payment.status || ""
  )
    .trim()
    .toUpperCase();

  return (
    status === "LUNAS" ||
    status === "PAID" ||
    status === "TERBAYAR" ||
    status === "SUCCESS"
  );
}

export function getMonthIndex(
  monthValue: unknown
) {
  if (
    monthValue === undefined ||
    monthValue === null
  ) {
    return -1;
  }

  const value = String(
    monthValue
  )
    .trim()
    .toLowerCase();

  /*
   * Format:
   * 2026-09
   */

  const isoMatch =
    value.match(
      /^\d{4}-(\d{1,2})$/
    );

  if (isoMatch) {
    const month = Number(
      isoMatch[1]
    );

    if (
      month >= 1 &&
      month <= 12
    ) {
      return month - 1;
    }
  }

  /*
   * Format:
   * 1 - 12
   */

  if (/^\d+$/.test(value)) {
    const month = Number(value);

    if (
      month >= 1 &&
      month <= 12
    ) {
      return month - 1;
    }
  }

  /*
   * Full month
   */

  const fullIndex =
    MONTHS.findIndex(
      (month) =>
        month.toLowerCase() ===
        value
    );

  if (fullIndex !== -1) {
    return fullIndex;
  }

  /*
   * Short month
   */

  const shortIndex =
    SHORT_MONTHS.findIndex(
      (month) =>
        month.toLowerCase() ===
        value
    );

  return shortIndex;
}