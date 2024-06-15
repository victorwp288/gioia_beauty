'use client'
import React, { useState, useRef, useEffect } from 'react'
import Accordion from '@/components/Accordion'
import Image from 'next/image'
import {
  maniPiedi,
  rituale,
  sopracciglia,
  tick,
  cerettaPic,
  makeupPic,
  massaggiPic,
  clock,
} from '@/components/ServicesImages'
import manicure from '@/data/manicureData'
import pedicure from '@/data/pedicureData'
import cigliaSopracciglia from '@/data/cigliaSopraccigliaData'
import massaggi from '@/data/massaggiData'
import ceretta from '@/data/cerettaData'
import rituali from '@/data/ritualiData'
import makeup from '@/data/makeupData'
import trattamentiViso from '@/data/trattamentiVisoData'

function ServicesContainer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)

  const handleScroll = () => {
    const scrollPosition = scrollContainerRef.current.scrollLeft
    const containerWidth = scrollContainerRef.current.offsetWidth
    const newIndex = Math.round(scrollPosition / containerWidth)
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    scrollContainer.addEventListener('scroll', handleScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="m-auto mt-2 w-[90vw] md:mt-12 md:w-[70vw]">
      <div className="flex flex-col gap-2 py-8 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-[#dec3c5] ">ESPLORA</h4>
        <h2 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
          I nostri trattamenti
        </h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:flex-col md:overflow-x-visible"
      >
        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Mani e piedi"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={maniPiedi}
            imagePosition="left"
          >
            <div className="grid gap-12 border-t-2  border-dashed border-gray-100  px-6 pb-4 md:grid-cols-2 md:px-12 md:py-12  lg:border-none">
              <div className=" flex flex-col gap-10  pt-8">
                {manicure.map((service, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <h3 className="font-serif text-[1.3rem] font-bold">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Image
                        src={clock}
                        width={18}
                        height={18}
                        alt="duration of the service"
                      />
                      <p className="text-sm font-normal text-gray-500">
                        {service.duration}m
                      </p>
                    </div>
                    <p className="text-sm font-light">{service.description}</p>
                    {service.subcategories && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {service.subcategories.map((subcategory, subIndex) => (
                          <div className="flex flex-col gap-2" key={subIndex}>
                            <div className="flex items-center gap-1">
                              <Image
                                src={clock}
                                width={18}
                                height={18}
                                alt="duration of the service"
                              />
                              <p className="text-sm font-normal text-gray-500">
                                +{subcategory.duration}m
                              </p>
                            </div>
                            <h4 className="w-[85%] text-xs">
                              {subcategory.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-10">
                {pedicure.map((service, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <h3 className="font-serif text-[1.3rem] font-bold">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Image
                        src={clock}
                        width={18}
                        height={18}
                        alt="duration of the service"
                      />
                      <p className="text-sm font-normal text-gray-500">
                        {service.duration}m
                      </p>
                    </div>
                    <p className="text-sm font-light">{service.description}</p>
                    {service.subcategories && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {service.subcategories.map((subcategory, subIndex) => (
                          <div className="flex flex-col gap-2" key={subIndex}>
                            <div className="flex items-center gap-1">
                              <Image
                                src={clock}
                                width={18}
                                height={18}
                                alt="duration of the service"
                              />
                              <p className="text-sm font-normal text-gray-500">
                                +{subcategory.duration}m
                              </p>
                            </div>
                            <h4 className="w-[85%] text-xs">
                              {subcategory.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        </div>
        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Ciglia e sopracciglia"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={sopracciglia}
            imagePosition="right"
          >
            <div className="grid gap-8 px-6 py-8 md:grid-cols-3 md:px-12 md:py-12">
              {cigliaSopracciglia.map((service, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <h3 className="font-serif text-[1.3rem] font-bold">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock}
                      width={18}
                      height={18}
                      alt="duration of the service"
                    />
                    <p className="text-sm font-normal text-gray-500">
                      {service.duration}m
                    </p>
                  </div>
                  <p className="text-sm font-light">{service.description}</p>
                </div>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Massaggi viso e corpo"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={massaggiPic}
            imagePosition="left"
          >
            <div className="grid gap-8 px-6 py-8 md:grid-cols-2 md:px-12 md:py-12">
              {massaggi.map((service, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <h3 className="font-serif text-[1.3rem] font-bold">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock}
                      width={18}
                      height={18}
                      alt="duration of the service"
                    />
                    {service.duration && (
                      <p className="text-sm font-normal text-gray-500">
                        {service.duration}m
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-light">{service.description}</p>
                </div>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Ceretta"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={cerettaPic}
            imagePosition="right"
          >
            <div className="flex flex-col">
              {ceretta.map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-8 px-6 py-8 md:px-12 md:py-12"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-[1.3rem] font-bold">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {service.duration && (
                        <p className="text-xs font-normal text-gray-500">
                          {service.duration}m
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-light md:w-[50%]">
                      {service.description}
                    </p>
                  </div>

                  {service.subcategories && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-7">
                      {service.subcategories.map((subcategory, subIndex) => (
                        <div className="flex flex-col gap-2" key={subIndex}>
                          <div className="flex items-center gap-1">
                            <Image
                              src={clock}
                              width={18}
                              height={18}
                              alt="duration of the service"
                            />
                            <p className="text-sm font-normal text-gray-500">
                              {subcategory.duration}m
                            </p>
                          </div>
                          <h4 className="w-[85%] text-sm">
                            {subcategory.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
        </div>
        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Rituali dal mondo"
            description="I rituali dal mondo sono un’esperienza personale e completa, ripropongono un’esperienza multisensoriale profondamente immersiva, a partire dagli aromi. Gli ingredienti e le pratiche proposte provengono direttamente dalle millenarie tradizioni di bellezza."
            image={rituale}
            imagePosition="left"
          >
            <div className="px-6 pb-12 md:px-12">
              <div className="flex flex-col gap-4 py-10">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    <Image
                      src={clock}
                      width={18}
                      height={18}
                      alt="duration of the service"
                    />
                    <p className="text-sm font-normal text-gray-500">60m</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    ESFOLIAZIONE, IMPACCO E APPLICAZIONE DELLA CREMA
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    <Image
                      src={clock}
                      width={18}
                      height={18}
                      alt="duration of the service"
                    />
                    <p className="text-sm font-normal text-gray-500">90m</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    ESFOLIAZIONE, IMPACCO E MASSAGGIO DI 30 MINUTI
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {rituali.map((service, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <h3 className="font-serif text-[1.3rem] font-bold">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {service.duration && (
                        <p className="text-sm font-normal text-gray-500">
                          {service.duration}m
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-light">{service.description}</p>
                    {service.subcategories && (
                      <div className="py-6">
                        {service.subcategories.map((subcategory, subIndex) => (
                          <div className="flex flex-col gap-2" key={subIndex}>
                            <div className="flex items-center gap-1">
                              <Image
                                src={clock}
                                width={18}
                                height={18}
                                alt="duration of the service"
                              />
                              <p className="text-sm font-normal text-gray-500">
                                {subcategory.duration}m
                              </p>
                            </div>
                            <h4 className="w-[85%] text-xs">
                              {subcategory.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        </div>

        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Make-up e acconciature"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={makeupPic}
            imagePosition="right"
          >
            <div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3 md:px-12 md:py-12">
              {makeup.map((service, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <h3 className="font-serif text-[1.3rem] font-bold">
                    {service.title}
                  </h3>
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <Image
                        src={clock}
                        width={18}
                        height={18}
                        alt="duration of the service"
                      />
                      <p className="text-sm font-normal text-gray-500">
                        {service.duration}m
                      </p>
                    </div>
                  )}
                  <p className="text-sm font-light">{service.description}</p>
                  {service.subcategories && (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {service.subcategories.map((subcategory, subIndex) => (
                        <div className="flex flex-col gap-2" key={subIndex}>
                          <div className="flex items-center gap-1">
                            <Image
                              src={clock}
                              width={18}
                              height={18}
                              alt="duration of the service"
                            />
                            <p className="text-sm font-normal text-gray-500">
                              {subcategory.duration}m
                            </p>
                          </div>
                          <h4 className="w-[85%] text-xs">
                            {subcategory.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="min-w-full snap-center">
          <Accordion
            className="w-full flex-shrink-0 md:w-auto"
            title="Trattamenti viso"
            description="Discover personalized treatments tailored to enhance your natural radiance and rejuvenate your skin. Step into a world of indulgence and refinement, where every visit leaves you feeling confident, refreshed, and revitalized."
            image={maniPiedi}
            imagePosition="left"
          >
            <div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 md:px-12 md:py-12">
              {trattamentiViso.map((service, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <h3 className="font-serif text-[1.3rem] font-bold">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock}
                      width={18}
                      height={18}
                      alt="duration of the service"
                    />
                    {service.duration && (
                      <p className="text-sm font-normal text-gray-500">
                        {service.duration}m
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-light">{service.description}</p>
                  {service.subcategories && (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {service.subcategories.map((subcategory, subIndex) => (
                        <div className="flex flex-col gap-2" key={subIndex}>
                          <div className="flex items-center gap-1">
                            <Image
                              src={tick}
                              width={18}
                              height={18}
                              alt="subcategory indicator"
                            />
                            <p className="text-sm font-normal text-gray-500">
                              {subcategory.duration}m
                            </p>
                          </div>
                          <h4 className="w-[85%] text-xs">
                            {subcategory.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
      <div className=" flex justify-center p-4 lg:hidden">
        {[...Array(7).keys()].map((_, index) => (
          <div
            key={index}
            className={`mx-1 h-1 w-1 rounded-full ${
              currentIndex === index ? 'bg-[#d3b7ba]' : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default ServicesContainer
