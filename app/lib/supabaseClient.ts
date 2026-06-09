import { createClient } from '@supabase/supabase-js';

// 環境変数が存在しない場合にエラーを出しやすくしておく
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabaseの環境変数が設定されていません。");
}

// サーバー側・クライアント側で重複して作成されないよう制御しつつ、
// アプリ全体で唯一の「窓口」となるクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // sessionStorageを使用することで、ブラウザのタブを閉じた際にログイン状態を破棄する
    // これにより、サイトを閉じたらログアウト状態になり、別の端末でログイン状態が続くこともなくなる
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    // 永続化キー（任意）
    storageKey: 'luxury-shop-auth-token',
  },
});