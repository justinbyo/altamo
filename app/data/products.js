// Dummy menu data organized by category
export const productCategories = [
  {
    id: 'cocktails',
    name: 'Cocktails',
    items: [
      { id: 'c1', name: 'Margarita', description: 'Classic lime margarita with salt rim', price: 12.00 },
      { id: 'c2', name: 'Old Fashioned', description: 'Bourbon, bitters, orange twist', price: 14.00 },
      { id: 'c3', name: 'Mojito', description: 'Rum, mint, lime, soda', price: 11.00 },
    ]
  },
  {
    id: 'beer',
    name: 'Beer',
    items: [
      { id: 'b1', name: 'IPA', description: 'Local craft IPA', price: 8.00 },
      { id: 'b2', name: 'Lager', description: 'Crisp pilsner lager', price: 7.00 },
      { id: 'b3', name: 'Stout', description: 'Dark chocolate stout', price: 9.00 },
    ]
  },
  {
    id: 'wine',
    name: 'Wine',
    items: [
      { id: 'w1', name: 'Cabernet Sauvignon', description: 'Full-bodied red wine', price: 10.00 },
      { id: 'w2', name: 'Chardonnay', description: 'Buttery white wine', price: 9.00 },
      { id: 'w3', name: 'Pinot Noir', description: 'Light red wine', price: 11.00 },
    ]
  },
  {
    id: 'appetizers',
    name: 'Appetizers',
    items: [
      { id: 'a1', name: 'Buffalo Wings', description: 'Spicy chicken wings with ranch', price: 12.00 },
      { id: 'a2', name: 'Mozzarella Sticks', description: 'Fried cheese with marinara', price: 9.00 },
      { id: 'a3', name: 'Calamari', description: 'Fried squid with lemon aioli', price: 13.00 },
    ]
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    items: [
      { id: 's1', name: 'Club Sandwich', description: 'Turkey, bacon, lettuce, tomato', price: 14.00 },
      { id: 's2', name: 'Burger', description: 'Beef patty with cheese and fries', price: 16.00 },
      { id: 's3', name: 'BLT', description: 'Bacon, lettuce, tomato on toast', price: 12.00 },
    ]
  },
  {
    id: 'pizza',
    name: 'Pizza',
    items: [
      { id: 'p1', name: 'Margherita', description: 'Tomato, mozzarella, basil', price: 15.00 },
      { id: 'p2', name: 'Pepperoni', description: 'Classic pepperoni pizza', price: 17.00 },
      { id: 'p3', name: 'Vegetarian', description: 'Bell peppers, onions, mushrooms', price: 16.00 },
    ]
  },
  {
    id: 'entrees',
    name: 'Entrees',
    items: [
      { id: 'e1', name: 'Grilled Salmon', description: 'Atlantic salmon with vegetables', price: 24.00 },
      { id: 'e2', name: 'Ribeye Steak', description: '12oz ribeye with mashed potatoes', price: 32.00 },
      { id: 'e3', name: 'Pasta Carbonara', description: 'Creamy pasta with bacon', price: 18.00 },
    ]
  },
  {
    id: 'dessert',
    name: 'Dessert',
    items: [
      { id: 'd1', name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 8.00 },
      { id: 'd2', name: 'Tiramisu', description: 'Italian coffee dessert', price: 9.00 },
      { id: 'd3', name: 'Cheesecake', description: 'New York style cheesecake', price: 8.00 },
    ]
  },
];

// Helper function to get all products flattened
export const getAllProducts = () => {
  return productCategories.flatMap(category => 
    category.items.map(item => ({ ...item, category: category.name }))
  );
};

// Helper function to search products
export const searchProducts = (query) => {
  if (!query) return productCategories;
  
  const lowerQuery = query.toLowerCase();
  return productCategories
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      )
    }))
    .filter(category => category.items.length > 0);
};
