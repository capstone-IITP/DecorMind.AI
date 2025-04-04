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
      </body>
    </Html>
  );
} 