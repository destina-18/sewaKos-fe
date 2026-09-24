import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "https://saturate-decency-dawdler.ngrok-free.dev";

function getBackendUrl(path: string[]) {
  const baseUrl = BACKEND_URL.replace(/\/$/, "");

  const tenantPath =
    path.length > 0
      ? `/tenants/${path.join("/")}`
      : "/tenants";

  return `${baseUrl}${tenantPath}`;
}

async function proxyRequest(
  request: NextRequest,
  path: string[]
) {
  const targetUrl = getBackendUrl(path);

  try {
    console.log("");
    console.log("=================================");
    console.log("TENANT PROXY");
    console.log("METHOD :", request.method);
    console.log("PATH   :", path);
    console.log("URL    :", targetUrl);
    console.log("=================================");

    const headers = new Headers();

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    // Supaya ngrok tidak mengembalikan halaman warning
    headers.set(
      "ngrok-skip-browser-warning",
      "true"
    );

    // Teruskan Authorization dari frontend
    const authorization =
      request.headers.get("authorization");

    if (authorization) {
      headers.set(
        "Authorization",
        authorization
      );

      console.log("Authorization : ADA");
    } else {
      console.log("Authorization : TIDAK ADA");
    }

    let body: string | undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      body = await request.text();

      if (body) {
        console.log("Request Body:", body);
      }
    }

    console.log(
      "Mengirim request ke backend..."
    );

    const response = await fetch(
      targetUrl,
      {
        method: request.method,
        headers,
        ...(body
          ? {
              body,
            }
          : {}),
        cache: "no-store",
        redirect: "follow",
      }
    );

    const responseText =
      await response.text();

    console.log(
      "Backend Status:",
      response.status
    );

    console.log(
      "Backend Response:",
      responseText
    );

    console.log(
      "================================="
    );

    // Response kosong
    if (!responseText) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    // Response JSON
    try {
      const json =
        JSON.parse(responseText);

      return NextResponse.json(
        json,
        {
          status: response.status,
        }
      );
    } catch {
      return new NextResponse(
        responseText,
        {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get(
                "content-type"
              ) ||
              "text/plain",
          },
        }
      );
    }
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "TENANT PROXY ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return NextResponse.json(
      {
        message:
          "Tidak dapat terhubung ke backend.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 502,
      }
    );
  }
}

// =====================================================
// GET
// =====================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path?: string[];
    }>;
  }
) {
  const params =
    await context.params;

  return proxyRequest(
    request,
    params.path || []
  );
}

// =====================================================
// POST
// =====================================================

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path?: string[];
    }>;
  }
) {
  const params =
    await context.params;

  return proxyRequest(
    request,
    params.path || []
  );
}

// =====================================================
// PATCH
// =====================================================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path?: string[];
    }>;
  }
) {
  const params =
    await context.params;

  return proxyRequest(
    request,
    params.path || []
  );
}

// =====================================================
// PUT
// =====================================================

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      path?: string[];
    }>;
  }
) {
  const params =
    await context.params;

  return proxyRequest(
    request,
    params.path || []
  );
}

// =====================================================
// DELETE
// =====================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path?: string[];
    }>;
  }
) {
  const params =
    await context.params;

  const path = params.path || [];

  console.log("");
  console.log("=================================");
  console.log("DELETE TENANT");
  console.log("Tenant ID :", path[path.length - 1]);
  console.log("=================================");

  return proxyRequest(
    request,
    path
  );
}