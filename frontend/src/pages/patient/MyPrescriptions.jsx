import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import jsPDF from 'jspdf'

function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get('/me')
        const patientId = meRes.data.profile.id
        const res = await api.get(`/patient/${patientId}/ordonnances`)
        setPrescriptions(res.data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const generatePDF = (p) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setTextColor(15, 72, 66)
    doc.text('HZ Dentaire', 20, 20)
    doc.setFontSize(14)
    doc.setTextColor(50)
    doc.text(`Ordonnance RX-${String(p.id).padStart(4, '0')}`, 20, 35)
    doc.setFontSize(12)
    doc.text(`Date: ${formatDate(p.date_delivrance)}`, 20, 45)
    if (p.instructions_generales) {
      doc.text(`Instructions: ${p.instructions_generales}`, 20, 53)
    }
    let y = 65
    doc.setFontSize(13)
    doc.text('Médicaments:', 20, y)
    p.medicaments?.forEach(m => {
      y += 10
      doc.setFontSize(11)
      const nom = m.medicament?.nom || m.nom || '—'
      const detail = [m.frequence, m.duree_jours ? `${m.duree_jours} jours` : null].filter(Boolean).join(' · ')
      doc.text(`• ${nom}${detail ? `  (${detail})` : ''}`, 25, y)
      if (m.instructions_speciales) {
        y += 7
        doc.setTextColor(100)
        doc.text(`  ${m.instructions_speciales}`, 28, y)
        doc.setTextColor(50)
      }
    })
    doc.save(`ordonnance-RX-${String(p.id).padStart(4, '0')}.pdf`)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, day] = dateStr.split('-')
    const d = new Date(+y, +m - 1, +day)
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <Layout>
      <div>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={styles.pageTitle}>
            Mes <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>ordonnances</em>
          </h1>
          <p style={styles.pageSub}>
            Toutes les ordonnances délivrées par votre dentiste. Téléchargez-les au format PDF pour la pharmacie.
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>Chargement...</p>
        ) : error ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <p>Impossible de charger les ordonnances.</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💊</div>
            <p>Aucune ordonnance trouvée</p>
          </div>
        ) : (
          prescriptions.map(p => {
            return (
              <div key={p.id} style={styles.row}>

                {/* Icone */}
                <div style={styles.icon}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-30 12 12)"/>
                    <path d="M8.5 6.5l7 7"/>
                  </svg>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <b style={styles.rowTitle}>
                    Ordonnance RX-{String(p.id).padStart(4, '0')}
                  </b>
                  <small style={styles.rowMeta}>
                    {p.medicaments?.length || 0} médicaments · délivrée le {formatDate(p.date_delivrance)}
                  </small>
                </div>

                {/* Bouton PDF */}
                <button style={styles.btnPDF} onClick={() => generatePDF(p)}>
                  ↓ PDF
                </button>

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
  pageSub: { color: 'var(--ink-2)', fontSize: '14px', margin: 0, maxWidth: '60ch' },
  empty: { textAlign: 'center', padding: '4rem', color: 'var(--ink-3)' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    marginBottom: '10px',
    transition: 'border-color 0.15s',
  },
  icon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    flexShrink: 0,
  },
  rowTitle: {
    fontSize: '14.5px',
    fontWeight: '500',
    fontFamily: "'Fraunces', serif",
    display: 'block',
    marginBottom: '2px',
    color: 'var(--ink)',
  },
  rowMeta: { color: 'var(--ink-3)', fontSize: '12.5px' },
  btnPDF: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid var(--line-strong)',
    color: 'var(--ink)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
}

export default MyPrescriptions