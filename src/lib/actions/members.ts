"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/client";
import crypto from "crypto";

export async function getMembers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return [];
  }

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          borrowings: { where: { status: "BORROWED" } },
        },
      },
    },
  });
}

export async function createInvitation(email: string, role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.invitation.create({
      data: {
        email,
        role,
        token,
        createdBy: session.user.id,
        expiresAt,
      },
    });

    return { success: true, token };
  } catch {
    return { error: "Failed to create invitation" };
  }
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  if (userId === session.user.id) {
    return { error: "You cannot change your own role" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/members");
    return { success: true };
  } catch {
    return { error: "Failed to update user role" };
  }
}

export async function getInvitations() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return [];
  }

  return prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
  });
}
