export const formatRupiah = (value: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
};

export const formatMonth = (month: string) => {
  if (!month) return "-";

  const parts = month.split("-");

  if (parts.length !== 2) {
    return month;
  }

  const year = parts[0];
  const monthNumber = Number(parts[1]);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${months[monthNumber - 1] || month} ${year}`;
};

export const formatDate = (date: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken")
  );
};

export const parseResponse = async (response: Response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Response server tidak valid.",
    };
  }
};

export const getErrorMessage = (
  response: Response,
  result: any,
  defaultMessage: string
) => {
  if (response.status === 401) {
    return "Sesi login sudah tidak valid. Silakan login kembali.";
  }

  if (response.status === 403) {
    return (
      "Akses ditolak (403 Forbidden). " +
      "Token login kamu tidak memiliki izin sebagai admin."
    );
  }

  if (Array.isArray(result?.message)) {
    return result.message.join(", ");
  }

  return result?.message || defaultMessage;
};