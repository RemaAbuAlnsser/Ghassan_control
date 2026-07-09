import { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import './StoreHero.css'

const DEFAULT_TITLE = 'شريكك الأول في تجهيز المشاريع التجارية'
const DEFAULT_DESCRIPTION =
  'نوفر حلولاً متكاملة لتجهيز المطاعم، المقاهي، السوبر ماركت، والمشاريع التجارية بأحدث المعدات وأعلى معايير الجودة.'
const DEFAULT_LOOP_WORDS = ['جودة', 'احترافية', 'اعتمادية', 'حلول متكاملة', 'معدات احترافية', 'أسعار منافسة']

const WORD_INTERVAL_MS = 2500
const FADE_DURATION_MS = 350

export default function StoreHero() {
  const { settings } = useSettings()

  const title = settings?.heroTitle || DEFAULT_TITLE
  const description = settings?.heroDescription || DEFAULT_DESCRIPTION
  const loopWords = settings?.heroLoopWords
    ? settings.heroLoopWords.split('\n').map((w) => w.trim()).filter(Boolean)
    : DEFAULT_LOOP_WORDS
  const words = loopWords.length > 0 ? loopWords : DEFAULT_LOOP_WORDS

  const [wordIndex, setWordIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length)
        setFading(false)
      }, FADE_DURATION_MS)
    }, WORD_INTERVAL_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join('|')])

  const currentWord = words[wordIndex % words.length]

  return (
    <section className="hero">
      <div className="hero-blob hero-blob-1" aria-hidden="true" />
      <div className="hero-blob hero-blob-2" aria-hidden="true" />
      <div className="hero-blob hero-blob-3" aria-hidden="true" />
      <div className="hero-blob hero-blob-4" aria-hidden="true" />

      <div className="hero-inner">
        <h1 className="hero-title hero-anim" style={{ animationDelay: '0s' }}>
          {title}
        </h1>

        <div className="hero-loop hero-anim" style={{ animationDelay: '0.12s' }}>
          <span className={fading ? 'hero-loop-word fading' : 'hero-loop-word'}>
            {currentWord}
          </span>
        </div>

        <p className="hero-desc hero-anim" style={{ animationDelay: '0.24s' }}>
          {description}
        </p>

        <div className="hero-actions hero-anim" style={{ animationDelay: '0.36s' }}>
          <a href="#products" className="btn primary hero-btn-primary">
            تصفح المنتجات
          </a>
          <a href="#footer" className="btn secondary hero-btn-secondary">
            تواصل معنا
          </a>
        </div>
      </div>
    </section>
  )
}
