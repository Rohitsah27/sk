import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import ProductsSection from '@/components/sections/ProductsSection'
import PromoBannersSection from '@/components/sections/PromoBannersSection'
import BigSaleBanner from '@/components/sections/BigSaleBanner'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductsSection title="Best Selling Products" />
      <PromoBannersSection />
      <ProductsSection title="Featured Products" />
      <BigSaleBanner />
    </Layout>
  )
}
