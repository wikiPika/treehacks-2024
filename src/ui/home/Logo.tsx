import Image from 'next/image'
import { LogoImage } from '../../../public'

export default function Logo() {
  return <div className="">
    <Image
      src={LogoImage}
      width={50}
      height={50}
      alt="Logo of Fudu"
    />

  </div>
}