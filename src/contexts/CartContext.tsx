 import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
 
 export interface CartItem {
   productId: string;
   productName: string;
   quantityGrams: number;
   pricePerGram: number;
   image: string;
 }
 
 interface CartContextType {
   items: CartItem[];
   addItem: (item: CartItem) => void;
   removeItem: (productId: string) => void;
   updateQuantity: (productId: string, quantityGrams: number) => void;
   clearCart: () => void;
   getTotal: () => number;
   getTotalItems: () => number;
 }
 
 const CartContext = createContext<CartContextType | undefined>(undefined);
 
 export const CartProvider = ({ children }: { children: ReactNode }) => {
   const [items, setItems] = useState<CartItem[]>(() => {
     const saved = localStorage.getItem('mittika-cart');
     return saved ? JSON.parse(saved) : [];
   });
 
   useEffect(() => {
     localStorage.setItem('mittika-cart', JSON.stringify(items));
   }, [items]);
 
   const addItem = (newItem: CartItem) => {
     setItems(prev => {
       const existing = prev.find(item => item.productId === newItem.productId);
       if (existing) {
         return prev.map(item =>
           item.productId === newItem.productId
             ? { ...item, quantityGrams: item.quantityGrams + newItem.quantityGrams }
             : item
         );
       }
       return [...prev, newItem];
     });
   };
 
   const removeItem = (productId: string) => {
     setItems(prev => prev.filter(item => item.productId !== productId));
   };
 
   const updateQuantity = (productId: string, quantityGrams: number) => {
     if (quantityGrams < 50) {
       removeItem(productId);
       return;
     }
     setItems(prev =>
       prev.map(item =>
         item.productId === productId
           ? { ...item, quantityGrams }
           : item
       )
     );
   };
 
   const clearCart = () => setItems([]);
 
   const getTotal = () => {
     return items.reduce((total, item) => total + (item.quantityGrams * item.pricePerGram), 0);
   };
 
   const getTotalItems = () => items.length;
 
   return (
     <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getTotalItems }}>
       {children}
     </CartContext.Provider>
   );
 };
 
 export const useCart = () => {
   const context = useContext(CartContext);
   if (!context) {
     throw new Error('useCart must be used within a CartProvider');
   }
   return context;
 };