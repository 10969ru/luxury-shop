"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("契約鍵の再刻印を完了した。");

    // 👉 ここ追加
    router.push("/login");
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
        className="border px-6 py-2 hover:bg-white hover:text-black"
      >
        刻印
      </button>
    </div>
  );
}