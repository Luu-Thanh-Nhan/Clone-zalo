import { Inter } from "next/font/google";
import "./globals.css";
import { ProviderContext } from "./context";
import { Toaster } from "react-hot-toast";
import { MessageProvider } from "@/components/messages/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QiChat",
  description: "It's A Good Platform For Message Sharing",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="qPr_3m_jtgVoFmOL2IRmvbU2OdtNkvMzWNbAkpMcueU" />
      </head>
      <body className={inter.className}>
        <ProviderContext>
          <MessageProvider>
            {children}
          </MessageProvider>
        </ProviderContext>
      </body>
    </html>
  );
}
