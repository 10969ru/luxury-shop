"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // メッセージを管理するStateを追加
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    setMessage(null); // 前回のメッセージをクリア

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://luxury-shop-teal.vercel.app/reset-password"
    });

    setLoading(false);

    if (error) {
      setMessage({ text: "依頼失敗: " + error.message, isError: true });
      return;
    }

    setMessage({
      text: "再契約依頼書を送信した。\n書簡（E-mail）を確認せよ。\nなお、再契約の使者が迷い込むことがある。\n迷惑書簡の領域も忘れずに捜索せよ。\n書簡が届かぬ場合は、wanderer.in.void@gmail.com宛に\n「鍵を忘れし者」である旨を直接伝達するがよい。\n我がその報せを感知次第、順に「鍵の再生成」たるゲートを返送する。",
      isError: false
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-xl mb-6">鍵の再契約</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        className="p-2 mb-4 bg-zinc-900 border border-zinc-700 w-64"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="border px-6 py-2 hover:bg-white hover:text-black mb-4"
      >
        {loading ? "依頼中..." : "依頼"}
      </button>

      {/* メッセージ表示エリア */}
      {message && (
        <p className={`text-sm whitespace-pre-line w-64 text-center ${message.isError ? "text-red-500" : "text-zinc-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}