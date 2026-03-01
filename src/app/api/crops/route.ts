import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Recupera impostazioni colture
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const crops = await prisma.cropSetting.findMany({
    where: { userId: session.user.id },
    orderBy: { cropName: "asc" },
  });

  return NextResponse.json(crops);
}

// POST - Aggiungi/Aggiorna coltura
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json();
  const { cropName, baseTemp, seasonStartDate, targetGDD } = body;

  if (!cropName || baseTemp === undefined || !seasonStartDate || !targetGDD) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

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

  await prisma.cropSetting.deleteMany({
    where: {
      userId: session.user.id,
      cropName,
    },
  });

  return NextResponse.json({ success: true });
}
