import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/data/products'

interface ProductCardProps extends Product {}

export default function ProductCard({
  id,
  title,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  category,
  slug
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
      <div className="relative group">
        <Link href={`/product/${slug}`}>
          <div className="overflow-hidden bg-white">
            <Image
              src={image}
              alt={title}
              width={300}
              height={300}
              className="w-full h-[220px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-100"
        >
          <Heart size={18} className="text-gray-600 hover:text-[hsl(var(--bonik-pink))]" />
        </Button> */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <Button 
            size="sm" 
            className="bg-[hsl(var(--bonik-blue))/90] hover:bg-[hsl(var(--bonik-blue))/90] text-white border-none shadow-none"
          >
            <ShoppingCart size={16} className="mr-2" />
            Quick View
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link 
          href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
          className="text-sm text-gray-500 mb-1 hover:text-[hsl(var(--bonik-blue))] transition-colors"
        >
          {category}
        </Link>
        <Link href={`/product/${slug}`} className="block">
          <h3 className="font-medium text-gray-800 hover:text-[hsl(var(--bonik-pink))] transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({reviews})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg text-gray-900">
              ₹{price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
          {/* <Button 
            variant="outline" 
            className="w-full mt-3 border-[hsl(var(--bonik-blue))] text-[hsl(var(--bonik-blue))] hover:bg-[hsl(var(--bonik-blue))] hover:text-white"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}