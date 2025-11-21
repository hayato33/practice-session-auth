# メモ

## セットアップ

1. `pnpm install`
2. `psql -U postgres -f db/init.sql`
3. `.env.local` 作成

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=practice_session_auth
DB_USER=postgres
DB_PASSWORD=your_password
```

4. `pnpm dev`
