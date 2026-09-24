import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL;

async function handler(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        message:
          "NEXT_PUBLIC_BASE_API_URL belum tersedia.",
      },
      {
        status: 500,
      }
    );
  }

  const { path } = await context.params;

  const baseUrl =
    BACKEND_URL.replace(/\/+$/, "");

  const endpoint = path
    .map((item) => encodeURIComponent(item))
    .join("/");

  const url =
    `${baseUrl}/${endpoint}` +
    request.nextUrl.search;

  try {
    const headers = new Headers();

    headers.set(
      "Accept",
      "application/json"
    );

    /* =====================================================
       CONTENT TYPE
    ===================================================== */

    const contentType =
      request.headers.get("content-type");

    if (contentType) {
      headers.set(
        "Content-Type",
        contentType
      );
    }

    /* =====================================================
       AUTHORIZATION
    ===================================================== */

    const authorization =
      request.headers.get("authorization");

    if (authorization) {
      headers.set(
        "Authorization",
        authorization
      );
    }

    /* =====================================================
       REQUEST BODY
    ===================================================== */

    let body: BodyInit | undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      /*
       * Untuk JSON, kita baca body terlebih dahulu.
       */
      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        const text =
          await request.text();

        try {
          const data = JSON.parse(text);

          /*
           * KHUSUS ENDPOINT ROOMS
           *
           * Backend kamu menolak:
           * "property status should not exist"
           *
           * Jadi status dibuang sebelum request
           * diteruskan ke backend.
           */
          if (
            path[0] === "rooms" &&
            data &&
            typeof data === "object" &&
            !Array.isArray(data)
          ) {
            delete data.status;
          }

          body = JSON.stringify(data);
        } catch {
          /*
           * Kalau body bukan JSON valid,
           * kirim apa adanya.
           */
          body = text;
        }
      } else {
        /*
         * Untuk request selain JSON,
         * teruskan body apa adanya.
         */
        body = await request.arrayBuffer();
      }
    }

    /* =====================================================
       SEND TO BACKEND
    ===================================================== */

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    const responseBody =
      await response.arrayBuffer();

    const responseHeaders =
      new Headers();

    const responseContentType =
      response.headers.get(
        "content-type"
      );

    if (responseContentType) {
      responseHeaders.set(
        "Content-Type",
        responseContentType
      );
    }

    return new NextResponse(
      responseBody,
      {
        status: response.status,
        statusText:
          response.statusText,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error(
      "Backend proxy error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Backend tidak dapat dihubungi.",
      },
      {
        status: 502,
      }
    );
  }
}

/* =========================================================
   GET
========================================================= */

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

/* =========================================================
   PATCH
========================================================= */

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}