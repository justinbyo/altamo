'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Payment from '../components/Payment';

export default function Checkout() {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [gratuity, setGratuity] = useState(15);
  
  // Check if we're in edit mode
  const isEditMode = searchParams.get('edit') !== null;
  console.log('Checkout page - searchParams:', searchParams);
  console.log('Checkout page - searchParams.get("edit"):', searchParams.get('edit'));
  console.log('Checkout page - isEditMode:', isEditMode);
  
  // Mock cart data - in a real app this would come from state management
  const cartItems = [
    { id: 'c1', name: 'Margarita', price: 12.00, quantity: 2 },
    { id: 'a1', name: 'Buffalo Wings', price: 12.00, quantity: 1 },
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gratuityAmount = subtotal * (gratuity / 100);
  const total = subtotal + gratuityAmount;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="checkout" isEditMode={isEditMode} />
      
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
                      <p className="font-medium text-gray-900">{item.name}</p>
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
                    onClick={() => setGratuity(percent)}
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
                onChange={(e) => setGratuity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom %"
              />
            </div>
          </div>
          
          <div>
            {isEditMode ? (
              // In edit mode, show locked payment method
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <span className="font-medium text-gray-900">Payment Already Processed</span>
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Gratuity ({gratuity}%)</span>
                  <span>${gratuityAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link 
                href="/summary"
                className="mt-6 block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                {isEditMode ? 'Update Order' : 'Submit Order'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
