"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { fetchCategories } from '@/data/categories';

interface CategoryCardProps {
  image: string;
  title: string;
  href: string;
}

function CategoryCard({ image, title }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden group">
      <Link href={`/category/${title.toLowerCase().replace(/\s+/g, '-')}`} className="block relative">
        <CardContent className="p-0 relative">
          <Image
            src={image}
            alt={title}
            width={300}
            height={300}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
            <div className="w-full bg-black bg-opacity-50 text-white p-3">
              <h3 className="text-center font-medium">{title}</h3>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default function CategoriesSection() {
   const [categories, setCategories] = useState<Category[]>([]);
    
      useEffect(() => {
        const loadCategories = async () => {
          const data = await fetchCategories();
          setCategories(data);
        };
    
        loadCategories();
      }, []);


  return (
    <section className="py-10 bg-white">
      <div className="container-custom-2 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Best selling Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              title={category.title}
              image={category.image}
              
            />
          ))}
        </div>
      </div>
    </section>
  )
}
