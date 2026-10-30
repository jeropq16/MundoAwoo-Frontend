import type { Metadata } from "next";
import { Alertas } from "@/presentation/providers/Alertas";
import { Cabecera } from "@/presentation/layouts/Cabecera";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mundo Awoo · Estudio de avatar",
  description: "Viste y anima tu lobo en el estudio de Mundo Awoo.",
  icons: { icon: "/lobo.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Alertas>
          <Cabecera />
          {children}
        </Alertas>
      </body>
    </html>
  );
}
