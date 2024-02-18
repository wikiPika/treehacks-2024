import React from 'react'

const Blurb = () => {
  return (
    <div className="w-full h-full flex-col justify-center items-center gap-6 inline-flex">
    <div className="text-neutral-800 text-[56px] font-black leading-[100px]">Fudu</div>
    <div className="w-[700px] text-center text-neutral-800 text-opacity-80 text-2xl font-normal pb-5">Fudu is a browser utility that allows seniors to better interact with the internet.</div>
    <a href="http://localhost:3000/demo"><button className="px-12 py-6 bg-neutral-800 rounded-[36px] justify-start items-start gap-2.5 inline-flex">
      <div className="text-white text-2xl font-normal leading-[18px]">Get Started</div>
    </button></a>
  </div>
  )
}

export default Blurb
