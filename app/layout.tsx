import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import React from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evaneos Chat",
  description: "Internal chatbot interface",
};

// const MswClient = () => {
//   React.useEffect(() => {
//     import('../mocks/setup').then(({ worker }) => {
//       if (process.env.NODE_ENV === 'development' && worker) {
//         worker.start({
//           onUnhandledRequest: 'bypass'
//         }).catch(err => console.error('MSW 启动失败:', err));
//       }
//     });
//   }, []);
//   return null;
// };
// Object.assign(MswClient, {
//   $$typeof: Symbol.for('react.client.reference'),
//   render: MswClient
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* <MswClient /> */}
        {children}
      </body>
    </html>
  );
}