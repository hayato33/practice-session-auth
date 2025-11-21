import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";

export default function SignupPage() {
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登録成功後、ログインページへ
        alert("登録が完了しました。ログインしてください。");
        router.push("/login");
      } else {
        setError(data.error || "登録に失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>ユーザー登録</h1>

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
          <label htmlFor="password">パスワード（8文字以上）</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            required
            minLength={8}
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
          {loading ? "登録中..." : "登録"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        すでにアカウントをお持ちですか？{" "}
        <a href="/login" style={{ color: "#0070f3" }}>
          ログイン
        </a>
      </p>
    </div>
  );
}
