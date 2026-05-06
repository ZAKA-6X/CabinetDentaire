import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const IcoHome    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/></svg>
const IcoCal     = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
const IcoList    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>
const IcoPill    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M8.5 6.5l7 7"/></svg>
const IcoReceipt = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>
const IcoUser    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
const IcoSparkle = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
const IcoLogout  = () => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcoUsers   = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IcoGear    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 5l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
const IcoPencil  = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

function Layout({ children, pageTitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getNavLinks = () => {
    if (user?.role === 'PATIENT') return [
      { ico: IcoHome,    label: 'Tableau de bord', path: '/patient/dashboard',    section: 'Espace patient' },
      { ico: IcoSparkle, label: 'Réserver',        path: '/patient/reserver' },
      { ico: IcoCal,     label: 'Mes rendez-vous', path: '/patient/rendez-vous' },
      { ico: IcoList,    label: 'Mes visites',     path: '/patient/visites' },
      { ico: IcoPill,    label: 'Ordonnances',     path: '/patient/ordonnances' },
      { ico: IcoReceipt, label: 'Factures',        path: '/patient/factures' },
      { ico: IcoUser,    label: 'Mon profil',      path: '/patient/profil',       section: 'Compte' },
    ]
    if (user?.role === 'SECRETAIRE') return [
      { ico: IcoHome,    label: 'Tableau de bord', path: '/secretaire/dashboard',  section: 'Secrétariat' },
      { ico: IcoCal,     label: 'Rendez-vous',     path: '/secretaire/rendez-vous' },
      { ico: IcoReceipt, label: 'Paiements',       path: '/secretaire/paiements' },
      { ico: IcoPill,    label: 'Médicaments',     path: '/secretaire/medicaments' },
      { ico: IcoGear,    label: 'Opérations',      path: '/secretaire/operations' },
      { ico: IcoUsers,   label: 'Patients',        path: '/secretaire/patients' },
    ]
    if (user?.role === 'DENTISTE') return [
      { ico: IcoHome,    label: 'Tableau de bord', path: '/dentiste/dashboard',       section: 'Clinique' },
      { ico: IcoPencil,  label: 'Nouvelle visite', path: '/dentiste/visite/nouvelle' },
      { ico: IcoPill,    label: 'Ordonnance',      path: '/dentiste/ordonnance/nouvelle' },
      { ico: IcoUsers,   label: 'Patients',        path: '/dentiste/patients' },
    ]
    return []
  }

  const links = getNavLinks()
  const handleLogout = () => { logout(); navigate('/login') }

  const initials = (user?.nom || user?.email || 'U').charAt(0).toUpperCase()
  const displayName = user?.nom ? `${user.prenom || ''} ${user.nom}`.trim() : user?.email

  let lastSection = null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <aside style={s.side}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.brandMark}>D</div>
          <div style={s.brandTxt}>
            <b style={s.brandName}>Al-Akwa</b>
            <small style={s.brandSub}>Clinique Dentaire</small>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {links.map(link => {
            const Ico = link.ico
            const isActive = location.pathname === link.path
            const showSection = link.section && link.section !== lastSection
            if (showSection) lastSection = link.section
            return (
              <div key={link.path}>
                {showSection && (
                  <div style={s.navLabel}>{link.section}</div>
                )}
                <div
                  style={{ ...s.navItem, ...(isActive ? s.navActive : {}) }}
                  onClick={() => navigate(link.path)}
                >
                  <span style={{ ...s.navIco, ...(isActive ? { color: '#fff', opacity: 1 } : {}) }}>
                    <Ico />
                  </span>
                  <span>{link.label}</span>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={s.sideFoot}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.footMeta}>
            <b style={{ fontSize: 13, display: 'block' }}>{displayName}</b>
            <small style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()} · Actif
            </small>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout} title="Déconnexion">
            <IcoLogout />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', letterSpacing: '0.02em' }}>
            Portail patient · <b style={{ color: 'var(--ink)', fontWeight: 500 }}>
              {links.find(l => l.path === location.pathname)?.label || 'Dashboard'}
            </b>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={s.pill}>
              <span style={s.dot} />
              Compte actif
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '36px 40px 80px', maxWidth: 1180, width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const s = {
  side: {
    background: 'var(--surface)',
    borderRight: '1px solid var(--line)',
    padding: '22px 18px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '4px 6px 22px',
  },
  brandMark: {
    width: 32, height: 32, borderRadius: 8,
    background: 'var(--accent)', color: '#fff',
    display: 'grid', placeItems: 'center',
    fontFamily: '"Fraunces", serif', fontWeight: 500,
    fontSize: 17, letterSpacing: '-0.02em',
  },
  brandTxt: { display: 'flex', flexDirection: 'column', lineHeight: 1.15 },
  brandName: { fontFamily: '"Fraunces", serif', fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em' },
  brandSub: { color: 'var(--ink-3)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 },
  navLabel: {
    fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--ink-3)', padding: '14px 10px 6px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '9px 10px', borderRadius: 9,
    color: 'var(--ink-2)', fontSize: 13.5,
    cursor: 'pointer', transition: 'background .15s, color .15s',
  },
  navActive: {
    background: 'var(--accent)', color: '#fff',
  },
  navIco: { width: 16, height: 16, opacity: 0.75, flexShrink: 0 },
  sideFoot: {
    marginTop: 'auto',
    borderTop: '1px solid var(--line)',
    paddingTop: 14,
    display: 'flex', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg,#c9d6d1,#9ab3ac)',
    display: 'grid', placeItems: 'center',
    color: '#fff', fontWeight: 500, fontSize: 13, flexShrink: 0,
  },
  footMeta: { lineHeight: 1.2, flex: 1, minWidth: 0 },
  logoutBtn: {
    width: 30, height: 30, borderRadius: 8,
    display: 'grid', placeItems: 'center',
    color: 'var(--ink-3)', border: '1px solid var(--line)',
    background: 'var(--card)', flexShrink: 0,
  },
  topbar: {
    padding: '18px 40px',
    display: 'flex', alignItems: 'center', gap: 16,
    borderBottom: '1px solid var(--line)',
    background: 'var(--bg)',
    position: 'sticky', top: 0, zIndex: 5,
  },
  pill: {
    border: '1px solid var(--line)', background: 'var(--card)',
    padding: '6px 12px', borderRadius: 999, fontSize: 12,
    color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' },
}

export default Layout
