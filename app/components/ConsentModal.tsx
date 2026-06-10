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
<div className="text-left text-xs text-zinc-300 space-y-4 leading-relaxed">
  <p>利用を開始する前に、以下の重要事項にご同意ください。</p>
  
  <ul className="list-decimal list-inside space-y-2">
    <li>本サイト内のすべての提供物（商品・仮想通貨等）は完全に架空のものであり、実体および金銭的価値を一切伴いません。</li>
    <li>利用者は「禁忌の館」の訪問者として、体験内容を現実世界に持ち込まない（秘匿する）ことに同意するものとします。</li>
    <li>本サービスの利用により生じた直接的・間接的損害について、運営者は一切の責任を負いません。</li>
    <li>本サービスは予告なく変更・停止される場合があり、それにより生じる影響についても利用者は了承するものとします。</li>
    <li>未成年者は保護者の同意を得た上で利用するものとし、利用を開始した時点で同意を得ているものとみなします。</li>
  </ul>

  <p className="pt-4 border-t border-zinc-800">
    上記および <Link href="/terms" className="underline hover:text-white font-bold">利用規約・プライバシーポリシー</Link> に同意して館へ入る。
  </p>
</div>        <button 
          onClick={handleAgree}
          className="w-full py-3 border border-white bg-black text-white hover:bg-white hover:text-black transition tracking-[0.2em]"
        >
          同意して入館する
        </button>
      </div>
  );
}