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

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      alert("ログインが必要です");
      router.push("/login");
      setLoading(false);
      return;
    }

    const username =
      user.user_metadata?.username ??
      user.email ??
      "名無し";

    const displayName =
      user.user_metadata?.display_name ??
      user.user_metadata?.name ??
      "名無し";

    const insertData = {
      user_id: user.id,
      content: content,
      username: username,
      display_name: displayName
    };

    const { error } = await supabase
      .from("requests")
      .insert(insertData);

    if (error) {
      console.error("詳細エラー:", JSON.stringify(error, null, 2));
      alert("エラー発生。F12キーを押してください");
      setLoading(false);
      return;
    }

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_key: "14d228de-8bd0-4cdb-bfb3-105249ca7ef6",

        subject: "禁忌具開発依頼",

        username,
        display_name: displayName,
        user_id: user.id,
        content
      })
    });

    setLoading(false);
    setContent("");
    showMessage(MESSAGES.MESSAGE_SENT);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32 max-w-md mx-auto">
      <h1 className="text-xl tracking-[0.2em] mb-8 border-b border-zinc-800 pb-4">
        禁忌具開発依頼
      </h1>

      <p className="text-zinc-300 text-xs mb-6">
        汝が望む禁忌具を記述せよ。我はその創造の可能性を深淵より探り出さん。
      </p>

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