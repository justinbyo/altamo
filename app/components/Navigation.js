'use client';

import Link from 'next/link';

export default function Navigation({ currentPage = 'order', cartItemCount = 0, onSearchChange, isEditMode = false, orderId = null }) {
  console.log('Navigation component - isEditMode:', isEditMode, 'currentPage:', currentPage);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <Link href="/order" className="text-xl font-bold text-gray-900">
              Altamo
            </Link>
            
            {currentPage === 'order' && (
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
              <Link
                href={isEditMode ? `/order?edit=order&order=${orderId}` : `/order?order=${orderId}`} 
                className="ml-8 text-blue-600 hover:text-blue-800">
                ← Back to menu
              </Link>
            )}
          </div>
          
          {currentPage === 'order' && (
            <Link 
              href={isEditMode ? `/checkout?edit=payment&order=${orderId}` : `/checkout?order=${orderId}`} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>
                {isEditMode ? 'Add Items' : 'Checkout'}
              </span>
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
