import { useEffect, useState } from "react";
import { fetchMe } from "../lib/api";

// 認証状態を表す型
type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; guest: { id: number; name: string } }
  | { status: "unauthenticated" };

// ローカルストレージに保存するトークンのキー
const TOKEN_KEY = "guest_token";

// ゲストの認証状態を管理するカスタムフック
export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  // コンポーネントのマウント時に認証状態を確認する
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ status: "unauthenticated" });
      return;
    }

    // トークンが存在する場合は自分の情報を取得して認証状態を更新する
    fetchMe(token)
      .then((guest) => setState({ status: "authenticated", guest }))
      .catch(() => {
        // 期限切れ/不正なトークンは破棄
        localStorage.removeItem(TOKEN_KEY); 
        // 認証状態を未認証に設定
        setState({ status: "unauthenticated" });
      }
    );
  }, []);

  // ログイン処理を行う関数
  function login(token: string, guest: { id: number; name: string }) {
    localStorage.setItem(TOKEN_KEY, token);
    setState({ status: "authenticated", guest });
  }

  return { state, login };
}