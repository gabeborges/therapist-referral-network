import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "profile-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type ImageKind = "jpeg" | "png" | "webp";

const KIND_CONTENT_TYPE: Record<ImageKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const KIND_EXT: Record<ImageKind, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

/**
 * Detects image kind from the leading bytes of the file.
 * Returns null for anything that doesn't match a supported image type.
 *
 * Magic bytes:
 *   JPEG:  FF D8 FF
 *   PNG:   89 50 4E 47 0D 0A 1A 0A
 *   WEBP:  "RIFF" .. .. .. .. "WEBP"
 */
function sniffImageKind(bytes: Uint8Array): ImageKind | null {
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  // "RIFF"....("WEBP")
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  // Magic-byte sniff on the actual file content. Client-supplied
  // `file.type` and filename extension are not trusted — a malicious
  // client can upload HTML/JS with a forged `image/png` content-type.
  const headerBytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const kind = sniffImageKind(headerBytes);

  if (kind === null) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, or WebP." },
      { status: 400 },
    );
  }

  const path = `${session.user.id}.${KIND_EXT[kind]}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET!,
  );

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    // contentType pinned from the sniffed kind — never from request.
    contentType: KIND_CONTENT_TYPE[kind],
  });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const cacheBustedUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  return NextResponse.json({ url: cacheBustedUrl });
}
