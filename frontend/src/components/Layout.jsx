import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const getNavLinks = () => {
    if (user?.role === 'PATIENT') return [
      { icon: 'home', label: 'Tableau de bord', path: '/patient/dashboard' },
      { icon: 'cal', label: 'Réserver RDV', path: '/patient/reserver' },
      { icon: 'list', label: 'Mes RDV', path: '/patient/rendez-vous' },
      { icon: 'visit', label: 'Mes visites', path: '/patient/visites' },
      { icon: 'pill', label: 'Ordonnances', path: '/patient/ordonnances' },
      { icon: 'receipt', label: 'Factures', path: '/patient/factures' },
      { icon: 'user', label: 'Mon profil', path: '/patient/profil' },
    ]
    if (user?.role === 'SECRETAIRE') return [
      { icon: 'home', label: 'Tableau de bord', path: '/secretaire/dashboard' },
      { icon: 'list', label: 'Rendez-vous', path: '/secretaire/rendez-vous' },
      { icon: 'receipt', label: 'Paiements', path: '/secretaire/paiements' },
      { icon: 'pill', label: 'Médicaments', path: '/secretaire/medicaments' },
      { icon: 'settings', label: 'Opérations', path: '/secretaire/operations' },
      { icon: 'users', label: 'Patients', path: '/secretaire/patients' },
    ]
    if (user?.role === 'DENTISTE') return [
      { icon: 'home', label: 'Tableau de bord', path: '/dentiste/dashboard' },
      { icon: 'edit', label: 'Enregistrer visite', path: '/dentiste/visite/nouvelle' },
      { icon: 'pill', label: 'Ordonnance', path: '/dentiste/ordonnance/nouvelle' },
      { icon: 'users', label: 'Patients', path: '/dentiste/patients' },
    ]
    return []
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.nom_complet?.split(' ')?.map(n => n[0])?.join('')?.slice(0, 2)?.toUpperCase()

  const NavIcon = ({ type }) => {
    const icons = {
      home: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/></svg>,
      cal: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
      list: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>,
      pill: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M8.5 6.5l7 7"/></svg>,
      receipt: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>,
      user: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
      users: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3a3 3 0 0 1 0 6M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
      visit: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      edit: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
      settings: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    }
    return icons[type] || icons.home
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: collapsed ? '64px 1fr' : '260px 1fr', background: 'var(--bg)' }}>

      {/* ─── Sidebar ─── */}
      <div style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--line)',
        padding: '22px 18px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '22px', borderBottom: '1px solid var(--line)', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Fraunces', serif", fontWeight: '500', fontSize: '17px', flexShrink: 0 }}>D</div>
          {!collapsed && <div>
            <b style={{ fontFamily: "'Fraunces', serif", fontWeight: '500', fontSize: '15px', display: 'block', color: 'var(--ink)' }}>DentaApp</b>
            <small style={{ color: 'var(--ink-3)', fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cabinet Dentaire</small>
          </div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: 'auto', color: 'var(--ink-3)', fontSize: '12px', padding: '4px' }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {!collapsed && <div style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '14px 10px 6px' }}>Navigation</div>}
          {getNavLinks().map(link => {
            const isActive = location.pathname === link.path
            return (
              <div
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '9px 10px',
                  borderRadius: '9px',
                  color: isActive ? '#fff' : 'var(--ink-2)',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  marginBottom: '3px',
                  transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                title={collapsed ? link.label : ''}
              >
                <span style={{ opacity: isActive ? 1 : 0.75, flexShrink: 0 }}>
                  <NavIcon type={link.icon} />
                </span>
                {!collapsed && <span>{link.label}</span>}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9d6d1, #9ab3ac)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: '500', fontSize: '13px', flexShrink: 0 }}>
            {initials}
          </div>
          {!collapsed && <>
            <div style={{ lineHeight: '1.2', overflow: 'hidden' }}>
              <b style={{ fontSize: '13px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nom_complet}</b>
              <small style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{user?.role}</small>
            </div>
            <button onClick={handleLogout} style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--rose)', flexShrink: 0 }}>Quitter</button>
          </>}
        </div>
      </div>

      {/* ─── Main ─── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{ padding: '18px 40px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ color: 'var(--ink-3)', fontSize: '12.5px' }}>
            DentaApp &nbsp;/&nbsp; <b style={{ color: 'var(--ink)', fontWeight: '500' }}>
              {getNavLinks().find(l => l.path === location.pathname)?.label || 'Dashboard'}
            </b>
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ border: '1px solid var(--line)', background: 'var(--card)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
              {user?.nom_complet?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '36px 40px 80px', maxWidth: '1180px', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout