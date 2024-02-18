import Instructions from './Instructions'
import Blurb from './Blurb'
import Image from 'next/image'
import { HomeImage } from '../../../public'

export default function Hero() {
  return <div className="w-full h-full flex flex-col justify-center items-center mx-auto gap-5 my-16">

    <Blurb />
    <Instructions />
    <Image
      src={HomeImage}
      width={500}
      height={500}
      alt="Picture of elderly couple holding a salad together at a table"
    />
  
</div>
}

