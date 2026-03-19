import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AdminAccess {
  userId: string | null;
  isAdmin: boolean;
}

export async function getAdminAccess(): Promise<AdminAccess> {
  const { userId } = await auth();
  const adminUserId = process.env.ADMIN_USER_ID;

  return {
    userId,
    isAdmin: Boolean(userId && adminUserId && userId === adminUserId),
  };
}

export async function requireAdminApiUser() {
  const { userId, isAdmin } = await getAdminAccess();

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  if (!isAdmin) {
    return {
      error: NextResponse.json({ error: "You are not authorised to access this resource." }, { status: 403 }),
    };
  }

  return { userId };
}
