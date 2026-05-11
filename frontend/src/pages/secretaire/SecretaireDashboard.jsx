import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function SecretaireDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ rdvEnAttente: 0, facturesEnAttente: 0, totalPatients: 0, rdvCeMois: 0 })
  const [rdvEnAttente, setRdvEnAttente] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rdvRes = await api.get('/rendez-vous')
        const enAttente = rdvRes.data.filter(r => r.statut === 'EN_ATTENTE')
        setRdvEnAttente(enAttente)
        setStats(prev => ({ ...prev, rdvEnAttente: enAttente.length }))
      } catch {
        setRdvEnAttente([
          { id: 1, patient: { nom_complet: 'Ahmed Mansouri', telephone: '0661234567' }, date: '2026-05-08', heure: '09:00', notes: 'Douleur molaire' },
          { id: 2, patient: { nom_complet: 'Nadia Berrada', telephone: '0662345678' }, date: '2026-05-09', heure: '14:30', notes: 'Contrôle annuel' },
        ])
        setStats({ rdvEnAttente: 2, facturesEnAttente: 3, totalPatients: 48, rdvCeMois: 12 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleConfirm = async (id) => {
    try {
      await api.put(`/rendez-vous/${id}/confirm`)
      setRdvEnAttente(prev => prev.filter(r => r.id !== id))
      setStats(prev => ({ ...prev, rdvEnAttente: prev.rdvEnAttente - 1 }))
    } catch { alert('Erreur confirmation') }
  }

  const handleReject = async (id) => {
    const raison = prompt('Raison du rejet :')
    if (!raison) return
    try {
      await api.put(`/rendez-vous/${id}/reject`, { raison })
      setRdvEnAttente(prev => prev.filter(r => r.id !== id))
      setStats(prev => ({ ...prev, rdvEnAttente: prev.rdvEnAttente - 1 }))
    } catch { alert('Erreur rejet') }
  }

  const STATS = [
    { label: 'RDV en attente', value: stats.rdvEnAttente, bg: '#FEF3C7', color: '#92400E', icon: '⏳' },
    { label: 'Factures à encaisser', value: stats.facturesEnAttente, bg: '#FEE2E2', color: '#991B1B', icon: '💳' },
    { label: 'Patients enregistrés', value: stats.totalPatients, bg: 'var(--accent-soft)', color: 'var(--accent)', icon: '👥' },
    { label: 'RDV ce mois', value: stats.rdvCeMois, bg: '#EDE9FE', color: '#5B21B6', icon: '📅' },
  ]

  const SHORTCUTS = [
    { label: 'Rendez-vous', path: '/secretaire/rendez-vous' },
    { label: 'Paiements',  path: '/secretaire/paiements' },
    { label: 'Médicaments', path: '/secretaire/medicaments' },
    { label: 'Opérations',  path: '/secretaire/operations' },
    { label: 'Patients',  path: '/secretaire/patients' },
  ]

  return (
    <Layout>
      <div>

        {/* Titre */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={styles.pageTitle}>
            Tableau de bord <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Secrétaire</em>
          </h1>
          <p style={styles.pageSub}>Gestion du cabinet dentaire</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={styles.statNum}>{s.value}</div>
                <div style={styles.statLbl}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Raccourcis */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚡ Raccourcis</h3>
          <div style={styles.shortcutGrid}>
            {SHORTCUTS.map(s => (
              <div key={s.path} style={styles.shortcut} onClick={() => navigate(s.path)}>
                <div style={styles.shortcutIcon}>{s.icon}</div>
                <span style={styles.shortcutLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RDV en attente */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ ...styles.cardTitle, margin: 0 }}>⏳ Demandes en attente</h3>
            <span
              style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: '500' }}
              onClick={() => navigate('/secretaire/rendez-vous')}
            >
              Voir tout →
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--ink-3)' }}>Chargement...</p>
          ) : rdvEnAttente.length === 0 ? (
            <p style={{ color: 'var(--ink-3)' }}>Aucune demande en attente ✅</p>
          ) : (
            rdvEnAttente.map(rdv => (
              <div key={rdv.id} style={styles.rdvRow}>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '14px', color: 'var(--ink)', fontFamily: "'Fraunces', serif" }}>
                    {rdv.patient?.nom_complet}
                  </b>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', marginTop: '2px' }}>
                    {rdv.date} · {rdv.heure?.slice(0, 5)} · {rdv.notes || '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{ ...styles.btnSmall, background: 'var(--success-soft)', color: 'var(--success)', border: 'none' }}
                    onClick={() => handleConfirm(rdv.id)}
                  >
                    ✓ Confirmer
                  </button>
                  <button
                    style={{ ...styles.btnSmall, background: 'var(--rose-soft)', color: 'var(--rose)', border: 'none' }}
                    onClick={() => handleReject(rdv.id)}
                  >
                    ✕ Rejeter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

const styles = {
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: '400',
    fontSize: '32px',
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
    margin: '0 0 6px',
  },
  pageSub: { color: 'var(--ink-2)', fontSize: '14px', margin: 0 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '48px', height: '48px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem', flexShrink: 0,
  },
  statNum: { fontSize: '1.8rem', fontWeight: '600', color: 'var(--ink)', lineHeight: 1 },
  statLbl: { fontSize: '0.82rem', color: 'var(--ink-3)', marginTop: '4px' },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '22px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '1.05rem',
    color: 'var(--ink)',
    margin: '0 0 1rem',
  },
  shortcutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
  },
  shortcut: {
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: 'var(--surface)',
  },
  shortcutIcon: { fontSize: '1.8rem', marginBottom: '8px' },
  shortcutLabel: { fontSize: '0.82rem', color: 'var(--ink-2)', fontWeight: '500' },
  rdvRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px dashed var(--line)',
  },
  btnSmall: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

export default SecretaireDashboard