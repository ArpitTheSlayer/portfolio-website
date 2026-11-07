import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arpit Pandey — Frontend Developer",
    template: "%s — Arpit Pandey",
  },
  description:
    "Frontend developer in Raipur, India. Next.js, React and Tailwind CSS with a full-stack foundation in Node.js, Express, MySQL and MongoDB.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Arpit Pandey — Frontend Developer",
    description:
      "Frontend developer in Raipur, India. Next.js, React and Tailwind CSS with a full-stack foundation.",
    type: "website",
    locale: "en_IN",
    siteName: "Arpit Pandey",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} bg-paper text-ink antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <noscript>
            <style>{".reveal { opacity: 1 !important; transform: none !important; }"}</style>
          </noscript>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
