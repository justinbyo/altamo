import "./globals.css";

export const metadata = {
  title: "Altamo - Order Menu",
  description: "Browse menu and order food and drinks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
