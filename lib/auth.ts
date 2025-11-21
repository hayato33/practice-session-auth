import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSimpleConnection } from "./db";

interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

interface AuthUser {
  id: number;
  email: string;
}

/**
 * リクエストからセッション情報を取得する関数
 *
 * CookieからsessionIdを取り出し、DBに問い合わせてセッションの有効性を確認
 * セッションが無効または期限切れの場合はnullを返す
 */
export async function getSession(
  req: NextApiRequest,
): Promise<{ session: Session; user: AuthUser } | null> {
  try {
    // 1. CookieからsessionIdを取得
    const cookies = parse(req.headers.cookie || "");
    const sessionId = cookies.sessionId;

    if (!sessionId) return null;

    // 2. DBからセッション情報と紐づくユーザー情報を取得
    const pool = await getSimpleConnection();
    const sessionResult = await pool.query(
      `SELECT s.id, s.user_id, s.expires_at, s.created_at, u.email
			FROM sessions s
			JOIN auth_users u ON s.user_id = u.id
			WHERE s.id = $1`,
      [sessionId],
    );

    if (sessionResult.rows.length === 0) {
      return null;
    }

    const row = sessionResult.rows[0];
    const expiresAt = new Date(row.expires_at);

    // 3. 期限切れのセッションはDBから削除
    if (expiresAt < new Date()) {
      await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
      return null;
    }

    // 4. 有効なセッション情報を返す
    return {
      session: {
        id: row.id,
        userId: row.user_id,
        expiresAt,
        createdAt: new Date(row.created_at),
      },
      user: {
        id: row.user_id,
        email: row.email,
      },
    };
  } catch (error) {
    console.error("セッション取得エラー:", error);
    return null;
  }
}

/**
 * 認証必須のAPIルートで使用するヘルパー関数
 *
 * getSessionを呼び出し、認証されていない場合は自動的に401エラーをレスポンス
 * 認証されている場合はセッション情報を返す
 *
 * 使用例:
 * const auth = await requireAuth(req, res);
 * if (!auth) return;
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ session: Session; user: AuthUser } | null> {
  const auth = await getSession(req);

  if (!auth) {
    res.status(401).json({ error: "認証が必要です" });
    return null;
  }

  return auth;
}
