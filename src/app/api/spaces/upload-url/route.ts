import { NextResponse } from "next/server";
import { getUploadUrl } from "@/lib/spaces";

export async function POST(req: Request) {
  try {
    const { key, contentType, expiresIn } = await req.json();
    if (!key || !contentType) {
      return NextResponse.json({ error: "key y contentType requeridos" }, { status: 400 });
    }
    const url = await getUploadUrl(key, contentType, typeof expiresIn === "number" ? expiresIn : 60);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "Error generando URL de subida" }, { status: 500 });
  }
}


