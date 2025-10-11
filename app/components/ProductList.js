import ProductItem from './ProductItem';

export default function ProductList({ categories, onAddToCart }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map(item => (
              <ProductItem 
                key={item.id} 
                product={item} 
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
