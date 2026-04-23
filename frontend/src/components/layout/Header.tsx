import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { AccountMenu } from '@/components/layout/AccountMenu'
import { HeaderSearch } from '@/components/layout/HeaderSearch'

export function Header() {
  const itemCount = useCartStore(s => s.itemCount)
  return (
    <header className="sticky top-0 z-20 bg-bg border-b border-border-soft">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-[18px] grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <nav className="flex items-center gap-7 text-[13px] font-medium tracking-wide">
          <Link className="hover:text-primary" to="/products">Shop</Link>
          <Link className="hover:text-primary hidden md:inline" to="/collections">Collections</Link>
          <Link className="hover:text-primary hidden md:inline" to="/journal">Journal</Link>
          <Link className="hover:text-primary hidden md:inline" to="/about">About</Link>
        </nav>
        <Link to="/" className="font-display font-black uppercase text-primary text-[22px] tracking-wide text-center">
          Maison<sup className="text-[10px] opacity-70">®</sup> Verde
        </Link>
        <div className="flex items-center justify-end gap-5 text-[13px] font-medium tracking-wide">
          <HeaderSearch />
          <AccountMenu />
          <Link to="/cart" className="inline-flex items-center gap-1.5 hover:text-primary">
            <ShoppingBag size={18} strokeWidth={1.6} />
            Cart ({itemCount})
          </Link>
        </div>
      </div>
    </header>
  )
}
