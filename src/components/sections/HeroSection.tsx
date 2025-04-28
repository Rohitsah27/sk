'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import hero from '@/images/hero-img.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Reset positions before animating
    gsap.set([contentRef.current, contentRef.current?.querySelector('h1'), 
             contentRef.current?.querySelector('p'), imageRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(imageRef.current, { scale: 0.8 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        // Add this to prevent conflicts with client-side navigation
        markers: false,
        id: 'hero-animation'
      }
    });

    // Content animation
    tl.to(contentRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8
    })
    .to(contentRef.current?.querySelector('h1'), {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, '-=0.4')
    .to(contentRef.current?.querySelector('p'), {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, '-=0.3')
    .to(imageRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.9,
      ease: 'back.out(1.7)'
    }, '-=0.7');

    return () => {
      // Proper cleanup
      ScrollTrigger.getById('hero-animation')?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="py-10 bg-blue-50 z-5 overflow-hidden" ref={heroRef}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8" ref={contentRef}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Leading Manufacturer of <span className="text-red-500">High-Quality</span> Testing Equipments
            </h1>
            <p className="text-gray-600 mb-6">
              Discover high-efficiency testing equipment designed to meet modern industry standards and your exact needs.
            </p>
            <Button
              asChild
              className="bonik-btn-primary px-5 py-3 rounded-xl font-medium tracking-wide shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3" ref={imageRef}>
            <Image
              src={hero}
              alt="Testing Equipment"
              width={300}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}