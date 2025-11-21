import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";

/**
 * 認証済みユーザー情報取得API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "メソッドが許可されていません" });
  }

  const auth = await requireAuth(req, res);
  if (!auth) return;

  res.status(200).json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
    },
  });
}
