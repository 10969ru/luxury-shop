"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!password) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setLoading(false);
      setMessage({ text: "刻印失敗: " + error.message, isError: true });
      return;
    }

    setMessage({ text: "契約鍵の再刻印を完了した。", isError: false });
    setLoading(false);

    // 成功した場合は少し待ってからログイン画面へ遷移
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-xl mb-6">鍵の再契約</h1>

      <input
        type="password"
        placeholder="新たなる鍵"
        className="p-2 mb-4 bg-zinc-900 border border-zinc-700 w-64"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="border px-6 py-2 hover:bg-white hover:text-black mb-4"
      >
        {loading ? "刻印中..." : "刻印"}
      </button>

      {/* メッセージ表示エリア */}
      {message && (
        <p className={`text-sm w-64 text-center ${message.isError ? "text-red-500" : "text-zinc-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}