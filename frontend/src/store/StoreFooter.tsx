import { resolveImageUrl } from '../api/client'
import { useSettings } from '../context/SettingsContext'
import defaultLogo from '../assets/logo.png'
import './StoreFooter.css'

function whatsappHref(number: string): string {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`
}

export default function StoreFooter() {
  const { settings } = useSettings()

  if (!settings) return null

  const logo = resolveImageUrl(settings.logo) ?? defaultLogo

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt={settings.siteName} className="footer-logo" />
          <span className="footer-slogan">
            إستيراد وتسويق معدات مطاعم وكوفي شوب وسوبرماركت
          </span>
        </div>

        <div className="footer-links-col">
          <h4>روابط سريعة</h4>
          <a href="/">الرئيسية</a>
          <a href="#products">المنتجات</a>
        </div>

        {(settings.phone || settings.email) && (
          <div className="footer-links-col">
            <h4>تواصل معنا</h4>
            {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          </div>
        )}
      </div>

      <hr className="footer-divider" />

      {(settings.whatsapp || settings.facebookUrl || settings.instagramUrl) && (
        <div className="footer-socials">
          {settings.whatsapp && (
            <a
              href={whatsappHref(settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label="واتساب"
            >
              WA
            </a>
          )}
          {settings.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label="فيسبوك"
            >
              f
            </a>
          )}
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label="انستغرام"
            >
              IG
            </a>
          )}
        </div>
      )}

      <p className="footer-copy">
        © {new Date().getFullYear()} {settings.siteName} — جميع الحقوق محفوظة
      </p>
    </footer>
  )
}
