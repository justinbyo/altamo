'use client';

import { useState, useEffect } from 'react';
import { OrderManager } from '../lib/orderManager';
import OrderManagerTest from './OrderManagerTest';

export default function DevPanel() {
  const [allOrders, setAllOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshOrders = () => {
    setAllOrders(OrderManager.getAllOrders());
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const clearAllOrders = () => {
    if (confirm('Clear all orders? This cannot be undone.')) {
      const orders = OrderManager.getAllOrders();
      orders.forEach(order => OrderManager.clearOrder(order.id));
      refreshOrders();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 z-50"
      >
        🛠️ Dev Panel
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-lg z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">Dev Panel</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={refreshOrders}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={clearAllOrders}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Orders ({allOrders.length}):
          </p>
          {allOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders found</p>
          ) : (
            <div className="space-y-2">
              {allOrders.map(order => (
                <div key={order.id} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="font-mono text-blue-600">{order.id}</div>
                  <div className="text-gray-600">
                    State: {order.state}
                  </div>
                  <div className="text-gray-600">
                    Building: {order.items?.length || 0} | 
                    Original: {order.originalItems?.length || 0} | 
                    Edit: {order.editItems?.length || 0}
                  </div>
                  <div className="text-gray-600">
                    Cart: {OrderManager.getCartItems(order).length} | 
                    All: {OrderManager.getAllItems(order).length} |
                    Total: ${OrderManager.calculateTotal(order).total.toFixed(2)}
                  </div>
                  <div className="text-gray-500">
                    {order.submittedAt ? `Submitted: ${new Date(order.submittedAt).toLocaleTimeString()}` : 'Not submitted'}
                  </div>
                  <button
                    onClick={() => OrderManager.debugOrder(order.id)}
                    className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Debug
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <OrderManagerTest />
        </div>
      </div>
    </div>
  );
}