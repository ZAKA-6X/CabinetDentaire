import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

const MONTHS_SHORT = ['JANV','FÉVR','MARS','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']

function MyVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get('/me')
        const patientId = meRes.data.profile.id
        const res = await api.get(`/patient/${patientId}/visites`)
        setVisits(res.data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = search
    ? visits.filter(v =>
        v.diagnostic?.toLowerCase().includes(search.toLowerCase()) ||
        v.traitement_fourni?.toLowerCase().includes(search.toLowerCase())
      )
    : visits

  return (
    <Layout>
      <div>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={styles.pageTitle}>
            Mes <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>visites</em>
          </h1>
          <p style={styles.pageSub}>
            Historique complet — diagnostics, traitements, opérations et ordonnances associées.
          </p>
        </div>

        {/* Recherche */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '22px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input
              placeholder="Rechercher dans diagnostics, traitements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '11px 14px 11px 38px',
                fontSize: '13.5px',
                background: 'var(--card)',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--ink)',
              }}
            />
          </div>
          <button style={{
            padding: '10px 16px',
            border: '1px solid var(--line-strong)',
            borderRadius: '10px',
            background: 'var(--card)',
            fontSize: '13px',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Filtrer par date
          </button>
        </div>

        {/* Liste visites */}
        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>Chargement...</p>
        ) : error ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <p>Impossible de charger les visites. Vérifiez votre connexion.</p>
          </div>
        ) : (
          <div style={styles.card}>
            {filtered.map((visite, i) => {
              const d = new Date(visite.date_visite)
              const day   = isNaN(d) ? '—' : d.getDate()
              const month = isNaN(d) ? '—' : MONTHS_SHORT[d.getMonth()]
              const year  = isNaN(d) ? '' : d.getFullYear()
              const title = visite.diagnostic || visite.traitement_fourni || 'Visite médicale'
              return (
                <div key={visite.id} style={{
                  ...styles.visitRow,
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none',
                }}>

                  {/* Date */}
                  <div style={styles.visitDate}>
                    <div style={styles.visitDay}>{day}</div>
                    <div style={styles.visitMonth}>{month}</div>
                    <div style={styles.visitYear}>{year}</div>
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <b style={styles.visitTitle}>{title}</b>
                    <small style={styles.visitMeta}>
                      visite V-{String(visite.id).padStart(4, '0')}
                    </small>
                    {visite.traitement_fourni && (
                      <p style={styles.visitDiag}>{visite.traitement_fourni}</p>
                    )}
                  </div>

                  {/* Droite */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ ...styles.chip, background: 'var(--success-soft)', color: 'var(--success)' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}/>
                      Complété
                    </span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--accent)' }}>
                      {visite.ordonnance && <span style={{ cursor: 'pointer' }}>· Ordonnance</span>}
                      {visite.facture && <span style={{ cursor: 'pointer' }}>· Facture</span>}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
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
  pageSub: { color: 'var(--ink-2)', fontSize: '14px', margin: 0 },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    padding: '0 22px',
  },
  visitRow: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr auto',
    gap: '20px',
    padding: '20px 0',
    alignItems: 'start',
  },
  visitDate: { paddingTop: '2px' },
  visitDay: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '400',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
  },
  visitMonth: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--ink-3)',
    marginTop: '2px',
  },
  visitYear: {
    fontSize: '11px',
    color: 'var(--ink-3)',
    marginTop: '1px',
  },
  visitTitle: {
    fontSize: '14px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '3px',
    color: 'var(--ink)',
  },
  visitMeta: {
    color: 'var(--ink-3)',
    fontSize: '12.5px',
    display: 'block',
    marginBottom: '6px',
  },
  visitDiag: {
    color: 'var(--ink-2)',
    fontSize: '13px',
    margin: 0,
    lineHeight: '1.5',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11.5px',
    fontWeight: '500',
  },
}

export default MyVisits