'use client';

import Link from 'next/link';

export default function Navigation({ currentPage = 'home', cartItemCount = 0, onSearchChange }) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Altamo
            </Link>
            
            {currentPage === 'home' && (
              <div className="ml-8 flex-1 max-w-lg">
                <input
                  type="text"
                  placeholder="Search menu..."
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {currentPage === 'checkout' && (
              <Link href="/" className="ml-8 text-blue-600 hover:text-blue-800">
                ← Back to Order
              </Link>
            )}
          </div>
          
          {currentPage === 'home' && (
            <Link 
              href="/checkout" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Checkout</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
