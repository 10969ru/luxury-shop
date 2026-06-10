"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useMessage } from "../context/MessageContext";
import { useConsent } from "../context/ConsentContext";

export default function LoginPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showMessage, MESSAGES, setIsPaused } = useMessage();
  const { setIsAgreed, setShowFog } = useConsent();
  const router = useRouter();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { display_name: displayName } }
    });
    if (error) { showMessage(MESSAGES.AUTH_ERROR); return; }
    showMessage(MESSAGES.SIGNUP_SUCCESS);
  };

  const handleSignIn = async () => {
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !user) { 
      showMessage(MESSAGES.LOGIN_INVALID); 
      return; 
    }

    // 1. プロファイル取得
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('has_consented')
      .eq('user_id', user.id)
      .single();

    // 2. 自己修復（プロファイルがない場合）
    if (profileError || !profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ user_id: user.id, username: email, has_consented: false, balance: 101000000000, display_name: displayName }])
        .select()
        .single();
      if (!insertError) profile = newProfile;
    }

    // 3. 分岐処理
    if (profile?.has_consented === false) {
      // 初回：メッセージを抑制してトップへ飛ばす（モーダルを待つ）
      setIsPaused(true); 
      setIsAgreed(false);
      router.push("/");
// 2回目以降の処理部分を修正
} else {
  localStorage.setItem('hasAgreed', 'true');
  setIsAgreed(true);
  
  // 霧だけここで表示指示を出す
  setShowFog(true); 
  supabase.rpc('process_login_bonus');
  
  // メッセージ表示はトップページに任せる（ここでshowMessageを呼ばない）
  router.push("/");
} 
 };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <button onClick={() => router.push('/')} className="absolute top-4 left-4 text-zinc-500 hover:text-white transition">← Home</button>
      <h1 className="text-2xl mb-8 tracking-[0.2em]">VOID ACCESS</h1>
      <input type="text" placeholder="Display Name" className="p-2 mb-4 bg-zinc-900 border border-zinc-700 rounded text-white w-64" onChange={(e) => setDisplayName(e.target.value)} />
      <input type="email" placeholder="Email" className="p-2 mb-4 bg-zinc-900 border border-zinc-700 rounded text-white w-64" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="p-2 mb-4 bg-zinc-900 border border-zinc-700 rounded text-white w-64" onChange={(e) => setPassword(e.target.value)} />
      <div className="flex gap-4 mt-4">
        <button onClick={handleSignUp} className="border px-6 py-2 hover:bg-white hover:text-black transition">Sign Up</button>
        <button onClick={handleSignIn} className="border px-6 py-2 hover:bg-white hover:text-black transition">Sign In</button>
      </div>
    </div>
  );
}