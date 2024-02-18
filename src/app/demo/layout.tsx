"use client";

import DataProvider from "@/ui/demo/DataContext";
import { ReactNode } from "react";

export default function Layout(props: {
  children: ReactNode
}) {
  return <DataProvider>
    {props.children}
  </DataProvider>
}