"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { signIn } from "@/lib/auth";
import { Role } from "@/generated/prisma/client";

export async function register(formData: {
  name: string;
  email: string;
  password: string;
  token?: string;
}) {
  try {
    const validated = registerSchema.parse(formData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    const userCount = await prisma.user.count();
    let role: Role = "MEMBER";

    // First user becomes ADMIN
    if (userCount === 0) {
      role = "ADMIN";
    }

    // Check invitation token
    if (validated.token) {
      const invitation = await prisma.invitation.findUnique({
        where: { token: validated.token },
      });

      if (!invitation) {
        return { error: "Invalid invitation token" };
      }

      if (invitation.used) {
        return { error: "This invitation has already been used" };
      }

      if (invitation.expiresAt < new Date()) {
        return { error: "This invitation has expired" };
      }

      role = invitation.role;

      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { used: true },
      });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "Invalid email or password" };
  }
}
