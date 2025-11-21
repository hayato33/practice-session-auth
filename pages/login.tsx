import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功後、プロフィールページへ
        router.push("/profile");
      } else {
        setError(data.error || "ログインに失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>ログイン</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@example.com"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        アカウントをお持ちでないですか？{" "}
        <a href="/signup" style={{ color: "#0070f3" }}>
          新規登録
        </a>
      </p>
    </div>
  );
}
