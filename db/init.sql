-- データベース作成
CREATE DATABASE practice_session_auth;

-- 既存のテーブルを削除（外部キー制約があるため、sessionsを先に削除）
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS auth_users;

-- 認証用ユーザーテーブル
CREATE TABLE auth_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- セッションテーブル
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
