export interface Payment {
  id: number;
  tenantId: number;
  month: string;
  amount: string | number;
  method: string;
  paymentDate: string;
  status: "LUNAS" | "BELUM_BAYAR";
  proofUrl: string | null;
  createdAt: string;
  updatedAt: string;

  tenant?: {
    id: number;
    userId: number;
    nik: string;
    phone: string;
    gender: string;
    address: string;
    roomId: number;
    moveInDate: string;
    moveOutDate: string | null;

    user?: {
      id: number;
      name: string;
      email: string;
    };

    room?: {
      id: number;
      roomNumber: string;
    };
  };
}

export interface Tenant {
  id: number;

  user?: {
    id: number;
    name: string;
    email: string;
  };

  room?: {
    id: number;
    roomNumber: string;
  };
}

export type FilterType = "SEMUA" | "LUNAS" | "BELUM_BAYAR";

export interface PaymentForm {
  tenantId: string;
  month: string;
  amount: string;
  method: string;
  status: "LUNAS" | "BELUM_BAYAR";
  paymentDate: string;
}