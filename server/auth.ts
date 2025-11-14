import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export async function seedAdminUser() {
  try {
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.username, "admin"),
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        fullName: "Administrator",
        role: "admin",
      });
      console.log("✓ Admin user created");
    } else {
      console.log("✓ Admin user already exists");
    }
  } catch (error: any) {
    // If database is not configured, use fallback authentication
    if (error.message && error.message.includes('password authentication')) {
      console.log("⚠️  Database not configured - using fallback authentication");
      console.log("⚠️  Login with: admin / admin");
    } else {
      console.error("Failed to seed admin user:", error.message);
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
