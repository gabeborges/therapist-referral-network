import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "profile-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, or WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${session.user.id}.${ext}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET!,
  );

  // Upload (upsert to overwrite previous image)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const cacheBustedUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  return NextResponse.json({ url: cacheBustedUrl });
}
