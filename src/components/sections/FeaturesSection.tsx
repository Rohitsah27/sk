import type React from 'react'
import { Truck, RefreshCw, Clock, CreditCard } from 'lucide-react'

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  return (
    <div className="flex items-center p-2 mt-2 border-b border-gray-200 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="mr-4 text-white">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-white">{description}</p>
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="py-2 pt-0 bg-red-500">
      <div className="container-custom-2 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureBox
            icon={<Truck size={24} />}
            title="Quick Dispatch"
            description="Ready to Ship in 2-5 Days"
          />
          <FeatureBox
            icon={<RefreshCw size={24} />}
            title="Quality Assurance"
            description="7-Day Product Replacement Guarantee"
          />
          <FeatureBox
            icon={<Clock size={24} />}
            title="Free Support"
            description="365 Days of Technical Assistance"
          />
          <FeatureBox
            icon={<CreditCard size={24} />}
            title="Secure Payments"
            description="100% Safe Transactions – GST Invoicing Available"
          />
        </div>
      </div>
    </section>
  )
}
