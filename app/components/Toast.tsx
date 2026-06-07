"use client";
import { useEffect } from "react";

export default function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // 2秒後に消える
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10 right-10 z-50 bg-zinc-900 border border-zinc-700 text-white p-4 rounded shadow-2xl">
      {message}
    </div>
  );
}