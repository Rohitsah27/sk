"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PhoneCall, Mail, ChevronDown, Search, User, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Product, fetchProducts } from "@/data/products";
import { SubCategory, fetchSubCategories } from "@/data/subcategories";
import { Category, fetchCategories } from "@/data/categories";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (options: Record<string, unknown>, element: string): void;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/w20/gb.png'
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' },
    { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' },
    {code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
  ];

  // Initialize Google Translate
  useEffect(() => {
    setIsClient(true);
    
    const loadGoogleTranslate = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,de,es,fr,it,ja,zh,hi',
            autoDisplay: false
          } as Record<string, unknown>,
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      window.googleTranslateElementInit = loadGoogleTranslate;
    }

    return () => {
      const script = document.getElementById('google-translate-script');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, subCategoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSubCategories()
        ]);
        
        console.log('Fetched products:', productsData);
        console.log('Fetched categories:', categoriesData);
        console.log('Fetched subcategories:', subCategoriesData);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    const newLanguage = languages.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
    }
    setShowLanguageMenu(false);
    
    // Change Google Translate language
    const changeLanguage = () => {
      const googleFrame = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (googleFrame) {
        googleFrame.value = languageCode;
        googleFrame.dispatchEvent(new Event('change'));
      } else {
        setTimeout(changeLanguage, 100);
      }
    };
    changeLanguage();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // Correct easing function format
      }
    }
  }

  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] // Correct easing function format
      }
    }
  }

  // Get unique categories from products
  const mappedCategories = categories.map(category => ({
    id: category._id,
    name: category.title,
    image: category.image,
    slug: category.title.toLowerCase().replace(/\s+/g, '-')
  }));

  // Get subcategories for a category
  const getSubCategories = (categoryName: string) => {
    return subCategories
      .filter(subCat => subCat.category === categoryName)
      .map(subCat => ({
        name: subCat.title,
        slug: subCat.slug
      }));
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results.slice(0, 5))
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowResults(false)
      setShowMobileSearch(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false)
        setHoveredCategory(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    setSearchQuery('')
    setShowResults(false)
  }

  // Handle category navigation
  const handleCategoryClick = (slug: string, categoryName?: string) => {
    setIsCategoryOpen(false);
    setHoveredCategory(null);
    
    if (categoryName) {
      // Handle subcategory click
      router.push(`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}?subcategory=${slug}`);
    } else {
      // Handle main category click
      router.push(`/category/${slug}`);
    }
  };

  return (
    <div>
      hello
    </div>
  );
}