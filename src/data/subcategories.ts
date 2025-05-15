// src/data/subcategories.ts

export interface SubCategory {
  id: number;
  title: string;
  slug: string;
  category: string; // This should match the parent category's title
  image?: string;
  description?: string;
  specifications?: string[];
}

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  // Use relative URL path instead of hardcoded hostname
  const res = await fetch('/api/subcategories');
  
  if (!res.ok) {
    throw new Error(`Failed to fetch subcategories: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data;
};

// Alternative with hardcoded URL (commented out)
// export const fetchSubCategories = async (): Promise<SubCategory[]> => {
//   const baseUrl = 'https://sk-equipments.netlify.app'; // Hardcoded BASE_URL
//   const res = await fetch(`${baseUrl}/api/subcategories`);
//   if (!res.ok) {
//     throw new Error(`Failed to fetch subcategories: ${res.status} ${res.statusText}`);
//   }
//   const data = await res.json();
//   return data;
// };

export const getSubCategoryBySlug = async (slug: string): Promise<SubCategory | undefined> => {
  const subCategories = await fetchSubCategories();
  return subCategories.find(subCat => subCat.slug === slug);
};

export const getSubCategoriesByCategory = async (categoryTitle: string): Promise<SubCategory[]> => {
  const subCategories = await fetchSubCategories();
  return subCategories.filter(subCat => subCat.category === categoryTitle);
};

export const getFeaturedSubCategories = async (count: number = 4): Promise<SubCategory[]> => {
  const subCategories = await fetchSubCategories();
  return subCategories.slice(0, count);
};

export const updateSubCategory = async (id: number, updatedSubCategory: Partial<SubCategory>): Promise<SubCategory | undefined> => {
  const subCategories = await fetchSubCategories();
  const index = subCategories.findIndex(subCat => subCat.id === id);
  if (index !== -1) {
    subCategories[index] = { ...subCategories[index], ...updatedSubCategory };
    return subCategories[index];
  }
  return undefined;
};