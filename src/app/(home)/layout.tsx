import Navbar from "@/ui/home/Navbar";
import Footer from "@/ui/home/Footer";
import "../globals.css";

import { ReactNode } from "react";

export default function Layout({children}: {
  children: ReactNode,
}) {
  return <div>
    <Navbar />
    {children}
    <Footer />
  </div>
}