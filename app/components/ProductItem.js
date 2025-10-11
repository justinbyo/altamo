export default function ProductItem({ product, onAddToCart }) {
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
      <button
        onClick={() => onAddToCart?.(product)}
        className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Add to Order
      </button>
    </div>
  );
}
