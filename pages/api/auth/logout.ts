import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/auth";
import { getSimpleConnection } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "メソッドが許可されていません" });
  }

  try {
    const auth = await getSession(req);

    if (auth) {
      const pool = await getSimpleConnection();
      await pool.query("DELETE FROM sessions WHERE id = $1", [auth.session.id]);
    }

    const cookie = serialize("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    res.status(200).json({ message: "ログアウトしました" });
  } catch (error) {
    console.error("ログアウトエラー:", error);
    res.status(500).json({ error: "内部サーバーエラー" });
  }
}
