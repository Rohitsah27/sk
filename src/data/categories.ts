// src/data/Categories.ts

export interface Category {
    id: number;
    title: string;
    image: string;
    price: string;
    originalPrice?: string;
    rating: number;
    reviews: number;
    category: string;
    slug: string;
    description?: string;
    specifications?: string[];
  }
  
  
  export const fetchCategories = async (): Promise<Category[]> => {
    // Use relative URL path instead of hardcoded hostname
    const res = await fetch('/api/categories');
    
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  };
//
  // export const fetchCategories = async (): Promise<Category[]> => {
  //   const baseUrl = 'https://sk-equipments.netlify.app'; // Hardcoded BASE_URL
  
  //   const res = await fetch(`${baseUrl}/api/categories`);
  //   if (!res.ok) {
  //     throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  //   }
  
  //   const data = await res.json();
  //   return data;
  // };
  
  
  export const getProductBySlug = async (slug: string): Promise<Category | undefined> => {
    const Categories = await fetchCategories();
    return Categories.find(product => product.slug === slug);
  };
  
  export const getFeaturedCategories = async (count: number = 4): Promise<Category[]> => {
    const Categories = await fetchCategories();
    return Categories.slice(0, count);
  };
  
  export const updateProduct = async (id: number, updatedProduct: Partial<Category>): Promise<Category | undefined> => {
    const Categories = await fetchCategories();
    const index = Categories.findIndex(product => product.id === id);
    if (index !== -1) {
      Categories[index] = { ...Categories[index], ...updatedProduct };
      return Categories[index];
    }
    return undefined;
  };
  