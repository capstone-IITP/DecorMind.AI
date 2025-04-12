import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from './_components/NextTopLoader';
import GoogleAnalytics from './_components/GoogleAnalytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DecorMind",
  description: "Transform your space with AI-powered interior design",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Client component for loader
const LoaderScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            var loader = document.querySelector('#loader');
            if (loader) {
              setTimeout(function() {
                loader.style.top = '-100%';
              }, 4000);
            }
          });
        `,
      }}
    />
  );
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <LoaderScript />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <NextTopLoader
            color="#22d3ee"
            showSpinner={false}
            height={3}
            shadow={true}
          />
          <GoogleAnalytics />
          <div id="loader">
            <h1>Welcome</h1>
            <h1>To</h1>
            <h1>DecorMind</h1>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}