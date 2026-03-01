import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Recupera preferenze
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  let preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  // Crea preferenze di default se non esistono
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json(preferences);
}

// PATCH - Aggiorna preferenze
export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json();

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: body,
    create: {
      userId: session.user.id,
      ...body,
    },
  });

  return NextResponse.json(preferences);
}
