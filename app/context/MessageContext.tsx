"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export const MESSAGES = {
  SIGNUP_SUCCESS: "契約は完了した。\n秘匿された扉を開放せよ。",
  SIGNUP_EXISTS: "この魂（E-mail）は既に契約済みである。\n別の鍵を用意せよ。",
  AUTH_ERROR: "過ちが発生した：",
  LOGIN_SUCCESS: "禁域へようこそ。",
  LOGIN_DAILY_BONUS: "禁域へようこそ。\n新たな資産が加算された。\nMY PAGRを開き、残高を確認せよ。",
  LOGIN_INVALID: "虚偽の鍵が提示された。\n正しき資格を示せ。",
  LOGOUT: "扉は閉ざされた。\nまたの入館を待つ。",
  WISH_ADD: "欲望の書に記した。",
  CART_ADD: "禁忌具を取引祭壇へ移した。",
  CART_ADD_MULTIPLE: "すべての禁忌具が\n祭壇へ移された。",
  PURCHASE_SUCCESS: "取引は完了した。\n禁忌具は速やかに届けられるだろう。",
  PURCHASE_FAILED_FUNDS: "残高が足りない。\n禁域での取引は不可能だ。",
  QUANTITY_LIMIT: "これ以上の干渉は許されない。",
  NETWORK_ERROR: "禁域との接続が断たれた。",
  PASSWORD_RESET_SENT: "鍵を生成するための書簡を送った。",
  REMOVE: "祭壇から抹消した。",
  MESSAGE_SENT:"願いは深淵に届いた。\n汝が捧げし祈りに、\n心より感謝する。"
};

// 型定義を拡張
interface MessageContextType {
  message: string | null;
  showMessage: (msg: string, delay?: number) => void;
  hideMessage: () => void;
  setIsPaused: (paused: boolean) => void;
  MESSAGES: typeof MESSAGES;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false); // メッセージ表示のガード用

  const showMessage = (msg: string, delay: number = 2500) => {
    // isPaused が true の間は showMessage を実行しても何も起きない
    if (isPaused) return;
    
    setMessage(msg);
    setTimeout(() => setMessage(null), delay);
  };

  const hideMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ message, showMessage, hideMessage, setIsPaused, MESSAGES }}>
      {children}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999999] bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
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

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage must be used within MessageProvider");
  return context;
};