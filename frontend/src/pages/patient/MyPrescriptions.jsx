import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import jsPDF from 'jspdf'

function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/ordonnances')
        setPrescriptions(res.data)
      } catch {
        setPrescriptions([
          { id: 39, statut: 'COMPLÉTÉ', date: '2026-04-09', medicaments: [{ nom: 'Amoxicilline 500mg' }, { nom: 'Ibuprofène 400mg' }] },
          { id: 36, statut: 'ACTIF', date: '2026-03-02', medicaments: [{ nom: 'Paracétamol 1g' }, { nom: 'Chlorhexidine' }] },
        ])
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
    doc.text('Cabinet Dentaire DentaApp', 20, 20)
    doc.setFontSize(14)
    doc.setTextColor(50)
    doc.text(`Ordonnance RX-${String(p.id).padStart(4, '0')}`, 20, 35)
    doc.setFontSize(12)
    doc.text(`Date: ${formatDate(p.date)}`, 20, 45)
    let y = 60
    doc.setFontSize(13)
    doc.text('Médicaments:', 20, y)
    p.medicaments?.forEach(m => {
      y += 10
      doc.setFontSize(11)
      doc.text(`• ${m.nom}`, 25, y)
    })
    doc.save(`ordonnance-RX-${String(p.id).padStart(4, '0')}.pdf`)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const chipStyle = (statut) => ({
    'ACTIF':    { background: 'var(--accent-soft)', color: 'var(--accent)', dot: 'var(--accent)' },
    'COMPLÉTÉ': { background: 'var(--success-soft)', color: 'var(--success)', dot: 'var(--success)' },
    'ANNULÉ':   { background: 'var(--rose-soft)', color: 'var(--rose)', dot: 'var(--rose)' },
  })[statut] || {}

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
        ) : prescriptions.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💊</div>
            <p>Aucune ordonnance trouvée</p>
          </div>
        ) : (
          prescriptions.map(p => {
            const chip = chipStyle(p.statut)
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
                    {p.medicaments?.length || 0} médicaments · délivrée le {formatDate(p.date)}
                  </small>
                </div>

                {/* Statut */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '3px 10px', borderRadius: '999px',
                  fontSize: '11.5px', fontWeight: '500',
                  background: chip.background, color: chip.color,
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: chip.dot }}/>
                  {p.statut === 'ACTIF' ? 'Actif' : p.statut === 'COMPLÉTÉ' ? 'Complété' : 'Annulé'}
                </span>

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