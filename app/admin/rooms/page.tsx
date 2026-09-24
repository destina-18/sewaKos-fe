"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AddRoom from "./add-room";
import EditRoom from "./edit-room";
import DeleteRoom from "./delete-room";

type Room = {
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

const API_URL = "/api/backend/rooms";

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

function isRoomOccupied(room: Room) {
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

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getArray(data: any): Room[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

/* =========================================================
   PAGE
========================================================= */

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "occupied" | "empty"
  >("all");

  /* =========================================================
     MODAL
  ========================================================= */

  const [showAdd, setShowAdd] = useState(false);

  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null);

  const [deleteRoom, setDeleteRoom] =
    useState<Room | null>(null);

  /* =========================================================
     FETCH ROOMS
  ========================================================= */

  const fetchRooms = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const response = await fetch(
          API_URL,
          {
            method: "GET",

            headers: {
              Accept: "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            cache: "no-store",
          }
        );

        if (!response.ok) {
          const text =
            await response.text();

          throw new Error(
            `Gagal mengambil kamar (${response.status})${
              text ? `: ${text}` : ""
            }`
          );
        }

        const data =
          await response.json();

        const fetchedRooms =
          getArray(data);

        /*
          Backend menjadi sumber utama
          untuk status kamar.
        */
        setRooms(fetchedRooms);
      } catch (err: any) {
        console.error(
          "Rooms error:",
          err
        );

        setError(
          err?.message ||
            "Gagal mengambil data kamar."
        );

        setRooms([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =========================================================
     INITIAL FETCH + SYNC
  ========================================================= */

  useEffect(() => {
    fetchRooms();

    /*
      Saat kembali dari halaman Penyewa,
      ambil status kamar terbaru.
    */
    const handleFocus = () => {
      fetchRooms();
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        fetchRooms();
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchRooms]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomNumber =
        getRoomNumber(room).toLowerCase();

      const matchSearch =
        roomNumber.includes(
          search.toLowerCase()
        );

      const occupied =
        isRoomOccupied(room);

      const matchFilter =
        filter === "all" ||
        (filter === "occupied" &&
          occupied) ||
        (filter === "empty" &&
          !occupied);

      return (
        matchSearch &&
        matchFilter
      );
    });
  }, [
    rooms,
    search,
    filter,
  ]);

  /* =========================================================
     SUCCESS HANDLER
  ========================================================= */

  function handleSuccess(
    message: string
  ) {
    setError("");
    setSuccess(message);

    fetchRooms();
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3]">
        <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-8">

          <div className="animate-pulse">

            <div className="h-5 w-32 rounded bg-[#e5e5e5]" />

            <div className="mt-2 h-3 w-64 rounded bg-[#eeeeee]" />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[190px] rounded-[12px] bg-white"
                  />
                )
              )}

            </div>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f5f2eb]">

      <main className="w-full px-7 py-8 md:px-10 lg:px-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between gap-5">

          <div>

            <h1 className="font-serif text-[24px] font-bold text-[#1d2d49]">
              Kelola Kamar
            </h1>

            <p className="mt-1 text-[10px] text-[#777]">
              Papan kunci — klik kamar untuk
              melihat atau mengubah detail.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowAdd(true);
            }}
            className="rounded-[5px] bg-[#bd8529] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#a87320]"
          >
            + Tambah Kamar
          </button>

        </div>

        {/* =================================================
            ALERT
        ================================================= */}

        {(error || success) && (
          <div
            className={`mt-5 rounded-[7px] border px-4 py-3 text-[10px] ${
              error
                ? "border-[#efcfc7] bg-[#fff8f5] text-[#b64c3d]"
                : "border-[#cfe3d7] bg-[#f3faf6] text-[#4f806b]"
            }`}
          >
            {error || success}
          </div>
        )}

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mt-5 flex items-center gap-2">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari nomor kamar..."
            className="h-[27px] w-[205px] rounded-[6px] border border-[#d7d4ce] bg-white px-2.5 text-[9px] text-[#555] outline-none placeholder:text-[#aaa] focus:border-[#bd8529]"
          />

          <button
            type="button"
            onClick={() =>
              setFilter("all")
            }
            className={`h-[27px] rounded-full px-4 text-[9px] font-medium ${
              filter === "all"
                ? "bg-[#172a49] text-white"
                : "border border-[#d7d4ce] bg-white text-[#666]"
            }`}
          >
            Semua
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("occupied")
            }
            className={`h-[27px] rounded-full px-4 text-[9px] font-medium ${
              filter === "occupied"
                ? "bg-[#4f806b] text-white"
                : "border border-[#d7d4ce] bg-white text-[#666]"
            }`}
          >
            Terisi
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("empty")
            }
            className={`h-[27px] rounded-full px-4 text-[9px] font-medium ${
              filter === "empty"
                ? "bg-[#b64c3d] text-white"
                : "border border-[#d7d4ce] bg-white text-[#666]"
            }`}
          >
            Kosong
          </button>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mt-5 grid max-w-[720px] grid-cols-3 gap-3">

          {/* TOTAL */}

          <div className="rounded-[8px] border border-[#e1ddd5] bg-white px-4 py-3">

            <p className="text-[8px] text-[#888]">
              Total Kamar
            </p>

            <p className="mt-1 font-serif text-[18px] font-bold text-[#1d2d49]">
              {rooms.length}
            </p>

          </div>

          {/* TERISI */}

          <div className="rounded-[8px] border border-[#e1ddd5] bg-white px-4 py-3">

            <p className="text-[8px] text-[#888]">
              Terisi
            </p>

            <p className="mt-1 font-serif text-[18px] font-bold text-[#4f806b]">
              {
                rooms.filter(
                  isRoomOccupied
                ).length
              }
            </p>

          </div>

          {/* KOSONG */}

          <div className="rounded-[8px] border border-[#e1ddd5] bg-white px-4 py-3">

            <p className="text-[8px] text-[#888]">
              Kosong
            </p>

            <p className="mt-1 font-serif text-[18px] font-bold text-[#b64c3d]">
              {
                rooms.filter(
                  (room) =>
                    !isRoomOccupied(room)
                ).length
              }
            </p>

          </div>

        </div>

        {/* =================================================
            ROOM BOARD
        ================================================= */}

        <div className="mt-5">

          {filteredRooms.length === 0 ? (

            <div className="rounded-[8px] border border-[#d9d5cd] bg-white px-5 py-16 text-center">

              <p className="font-serif text-[15px] font-bold text-[#39445a]">
                Tidak ada kamar
              </p>

              <p className="mt-1 text-[9px] text-[#999]">
                Belum ada kamar yang sesuai
                dengan pencarian.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {/* =================================================
                  LANTAI
              ================================================= */}

              {[
                {
                  title: "Lantai 1",

                  rooms:
                    filteredRooms.filter(
                      (room) =>
                        Number(
                          room.floor
                        ) === 1
                    ),
                },

                {
                  title: "Lantai 2",

                  rooms:
                    filteredRooms.filter(
                      (room) =>
                        Number(
                          room.floor
                        ) === 2
                    ),
                },
              ]
                .filter(
                  (floor) =>
                    floor.rooms.length > 0
                )
                .map((floor) => (

                  <section
                    key={floor.title}
                    className="rounded-[8px] border border-[#d9d5cd] bg-white px-4 py-4 sm:px-5"
                  >

                    <h2 className="font-serif text-[12px] font-bold text-[#35435b]">
                      {floor.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-6">

                      {floor.rooms.map(
                        (room) => {

                          const occupied =
                            isRoomOccupied(
                              room
                            );

                          return (

                            <div
                              key={room.id}
                              className="relative flex w-[78px] flex-col items-center"
                            >

                              {/* =================================================
                                  GARIS / TITIK
                              ================================================= */}

                              <div className="flex h-[20px] flex-col items-center">

                                <span
                                  className={`h-[7px] w-[7px] rounded-full border ${
                                    occupied
                                      ? "border-[#6c947f] bg-white"
                                      : "border-[#c85b49] bg-white"
                                  }`}
                                />

                                <span className="h-[13px] w-px bg-[#d8d3ca]" />

                              </div>

                              {/* =================================================
                                  KAMAR
                              ================================================= */}

                              <button
                                type="button"
                                onClick={() =>
                                  setEditingRoom(
                                    room
                                  )
                                }
                                className={`flex h-[70px] w-[60px] flex-col items-center justify-center rounded-t-[6px] rounded-b-[20px] border transition hover:-translate-y-1 ${
                                  occupied
                                    ? "border-[#81a991] bg-[#eaf2ed] text-[#4f806b]"
                                    : "border-[#d46a58] bg-[#fff0eb] text-[#b64c3d]"
                                }`}
                              >

                                <span
                                  className={`h-[9px] w-[9px] rounded-full border ${
                                    occupied
                                      ? "border-[#5f8d77] bg-white"
                                      : "border-[#c45b48] bg-white"
                                  }`}
                                />

                                <span className="mt-2 text-[10px] font-bold">
                                  {getRoomNumber(
                                    room
                                  )}
                                </span>

                                <span className="mt-[1px] text-[7px] font-semibold">
                                  {occupied
                                    ? "TERISI"
                                    : "KOSONG"}
                                </span>

                                <span className="mt-[2px] max-w-[53px] truncate text-[6px] opacity-70">
                                  {formatRupiah(
                                    getRoomPrice(
                                      room
                                    )
                                  )}
                                </span>

                              </button>

                              {/* =================================================
                                  DELETE BUTTON
                              ================================================= */}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setDeleteRoom(
                                    room
                                  );

                                  setError("");
                                  setSuccess("");
                                }}
                                className="mt-2 flex h-[22px] w-[60px] items-center justify-center rounded-[5px] border border-[#e2c0ba] bg-white text-[8px] font-medium text-[#b64c3d] transition hover:bg-[#fff1ee]"
                              >
                                Hapus
                              </button>

                            </div>

                          );
                        }
                      )}

                    </div>

                    {/* =================================================
                        LEGEND
                    ================================================= */}

                    <div className="mt-5 flex items-center gap-4 border-t border-[#eeeae3] pt-3 text-[8px] text-[#777]">

                      <span className="flex items-center gap-1.5">

                        <span className="h-[7px] w-[7px] rounded-full bg-[#5f8d77]" />

                        Terisi

                      </span>

                      <span className="flex items-center gap-1.5">

                        <span className="h-[7px] w-[7px] rounded-full bg-[#b64c3d]" />

                        Kosong

                      </span>

                    </div>

                  </section>

                ))}

            </div>

          )}

        </div>

        {/* =================================================
            REFRESH
        ================================================= */}

        <div className="mt-4 flex justify-end">

          <button
            type="button"
            onClick={fetchRooms}
            disabled={loading}
            className="rounded-[5px] border border-[#d8d4cc] bg-white px-3 py-1.5 text-[8px] text-[#666] hover:bg-[#fafafa]"
          >
            ↻ Refresh
          </button>

        </div>

      </main>

      {/* =====================================================
          TAMBAH KAMAR
      ===================================================== */}

      {showAdd && (
        <AddRoom
          onClose={() =>
            setShowAdd(false)
          }
          onSuccess={() =>
            handleSuccess(
              "Kamar berhasil ditambahkan."
            )
          }
        />
      )}

      {/* =====================================================
          EDIT KAMAR
      ===================================================== */}

      {editingRoom && (
        <EditRoom
          room={editingRoom}
          onClose={() =>
            setEditingRoom(null)
          }
          onSuccess={() =>
            handleSuccess(
              "Kamar berhasil diperbarui."
            )
          }
        />
      )}

      {/* =====================================================
          HAPUS KAMAR
      ===================================================== */}

      {deleteRoom && (
        <DeleteRoom
          room={deleteRoom}
          onClose={() =>
            setDeleteRoom(null)
          }
          onSuccess={() =>
            handleSuccess(
              "Kamar berhasil dihapus."
            )
          }
        />
      )}

    </div>
  );
}