import type { Metadata, Viewport } from 'next'
import { Inter, Mona_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { TopButton } from '@/components/chrome/TopButton'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { RevealObserver } from '@/components/motion/RevealObserver'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, buildMetadata, siteJsonLd } from '@/lib/seo'

const mona = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona', display: 'swap' })
/** Figures and small labels: plain, even numerals. */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata('/'),
}

/** The site opens in light; ThemeToggle keeps the browser chrome in step when a visitor picks dark. */
export const viewport: Viewport = {
  themeColor: '#f2f0ea',
  colorScheme: 'light',
}

/**
 * Runs before first paint: resolves the theme (a saved choice, otherwise light), flags JS
 * for reveal states, and switches reveals off for reduced motion or if the observer never
 * starts.
 */
const BOOT = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('ibw-theme')}catch(e){}if(t!=='dark'){t='light'}d.setAttribute('data-theme',t);if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reveal-off')}setTimeout(function(){if(!d.classList.contains('io-ready')){d.classList.add('reveal-off')}},4000)}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${mona.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <JsonLd data={siteJsonLd()} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-ink px-4 py-2 text-sm text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <TopButton />
        </SmoothScroll>
        <RevealObserver />
      </body>
    </html>
  )
}
