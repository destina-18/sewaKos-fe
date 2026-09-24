import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal terhubung ke backend",
      },
      {
        status: 500,
      }
    );
  }
}