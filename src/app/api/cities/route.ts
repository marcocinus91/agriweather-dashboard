import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { citySchema } from "@/lib/validations";

// GET - Recupera città salvate
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  try {
    const cities = await prisma.savedCity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Cities GET error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero città" },
      { status: 500 },
    );
  }
}

// POST - Aggiungi città
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
  const validation = citySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, latitude, longitude, country } = validation.data;

  try {
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
  } catch (error: unknown) {
    // Città già salvata (unique constraint)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Città già salvata" }, { status: 409 });
    }
    console.error("Cities POST error:", error);
    return NextResponse.json(
      { error: "Errore nel salvataggio" },
      { status: 500 },
    );
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

  try {
    await prisma.savedCity.deleteMany({
      where: {
        id: cityId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cities DELETE error:", error);
    return NextResponse.json(
      { error: "Errore nella rimozione" },
      { status: 500 },
    );
  }
}
