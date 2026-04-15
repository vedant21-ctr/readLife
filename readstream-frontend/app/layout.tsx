import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "ReadStream - Your Daily Stream of Knowledge",
  description: "AI curated multilingual news platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        playfair.variable
      )}>
        <SmoothScroll />
        <div className="bg-grain fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] mix-blend-overlay"></div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <footer className="border-t border-border-soft bg-background">
                  <div className="container mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-3xl font-serif font-black tracking-tight">ReadStream<span className="text-amber-500">.</span></h3>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                          Your premium hub for carefully curated stories, research-driven insights, and an immersive, uninterrupted reading experience.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <h4 className="font-bold text-[10px] tracking-widest uppercase text-foreground/80">Explore</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                          <li><a href="/news" className="hover:text-amber-600 transition-colors inline-block">Latest News</a></li>
                          <li><a href="/trending" className="hover:text-amber-600 transition-colors inline-block">Trending Stories</a></li>
                          <li><a href="/academic" className="hover:text-amber-600 transition-colors inline-block">Academic Journals</a></li>
                        </ul>
                      </div>
                      <div className="space-y-6">
                        <h4 className="font-bold text-[10px] tracking-widest uppercase text-foreground/80">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                          <li><a href="/about" className="hover:text-amber-600 transition-colors inline-block">Our Vision</a></li>
                          <li><a href="/subscription" className="hover:text-amber-600 transition-colors inline-block">Premium Access</a></li>
                          <li><a href="/contact" className="hover:text-amber-600 transition-colors inline-block">Contact Support</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
                      <p>© {new Date().getFullYear()} ReadStream Inc. All rights reserved.</p>
                      <div className="flex gap-6">
                        <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
