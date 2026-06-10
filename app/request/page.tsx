"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useMessage } from "../context/MessageContext";

export default function RequestPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showMessage, MESSAGES } = useMessage();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("ログインが必要です");
      router.push("/login");
      setLoading(false);
      return;
    }

    // プロフィール情報を取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('user_id', user.id) // カラム名を user_id に修正
      .single();

    const insertData = {
      user_id: user.id,
      content: content,
      username: profile?.username ?? "名無し",
      display_name: profile?.display_name ?? "名無し"
    };

    const { error } = await supabase.from('requests').insert(insertData);

    if (error) {
      console.error("詳細エラー:", JSON.stringify(error, null, 2)); 
      alert("エラー発生。F12キーを押してコンソールを確認してください。");
      setLoading(false);
      return;
    }

    // 送信成功時の処理
    setLoading(false);
    setContent(""); // 入力内容をクリア
    showMessage(MESSAGES.MESSAGE_SENT); // メッセージカードを表示
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32 max-w-md mx-auto">
      <h1 className="text-xl tracking-[0.2em] mb-8 border-b border-zinc-800 pb-4">禁忌具開発依頼</h1>
      <p className="text-zinc-300 text-xs mb-6">汝が望む禁忌具を記述せよ。我はその創造の可能性を深淵より探り出さん。</p>
      
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
        {loading ? "魔法陣を展開中…" : "願いを捧げる"}
      </button>
    </div>
  );
}