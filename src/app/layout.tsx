import type { Metadata } from "next";
import localFont from "next/font/local";
import { Alertas } from "@/presentation/providers/Alertas";
import { Cabecera } from "@/presentation/layouts/Cabecera";
import { Pie } from "@/presentation/layouts/Pie";
import "./globals.css";
const display = localFont({
  src: "../../public/fonts/BarlowCondensed-ExtraBold.ttf",
  variable: "--font-display",
  display: "swap",
});
const graffiti = localFont({
  src: "../../public/fonts/PermanentMarker-Regular.ttf",
  variable: "--font-graffiti",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Mundo Awoo · El barrio es tuyo",
  description: "Tu personaje, tu pinta, tu mundo. Elige tu personaje 3D, viste tu avatar y lleva el flow del barrio a Mundo Awoo.",
  icons: { icon: "/lobo.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${display.variable} ${graffiti.variable}`}>
      <body>
        <a className="skipLink" href="#contenido">Saltar al contenido</a>
        <Alertas>
          <Cabecera />
          {children}
          <Pie />
        </Alertas>
      </body>
    </html>
  );
}
