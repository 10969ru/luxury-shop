"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://luxury-shop-teal.vercel.app/reset-password"
    });

    setLoading(false);

    if (error) {
      alert("送信失敗: " + error.message);
      return;
    }

    alert("再契約依頼書を送信した。\n書簡（E-mail）を確認せよ。");
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
        className="border px-6 py-2 hover:bg-white hover:text-black"
      >
        {loading ? "依頼中..." : "依頼"}
      </button>
    </div>
  );
}