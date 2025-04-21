import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryCardProps {
  image: string;
  title: string;
  href: string;
}

function CategoryCard({ image, title, href }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden group">
      <Link href={href}>
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
  const categories = [
    {
      id: 1,
      title: "Fabrics Testing",
      image: "https://5.imimg.com/data5/SELLER/Default/2024/4/409839437/VY/RN/DU/2556085/rubbing-fastness-tester-500x500.jpg",
      href: "/category/mens-fashion"
    },
    {
      id: 2,
      title: "Testing Equipment",
      image: "https://5.imimg.com/data5/SELLER/Default/2021/10/KY/UZ/NU/2556085/toy-flammability-tester-500x500.jpg",
      href: "/category/womens-fashion"
    },
    {
      id: 3,
      title: "Textile Testing Equipments",
      image: "https://5.imimg.com/data5/SELLER/Default/2024/11/463278774/QE/CV/PH/2556085/martindale-abrasion-tester-500x500.jpeg",
      href: "/category/gadgets"
    },
    {
      id: 4,
      title: "Cosmetic Testing Equipment",
      image: "https://5.imimg.com/data5/SELLER/Default/2023/11/362756854/PX/CJ/NC/2556085/box-compression-tester-500x500.jpg",
      href: "/category/cosmetics"
    },
    {
      id: 5,
      title: "Paper Testing Equipment",
      image: "https://3.imimg.com/data3/AD/MW/MY-2556085/cobb-sizing-tester-250x250.jpg",
      href: "/category/mens-fashion"
    }
  ]

  return (
    <section className="py-10 bg-white">
      <div className="container-custom-2 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Best selling Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
