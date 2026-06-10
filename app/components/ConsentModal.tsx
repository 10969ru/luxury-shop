"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useConsent } from "../context/ConsentContext";
import { useMessage } from "../context/MessageContext";
import Link from 'next/link';

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setIsAgreed } = useConsent();
  // MessageContextから必要な関数・変数を取得
  const { showMessage, MESSAGES, setIsPaused } = useMessage();

  useEffect(() => {
    const checkConsent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // loginやtermsではモーダルを出さない
      if (!user || ["/login", "/terms"].includes(pathname)) {
        setIsOpen(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_consented')
        .eq('id', user.id)
        .single();

      if (profile && !profile.has_consented) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkConsent();
  }, [pathname]);

  const handleAgree = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // DB更新
    await supabase.from('profiles').update({ has_consented: true }).eq('id', user.id);
    await supabase.rpc('process_login_bonus');

    setIsOpen(false);
    setIsAgreed(true);
    
    // 初回同意後にメッセージ表示を許可し、表示する
    setIsPaused(false);
    showMessage(MESSAGES.LOGIN_DAILY_BONUS, 2500);

    // メッセージ表示後に遷移
    setTimeout(() => {
      router.push("/");
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-6">
      <div className="max-w-md w-full border border-zinc-700 bg-black p-8 text-center space-y-6">
        <h2 className="text-xl tracking-[0.3em] text-white">禁忌の領域へのアクセス</h2>
        <div className="text-left text-xs text-zinc-300 space-y-4 leading-relaxed">
          <p>1. 本サイトで取り扱われる商品は全て架空であり、実物は配送されません。</p>
          <p>2. 本サイト内の資産は、本サイト内でのみ有効であり、換金性は一切ありません。</p>
          <p>3. あなたは現在「禁忌の城」に足を踏み入れようとしています。ここで得た情報、体験を外部に口外することは固く禁じられています</p>
          <p>4. 利用により生じたいかなる損害についても、運営者は一切の責任を負いません。</p>
          <p>5. 利用者が未成年者である場合は、保護者の同意を得て本サイトを利用するものとします。</p>
          <p className="pt-4 border-t border-zinc-800">
            詳細は <Link href="/terms" className="underline hover:text-white">利用規約</Link> をご確認ください。
          </p>
        </div>
        <button 
          onClick={handleAgree}
          className="w-full py-3 border border-white bg-black text-white hover:bg-white hover:text-black transition tracking-[0.2em]"
        >
          同意して入城する
        </button>
      </div>
    </div>
  );
}