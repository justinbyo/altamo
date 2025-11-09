import { useState } from 'react';

export default function ProductItem({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    setQuantity(1); // Reset to 1 after adding
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        </div>
        <div className="ml-4 text-right">
          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            −
          </button>
          <span className="px-3 py-1 text-gray-900 font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
