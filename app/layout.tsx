import { Header } from "./components/Header";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { MessageProvider } from "./context/MessageContext";
import FogEffect from "../components/FogEffect"; // FogEffectのインポート
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        {/* すべての機能とエフェクトをここで囲む */}
        <FogEffect /> 
        <MessageProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
            </CartProvider>
          </WishlistProvider>
        </MessageProvider>
      </body>
    </html>
  );
}