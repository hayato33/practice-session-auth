import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* サイドバー */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "#f7f9fc",
          borderRight: "1px solid #eaeaea",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "30px", fontWeight: "bold", fontSize: "1.1rem" }}>
          Auth App
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <Link
                href="/"
                style={{
                  display: "block",
                  padding: "10px 15px",
                  color: "#333",
                  textDecoration: "none",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                トップページ
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                style={{
                  display: "block",
                  padding: "10px 15px",
                  color: "#333",
                  textDecoration: "none",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                新規登録
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                style={{
                  display: "block",
                  padding: "10px 15px",
                  color: "#333",
                  textDecoration: "none",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                ログイン
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                style={{
                  display: "block",
                  padding: "10px 15px",
                  color: "#333",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                プロフィール
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main style={{ flex: 1, padding: "40px" }}>{children}</main>
    </div>
  );
}
