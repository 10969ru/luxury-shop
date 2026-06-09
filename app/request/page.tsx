"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RequestPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("ログインが必要です");
      router.push("/login");
      return;
    }

    // プロフィール情報を取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', user.id)
      .single();

    // insertDataをany型として定義することで赤線を回避
    const insertData: any = {
      user_id: user.id,
      content: content,
      username: profile?.username ?? "名無し",
      display_name: profile?.display_name ?? "名無し"
    };

const { error } = await supabase.from('requests').insert(insertData);

    if (error) {
      // JSON.stringifyを追加してエラーの詳細を強制表示
      console.error("詳細エラー:", JSON.stringify(error, null, 2)); 
      alert("エラー発生。F12キーを押してコンソールを確認してください。");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32 max-w-md mx-auto">
      <h1 className="text-xl tracking-[0.2em] mb-8 border-b border-zinc-800 pb-4">商品開発依頼</h1>
      <p className="text-zinc-300 text-xs mb-6">あなたの望む「禁忌のアイテム」を記述せよ。我々がそれを虚無から召喚する可能性を探る。</p>
      
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 bg-zinc-900 border border-zinc-700 p-4 mb-4 text-sm text-white focus:outline-none focus:border-white"
        placeholder="例：深淵を覗き見るための黒い鏡..."
      />
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className="w-full py-3 border border-white hover:bg-white hover:text-black transition tracking-[0.2em] disabled:opacity-50"
      >
        {loading ? "送信中..." : "送信する"}
      </button>
    </div>
  );
}