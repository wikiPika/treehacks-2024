"use client";

import Link from "next/link";
import Logo from "./Logo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const links = [
  ["Home", "/"],
  ["Demo", "/demo"],
]

export default function Navbar() {
  return <div className="flex flex-row justify-between items-center border-b-1 border-black">
    <div className="flex flex-row justify-between items-center gap-4 p-4">
      <Logo />
      {links.map((v, i) => {
        return <Link href={v[1]} key={"navbar-" + i} className="font-medium w-16 text-center">
          {v[0]}
        </Link>
      })}
    </div>
    <div className="font-medium pr-8">
      <SignedIn>
        <UserButton appearance={{
          elements: {
            avatarBox: "w-12 h-12"
          }
        }} />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  </div>
}