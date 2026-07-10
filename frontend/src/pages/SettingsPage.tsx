import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { updateSettings } from '../api/settings'
import { resolveImageUrl } from '../api/client'
import { useSettings } from '../context/SettingsContext'
import '../components/CategoryFormModal.css'
import '../components/ProductFormModal.css'
import './CategoriesPage.css'
import './SettingsPage.css'

export default function SettingsPage() {
  const { settings, reload } = useSettings()

  const [siteName, setSiteName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [metaPixelId, setMetaPixelId] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroLoopWords, setHeroLoopWords] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [favicon, setFavicon] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!settings) return
    setSiteName(settings.siteName)
    setPhone(settings.phone ?? '')
    setEmail(settings.email ?? '')
    setWhatsapp(settings.whatsapp ?? '')
    setFacebookUrl(settings.facebookUrl ?? '')
    setInstagramUrl(settings.instagramUrl ?? '')
    setTiktokUrl(settings.tiktokUrl ?? '')
    setMetaPixelId(settings.metaPixelId ?? '')
    setHeroTitle(settings.heroTitle)
    setHeroDescription(settings.heroDescription ?? '')
    setHeroLoopWords(settings.heroLoopWords ?? '')
    setLogoPreview(resolveImageUrl(settings.logo))
    setFaviconPreview(resolveImageUrl(settings.favicon))
  }, [settings])

  function handleLogoChange(file: File | null) {
    setLogo(file)
    setLogoPreview(file ? URL.createObjectURL(file) : resolveImageUrl(settings?.logo ?? null))
  }

  function handleFaviconChange(file: File | null) {
    setFavicon(file)
    setFaviconPreview(file ? URL.createObjectURL(file) : resolveImageUrl(settings?.favicon ?? null))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await updateSettings({
        siteName: siteName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        tiktokUrl: tiktokUrl.trim(),
        metaPixelId: metaPixelId.trim(),
        heroTitle: heroTitle.trim(),
        heroDescription: heroDescription.trim(),
        heroLoopWords: heroLoopWords.trim(),
        logo,
        favicon,
      })
      setLogo(null)
      setFavicon(null)
      reload()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('تعذر حفظ الإعدادات، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="categories-page settings-page">
      <header className="page-header">
        <h1>الإعدادات</h1>
      </header>

      {!settings ? (
        <p>جارٍ التحميل...</p>
      ) : (
        <form onSubmit={handleSubmit} className="settings-form">
          <section className="settings-section">
            <h2>معلومات الموقع</h2>

            <label className="field">
              <span>اسم الموقع (يظهر في تبويب المتصفح)</span>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="اسم الموقع"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>اللوجو</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                />
                {logoPreview && (
                  <div className="image-preview">
                    <img src={logoPreview} alt="اللوجو" />
                  </div>
                )}
              </label>

              <label className="field">
                <span>أيقونة التبويب (Favicon)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFaviconChange(e.target.files?.[0] ?? null)}
                />
                {faviconPreview && (
                  <div className="image-preview">
                    <img src={faviconPreview} alt="Favicon" className="favicon-preview-img" />
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h2>قسم الهيرو (الصفحة الرئيسية)</h2>

            <label className="field">
              <span>العنوان الرئيسي</span>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="شريكك الأول في تجهيز المشاريع التجارية"
              />
            </label>

            <label className="field">
              <span>الوصف تحت العنوان</span>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="وصف مختصر عن الشركة"
                rows={3}
              />
            </label>

            <label className="field">
              <span>الكلمات المتحركة (كل كلمة أو عبارة بسطر منفصل)</span>
              <textarea
                value={heroLoopWords}
                onChange={(e) => setHeroLoopWords(e.target.value)}
                placeholder={'جودة\nاحترافية\nاعتمادية'}
                rows={6}
              />
            </label>
          </section>

          <section className="settings-section">
            <h2>معلومات الفوتر</h2>

            <div className="field-row">
              <label className="field">
                <span>رقم الجوال</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الجوال"
                />
              </label>
              <label className="field">
                <span>البريد الإلكتروني</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                />
              </label>
            </div>

            <label className="field">
              <span>واتساب</span>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="رقم الواتساب"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>رابط فيسبوك</span>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </label>
              <label className="field">
                <span>رابط انستغرام</span>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </label>
            </div>

            <label className="field">
              <span>رابط تيك توك</span>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@..."
              />
            </label>
          </section>

          <section className="settings-section">
            <h2>التسويق الإلكتروني</h2>

            <label className="field">
              <span>معرّف بيكسل ميتا (Meta Pixel ID)</span>
              <input
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="مثال: 1234567890123456"
              />
            </label>
          </section>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="settings-success">تم حفظ الإعدادات بنجاح</p>}

          <div className="modal-actions">
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
