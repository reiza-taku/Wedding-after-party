import bcrypt from "bcrypt";
import { db } from "./db";

//コストファクター(ハッシュ計算の強さ)
const SALT_ROUNDS = 10; 

/*------------------------------------------
    ユーザー認証関連の関数
------------------------------------------*/
//ユーザー登録時にパスワードを安全に保存する関数
export async function createUser(
    username: string, 
    plainPassword: string, 
    role: "staff" | "manager") {

  //パスワードをハッシュ化(bcryptは同じパスワードでも毎回異なるハッシュ値を生成)
  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  //SQLを実行して、users テーブルにユーザーを1件追加
  const statement = db.prepare(
    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)"
  );
  await statement.run(username, passwordHash, role);

  //run() の結果からIDを取得して返す(必要になれば実装)
}

//ログイン時に、入力パスワードが正しいか確かめる関数
export async function verifyPassword(plainPassword:string, passwordHash:string){
    return bcrypt.compare(plainPassword, passwordHash);
}