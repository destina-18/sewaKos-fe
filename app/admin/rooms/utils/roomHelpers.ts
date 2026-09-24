export type Room = {
  id: number | string;
  roomNumber?: string;
  room_number?: string;
  number?: string;
  name?: string;
  floor?: number;
  type?: string;
  facilityIds?: number[];
  status?: string;
  isOccupied?: boolean;
  occupied?: boolean;
  price?: number;
  rentPrice?: number;
  rent_price?: number;
  description?: string;
};

export type RoomStatus = "occupied" | "empty";

export function getRoomNumber(room: Room) {
  return (
    room.roomNumber ||
    room.room_number ||
    room.number ||
    room.name ||
    "-"
  );
}

export function getRoomPrice(room: Room) {
  return (
    Number(room.price) ||
    Number(room.rentPrice) ||
    Number(room.rent_price) ||
    0
  );
}

export function isRoomOccupied(room: Room) {
  const status = String(room.status || "")
    .trim()
    .toLowerCase();

  return (
    room.isOccupied === true ||
    room.occupied === true ||
    status === "occupied" ||
    status === "terisi"
  );
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}