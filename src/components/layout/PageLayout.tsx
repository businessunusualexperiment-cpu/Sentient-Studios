import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
type PageLayoutProps = {
  children: React.ReactNode;
};
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}