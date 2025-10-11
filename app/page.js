'use client';

import { useState } from 'react';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import { productCategories, searchProducts } from './data/products';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  
  const filteredCategories = searchQuery ? searchProducts(searchQuery) : productCategories;
  
  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage="home" 
        cartItemCount={cart.length}
        onSearchChange={setSearchQuery}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600 mt-2">Browse our menu and add items to your order</p>
        </div>
        
        <ProductList 
          categories={filteredCategories}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}
