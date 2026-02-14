import React from "react";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
