'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Payment from '../components/Payment';
import { OrderManager } from '../lib/orderManager';

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [gratuity, setGratuity] = useState(15);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  // Get order info from URL
  const isEditMode = searchParams.get('edit') !== null;
  const orderIdParam = searchParams.get('order');
  
  // Load order data
  useEffect(() => {
    if (!orderIdParam) {
      router.push('/order');
      return;
    }
    
    const order = OrderManager.getOrder(orderIdParam);
    if (!order) {
      router.push('/order');
      return;
    }
    
    setCurrentOrder(order);
    setGratuity(order.gratuity || 15);
    setPaymentMethod(order.payment.method || 'card');
  }, [orderIdParam, router]);
  
  const handleGratuityChange = (newGratuity) => {
    if (newGratuity !== gratuity) {
      console.log(`💰 User changed gratuity from ${gratuity}% to ${newGratuity}%`);
      setGratuity(newGratuity);
    }
  };

  const handleSubmitOrder = () => {
    if (!currentOrder) return;
    
    const updatedOrder = OrderManager.submitOrder(currentOrder.id, paymentMethod, gratuity);
    if (updatedOrder) {
      const params = new URLSearchParams();
      params.set('order', updatedOrder.id);
      router.push(`/summary?${params.toString()}`);
    }
  };
  
  if (!currentOrder) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading order...</div>
    </div>;
  }
  
  // Use getCartItems for build state, getAllItems for submitted/editing states
  const cartItems = currentOrder.state === 'building' 
    ? OrderManager.getCartItems(currentOrder) 
    : OrderManager.getAllItems(currentOrder);
  const totals = OrderManager.calculateTotal({ ...currentOrder, gratuity });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage="checkout" 
        isEditMode={isEditMode} 
        orderId={currentOrder.id}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Order' : 'Checkout'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Order</h2>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.name}
                        {item.isNew && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">NEW</span>}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gratuity</h2>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[15, 18, 20, 25].map(percent => (
                  <button
                    key={percent}
                    onClick={() => handleGratuityChange(percent)}
                    className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                      gratuity === percent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={gratuity}
                onChange={(e) => handleGratuityChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom %"
              />
            </div>
          </div>
          
          <div>
{currentOrder.payment.isLocked || isEditMode ? (
              // In edit mode or payment locked, show locked payment method
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <span className="font-medium text-gray-900">
                      {currentOrder.payment.method === 'card' 
                        ? `Card ending in ${currentOrder.payment.lastFour}` 
                        : 'Cash Payment'
                      }
                    </span>
                    <p className="text-sm text-gray-600">Payment method cannot be changed after order submission</p>
                  </div>
                </div>
              </div>
            ) : (
              // Normal mode, allow payment method selection
              <Payment 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Gratuity ({gratuity}%)</span>
                  <span>${totals.gratuityAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmitOrder}
                className="mt-6 block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                {isEditMode ? 'Update Order' : 'Submit Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
