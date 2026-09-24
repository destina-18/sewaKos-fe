import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    if (!baseUrl) {
      return NextResponse.json(
        {
          message: "URL API belum dikonfigurasi.",
        },
        {
          status: 500,
        }
      );
    }

    const authorization = request.headers.get("authorization");

    const response = await fetch(`${baseUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authorization
          ? {
              Authorization: authorization,
            }
          : {}),
      },
      cache: "no-store",
    });

    const text = await response.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        {
          message: "Backend mengembalikan response yang tidak valid.",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        message: "Gagal terhubung ke backend.",
      },
      {
        status: 500,
      }
    );
  }
}