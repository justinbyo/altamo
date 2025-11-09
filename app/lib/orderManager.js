// Order management utility for handling persistent order state
export class OrderManager {
  // Configuration
  static CONFIG = {
    MAX_ITEMS_PER_ORDER: null, // null = no limit, set to number for limit
    MAX_QUANTITY_PER_ITEM: 99
  };
  
  // Generate a new order ID
  static generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substring(2, 11).toUpperCase();
  }
  
  // Get order from localStorage
  static getOrder(orderId) {
    if (!orderId || typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`order-${orderId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading order:', error);
      return null;
    }
  }
  
  // Save order to localStorage
  static saveOrder(orderId, orderData) {
    if (typeof window === 'undefined') return;
    try {
      const dataToSave = {
        ...orderData,
        lastUpdated: new Date().toISOString()
      };
      const serializedData = JSON.stringify(dataToSave);
      console.log(`Saving order ${orderId}, size: ${serializedData.length} chars`);
      localStorage.setItem(`order-${orderId}`, serializedData);
      console.log(`✅ Successfully saved order ${orderId}`);
    } catch (error) {
      console.error('❌ Error saving order:', error);
      console.error('Order data that failed to save:', orderData);
      
      // Try to provide more specific error info
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Current storage:');
        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length;
          }
        }
        console.error(`Total localStorage size: ${totalSize} chars`);
      }
    }
  }
  
  // Create a new order
  static createOrder(orderId) {
    const order = {
      id: orderId,
      state: 'building', // building -> submitted -> editing
      items: [], // Current items being built
      originalItems: [], // Items from initial submission
      editItems: [], // Items added during edits
      payment: { 
        method: null, 
        isLocked: false,
        lastFour: null 
      },
      gratuity: 15,
      createdAt: new Date().toISOString(),
      submittedAt: null
    };
    this.saveOrder(orderId, order);
    return order;
  }
  
  // Add items to order (different behavior for edit vs normal mode)
  static addItems(orderId, newItems, isEditMode = false) {
    const order = this.getOrder(orderId);
    if (!order) return null;
    
    // Check item limits if configured
    if (this.CONFIG.MAX_ITEMS_PER_ORDER) {
      const currentItemCount = this.getAllItems(order).length;
      const newItemCount = newItems.length;
      if (currentItemCount + newItemCount > this.CONFIG.MAX_ITEMS_PER_ORDER) {
        console.warn(`Cannot add ${newItemCount} items. Would exceed limit of ${this.CONFIG.MAX_ITEMS_PER_ORDER}`);
        return order; // Return unchanged order
      }
    }
    
    const itemsToAdd = newItems.map(item => ({
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique IDs
      addedAt: new Date().toISOString(),
      isNew: isEditMode // Mark items added in edit mode
    }));
    
    console.log(`Adding ${itemsToAdd.length} items to order ${orderId} (edit mode: ${isEditMode})`);
    console.log('Items to add:', itemsToAdd);
    console.log('Order state before:', order.state);
    console.log('Current items before:', order.items?.length || 0);
    console.log('Current editItems before:', order.editItems?.length || 0);
    
    if (isEditMode && (order.state === 'submitted' || order.state === 'editing')) {
      // Handle edit mode for both submitted and already-editing orders
      order.editItems = [...(order.editItems || []), ...itemsToAdd];
      order.state = 'editing';
      console.log('✅ Added to editItems array');
    } else {
      // Handle building mode
      order.items = [...(order.items || []), ...itemsToAdd];
      console.log('✅ Added to items array');
    }
    
    console.log('Current items after:', order.items?.length || 0);
    console.log('Current editItems after:', order.editItems?.length || 0);
    console.log('Order state after:', order.state);
    
    this.saveOrder(orderId, order);
    return order;
  }
  
  // Submit order (moves items to originalItems, locks payment)
  static submitOrder(orderId, paymentMethod, gratuity) {
    const order = this.getOrder(orderId);
    if (!order) return null;
    
    console.log(`💰 Submitting order ${orderId} with gratuity: ${gratuity}%`);
    
    if (order.state === 'building') {
      // First submission
      order.state = 'submitted';
      order.originalItems = [...order.items];
      order.items = []; // Clear temp items
      order.payment = { 
        method: paymentMethod, 
        isLocked: true,
        lastFour: paymentMethod === 'card' ? '1234' : null
      };
      
      // Log gratuity setting
      const oldGratuity = order.gratuity || 15;
      if (oldGratuity !== gratuity) {
        console.log(`Gratuity updated from ${oldGratuity}% to ${gratuity}%`);
      }
      order.gratuity = gratuity;
      order.submittedAt = new Date().toISOString();
    } else if (order.state === 'editing') {
      // Update existing order
      const oldGratuity = order.gratuity || 15;
      if (oldGratuity !== gratuity) {
        console.log(`Gratuity updated from ${oldGratuity}% to ${gratuity}%`);
      }
      order.gratuity = gratuity;
      // Keep edit items as permanent additions
    }
    
    this.saveOrder(orderId, order);
    return order;
  }
  
  // Get all items (original + edit items)
  static getAllItems(order) {
    if (!order) return [];
    return [
      ...(order.originalItems || []),
      ...(order.editItems || [])
    ];
  }
  
  // Get current cart items (items being built)
  static getCartItems(order) {
    if (!order) return [];
    if (order.state === 'building') {
      return order.items || [];
    }
    return this.getAllItems(order);
  }
  
  // Get items for current editing session (for cart count in edit mode)
  static getCurrentSessionItems(order) {
    if (!order) return [];
    if (order.state === 'building') {
      return order.items || [];
    }
    // In edit mode, only show the new items being added in this session
    return order.editItems || [];
  }
  
  // Update gratuity with logging
  static updateGratuity(orderId, newGratuity) {
    const order = this.getOrder(orderId);
    if (!order) return null;
    
    const oldGratuity = order.gratuity || 15;
    if (oldGratuity !== newGratuity) {
      console.log(`💰 Gratuity changed from ${oldGratuity}% to ${newGratuity}%`);
      order.gratuity = newGratuity;
      this.saveOrder(orderId, order);
    }
    
    return order;
  }
  
  // Calculate order totals
  static calculateTotal(order) {
    if (!order) return { subtotal: 0, gratuityAmount: 0, total: 0 };
    
    // Use appropriate items based on order state
    const items = order.state === 'building' 
      ? this.getCartItems(order) 
      : this.getAllItems(order);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gratuityAmount = subtotal * ((order.gratuity || 0) / 100);
    const total = subtotal + gratuityAmount;
    
    console.log(`📊 Calculating total - Subtotal: $${subtotal.toFixed(2)}, Gratuity (${order.gratuity || 0}%): $${gratuityAmount.toFixed(2)}, Total: $${total.toFixed(2)}`);
    
    return { 
      subtotal: Number(subtotal.toFixed(2)), 
      gratuityAmount: Number(gratuityAmount.toFixed(2)), 
      total: Number(total.toFixed(2))
    };
  }
  
  // Clear order data (for testing)
  static clearOrder(orderId) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`order-${orderId}`);
    }
  }
  
  // Debug: List all orders
  static getAllOrders() {
    if (typeof window === 'undefined') return [];
    const orders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('order-')) {
        try {
          const order = JSON.parse(localStorage.getItem(key));
          orders.push(order);
        } catch (error) {
          console.error('Error parsing order:', key, error);
        }
      }
    }
    return orders;
  }
  
  // Debug: Get detailed order info
  static debugOrder(orderId) {
    const order = this.getOrder(orderId);
    if (!order) {
      console.log(`Order ${orderId} not found`);
      return null;
    }
    
    console.log(`=== ORDER DEBUG: ${orderId} ===`);
    console.log(`State: ${order.state}`);
    console.log(`Building items (${order.items?.length || 0}):`, order.items);
    console.log(`Original items (${order.originalItems?.length || 0}):`, order.originalItems);
    console.log(`Edit items (${order.editItems?.length || 0}):`, order.editItems);
    console.log(`Cart items:`, this.getCartItems(order));
    console.log(`All items:`, this.getAllItems(order));
    console.log(`Payment:`, order.payment);
    console.log(`Full order:`, order);
    
    return order;
  }
}