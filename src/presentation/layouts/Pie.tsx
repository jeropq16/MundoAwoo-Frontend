import Link from "next/link";
import { Icono } from "../components/common/Icono";

export function Pie() {
  return (
    <footer className="siteFooter">
      <Link href="/" className="footerBrand"><Icono nombre="avatar" size={24} /> MUNDO AWOO<span>®</span></Link>
      <span>DEL BARRIO PARA EL MUNDO.</span>
      <span className="footerSignature">Hecho con flow ↗</span>
    </footer>
  );
}
