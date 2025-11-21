import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSimpleConnection } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "メソッドが許可されていません" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "メールアドレスとパスワードは必須です" });
    }

    const pool = await getSimpleConnection();
    const userResult = await pool.query(
      "SELECT id, email, password_hash FROM auth_users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "メールアドレスまたはパスワードが正しくありません" });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "メールアドレスまたはパスワードが正しくありません" });
    }

    const sessionId = randomUUID();

    // 検証用: セッション有効期限を3分に設定
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 3);

    const createdAt = new Date();
    await pool.query(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES ($1, $2, $3, $4)",
      [sessionId, user.id, expiresAt, createdAt],
    );

    const cookie = serialize("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 3, // 検証用: 3分
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    res.status(200).json({
      message: "ログインに成功しました",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("ログインエラー:", error);
    res.status(500).json({ error: "内部サーバーエラー" });
  }
}
