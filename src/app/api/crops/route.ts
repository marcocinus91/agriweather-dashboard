import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cropSettingSchema } from "@/lib/validations";

// GET - Recupera impostazioni colture
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  try {
    const crops = await prisma.cropSetting.findMany({
      where: { userId: session.user.id },
      orderBy: { cropName: "asc" },
    });

    return NextResponse.json(crops);
  } catch (error) {
    console.error("Crops GET error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero colture" },
      { status: 500 },
    );
  }
}

// POST - Aggiungi/Aggiorna coltura
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  // Validazione
  const validation = cropSettingSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 },
    );
  }

  const { cropName, baseTemp, seasonStartDate, targetGDD } = validation.data;

  try {
    const crop = await prisma.cropSetting.upsert({
      where: {
        userId_cropName: {
          userId: session.user.id,
          cropName,
        },
      },
      update: {
        baseTemp,
        seasonStartDate,
        targetGDD,
      },
      create: {
        userId: session.user.id,
        cropName,
        baseTemp,
        seasonStartDate,
        targetGDD,
      },
    });

    return NextResponse.json(crop);
  } catch (error) {
    console.error("Crops POST error:", error);
    return NextResponse.json(
      { error: "Errore nel salvataggio" },
      { status: 500 },
    );
  }
}

// DELETE - Rimuovi coltura
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cropName = searchParams.get("name");

  if (!cropName) {
    return NextResponse.json(
      { error: "Nome coltura richiesto" },
      { status: 400 },
    );
  }

  try {
    await prisma.cropSetting.deleteMany({
      where: {
        userId: session.user.id,
        cropName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Crops DELETE error:", error);
    return NextResponse.json(
      { error: "Errore nella rimozione" },
      { status: 500 },
    );
  }
}
