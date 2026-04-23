import type { Product } from '@/types/api'

type Variant = Product['silhouette']

/**
 * SVG placeholder silhouettes per underwear style — used until real photos land.
 * Stroke/fill tuned to look good on both dark and light backgrounds.
 */
export function ProductSilhouette({
  variant,
  className = '',
}: {
  variant: Variant
  className?: string
}) {
  switch (variant) {
    case 'brief':
      return (
        <svg viewBox="0 0 240 300" className={className} aria-hidden>
          <path d="M40 40 L200 40 L204 180 Q190 240 120 270 Q50 240 36 180 Z" fill="#F4EEDE" opacity="0.95" />
          <path d="M56 60 L184 60 L188 170 Q176 220 120 250 Q64 220 52 170 Z" fill="#fff" opacity="0.2" />
          <path d="M40 40 L200 40 L200 60 L40 60 Z" fill="#1F3D2F" opacity="0.3" />
          <path d="M110 200 Q120 212 130 200" stroke="#1F3D2F" strokeWidth="1.5" fill="none" opacity="0.35" />
        </svg>
      )
    case 'bikini':
      return (
        <svg viewBox="0 0 240 300" className={className} aria-hidden>
          <path d="M30 130 Q120 80 210 130 L196 215 Q160 262 120 262 Q80 262 44 215 Z" fill="#F4EEDE" opacity="0.95" />
          <path d="M56 150 Q120 115 184 150 L172 200 Q150 238 120 238 Q90 238 68 200 Z" fill="#fff" opacity="0.22" />
          <path d="M30 130 Q120 80 210 130 L210 148 Q120 104 30 148 Z" fill="#8C6C3E" opacity="0.2" />
        </svg>
      )
    case 'boyshort':
      return (
        <svg viewBox="0 0 240 300" className={className} aria-hidden>
          <path d="M30 90 L210 90 Q218 220 180 240 L150 240 L130 180 L110 180 L90 240 L60 240 Q22 220 30 90 Z" fill="#F4EEDE" opacity="0.95" />
          <path d="M54 110 L186 110 Q192 210 164 222 L150 222 L136 190 L104 190 L90 222 L76 222 Q48 210 54 110 Z" fill="#fff" opacity="0.2" />
          <path d="M30 90 L210 90 L210 108 L30 108 Z" fill="#1F3D2F" opacity="0.3" />
        </svg>
      )
    case 'chill':
      return (
        <svg viewBox="0 0 240 300" className={className} aria-hidden>
          <path d="M40 100 Q120 76 200 100 L190 220 Q160 258 120 258 Q80 258 50 220 Z" fill="#F4EEDE" opacity="0.95" />
          <path d="M64 122 Q120 102 176 122 L168 210 Q144 236 120 236 Q96 236 72 210 Z" fill="#fff" opacity="0.22" />
          <path d="M40 100 Q120 76 200 100 L200 118 Q120 96 40 118 Z" fill="#8A7150" opacity="0.2" />
          <path d="M114 190 Q120 196 126 190" stroke="#1F3D2F" strokeWidth="1.4" fill="none" opacity="0.3" />
        </svg>
      )
  }
}

const GRADIENTS: Record<Variant, string> = {
  brief: 'linear-gradient(160deg, #A7C39D, #4B7257)',
  bikini: 'linear-gradient(160deg, #7E9E85, #365846)',
  boyshort: 'linear-gradient(160deg, #C9A884, #7A5B34)',
  chill: 'linear-gradient(160deg, #E8D4AE, #B89466)',
}

export function productGradient(variant: Variant) {
  return GRADIENTS[variant]
}
