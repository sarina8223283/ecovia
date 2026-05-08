import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { WovenBasket } from '@/components/icons/BotanicalIcons';
import cartIcon from '@/assets/icons/cart-icon.png';
 
 const CartDrawer = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
 
   const handleCheckout = () => {
     navigate('/checkout');
     setIsOpen(false);
   };
 
   return (
     <Sheet open={isOpen} onOpenChange={setIsOpen}>
       <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-primary/10 rounded-full transition-all duration-200 text-primary" aria-label="Cart">
            <WovenBasket size={22} className="hover:scale-110 transition-transform" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </button>
       </SheetTrigger>
       <SheetContent className="w-full sm:max-w-md flex flex-col">
         <SheetHeader>
           <SheetTitle className="font-serif text-xl">Your Cart</SheetTitle>
         </SheetHeader>
 
         {items.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
             <img src={cartIcon} alt="Empty cart" className="w-16 h-16 object-contain opacity-30 mb-4" />
             <h3 className="font-medium text-foreground mb-2">Your cart is empty</h3>
             <p className="text-sm text-muted-foreground mb-6">
               Add some natural herbal powders to get started!
             </p>
             <Link
               to="/products"
               onClick={() => setIsOpen(false)}
               className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
             >
               Browse Products
             </Link>
           </div>
         ) : (
           <>
             <div className="flex-1 overflow-y-auto py-4 space-y-4">
               {items.map(item => (
                 <div key={item.productId} className="flex gap-4 p-3 rounded-lg bg-secondary/30">
                   <img 
                     src={item.image} 
                     alt={item.productName}
                     className="w-20 h-20 rounded-lg object-cover"
                   />
                   <div className="flex-1 min-w-0">
                     <h4 className="font-medium text-foreground text-sm line-clamp-1">
                       {item.productName}
                     </h4>
                     <p className="text-xs text-muted-foreground mt-1">
                       ₹{item.pricePerGram}/g
                     </p>
                     <div className="flex items-center gap-2 mt-2">
                       <button
                         onClick={() => updateQuantity(item.productId, item.quantityGrams - 50)}
                         className="w-7 h-7 rounded bg-secondary flex items-center justify-center hover:bg-secondary/80"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="text-sm font-medium min-w-[60px] text-center">
                         {item.quantityGrams >= 1000 
                           ? `${item.quantityGrams / 1000} Kg` 
                           : `${item.quantityGrams}g`}
                       </span>
                       <button
                         onClick={() => updateQuantity(item.productId, item.quantityGrams + 50)}
                         className="w-7 h-7 rounded bg-secondary flex items-center justify-center hover:bg-secondary/80"
                       >
                         <Plus size={14} />
                       </button>
                     </div>
                   </div>
                   <div className="flex flex-col items-end justify-between">
                     <button
                       onClick={() => removeItem(item.productId)}
                       className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                     >
                       <Trash2 size={16} />
                     </button>
                     <span className="font-semibold text-foreground">
                       ₹{(item.quantityGrams * item.pricePerGram).toFixed(2)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
 
             {/* Cart Footer */}
             <div className="border-t border-border pt-4 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="font-medium text-foreground">Total</span>
                 <span className="text-xl font-bold text-foreground">₹{getTotal().toFixed(2)}</span>
               </div>
 
               {!user && (
                 <div className="p-3 rounded-lg bg-secondary/50 text-sm text-muted-foreground">
                   <Link to="/auth" onClick={() => setIsOpen(false)} className="text-primary font-medium hover:underline">
                     Sign in
                   </Link>
                   {' '}to save your order history
                 </div>
               )}
 
                <button
                  onClick={handleCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <CreditCard size={18} />
                  Proceed to Checkout
                </button>

               <button
                 onClick={clearCart}
                 className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
               >
                 Clear Cart
               </button>
             </div>
           </>
         )}
       </SheetContent>
     </Sheet>
   );
 };
 
 export default CartDrawer;