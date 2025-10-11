'use client';

export default function Payment({ paymentMethod, setPaymentMethod }) {
  const paymentOptions = [
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'apple-pay', label: 'Apple Pay', icon: '🍎' },
    { id: 'google-pay', label: 'Google Pay', icon: '🔵' },
    { id: 'cash', label: 'Cash', icon: '💵' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
      
      <div className="space-y-3">
        {paymentOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setPaymentMethod(option.id)}
            className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
              paymentMethod === option.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{option.icon}</span>
            <span className="font-medium text-gray-900">{option.label}</span>
            {paymentMethod === option.id && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="CVV"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
