import Link from "next/link";
import Logo from "./Logo";

const links = [
  ["Home", "/"],
  ["Demo", "/demo"],
]

export default function Navbar() {
  return <div className="flex flex-row justify-center items-center gap-4 p-4 border-b-1 border-black">
    <Logo />
    {links.map((v, i) => {
      return <Link href={v[1]} key={"navbar-" + i} className="font-medium w-16 text-center">
        {v[0]}
      </Link>
    })}
  </div>
}