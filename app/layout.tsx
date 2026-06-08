// app/layout.tsx
import { Header } from "./components/Header";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext"; // これを追加！
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <WishlistProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

