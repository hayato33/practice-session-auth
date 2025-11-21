import bcrypt from "bcrypt";
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

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "パスワードは8文字以上にしてください" });
    }

    const pool = await getSimpleConnection();
    const existingUser = await pool.query(
      "SELECT id FROM auth_users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "このメールアドレスは既に登録されています" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO auth_users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash],
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: "ユーザー登録が完了しました",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    res.status(500).json({ error: "内部サーバーエラー" });
  }
}
