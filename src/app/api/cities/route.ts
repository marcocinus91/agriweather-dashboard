import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Recupera città salvate
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const cities = await prisma.savedCity.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cities);
}

// POST - Aggiungi città
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json();
  const { name, latitude, longitude, country } = body;

  if (!name || latitude === undefined || longitude === undefined) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  // Controlla limite (max 5 città)
  const count = await prisma.savedCity.count({
    where: { userId: session.user.id },
  });

  if (count >= 5) {
    return NextResponse.json(
      { error: "Limite massimo di 5 città raggiunto" },
      { status: 400 },
    );
  }

  try {
    const city = await prisma.savedCity.create({
      data: {
        userId: session.user.id,
        name,
        latitude,
        longitude,
        country,
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    // Città già salvata (unique constraint)
    return NextResponse.json({ error: "Città già salvata" }, { status: 409 });
  }
}

// DELETE - Rimuovi città
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("id");

  if (!cityId) {
    return NextResponse.json({ error: "ID città richiesto" }, { status: 400 });
  }

  await prisma.savedCity.deleteMany({
    where: {
      id: cityId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
