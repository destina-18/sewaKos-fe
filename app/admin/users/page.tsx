"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AddUser from "./add-user"; 
import EditUser from "./edit-user"; 
import DeleteUser from "./delete-user"; 

/* =========================================================
   TYPE
========================================================= */

export type Tenant = {
  id: number;
  userId: number;
  nik: string;
  phone: string;
  gender: string;
  address: string;
  roomId: number;
  moveInDate: string;
  moveOutDate?: string | null;

  user?: {
    id: number;
    name: string;
    email: string;
  };

  room?: {
    id: number;
    roomNumber: string;
    floor: number;
    type: string;
    price: number;
    description: string;
    status: string;
  };
};

export type Room = {
  id: number;
  roomNumber: string;
  floor: number;
  type: string;
  price: number;
  description: string;
  status: string;
};

export type TenantForm = {
  name: string;
  email: string;
  password: string;
  nik: string;
  phone: string;
  gender: string;
  address: string;
  roomId: string;
  moveInDate: string;
};

export const emptyForm: TenantForm = {
  name: "",
  email: "",
  password: "",
  nik: "",
  phone: "",
  gender: "",
  address: "",
  roomId: "",
  moveInDate: "",
};

/* =========================================================
   PAGE
========================================================= */

export default function PenyewaPage() {
  const [tenants, setTenants] =
    useState<Tenant[]>([]);

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingRooms, setLoadingRooms] =
    useState(true);

  const [showAdd, setShowAdd] =
    useState(false);

  const [editingTenant, setEditingTenant] =
    useState<Tenant | null>(null);

  const [deletingTenant, setDeletingTenant] =
    useState<Tenant | null>(null);

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    if (
      typeof window === "undefined"
    ) {
      return "";
    }

    const keys = [
      "token",
      "access_token",
      "accessToken",
      "authToken",
      "jwt",
      "NEXT_PUBLIC_TOKEN",
    ];

    for (const key of keys) {
      const value =
        localStorage.getItem(key);

      if (value) {
        console.log(
          `Token ditemukan: localStorage.${key}`
        );

        return value.replace(
          /^Bearer\s+/i,
          ""
        );
      }
    }

    const cookies =
      document.cookie.split(";");

    for (const cookie of cookies) {
      const [key, ...rest] =
        cookie.trim().split("=");

      if (
        [
          "token",
          "access_token",
          "accessToken",
          "authToken",
          "jwt",
        ].includes(key)
      ) {
        const value =
          decodeURIComponent(
            rest.join("=")
          );

        if (value) {
          console.log(
            `Token ditemukan: cookie.${key}`
          );

          return value.replace(
            /^Bearer\s+/i,
            ""
          );
        }
      }
    }

    console.warn(
      "TOKEN TIDAK DITEMUKAN"
    );

    return "";
  };

  /* =========================================================
     HEADER
  ========================================================= */

  const getHeaders = () => {
    const token = getToken();

    const headers: HeadersInit = {
      "Content-Type":
        "application/json",
    };

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    return headers;
  };

  /* =========================================================
     GET TENANTS
  ========================================================= */

  const getTenants = useCallback(
    async () => {
      try {
        setLoading(true);

        const token = getToken();

        console.log(
          "================================="
        );
        console.log(
          "GET TENANTS"
        );
        console.log(
          "Token tersedia:",
          Boolean(token)
        );
        console.log(
          "================================="
        );

        const response =
          await fetch(
            "/api/tenants",
            {
              method: "GET",
              headers: getHeaders(),
              cache: "no-store",
            }
          );

        const result =
          await response
            .json()
            .catch(() => null);

        console.log(
          "GET TENANTS STATUS:",
          response.status
        );

        console.log(
          "GET TENANTS RESPONSE:",
          result
        );

        if (!response.ok) {
          if (
            response.status === 401
          ) {
            throw new Error(
              "Unauthorized (401). Token login admin tidak ditemukan atau sudah tidak valid."
            );
          }

          if (
            response.status === 403
          ) {
            throw new Error(
              "Forbidden (403). Akun kamu tidak memiliki akses Admin."
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
                  `Gagal mengambil data penyewa (${response.status})`
          );
        }

        let rawData: any[] = [];

        if (
          Array.isArray(result)
        ) {
          rawData = result;
        } else if (
          Array.isArray(
            result?.data
          )
        ) {
          rawData = result.data;
        } else if (
          Array.isArray(
            result?.tenants
          )
        ) {
          rawData =
            result.tenants;
        }

        const data: Tenant[] =
          rawData.map(
            (tenant) => ({
              id: Number(
                tenant.id
              ),

              userId: Number(
                tenant.userId
              ),

              nik:
                tenant.nik ||
                "",

              phone:
                tenant.phone ||
                "",

              gender:
                tenant.gender ||
                "",

              address:
                tenant.address ||
                "",

              roomId: Number(
                tenant.roomId
              ),

              moveInDate:
                tenant.moveInDate ||
                "",

              moveOutDate:
                tenant.moveOutDate ||
                null,

              user: tenant.user
                ? {
                    id: Number(
                      tenant.user.id
                    ),

                    name:
                      tenant.user
                        .name || "",

                    email:
                      tenant.user
                        .email || "",
                  }
                : undefined,

              room: tenant.room
                ? {
                    id: Number(
                      tenant.room.id
                    ),

                    roomNumber:
                      tenant.room
                        .roomNumber ||
                      tenant.room
                        .room_number ||
                      "",

                    floor: Number(
                      tenant.room
                        .floor || 0
                    ),

                    type:
                      tenant.room
                        .type || "",

                    price: Number(
                      tenant.room
                        .price || 0
                    ),

                    description:
                      tenant.room
                        .description ||
                      "",

                    status: String(
                      tenant.room
                        .status || ""
                    ),
                  }
                : undefined,
            })
          );

        setTenants(data);

      } catch (error) {
        console.error(
          "GET TENANTS ERROR:",
          error
        );

        setTenants([]);

        /*
          Error ditampilkan di page.
        */
        console.log(error);

      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =========================================================
     GET ROOMS
  ========================================================= */

  const getRooms = useCallback(
    async () => {
      try {
        setLoadingRooms(true);

        const response =
          await fetch(
            "/api/rooms",
            {
              method: "GET",
              headers: getHeaders(),
              cache: "no-store",
            }
          );

        const result =
          await response
            .json()
            .catch(() => null);

        console.log(
          "GET ROOMS STATUS:",
          response.status
        );

        console.log(
          "GET ROOMS RESPONSE:",
          result
        );

        if (!response.ok) {
          if (
            response.status === 401
          ) {
            throw new Error(
              "Unauthorized (401). Token login admin tidak ditemukan atau sudah tidak valid."
            );
          }

          if (
            response.status === 403
          ) {
            throw new Error(
              "Forbidden (403). Akun kamu tidak memiliki akses Admin."
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
                  `Gagal mengambil data kamar (${response.status})`
          );
        }

        let rawData: any[] = [];

        if (
          Array.isArray(result)
        ) {
          rawData = result;
        } else if (
          Array.isArray(
            result?.data
          )
        ) {
          rawData = result.data;
        } else if (
          Array.isArray(
            result?.rooms
          )
        ) {
          rawData =
            result.rooms;
        }

        const data: Room[] =
          rawData
            .map((room) => ({
              id: Number(
                room.id
              ),

              roomNumber:
                room.roomNumber ||
                room.room_number ||
                "",

              floor: Number(
                room.floor || 0
              ),

              type:
                room.type || "",

              price: Number(
                room.price || 0
              ),

              description:
                room.description ||
                "",

              status: String(
                room.status || ""
              ),
            }))
            .filter(
              (room) =>
                Number.isFinite(
                  room.id
                ) &&
                room.id > 0
            );

        setRooms(data);

      } catch (error) {
        console.error(
          "GET ROOMS ERROR:",
          error
        );

        setRooms([]);

      } finally {
        setLoadingRooms(false);
      }
    },
    []
  );

  /* =========================================================
     LOAD AWAL
  ========================================================= */

  useEffect(() => {
    getTenants();
    getRooms();
  }, [
    getTenants,
    getRooms,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredTenants =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim();

      if (!keyword) {
        return tenants;
      }

      return tenants.filter(
        (tenant) =>
          tenant.user?.name
            ?.toLowerCase()
            .includes(keyword) ||

          tenant.user?.email
            ?.toLowerCase()
            .includes(keyword) ||

          tenant.phone
            ?.toLowerCase()
            .includes(keyword) ||

          tenant.nik
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [
      tenants,
      search,
    ]);

  /* =========================================================
     AVAILABLE ROOMS
  ========================================================= */

  const availableRooms =
    useMemo(() => {
      return rooms.filter(
        (room) => {
          const status =
            String(
              room.status || ""
            )
              .toUpperCase()
              .trim();

          /*
            TAMBAH:
            hanya kamar KOSONG.
          */

          if (!editingTenant) {
            return (
              status === "KOSONG"
            );
          }

          /*
            EDIT:
            kamar yang sedang
            dipakai tenant tersebut
            tetap ditampilkan.
          */

          if (
            editingTenant &&
            editingTenant.roomId ===
              room.id
          ) {
            return true;
          }

          /*
            Kamar lain harus kosong.
          */

          return (
            status === "KOSONG"
          );
        }
      );
    }, [
      rooms,
      editingTenant,
    ]);

  /* =========================================================
     TAMBAH
  ========================================================= */

  function handleTambah() {
    setSuccess("");
    setShowAdd(true);
  }

  /* =========================================================
     EDIT
  ========================================================= */

  function handleEdit(
    tenant: Tenant
  ) {
    setSuccess("");
    setEditingTenant(tenant);
  }

  /* =========================================================
     SUCCESS
  ========================================================= */

  async function handleSuccess(
    message: string
  ) {
    setSuccess(message);

    await getTenants();
    await getRooms();
  }

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  function formatDate(
    date?: string
  ) {
    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f6f3ec]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="h-[74px] bg-white border-b border-[#eeeae1] flex items-center justify-between px-8">

        <p className="text-[14px] text-[#77736c]">
          Penyewa
        </p>

        <div className="flex items-center gap-3">

          <span className="text-[14px] font-semibold text-[#171717]">
            Admin
          </span>

          <div className="w-8 h-8 rounded-full bg-[#682020] text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>

          <button
            type="button"
            className="h-8 px-2.5 rounded-md border border-[#ddd8ce] bg-white text-[13px] font-medium text-[#171717] hover:bg-[#f7f5f0]"
          >
            Keluar
          </button>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="px-8 py-10">

        <div className="max-w-[1000px] mx-auto">

          {/* TITLE */}

          <div className="mb-5">

            <h1 className="font-serif text-[22px] font-bold text-[#172642]">
              Kelola Penyewa
            </h1>

            <p className="mt-1 text-[12px] text-[#8a857d]">
              Data seluruh penyewa yang
              terdaftar di kos Anda.
            </p>

          </div>

          {/* SUCCESS */}

          {success && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-[11px] text-green-700">
              {success}
            </div>
          )}

          {/* SEARCH + ADD */}

          <div className="flex items-center justify-between mb-5">

            <input
              type="text"
              placeholder="Cari nama penyewa..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-[205px] h-[27px] px-3 rounded-md border border-[#d8d5ce] bg-white text-[11px] text-[#333] outline-none placeholder:text-[#c7c5c1] focus:border-[#b9852f]"
            />

            <button
              type="button"
              onClick={
                handleTambah
              }
              className="h-[27px] px-3 rounded-md bg-[#bc8430] text-white text-[10px] font-semibold hover:bg-[#a97326] transition"
            >
              + Tambah Penyewa
            </button>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="bg-white border border-[#d8d5ce] rounded-lg overflow-hidden">

            <div className="px-9 py-4">

              {loading ? (

                <div className="py-12 text-center">

                  <p className="text-[12px] text-[#8a857d]">
                    Memuat data penyewa...
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full border-collapse min-w-[800px]">

                    <thead>

                      <tr className="border-b border-[#ddd9d1]">

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65] w-[20%]">
                          NAMA
                        </th>

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65] w-[10%]">
                          KAMAR
                        </th>

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65] w-[18%]">
                          NO. HP
                        </th>

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65] w-[17%]">
                          TGL MASUK
                        </th>

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65] w-[12%]">
                          STATUS
                        </th>

                        <th className="text-left pb-2 text-[8px] font-semibold tracking-wide text-[#6f6b65]">
                          AKSI
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredTenants.length >
                      0 ? (

                        filteredTenants.map(
                          (tenant) => (

                            <tr
                              key={
                                tenant.id
                              }
                              className="border-b border-[#e4e1db] last:border-b-0"
                            >

                              <td className="py-3 text-[10px] text-[#393733]">
                                {
                                  tenant
                                    .user
                                    ?.name ||
                                  "-"
                                }
                              </td>

                              <td className="py-3 text-[10px] font-mono text-[#393733]">
                                {
                                  tenant
                                    .room
                                    ?.roomNumber ||
                                  tenant.roomId ||
                                  "-"
                                }
                              </td>

                              <td className="py-3 text-[10px] text-[#393733]">
                                {
                                  tenant.phone
                                }
                              </td>

                              <td className="py-3 text-[10px] text-[#393733]">
                                {formatDate(
                                  tenant.moveInDate
                                )}
                              </td>

                              <td className="py-3">

                                <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[8px] font-medium bg-[#e5f1e9] text-[#4e7b60]">
                                  {
                                    tenant
                                      .room
                                      ?.status ||
                                    "Aktif"
                                  }
                                </span>

                              </td>

                              <td className="py-3">

                                <div className="flex items-center gap-3">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        tenant
                                      )
                                    }
                                    className="text-[9px] font-medium text-[#a66e1e] hover:text-[#7e5012]"
                                  >
                                    Ubah
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeletingTenant(
                                        tenant
                                      )
                                    }
                                    className="text-[9px] font-medium text-[#a66e1e] hover:text-red-600"
                                  >
                                    Hapus
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan={6}
                            className="py-10 text-center text-[11px] text-[#99958e]"
                          >
                            {search
                              ? "Penyewa tidak ditemukan."
                              : "Belum ada data penyewa."}
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>

        </div>

      </main>

      {/* =================================================
          TAMBAH USER
      ================================================= */}

      {showAdd && (
        <AddUser
          rooms={
            availableRooms
          }
          loadingRooms={
            loadingRooms
          }
          onClose={() =>
            setShowAdd(false)
          }
          onSuccess={() =>
            handleSuccess(
              "Penyewa berhasil ditambahkan."
            )
          }
        />
      )}

      {/* =================================================
          EDIT USER
      ================================================= */}

      {editingTenant && (
        <EditUser
          tenant={
            editingTenant
          }
          rooms={
            availableRooms
          }
          loadingRooms={
            loadingRooms
          }
          onClose={() =>
            setEditingTenant(
              null
            )
          }
          onSuccess={() =>
            handleSuccess(
              "Data penyewa berhasil diubah."
            )
          }
        />
      )}

      {/* =================================================
          DELETE USER
      ================================================= */}

      {deletingTenant && (
        <DeleteUser
          tenant={
            deletingTenant
          }
          onClose={() =>
            setDeletingTenant(
              null
            )
          }
          onSuccess={() =>
            handleSuccess(
              "Penyewa berhasil dihapus."
            )
          }
        />
      )}

    </div>
  );
}