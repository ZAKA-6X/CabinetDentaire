import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

const FILTERS = [
  { key: '', label: 'Tous' },
  { key: 'EN_ATTENTE', label: 'En attente' },
  { key: 'CONFIRMÉ', label: 'Confirmés' },
  { key: 'COMPLÉTÉ', label: 'Complétés' },
  { key: 'ANNULÉ', label: 'Annulés' },
]

function MyAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/rendez-vous')
        setAppointments(res.data)
      } catch (err) {
        console.error('Erreur chargement RDV')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Confirmer l\'annulation ?')) return
    try {
      await api.delete(`/rendez-vous/${id}`)
      setAppointments(appointments.map(r =>
        r.id === id ? { ...r, statut: 'ANNULÉ' } : r
      ))
    } catch {
      alert('Erreur lors de l\'annulation')
    }
  }

  const filtered = filter
    ? appointments.filter(r => r.statut === filter)
    : appointments

  const countBy = (key) => appointments.filter(r => r.statut === key).length

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
    const months = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC']
    return `${days[d.getDay()]}. ${d.getDate()} ${months[d.getMonth()]}`
  }

  const chipStyle = (statut) => {
    const map = {
      'EN_ATTENTE': { background: 'var(--amber-soft)', color: '#8d6a2b', dot: 'var(--gold)' },
      'CONFIRMÉ':   { background: 'var(--accent-soft)', color: 'var(--accent)', dot: 'var(--accent)' },
      'COMPLÉTÉ':   { background: 'var(--success-soft)', color: 'var(--success)', dot: 'var(--success)' },
      'ANNULÉ':     { background: 'var(--rose-soft)', color: 'var(--rose)', dot: 'var(--rose)' },
    }
    return map[statut] || map['EN_ATTENTE']
  }

  return (
    <Layout>
      <div>

        {/* ─── Header ─── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={styles.pageTitle}>
              Mes <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>rendez-vous</em>
            </h1>
            <p style={styles.pageSub}>
              Retrouvez toutes vos réservations — en attente, confirmées, passées.
            </p>
          </div>
          <button
            style={styles.btnPrimary}
            onClick={() => navigate('/patient/reserver')}
          >
            + Nouveau rendez-vous
          </button>
        </div>

        {/* ─── Tabs filtre ─── */}
        <div style={styles.tabs}>
          {FILTERS.map(f => (
            <div
              key={f.key}
              style={{
                ...styles.tab,
                ...(filter === f.key ? styles.tabActive : {})
              }}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span style={{
                marginLeft: '5px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                color: filter === f.key ? 'var(--accent)' : 'var(--ink-3)',
              }}>
                {f.key === '' ? appointments.length : countBy(f.key)}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Liste RDV ─── */}
        {loading ? (
          <p style={{ color: 'var(--ink-3)', padding: '2rem 0' }}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
            <p>Aucun rendez-vous trouvé</p>
          </div>
        ) : (
          filtered.map(rdv => {
            const chip = chipStyle(rdv.statut)
            return (
              <div key={rdv.id} style={styles.apptCard}>

                {/* Heure + date */}
                <div style={styles.apptTime}>
                  <div style={styles.apptHour}>
                    {rdv.heure?.slice(0, 5)?.replace(':', 'h')}
                  </div>
                  <div style={styles.apptDate}>
                    {formatDate(rdv.date)}
                  </div>
                </div>

                {/* Séparateur */}
                <div style={styles.apptDivider}/>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <b style={styles.apptTitle}>
                    {rdv.notes || 'Rendez-vous médical'}
                  </b>
                  <small style={styles.apptMeta}>
                    avec Dr. {rdv.dentiste?.nom_complet || 'Médecin'} · {rdv.id ? `RDV-${String(rdv.id).padStart(4, '0')}` : ''}
                  </small>
                </div>

                {/* Statut + actions */}
                <div style={styles.apptActions}>
                  {/* Chip statut */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '3px 10px', borderRadius: '999px',
                    fontSize: '11.5px', fontWeight: '500',
                    background: chip.background, color: chip.color,
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: chip.dot }}/>
                    {rdv.statut === 'EN_ATTENTE' ? 'En attente' :
                     rdv.statut === 'CONFIRMÉ' ? 'Confirmé' :
                     rdv.statut === 'COMPLÉTÉ' ? 'Complété' : 'Annulé'}
                  </span>

                  <button style={styles.btnGhost}>Détails</button>

                  {rdv.statut === 'EN_ATTENTE' && (
                    <button
                      style={styles.btnDanger}
                      onClick={() => handleCancel(rdv.id)}
                    >
                      Annuler
                    </button>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>
    </Layout>
  )
}

const styles = {
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: '400',
    fontSize: '36px',
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
    margin: '0 0 6px',
    lineHeight: '1.1',
  },
  pageSub: {
    color: 'var(--ink-2)',
    fontSize: '14px',
    margin: 0,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '500',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid var(--line)',
    marginBottom: '22px',
  },
  tab: {
    padding: '10px 14px',
    fontSize: '13px',
    color: 'var(--ink-3)',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    color: 'var(--ink-3)',
  },
  apptCard: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    gap: '20px',
    padding: '18px 22px',
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    marginBottom: '10px',
    alignItems: 'center',
    transition: 'border-color 0.15s',
  },
  apptTime: {
    textAlign: 'center',
    minWidth: '80px',
  },
  apptHour: {
    fontFamily: '"Geist Mono", monospace',
    fontSize: '20px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
  },
  apptDate: {
    fontSize: '11px',
    color: 'var(--ink-3)',
    marginTop: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  apptDivider: {
    width: '1px',
    height: '40px',
    background: 'var(--line)',
  },
  apptTitle: {
    fontSize: '14.5px',
    fontWeight: '500',
    fontFamily: "'Fraunces', serif",
    display: 'block',
    marginBottom: '3px',
    color: 'var(--ink)',
  },
  apptMeta: {
    color: 'var(--ink-3)',
    fontSize: '12.5px',
  },
  apptActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 11px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid var(--line-strong)',
    color: 'var(--ink)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 11px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid var(--rose-soft)',
    color: 'var(--rose)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

export default MyAppointments