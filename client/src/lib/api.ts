const API_BASE = import.meta.env.VITE_API_BASE;

// ゲスト登録API
export async function registerGuest(name: string) {
  const res = await fetch(`${API_BASE}/guests/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("register failed");
  }
  return res.json() as Promise<{ token: string; name: string }>;
}

// JWTを使って自分の情報を取得するAPI
export async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE}/guests/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("invalid token");
  }
  return res.json() as Promise<{ id: number; name: string }>;
}