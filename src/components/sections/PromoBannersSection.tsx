
"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function PromoBannersSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Our Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Leather Testing Equipment</h3>
              <p className="text-gray-600 mb-4">
                Professional equipment for quality control and research
              </p>
              <Button>View Details</Button>
            </div>
          </div>
          
          <div className="group bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                FEATURED
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Lab Testing Solutions</h3>
              <p className="text-gray-600 mb-4">
                Cutting-edge instruments for precise laboratory analysis
              </p>
              <Button>View Details</Button>
            </div>
          </div>
          
          <div className="group bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Textile Testing Equipment</h3>
              <p className="text-gray-600 mb-4">
                Special offers on selected textile testing machines
              </p>
              <Button>View Details</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
