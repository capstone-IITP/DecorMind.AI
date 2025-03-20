import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // This will help disable the development mode banner
  // Cannot modify process.env directly, so removing this line
  // if (process.env.NODE_ENV === 'development') {
  //   process.env.NODE_ENV = 'production';
  // }

  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <style jsx global>{`
          /* Hide Next.js development mode banner */
          #__next-build-watcher,
          [data-nextjs-dialog-overlay],
          [data-nextjs-dialog],
          [data-nextjs-toast],
          [data-nextjs-toast-errors] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      </body>
    </Html>
  );
} 