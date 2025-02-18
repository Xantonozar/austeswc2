import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
const exoItalic = localFont({
  src: "./fonts/YesevaOne-Regular.ttf",
  variable: "--font-exo-italic",
});



export const metadata = {
  title: "AUSTESWC",
  description: "Ahsanullah University of Science and Technology Environmental and Social Welfare Club is a Environmental and Social Welfare Club ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
     
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
