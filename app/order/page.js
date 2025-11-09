'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '../components/Navigation';
import ProductList from '../components/ProductList';
import { productCategories, searchProducts } from '../data/products';

export default function Order() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  
  // Check if we're in edit mode
  const isEditMode = searchParams.get('edit') !== null;
  
  const filteredCategories = searchQuery ? searchProducts(searchQuery) : productCategories;
  
  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage="order" 
        cartItemCount={cart.length}
        onSearchChange={setSearchQuery}
        isEditMode={isEditMode}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Add additional items to your existing order' : 'Browse our menu and add items to your order'}
          </p>
        </div>
        
        <ProductList 
          categories={filteredCategories}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}