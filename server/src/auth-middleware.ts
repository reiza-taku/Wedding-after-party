import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  sub: number;
  type: "guest" | "admin";
  name?: string;
  username?: string;
  role?: string;
}

// Expressの型にauthプロパティを追加する宣言のマージ
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

// 環境変数が設定されているかを確認する関数
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} が設定されていません。.env を確認してください。`);
  }

  return value;
}
const JWT_SECRET = getRequiredEnv("JWT_SECRET");

// JWTの中身が想定どおりかを確認する関数
function isAuthPayload(payload: unknown): payload is AuthPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const data = payload as Record<string, unknown>;

  return (
    typeof data.sub === "number" &&
    (data.type === "guest" || data.type === "admin")
  );
}

// JWTトークンの検証と認証情報の付与を行うミドルウェア
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }

  // "Bearer " の7文字を除去
  const token = header.slice(7); 
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!isAuthPayload(payload)) {
      return res.status(401).json({ error: "invalid token payload" });
    }

    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}