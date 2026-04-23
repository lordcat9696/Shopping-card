import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/layout/Marquee'
import { ShopByStyle } from '@/components/home/ShopByStyle'
import { BodyHappyDesign } from '@/components/home/BodyHappyDesign'
import { ProductSpotlight } from '@/components/home/ProductSpotlight'
import { EverydayEdit } from '@/components/home/EverydayEdit'
import { ReusableBanner } from '@/components/home/ReusableBanner'
import { Promise as PromiseSection } from '@/components/home/Promise'

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ShopByStyle />
      <EverydayEdit />
      <BodyHappyDesign />
      <ProductSpotlight />
      <ReusableBanner />
      <PromiseSection />
    </>
  )
}
