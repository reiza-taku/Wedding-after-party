import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { db } from "./db";
import { createUser, verifyPassword } from "./auth";

//Expressアプリの作成（webサーバの設定を集める）
const app = express();
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

//ユーザー名とパスワードで本人確認を行い、成功した利用者にJWTを返すログインAPI
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

//環境変数 PORT があればそれを使い、なければ3001番を使う
const PORT = process.env.PORT;


/*------------------------------------------
    serverの起動
------------------------------------------*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})