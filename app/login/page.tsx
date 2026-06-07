"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

const handleSignUp = async () => {
    // 1. まず同じメールでログインできるか試す
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    // ログインに成功したら「既に登録済み」とみなす
    if (!signInError && signInData.user) {
      setMessage("この書簡（E-mail）は既に契約済みである。\n別の鍵を用意せよ。");
      return; // ここで終了
    }

    // 2. ログインできなかったら、新規登録を試みる
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    
    if (signUpError) {
      if (signUpError.message.includes("rate limit")) {
        setMessage("汝の試行回数は許容範囲を超えた。\n時間を置いて再試行せよ。");
      } else {
        setMessage(`過ちが発生した：\n${signUpError.message}`);
      }
    } else {
      setMessage("契約は完了した。\n禁断の書簡（E-mail）を確認し、\n秘匿された紹介への扉を開放せよ。");
    }
  };
  
const handleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    setMessage(error.message === "Invalid login credentials" ? "虚偽の鍵が提示された。\n正しき資格を示せ。" : error.message);
  } else {
    // 1. ログイン成功後、DBのロジック（ボーナス処理）を呼び出す
    // ※ SupabaseのRPC機能で作成した関数を呼び出す
    const { data: bonusData, error: bonusError } = await supabase
      .rpc('process_login_bonus');

    // 2. その結果に基づいてメッセージを出し分ける
    // ユーザーの最新のlast_loginを確認するために取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_login')
      .eq('id', data.user.id)
      .single();

    // 今日が「初ログイン」だったかどうかを判定（フロントでも判断可能）
    const lastLoginDate = profile?.last_login ? new Date(profile.last_login).toISOString().split('T')[0] : null;
    const today = new Date().toISOString().split('T')[0];

    // 初回（あるいは付与が発生した日）の判定
    if (lastLoginDate === today) {
       setMessage("禁域へようこそ。\n新たな資産が加算された。\nマイページを開き、残高を確認せよ。");
    } else {
       setMessage("禁域へようこそ。");
    }

    setTimeout(() => router.push('/'), 2000);
  }
};
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      {/* メッセージカード */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative w-80 h-40 bg-gradient-to-br from-zinc-800 to-black border border-zinc-600 rounded-lg shadow-2xl flex items-center justify-center p-6 text-center">
            <button 
              onClick={() => setMessage(null)} 
              className="absolute top-2 right-2 text-zinc-500 hover:text-white"
            >✕</button>
            {/* ここで改行を有効にしています */}
            <p className="text-white whitespace-pre-wrap">{message}</p>
          </div>
        </div>
      )}

      <button onClick={() => router.push('/')} className="absolute top-4 left-4 text-zinc-500 hover:text-white transition">← Home</button>
      <h1 className="text-2xl mb-8">VOID ACCESS</h1>
      
      <input type="email" placeholder="Email" className="p-2 mb-4 bg-zinc-900 border border-zinc-700 rounded text-white" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="p-2 mb-4 bg-zinc-900 border border-zinc-700 rounded text-white" onChange={(e) => setPassword(e.target.value)} />
      
      <div className="flex gap-4">
        <button onClick={handleSignUp} className="border px-4 py-2 hover:bg-white hover:text-black transition">Sign Up</button>
        <button onClick={handleSignIn} className="border px-4 py-2 hover:bg-white hover:text-black transition">Sign In</button>
      </div>
    </div>
  );
}