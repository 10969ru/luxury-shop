import { Header } from "./components/Header";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext"; // 追加
import FogEffect from "../components/FogEffect";
import "./globals.css";
import ConsentModal from "./components/ConsentModal";
import { ConsentProvider } from "./context/ConsentContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* AuthProviderを最上位に配置することで、全コンテキストで認証情報を利用可能にする */}
        <AuthProvider>
          <ConsentProvider>
            <MessageProvider>
              {/* コンテキストの内側に配置することで、モーダルから通知機能を安全に利用可能に */}
              <ConsentModal /> 
              <WishlistProvider>
                <CartProvider>
                  <FogEffect />
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <footer className="mt-20 pb-10 text-center">
                    <div className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase opacity-60 leading-tight px-4 mb-4">
                      Disclaimers: All items listed on this site are purely fictional. No real goods will be delivered. All in-site assets have no real-world monetary value.
                    </div>
                    <a href="/terms" className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition">
                      Terms of Service
                    </a>
                  </footer>
                </CartProvider>
              </WishlistProvider>
            </MessageProvider>
          </ConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}