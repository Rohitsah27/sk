import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <section className="py-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Image Skeleton */}
          <div className="relative">
            <div className="md:sticky md:top-24 bg-white p-8 rounded-lg flex flex-col gap-4 border">
              <Skeleton className="w-[400px] h-[400px] rounded-lg" />
              
              {/* Additional Images Skeleton */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 flex-shrink-0 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-4 h-4" />
              ))}
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}