import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Image Skeleton */}
        <div className="relative">
          <div className="md:sticky md:top-24 bg-white p-8 rounded-lg flex flex-col gap-4 border">
            <Skeleton className="aspect-square w-full" />

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
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  );
}