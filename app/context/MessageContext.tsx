"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// メッセージ辞書（一元管理用）
export const MESSAGES = {
  SIGNUP_SUCCESS: "契約は完了した。\n禁断の書簡（E-mail）を確認し、\n秘匿された扉を開放せよ。",
  SIGNUP_EXISTS: "この書簡（E-mail）は既に契約済みである。\n別の鍵を用意せよ。",
  AUTH_ERROR: "過ちが発生した：",
  LOGIN_SUCCESS: "禁域へようこそ。",
  LOGIN_DAILY_BONUS: "禁域へようこそ。\n新たな資産が加算された。\nマイページを開き、残高を確認せよ。",
  LOGIN_INVALID: "虚偽の鍵が提示された。\n正しき資格を示せ。",
  LOGOUT: "扉は閉ざされた。",
  WISH_ADD: "禁域の記録に刻まれた。",
  CART_ADD: "果実がカートへ格納された。",
  CART_ADD_MULTIPLE: "すべての果実が\nカートへ積載された。",
  PURCHASE_SUCCESS: "取引は完了した。\n果実は速やかに届けられるだろう。",
  PURCHASE_FAILED_FUNDS: "残高が足りない。\n禁域での取引は不可能だ。",
  QUANTITY_LIMIT: "これ以上の干渉は許されない。",
  NETWORK_ERROR: "禁域との接続が断たれた。",
  PASSWORD_RESET_SENT: "鍵を生成するための書簡を送った。",
  REMOVE:"禁域の記録から抹消した。",
};

const MessageContext = createContext<any>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  const hideMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ message, showMessage, hideMessage, MESSAGES }}>
      {children}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-zinc-800 to-black border border-zinc-600 rounded-lg p-8 text-center shadow-2xl">
            <button 
              onClick={hideMessage} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >✕</button>
            <p className="text-white whitespace-pre-wrap leading-relaxed tracking-wider">{message}</p>
          </div>
        </div>
      )}
    </MessageContext.Provider>
  );
}

export const useMessage = () => useContext(MessageContext);