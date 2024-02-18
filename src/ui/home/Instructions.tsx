import React from 'react'

function Instructions() {
  return (
    <div className="w-full h-full px-16 py-10 bg-white relative rounded-[48px] justify-center items-start gap-[72px] inline-flex">
    <div className="flex-col justify-start items-start gap-3 inline-flex">
      <div className="text-neutral-800 text-2xl font-extrabold">TTSTT</div>
      <div className="w-[66px] h-1 bg-neutral-800" />
      <div className="w-44 text-neutral-800 text-opacity-70 text-lg font-normal">Step by step voice walkthroughs for online forms.</div>
    </div>
    <div className="flex-col justify-start items-start gap-3 inline-flex">
      <div className="text-neutral-800 text-2xl font-extrabold">LLM</div>
      <div className="w-[66px] h-1 bg-neutral-800" />
      <div className="w-44 text-neutral-800 text-opacity-70 text-lg font-normal">Processes most forms of rambling.</div>
    </div>
    <div className="flex-col justify-start items-start gap-3 inline-flex">
      <div className="text-neutral-800 text-2xl font-extrabold">Intuitive</div>
      <div className="w-[66px] h-1 bg-neutral-800" />
      <div className="w-44 text-neutral-800 text-opacity-70 text-lg font-normal">Not very hard to use (we hope).</div>
    </div>
  </div>
  )
}

export default Instructions
