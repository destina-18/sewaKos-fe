export type Payment = {
  id: number | string;

  tenantId?: number | string;

  month?: string;

  amount?: number | string;

  method?: string;

  paymentDate?: string;

  status?: string;

  proofUrl?: string | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;

  tenant?: {
    id?: number | string;

    user?: {
      id?: number | string;
      name?: string;
      email?: string;
    };

    room?: {
      id?: number | string;
      roomNumber?: string;
      room_number?: string;
      number?: string;
    };
  };
};

export type MonthlyReport = {
  month?: string;
  bulan?: string;

  year?: number | string;
  tahun?: number | string;

  revenue?: number | string;
  income?: number | string;
  amount?: number | string;
  total?: number | string;
  pendapatan?: number | string;

  occupancy?: number | string;
  occupancyRate?: number | string;
  averageOccupancy?: number | string;
  rataRataOkupansi?: number | string;
};

export type ChartItem = {
  month: string;
  revenue: number;
};