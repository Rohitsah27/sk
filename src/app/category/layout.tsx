import { generateStaticParams } from '@/data/products';

export async function generateStaticParams() {
  const params = await generateStaticParams();
  return params;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}