import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch {
      alert("ログアウトに失敗しました");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        読み込み中...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1>プロフィール</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>ユーザーID:</strong> {user.id}
        </p>
        <p>
          <strong>メールアドレス:</strong> {user.email}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
