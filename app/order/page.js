'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import ProductList from '../components/ProductList';
import DevPanel from '../components/DevPanel';
import { productCategories, searchProducts } from '../data/products';
import { OrderManager } from '../lib/orderManager';

export default function Order() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // Check if we're in edit mode
  const isEditMode = searchParams.get('edit') !== null;
  const orderIdParam = searchParams.get('order');
  
  const filteredCategories = searchQuery ? searchProducts(searchQuery) : productCategories;
  
  // Initialize or load order
  useEffect(() => {
    let id = orderIdParam;
    
    if (!id) {
      // Create new order if none exists
      id = OrderManager.generateOrderId();
      setOrderId(id);
      // Update URL with new order ID
      const newUrl = new URLSearchParams(searchParams);
      newUrl.set('order', id);
      router.replace(`/order?${newUrl.toString()}`, { scroll: false });
    } else {
      setOrderId(id);
    }
    
    // Load or create order
    let order = OrderManager.getOrder(id);
    if (!order) {
      order = OrderManager.createOrder(id);
    }
    
    setCurrentOrder(order);
  }, [orderIdParam, searchParams, router]);

  const handleAddToCart = (product, quantity = 1) => {
    if (!orderId || quantity <= 0) return;
    
    console.log(`=== Adding item to cart ===`);
    console.log(`Product: ${product.name}, Quantity: ${quantity}, Edit Mode: ${isEditMode}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Current order state:`, currentOrder?.state);
    console.log(`Current session items count:`, OrderManager.getCurrentSessionItems(currentOrder).length);
    console.log(`All items count:`, OrderManager.getAllItems(currentOrder).length);
    
    const newItems = [{
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: product.category
    }];
    
    const updatedOrder = OrderManager.addItems(orderId, newItems, isEditMode);
    if (updatedOrder) {
      setCurrentOrder(updatedOrder);
      console.log(`✅ Successfully added. New session count:`, OrderManager.getCurrentSessionItems(updatedOrder).length);
      console.log(`✅ Successfully added. Total count:`, OrderManager.getAllItems(updatedOrder).length);
    } else {
      console.error(`❌ Failed to add item`);
    }
  };
  
  // Get cart count for navigation (use current session items for better edit mode UX)
  const cartItemCount = currentOrder ? OrderManager.getCurrentSessionItems(currentOrder).length : 0;
  
  if (!currentOrder) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading order...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage="order" 
        cartItemCount={cartItemCount}
        onSearchChange={setSearchQuery}
        isEditMode={isEditMode}
        orderId={orderId}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Add additional items to your existing order' : 'Browse our menu and add items to your order'}
          </p>
          
          {/* Order Status Info for development */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-800">
              Order: {currentOrder.id} | State: {currentOrder.state} | 
              Items: {OrderManager.getCartItems(currentOrder).length}
              {isEditMode && ' | Edit Mode Active'}
            </p>
          </div>
        </div>
        
        <ProductList 
          categories={filteredCategories}
          onAddToCart={handleAddToCart}
        />
      </main>
      
      <DevPanel />
    </div>
  );
}