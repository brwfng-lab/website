"use client";

import { useCart, CartItem } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

export default function MerchGrid({ products }: { products: any[] }) {
  const { addToCart, items } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const isAdded = addedIds.has(product.id);
        const inCartQuantity = items.find(item => item.id === product.id)?.quantity || 0;

        return (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {inCartQuantity > 0 && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                  {inCartQuantity} in cart
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-slate-900 mb-2">{product.name}</h3>
              <p className="text-sm font-light text-slate-500 mb-6 flex-1">{product.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-xl font-light text-slate-900">&#8358;{product.price.toLocaleString()}</span>
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdded}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isAdded ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
