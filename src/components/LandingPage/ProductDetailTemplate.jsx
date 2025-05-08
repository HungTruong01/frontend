import React from 'react';

const ProductDetailTemplate = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Mô tả sản phẩm</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="inline-block pb-1.5 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
                {product.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTemplate;