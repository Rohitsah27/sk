import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import hero from '@/images/hero-img.png'

export default function HeroSection() {
  return (
    <section className="py-10 bg-blue-50 z-5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Leading Manufacturer of <span className="text-red-500">High-Quality</span> Testing Equipments
            </h1>
            <p className="text-gray-600 mb-6">
            Discover high-efficiency testing equipment designed to meet modern industry standards and your exact needs.
            </p>
            <Button asChild className="bonik-btn-primary">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3">
            <Image
              // src="https://ext.same-assets.com/4117257200/3114575549.png"
              src={hero}
              alt="Fashionable Bag"
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
