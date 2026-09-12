import { useAuth } from "./hooks/useAuth";
import { registerGuest } from "./lib/api";
import { NameForm } from "./components/NameForm";

function App() {
  const { state, login } = useAuth();

  if (state.status === "loading") {
    return <p>確認中...</p>;
  }

  if (state.status === "unauthenticated") {
    return (
      <NameForm
        onSubmit={async (name: string) => {
          const { token, name: registeredName } = await registerGuest(name);
          login(token, { id: 0, name: registeredName }); // idはAPIから取れれば差し替え
        }}
      />
    );
  }

  return <p>ようこそ、{state.guest.name}さん</p>;
}

export default App;