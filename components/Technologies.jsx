import React from 'react'
import Image from 'next/image'
import { elettroporatore } from './ServicesImages'

function Technologies() {
  return (
    <div className=" m-auto w-[90vw] md:w-[70vw] md:py-12">
      <div className="flex flex-col gap-2 py-8 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-white ">SCOPRI</h4>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
          Le tecnologie
        </h2>
      </div>

      <div>
        <Image src={elettroporatore} alt="test" width={400} />
      </div>
    </div>
  )
}

export default Technologies
