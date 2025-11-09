'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderManager } from '../lib/orderManager';

export default function Summary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const orderIdParam = searchParams.get('order');
  
  useEffect(() => {
    if (!orderIdParam) {
      router.push('/order');
      return;
    }
    
    const order = OrderManager.getOrder(orderIdParam);
    if (!order || order.state === 'building') {
      router.push('/order');
      return;
    }
    
    setCurrentOrder(order);
  }, [orderIdParam, router]);
  
  if (!currentOrder) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading order...</div>
    </div>;
  }
  
  const orderItems = OrderManager.getAllItems(currentOrder);
  const totals = OrderManager.calculateTotal(currentOrder);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
          <p className="text-gray-600 mb-4">Your order has been received</p>
          <p className="text-sm text-gray-500">Order Number: <span className="font-mono font-medium">{currentOrder.id}</span></p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Details</h3>
          <div className="space-y-3">
            {orderItems.map(item => (
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
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment & Gratuity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Payment Method</span>
              <span className="font-medium text-gray-900">
                {currentOrder.payment.method === 'card' 
                  ? `Credit Card ending in ${currentOrder.payment.lastFour}` 
                  : 'Cash Payment'
                }
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Gratuity ({currentOrder.gratuity}%)</span>
              <span>${totals.gratuityAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link 
            href={`/order?edit=order&order=${currentOrder.id}`}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Edit Order
          </Link>
          <Link 
            href={`/checkout?edit=payment&order=${currentOrder.id}`}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Change Payment/Gratuity
          </Link>
        </div>
      </main>
    </div>
  );
}
