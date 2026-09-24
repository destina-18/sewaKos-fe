import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  "https://saturate-decency-dawdler.ngrok-free.dev";

export async function GET(request: NextRequest) {
  try {
    const authorization =
      request.headers.get("authorization");

    console.log("=================================");
    console.log("ROOM PROXY");
    console.log("METHOD : GET");
    console.log(
      "URL    : " + `${BACKEND_URL}/rooms`
    );
    console.log("=================================");
    console.log(
      "Authorization :",
      authorization ? "ADA" : "TIDAK ADA"
    );

    const response = await fetch(
      `${BACKEND_URL}/rooms`,
      {
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
      }
    );

    const result = await response
      .json()
      .catch(() => null);

    console.log(
      "Backend Status:",
      response.status
    );

    console.log(
      "Backend Response:",
      JSON.stringify(result)
    );

    return NextResponse.json(
      result,
      {
        status: response.status,
      }
    );
  } catch (error) {
    console.error(
      "ROOM PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Gagal menghubungkan ke backend kamar",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}