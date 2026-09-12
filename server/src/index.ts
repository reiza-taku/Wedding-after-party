import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { db } from "./db";
import { createUser, verifyPassword } from "./auth";
import { requireAuth } from "./auth-middleware";

//Expressアプリの作成（webサーバの設定を集める）
const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET が設定されていません。.env を確認してください。");
}


/*------------------------------------------
    共通のミドルウェアの設定
------------------------------------------*/

//リクエストがルート処理に到達する前に、リクエストのボディをJSONとして解析する
app.use(cors());
//HTTPリクエストのボディをJSONとして解析するミドルウェアを追加
app.use(express.json());

//GET /health エンドポイントの定義
//app.get("URLのパス", "リクエストを処理する関数");
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

//テスト用のユーザーを作成するエンドポイント
app.get("/test-user", async (_req, res) => {
  await createUser("staff1", "password123", "staff");
  res.json({ message: "created" });
});

/*------------------------------------------
    ユーザー名とパスワードで本人確認を行い、
    成功した利用者にJWTを返すログインAPI
------------------------------------------*/
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  type UserRow = {
    id: number;
    username: string;
    password_hash: string;
    role: "staff" | "manager";
  };
  //ユーザー名に一致するレコードを取得する
  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as UserRow | undefined;

  if (!user) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  //パスワードの検証
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  //JWTを生成して返す
  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/*------------------------------------------
    ゲスト登録API
    ゲストの名前を登録し、JWTを返す
------------------------------------------*/  
app.post("/guests/register", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "name is required" });
  }

  const trimmedName = name.trim();
  // まず同じ名前のゲストがいないか探す
  let guest = db
    .prepare("SELECT id, name FROM guests WHERE name = ?")
    .get(trimmedName) as { id: number; name: string } | undefined;

  // いなければ新規作成
  if (!guest) {
    const result = db.prepare("INSERT INTO guests (name) VALUES (?)").run(trimmedName);
    guest = { id: Number(result.lastInsertRowid), name: trimmedName };
  }

  // 二次会当日中はログイン状態を保ちたいので有効期限は長め
  const token = jwt.sign(
    { sub: guest.id, name: trimmedName, type: "guest" },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token, name: trimmedName });
});

// 動作確認用の保護されたルート
app.get("/guests/me", requireAuth, (req, res) => {
  res.json({ id: req.auth?.sub, name: req.auth?.name });
});


/*------------------------------------------
    serverの起動
------------------------------------------*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})