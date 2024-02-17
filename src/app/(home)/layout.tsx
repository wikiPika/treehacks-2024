import Navbar from "@/ui/home/Navbar";
import Footer from "@/ui/home/Footer";
import "../globals.css";

import { ReactNode } from "react";

export default function Layout(props: {
  children: ReactNode,
}) {
  return <div>
    <Navbar />
    {props.children}
    <Footer />
  </div>
}