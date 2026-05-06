import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  Award,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

// --- Shared Components ---

const PromoBanner = ({ timeLeft }: { timeLeft: number }) => {
  const formatTimeFull = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-8 bg-gold text-luxury-black flex items-center justify-center text-[10px] md:text-[11px] font-bold tracking-ultra uppercase shrink-0 sticky top-0 z-[60]">
      Order 3 bottles, get FREE delivery anywhere in Nigeria! <span className="ml-4 opacity-75 hidden sm:inline">ENDS IN: {formatTimeFull(timeLeft)}</span>
    </div>
  );
};

const Button = ({ 
  children, 
  variant = 'gold', 
  className = '', 
  onClick,
  disabled
}: { 
  children: React.ReactNode; 
  variant?: 'gold' | 'outline' | 'ghost'; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const base = "px-6 py-3 font-semibold transition-all duration-300 relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    gold: "bg-gold text-luxury-black font-bold gold-glow hover:bg-gold-light",
    outline: "border border-gold text-gold hover:bg-gold/10",
    ghost: "text-white/70 hover:text-white"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'gold' && (
        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
      )}
    </button>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl lg:text-6xl mb-4 gold-text-glow"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-white/60 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// --- Sub-components ---

const AgeGate = ({ onVerify }: { onVerify: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <div className="max-w-md w-full text-center border border-white/10 p-12 bg-luxury-black/50 gold-glow rounded-3xl">
        <div className="inline-block border border-gold/50 px-3 py-1 rounded-full mb-6">
          <span className="text-[10px] text-gold uppercase font-bold tracking-widest italic">Nigeria's #1 Spirits House</span>
        </div>
        <h1 className="text-5xl font-serif italic text-gold mb-4 italic">Drink-Up</h1>
        <p className="text-white/60 mb-10 text-sm tracking-wide">AUTHENTIC QUALITY SINCE 1971. <br/>ARE YOU OVER THE AGE OF 18?</p>
        <div className="flex gap-4">
          <Button className="flex-1 uppercase text-xs tracking-widest" onClick={onVerify}>I am 18+</Button>
          <Button variant="outline" className="flex-1 uppercase text-xs tracking-widest" onClick={() => window.location.href = "https://google.com"}>No</Button>
        </div>
        <p className="mt-10 text-[9px] text-white/20 uppercase tracking-[0.3em]">Enjoy Responsibly. No underage drinking.</p>
      </div>
    </motion.div>
  );
};

const Navbar = ({ cartCount, onOpenCart, onOpenNav }: { cartCount: number; onOpenCart: () => void; onOpenNav: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-8 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-luxury-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-10 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <a href="#" className="text-2xl font-serif italic text-gold font-bold tracking-tight">Drink-Up</a>
          <div className="hidden lg:flex gap-8 mt-1">
            {['Home', 'Products', 'About IDL', 'How It Works', 'Contact'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] font-semibold uppercase tracking-widest text-white/70 hover:text-gold transition-colors">{link}</a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onOpenCart} className="relative p-2 text-white/80 hover:text-gold transition-colors group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-luxury-black text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-luxury-black group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </button>
          
          <Button variant="gold" className="hidden sm:block py-2.5 px-6 text-[11px] uppercase tracking-widest shadow-none hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]">Order Now</Button>
          
          <button onClick={onOpenNav} className="lg:hidden p-2 text-white/80 hover:text-gold transition-colors">
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeItem 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[];
  updateQuantity: (id: string, variant: string, delta: number) => void;
  removeItem: (id: string, variant: string) => void;
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-black border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-gold italic">Your Selection</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gold/20">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-lg">Your cart is empty.</p>
                  <Button variant="ghost" onClick={onClose} className="mt-4">Back to Shop</Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedVariant}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-white/50">{item.selectedVariant}</p>
                        </div>
                        <p className="text-sm font-bold text-gold">NGN {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.selectedVariant, -1)} className="p-1 px-2 hover:bg-white/10 transition-colors"><Minus size={12} /></button>
                          <span className="px-3 text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedVariant, 1)} className="p-1 px-2 hover:bg-white/10 transition-colors"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id, item.selectedVariant)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-2xl font-bold text-gold">NGN {total.toLocaleString()}</span>
                </div>
                <Button className="w-full py-4 text-center" onClick={() => window.location.href = "https://idlng.com"}>Proceed to Checkout</Button>
                <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-[0.2em]">Secure ordering via IDL Official</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProductCard: React.FC<{ 
  product: Product; 
  onAdd: (p: Product, variant: string) => void;
}> = ({ product, onAdd }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col gap-4 transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.06] cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.rating >= 4.9 && (
          <div className="absolute top-3 right-3 bg-red-600 text-[9px] font-bold px-2 py-0.5 rounded text-white tracking-widest shadow-lg">
            BEST SELLER
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold tracking-wide transition-colors group-hover:text-gold">{product.name}</h3>
          <span className="text-xs text-gold font-bold tracking-tight">₦{product.price.toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-white/40 italic">{selectedVariant} Premium Selection</p>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="relative">
          <select 
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-gold/50 cursor-pointer appearance-none text-white/70"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' opacity='0.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '0.8rem' }}
          >
            {product.variants.map(v => (
              <option key={v} value={v} className="bg-luxury-black">{v}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product, selectedVariant); }}
          className="w-full bg-white/5 border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest transition-all group-hover:bg-gold group-hover:text-luxury-black"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600 * 24 + 450); // 1 day, 7 mins approx

  // Countdown controller
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addToCart = (product: Product, variant: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedVariant === variant);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedVariant === variant 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedVariant: variant, quantity: 1 }];
    });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateQuantity = (id: string, variant: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant === variant) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string, variant: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedVariant === variant)));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-luxury-black overflow-x-hidden">
      <AnimatePresence>
        {showAgeGate && <AgeGate onVerify={() => setShowAgeGate(false)} />}
      </AnimatePresence>

      <PromoBanner timeLeft={timeLeft} />

      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenNav={() => setIsNavOpen(true)} 
      />

      {/* Age verified indicator */}
      {!showAgeGate && (
        <div className="fixed bottom-10 right-10 z-40 flex items-center gap-3 bg-black/80 border border-gold/30 px-4 py-2 rounded-full backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold italic">Age Verified 18+</span>
        </div>
      )}

      {/* Floating Side Utility */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-12 bg-white/5 border border-white/10 rounded-l-2xl py-6 flex flex-col items-center gap-8 z-40 backdrop-blur-md hidden xl:flex">
         <button className="text-white/40 hover:text-gold transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </button>
         <button className="text-white/40 hover:text-gold transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </button>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-luxury-black/40 to-luxury-black z-10" />
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569701881693-567ab382c3c9?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale contrast-125 opacity-40" 
          />
        </div>

        <div className="container mx-auto px-10 relative z-20">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 text-left"
            >
              <div className="inline-block border border-gold/50 px-4 py-1.5 rounded-full mb-8">
                <span className="text-[10px] text-gold uppercase font-bold tracking-[0.2em] italic">Nigeria's #1 Spirits House</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 font-serif leading-[0.95] tracking-tight">
                Nigeria's <span className="text-gold italic">Finest</span> <br /> Spirits, Delivered.
              </h1>
              <p className="text-sm md:text-base text-white/60 max-w-[420px] mb-12 leading-relaxed">
                Direct from Intercontinental Distillers Limited. Order Veleta, Eagle's, Bull Gin, and more — fast, easy, and authentic.
              </p>
              <div className="flex flex-wrap gap-5">
                <Button className="px-12 py-4 text-xs tracking-widest uppercase" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Shop Now
                </Button>
                <Button variant="outline" className="px-12 py-4 text-xs tracking-widest uppercase" onClick={() => document.getElementById('about-idl')?.scrollIntoView({ behavior: 'smooth' })}>
                  Our Heritage
                </Button>
              </div>
            </motion.div>

            {/* Visual Element - Mock Bottle from Theme */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="flex-1 hidden xl:flex justify-center"
            >
               <div className="w-48 h-96 bg-gradient-to-b from-gold/40 to-transparent border border-white/10 rounded-t-[5rem] rounded-b-2xl relative shadow-[0_0_100px_rgba(201,168,76,0.1)] overflow-hidden">
                  <div className="absolute top-1/4 inset-x-4 h-24 bg-white/10 backdrop-blur-md flex items-center justify-center text-luxury-black flex-col border-y border-white/20">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Authentic</span>
                    <span className="text-2xl font-serif italic font-bold">Chelsea</span>
                  </div>
                  <motion.div 
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/2 pointer-events-none"
                  />
               </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Bottle Visual Element */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-20 hidden xl:block w-64 h-96 opacity-20"
        >
          <img src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=600" alt="Spirit" className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(201,168,76,0.3)]" />
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gold py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-12 items-center text-luxury-black font-bold uppercase tracking-widest text-sm mr-12 shrink-0">
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Trusted by 50,000+ Nigerians</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Fast Nationwide Delivery</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Secure Payment Gateway</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Official IDL Partner</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Premium Quality Guaranteed</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="liquid-mesh absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading 
            title="Our Collection" 
            subtitle="Discover our range of premium spirits, crafted for every occasion. From celebration schnapps to refined gins."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <SectionHeading title="Experience Premium" subtitle="Three simple steps to enjoying Nigeria's finest distilleries." />
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:text-luxury-black transition-all duration-500 gold-glow">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-2xl mb-3">01. Browse</h3>
              <p className="text-white/50 text-sm">Explore IDL's full range of premium spirits and cocktails, from whiskey to aromatic schnapps.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:text-luxury-black transition-all duration-500 gold-glow">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl mb-3">02. Order</h3>
              <p className="text-white/50 text-sm">Securely place your order. Choose your preferred bottle size and quantity with ease.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:text-luxury-black transition-all duration-500 gold-glow">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl mb-3">03. Receive</h3>
              <p className="text-white/50 text-sm">Experience ultra-fast delivery. Your favourite drinks arrive pristine at your doorstep.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <SectionHeading title="Most Loved" subtitle="Our current trending spirits across the nation." />
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-12 px-6 lg:px-[calc((100vw-1200px)/2)] snap-x">
          {PRODUCTS.slice(0, 5).map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] md:min-w-[350px] snap-center bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group hover:border-gold/30 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold text-luxury-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Best Seller
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif italic mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gold font-bold">NGN {product.price.toLocaleString()}</span>
                  <button 
                    onClick={() => addToCart(product, product.variants[0])}
                    className="text-white/60 hover:text-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
                  >
                    Quick Add <Plus size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gold p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 text-luxury-black max-w-xl">
              <h2 className="text-4xl md:text-5xl mb-4 italic font-bold">Limited Offer!</h2>
              <p className="text-lg opacity-80 mb-6">Order any 3 bottles today and enjoy <span className="font-bold underline">FREE delivery</span> anywhere in Nigeria. Don't miss out!</p>
              <div className="flex gap-4">
                <div className="bg-luxury-black text-gold px-4 py-3 rounded-lg text-center min-w-[70px]">
                  <span className="block text-2xl font-bold leading-none">{formatTime(timeLeft).split(':')[0]}</span>
                  <span className="text-[10px] uppercase font-bold opacity-70">Hours</span>
                </div>
                <div className="bg-luxury-black text-gold px-4 py-3 rounded-lg text-center min-w-[70px]">
                  <span className="block text-2xl font-bold leading-none">{formatTime(timeLeft).split(':')[1]}</span>
                  <span className="text-[10px] uppercase font-bold opacity-70">Mins</span>
                </div>
                <div className="bg-luxury-black text-gold px-4 py-3 rounded-lg text-center min-w-[70px]">
                  <span className="block text-2xl font-bold leading-none">{formatTime(timeLeft).split(':')[2]}</span>
                  <span className="text-[10px] uppercase font-bold opacity-70">Secs</span>
                </div>
              </div>
            </div>
            
            <Button variant="gold" className="bg-luxury-black text-gold border-2 border-luxury-black hover:bg-luxury-black/90 hover:text-gold-light w-full md:w-auto px-12 py-5 text-xl">
              Claim Offer
            </Button>
          </div>
        </div>
      </section>

      {/* About IDL */}
      <section id="about-idl" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-6xl mb-6 gold-text-glow">The Heritage of IDL</h2>
                <div className="w-20 h-1 bg-gold mb-8 shadow-[0_0_10px_#C9A84C]" />
                <p className="text-white/60 leading-relaxed text-lg mb-6">
                  Intercontinental Distillers Limited (IDL) is Nigeria's leading spirit brand house. Since 1971, we have been crafting premium alcoholic beverages that define quality and tradition. 
                </p>
                <p className="text-white/60 leading-relaxed text-lg mb-10">
                  From the iconic Eagle's Aromatic Schnapps to the crisp Bull London Dry Gin, our products are a staple in celebrations across West Africa. Drink-Up is our official gateway to bringing these spirits directly to 21st-century consumers.
                </p>
                
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-gold">50+</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold">10+</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Premium Brands</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold">36</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">States Presence</div>
                  </div>
                </div>

                <a href="https://idlng.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gold hover:text-gold-light mt-12 transition-colors group">
                  Visit Official Website <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
            
            <div className="flex-1 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-2xl overflow-hidden border border-white/10 gold-glow"
              >
                <img src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=1200" alt="Distillery" className="w-full grayscale brightness-50" />
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-black/40">
                  <h3 className="text-4xl text-white font-serif italic italic">"Crafting Traditions Since 1971"</h3>
                </div>
              </motion.div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <SectionHeading title="Voices of Refinement" subtitle="What our community says about their premium Drink-Up experience." />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Folake A.", loc: "Lagos", quote: "The ease of ordering my favorite Bull Gin variants is unmatched. Delivery was fast and discrete.", stars: 5 },
              { name: "Ikenna O.", loc: "Abuja", quote: "Eagle's Schnapps is a must for our family gatherings. Drink-Up makes it so easy to stock up official bottles.", stars: 5 },
              { name: "Seyi W.", loc: "Port Harcourt", quote: "Squadron Dark Rum arrived perfectly packed. The ultra-premium site experience lives up to the brand.", stars: 4 },
            ].map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-luxury-black/50 border border-white/5 p-8 rounded-2xl"
              >
                <div className="flex gap-1 text-gold mb-6">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg italic text-white/80 mb-6 font-serif">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-gold">{t.name}</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{t.loc}, Nigeria</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <SectionHeading title="Join the Inner Circle" subtitle="Be the first to know about new IDL releases, exclusive vintage drops, and premium discounts." />
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <Button variant="gold" className="px-12">Get Deals</Button>
          </form>
          <p className="mt-6 text-xs text-white/30 uppercase tracking-[0.2em]">Privacy Guaranteed. No Spam.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-footer-black border-t border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-[320px]">
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">The Heritage</div>
              <a href="#" className="text-3xl font-serif italic text-gold font-bold mb-4 block">Drink-Up</a>
              <p className="text-white/40 text-[11px] leading-relaxed mb-8">
                Official ordering platform for Intercontinental Distillers Limited. Crafting excellence since 1971. Authenticity guaranteed with every pour.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-gold hover:text-luxury-black transition-all"><Instagram size={16} /></a>
                <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-gold hover:text-luxury-black transition-all"><Facebook size={16} /></a>
                <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-gold hover:text-luxury-black transition-all"><Twitter size={16} /></a>
              </div>
            </div>
            
            <div className="h-20 w-[1px] bg-white/10 hidden md:block self-center"></div>

            <div className="flex-1">
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">Stay Refined</div>
              <div className="flex border-b border-white/20 pb-2 max-w-sm">
                <input 
                  type="text" 
                  placeholder="Your Email Address" 
                  className="bg-transparent text-[11px] outline-none flex-1 font-medium tracking-wide" 
                />
                <button className="text-gold text-[10px] font-bold uppercase tracking-widest ml-4 hover:text-gold-light transition-colors">Join</button>
              </div>
              <p className="text-[9px] text-white/20 mt-3 uppercase tracking-widest">Receive exclusive drops and release notifications.</p>
            </div>

            <div className="text-right flex flex-col items-end gap-3 shrink-0">
              <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <a href="https://idlng.com" className="hover:text-gold transition-colors">idlng.com</a>
                <span>18+ Only</span>
                <span className="text-gold italic">Drink Responsibly</span>
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest tracking-ultra">© 2026 OFFICIAL IDL ORDERING</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-10">
              {['Products', 'About', 'Contact', 'Terms'].map(link => (
                <a key={link} href="#" className="text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-gold transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex gap-2">
               <div className="w-8 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                  <span className="text-[8px] font-bold italic">VISA</span>
               </div>
               <div className="w-8 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                  <span className="text-[8px] font-bold italic">MC</span>
               </div>
               <div className="w-8 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                  <span className="text-[8px] font-bold italic">PAY</span>
               </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-10 z-[100] bg-gold text-luxury-black px-6 py-4 rounded-xl gold-glow flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} />
            Added to your collection!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
