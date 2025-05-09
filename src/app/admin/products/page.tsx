"use client";

import { Category, fetchCategories } from '@/data/categories';
import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload } from 'react-icons/fi';

interface Product {
  _id: string;
  title: string;
  image: string;
  price?: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
  description?: string;
  specifications?: string[];
  isBestSelling?: boolean;
  isFeatured?: boolean;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    title: '',
    image: '',
    price: undefined,
    rating: 3,
    reviews: 0,
    category: '',
    slug: '',
    description: '',
    specifications: [],
    isBestSelling: false,
    isFeatured: false
  });
  const [newSpecification, setNewSpecification] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProductFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: name === 'rating' || name === 'reviews' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Image upload failed');
      setProductFormData(prev => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Image upload failed');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = async (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      ...product,
      specifications: product.specifications || []
    });

    if (product.image) {
      try {
        if (product.image.startsWith('data:')) {
          setImagePreview(product.image);
        } else {
          const response = await fetch(product.image);
          if (response.ok) {
            const blob = await response.blob();
            setImagePreview(URL.createObjectURL(blob));
          }
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setImagePreview('/placeholder-product.png');
      }
    } else {
      setImagePreview(null);
    }

    setIsAddingProduct(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductFormData({
      title: '',
      image: '',
      price: undefined,
      rating: 3,
      reviews: 0,
      category: '',
      slug: '',
      description: '',
      specifications: [],
      isBestSelling: false,
      isFeatured: false
    });
    setImagePreview(null);
  };

  const handleAddSpecification = () => {
    if (!newSpecification.trim()) return;
    setProductFormData(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), newSpecification.trim()]
    }));
    setNewSpecification('');
  };

  const handleRemoveSpecification = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddBulletPoint = () => {
    const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement | null;
    if (textarea) {
      const { selectionStart, selectionEnd } = textarea;
      const value = textarea.value;
      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionEnd);

      const updatedDescription = `${beforeCursor}• ${afterCursor}`;
      setProductFormData(prev => ({
        ...prev,
        description: updatedDescription
      }));

      // Update cursor position after the bullet point
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        textarea.focus();
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!productFormData.title || !productFormData.category) {
        setError('Please fill in all required fields');
        return;
      }

      const method = isAddingProduct ? 'POST' : 'PUT';
      const response = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const result = await response.json();
      if (isAddingProduct) {
        setProducts([...products, result]);
      } else {
        setProducts(products.map(p => p._id === result._id ? result : p));
      }

      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductFormData({
        title: '',
        image: '',
        price: undefined,
        rating: 3,
        reviews: 0,
        category: '',
        slug: '',
        description: '',
        specifications: [],
        isBestSelling: false,
        isFeatured: false
      });
      setImagePreview(null);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductFormData({
      title: '',
      image: '',
      price: undefined,
      rating: 3,
      reviews: 0,
      category: '',
      slug: '',
      description: '',
      specifications: [],
      isBestSelling: false,
      isFeatured: false
    });
    setImagePreview(null);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and search */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button onClick={handleAddNewClick} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <FiPlus /> Add New Product
          </button>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Product Form */}
      {(isAddingProduct || editingProduct) && (
        <div className="mt-8 mb-10 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAddingProduct ? 'Add New Product' : `Edit Product: ${editingProduct?.title}`}
            </h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={productFormData.title || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
  <input
    type="text"
    name="slug"
    value={productFormData.slug || ''}
    onChange={(e) => {
      const capitalizeWords = (str: string) => {
        return str
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      const formattedValue = capitalizeWords(e.target.value);

      setProductFormData(prev => ({
        ...prev,
        slug: formattedValue,
      }));
    }}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    required
  />
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <div className="space-y-2">
                    <div>
                      <input
                        type="checkbox"
                        id="isBestSelling"
                        name="isBestSelling"
                        checked={productFormData.isBestSelling || false}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      <label htmlFor="isBestSelling" className="text-sm text-gray-700">Best Selling Product</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={productFormData.isFeatured || false}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      <label htmlFor="isFeatured" className="text-sm text-gray-700">Featured Product</label>
                    </div>

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    name="category"
                    value={productFormData.category || ''}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={productFormData.rating || 3}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1" max="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                    <input
                      type="number"
                      name="reviews"
                      value={productFormData.reviews || 0}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUpload size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                        <FiUpload className="mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={productFormData.image || ''}
                        onChange={handleFormChange}
                        placeholder="Or enter image URL"
                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button
                      type="button"
                      onClick={handleAddBulletPoint}
                      className="text-sm text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-slate-200 py-1 px-2 rounded-lg transition-colors"
                    >
                      Add Bullet
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={productFormData.description || ''}
                    onChange={handleFormChange}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecification}
                  onChange={(e) => setNewSpecification(e.target.value)}
                  placeholder="Add new specification"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {productFormData.specifications?.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                disabled={isUploading}
              >
                {isAddingProduct ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image || '/placeholder-product.png'}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}