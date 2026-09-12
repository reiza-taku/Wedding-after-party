// src/components/NameForm.tsx
import { useState } from "react";

export function NameForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSubmit(name.trim());
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前を入力してください"
      />
      <button type="submit">参加する</button>
    </form>
  );
}