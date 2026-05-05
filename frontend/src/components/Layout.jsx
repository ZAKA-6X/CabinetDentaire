import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // ─── Liens selon rôle ───
  const getNavLinks = () => {
    if (user?.role === 'PATIENT') return [
      { icon: '🏠', label: 'Accueil', path: '/patient/dashboard' },
      { icon: '📅', label: 'Réserver RDV', path: '/patient/reserver' },
      { icon: '📋', label: 'Mes RDV', path: '/patient/rendez-vous' },
      { icon: '🏥', label: 'Mes visites', path: '/patient/visites' },
      { icon: '💊', label: 'Ordonnances', path: '/patient/ordonnances' },
      { icon: '💳', label: 'Factures', path: '/patient/factures' },
      { icon: '👤', label: 'Mon profil', path: '/patient/profil' },
    ]
    if (user?.role === 'SECRETAIRE') return [
      { icon: '🏠', label: 'Accueil', path: '/secretaire/dashboard' },
      { icon: '📋', label: 'Rendez-vous', path: '/secretaire/rendez-vous' },
      { icon: '💳', label: 'Paiements', path: '/secretaire/paiements' },
      { icon: '💊', label: 'Médicaments', path: '/secretaire/medicaments' },
      { icon: '⚙️', label: 'Opérations', path: '/secretaire/operations' },
      { icon: '👥', label: 'Patients', path: '/secretaire/patients' },
    ]
    if (user?.role === 'DENTISTE') return [
      { icon: '🏠', label: 'Accueil', path: '/dentiste/dashboard' },
      { icon: '📝', label: 'Enregistrer visite', path: '/dentiste/visite/nouvelle' },
      { icon: '💊', label: 'Ordonnance', path: '/dentiste/ordonnance/nouvelle' },
      { icon: '👥', label: 'Patients', path: '/dentiste/patients' },
    ]
    return []
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.nom_complet
    ?.split(' ')
    ?.map(n => n[0])
    ?.join('')
    ?.slice(0, 2)
    ?.toUpperCase()

  return (
    <div style={styles.wrapper}>

      {/* ─── Sidebar ─── */}
      <div style={{
        ...styles.sidebar,
        width: collapsed ? '70px' : '240px',
      }}>

        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>🦷</div>
          {!collapsed && (
            <span style={styles.logoText}>DentaApp</span>
          )}
        </div>

        {/* Toggle collapse */}
        <button
          style={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>

        {/* Nav links */}
        <nav style={styles.nav}>
          {getNavLinks().map(link => {
            const isActive = location.pathname === link.path
            return (
              <div
                key={link.path}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onClick={() => navigate(link.path)}
                title={collapsed ? link.label : ''}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                {!collapsed && (
                  <span style={styles.navLabel}>{link.label}</span>
                )}
              </div>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={styles.sidebarBottom}>
          {!collapsed && (
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>{initials}</div>
              <div>
                <div style={styles.userName}>
                  {user?.nom_complet?.split(' ')[0]}
                </div>
                <div style={styles.userRole}>{user?.role}</div>
              </div>
            </div>
          )}
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            title="Déconnexion"
          >
            🚪
          </button>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <div style={{
        ...styles.main,
        marginLeft: collapsed ? '70px' : '240px',
      }}>

        {/* Topbar */}
        <div style={styles.topbar}>
          <div>
            <h2 style={styles.topbarTitle}>
              {getNavLinks().find(l => l.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div style={styles.topbarRight}>
            <span style={styles.topbarDate}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <div style={styles.topbarAvatar}>{initials}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={styles.content}>
          {children}
        </div>

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F0F4F8',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    background: 'white',
    boxShadow: '2px 0 20px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s',
    zIndex: 100,
    overflow: 'hidden',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '1.25rem 1rem',
    borderBottom: '1px solid #F1F5F9',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #00C9A7, #0B1F3A)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'Georgia, serif',
    fontWeight: '700',
    color: '#0B1F3A',
    fontSize: '1.1rem',
    whiteSpace: 'nowrap',
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#94A3B8',
    fontSize: '1rem',
    alignSelf: 'flex-end',
    marginRight: '8px',
    marginTop: '4px',
  },
  nav: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '4px',
    color: '#64748B',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    background: '#EEF9F6',
    color: '#00C9A7',
    fontWeight: '600',
  },
  navIcon: { fontSize: '1.1rem', flexShrink: 0 },
  navLabel: { fontSize: '0.88rem' },
  sidebarBottom: {
    padding: '1rem',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflow: 'hidden',
  },
  userAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#0B1F3A',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#0B1F3A',
    whiteSpace: 'nowrap',
  },
  userRole: {
    fontSize: '0.72rem',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: '#FEF2F2',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '1rem',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.3s',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    background: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  topbarTitle: {
    fontSize: '1.2rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  topbarDate: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    textTransform: 'capitalize',
  },
  topbarAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#0B1F3A',
  },
  content: {
    padding: '1.5rem 2rem',
    flex: 1,
  },
}

export default Layout