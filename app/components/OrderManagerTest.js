'use client';

import { useState } from 'react';
import { OrderManager } from '../lib/orderManager';

export default function OrderManagerTest() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: Date.now() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Create order
      const orderId = OrderManager.generateOrderId();
      addTestResult('Create Order', 'RUNNING', `ID: ${orderId}`);
      
      const order = OrderManager.createOrder(orderId);
      if (order && order.state === 'building') {
        addTestResult('Create Order', 'PASS', `Order created with state: ${order.state}`);
      } else {
        addTestResult('Create Order', 'FAIL', 'Order not created properly');
        return;
      }

      // Test 2: Add multiple items in building state
      addTestResult('Add Items (Building)', 'RUNNING', 'Adding 5 items...');
      
      for (let i = 1; i <= 5; i++) {
        const items = [{
          id: `test-item-${i}`,
          name: `Test Item ${i}`,
          price: 10.00,
          quantity: 1
        }];
        
        const updatedOrder = OrderManager.addItems(orderId, items, false);
        if (!updatedOrder) {
          addTestResult('Add Items (Building)', 'FAIL', `Failed to add item ${i}`);
          return;
        }
      }
      
      const orderAfterBuilding = OrderManager.getOrder(orderId);
      const buildingItems = OrderManager.getCartItems(orderAfterBuilding);
      
      if (buildingItems.length === 5) {
        addTestResult('Add Items (Building)', 'PASS', `Successfully added 5 items. Cart has ${buildingItems.length} items`);
      } else {
        addTestResult('Add Items (Building)', 'FAIL', `Expected 5 items, got ${buildingItems.length}`);
        return;
      }

      // Test 3: Submit order
      addTestResult('Submit Order', 'RUNNING', 'Submitting order...');
      
      const submittedOrder = OrderManager.submitOrder(orderId, 'card', 15);
      if (submittedOrder && submittedOrder.state === 'submitted') {
        const originalItems = submittedOrder.originalItems || [];
        addTestResult('Submit Order', 'PASS', `Order submitted. Original items: ${originalItems.length}`);
      } else {
        addTestResult('Submit Order', 'FAIL', 'Order submission failed');
        return;
      }

      // Test 4: Add items in edit mode
      addTestResult('Add Items (Edit)', 'RUNNING', 'Adding 5 items in edit mode...');
      
      for (let i = 6; i <= 10; i++) {
        const items = [{
          id: `test-edit-item-${i}`,
          name: `Edit Item ${i}`,
          price: 15.00,
          quantity: 1
        }];
        
        const updatedOrder = OrderManager.addItems(orderId, items, true);
        if (!updatedOrder) {
          addTestResult('Add Items (Edit)', 'FAIL', `Failed to add edit item ${i}`);
          return;
        }
        
        // Log progress for each item
        const editItemsCount = updatedOrder.editItems?.length || 0;
        console.log(`Added edit item ${i}, total edit items: ${editItemsCount}`);
      }
      
      const finalOrder = OrderManager.getOrder(orderId);
      const allItems = OrderManager.getAllItems(finalOrder);
      const editItems = finalOrder.editItems || [];
      
      if (allItems.length === 10 && editItems.length === 5) {
        addTestResult('Add Items (Edit)', 'PASS', `Successfully added 5 edit items. Total: ${allItems.length}, Edit: ${editItems.length}`);
      } else {
        addTestResult('Add Items (Edit)', 'FAIL', `Expected 10 total (5 edit), got ${allItems.length} total (${editItems.length} edit)`);
      }

      // Test 5: Verify calculations
      addTestResult('Calculate Totals', 'RUNNING', 'Checking calculations...');
      
      const totals = OrderManager.calculateTotal(finalOrder);
      const expectedSubtotal = (5 * 10.00) + (5 * 15.00); // 125.00
      
      if (Math.abs(totals.subtotal - expectedSubtotal) < 0.01) {
        addTestResult('Calculate Totals', 'PASS', `Subtotal correct: $${totals.subtotal} (expected $${expectedSubtotal})`);
      } else {
        addTestResult('Calculate Totals', 'FAIL', `Subtotal wrong: $${totals.subtotal} (expected $${expectedSubtotal})`);
      }
      
      // Cleanup
      OrderManager.clearOrder(orderId);
      addTestResult('Cleanup', 'PASS', 'Test order removed');
      
    } catch (error) {
      addTestResult('Test Runner', 'ERROR', error.message);
      console.error('Test error:', error);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">OrderManager Tests</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm">No tests run yet</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <span className={`font-mono px-2 py-1 rounded text-xs ${
                result.result === 'PASS' ? 'bg-green-100 text-green-800' :
                result.result === 'FAIL' ? 'bg-red-100 text-red-800' :
                result.result === 'ERROR' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {result.result}
              </span>
              <div className="flex-1">
                <div className="font-medium">{result.test}</div>
                {result.details && <div className="text-gray-600">{result.details}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}