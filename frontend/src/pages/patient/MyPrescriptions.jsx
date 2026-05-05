import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import jsPDF from 'jspdf'

function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/ordonnances')
        setPrescriptions(res.data)
      } catch (err) {
        console.error('Erreur chargement ordonnances')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Générer PDF ordonnance ───
  const generatePDF = (prescription) => {
    const doc = new jsPDF()

    // En-tête
    doc.setFontSize(20)
    doc.setTextColor(11, 31, 58)
    doc.text('Cabinet Dentaire DentaApp', 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(`Patient: ${prescription.patient?.nom_complet}`, 20, 35)
    doc.text(`Date: ${prescription.date}`, 20, 43)
    doc.text(`Médecin: Dr. ${prescription.dentiste?.nom_complet}`, 20, 51)

    // Ligne séparatrice
    doc.setDrawColor(0, 201, 167)
    doc.line(20, 58, 190, 58)

    // Médicaments
    doc.setFontSize(14)
    doc.setTextColor(11, 31, 58)
    doc.text('Médicaments prescrits:', 20, 68)

    let y = 80
    prescription.medicaments?.forEach((med) => {
      doc.setFontSize(11)
      doc.setTextColor(50)
      doc.text(`• ${med.nom} — ${med.frequence} — ${med.duree_jours} jours`, 25, y)
      y += 10
    })

    // Instructions
    if (prescription.instructions_generales) {
      y += 5
      doc.setFontSize(12)
      doc.setTextColor(11, 31, 58)
      doc.text('Instructions:', 20, y)
      y += 8
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(prescription.instructions_generales, 25, y)
    }

    doc.save(`ordonnance_${prescription.patient?.nom_complet}.pdf`)
  }

  // ─── Badge statut ───
  const getBadge = (statut) => {
    const badges = {
      'ACTIF':    { background: '#D1FAE5', color: '#065F46' },
      'COMPLÉTÉ': { background: '#DBEAFE', color: '#1E40AF' },
      'ANNULÉ':   { background: '#FEE2E2', color: '#991B1B' },
    }
    return badges[statut] || { background: '#F1F5F9', color: '#475569' }
  }

  const filtered = filter
    ? prescriptions.filter(p => p.statut === filter)
    : prescriptions

  return (
   <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>💊 Mes ordonnances</h2>
          <p style={styles.sub}>Consultez et téléchargez vos ordonnances</p>
        </div>

        <div style={styles.card}>

          {/* Filtre statut */}
          <div style={styles.filterBar}>
            {['', 'ACTIF', 'COMPLÉTÉ', 'ANNULÉ'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === s ? styles.filterBtnActive : {})
                }}
              >
                {s || 'Tous'}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>💊</div>
              <p>Aucune ordonnance trouvée</p>
            </div>
          ) : (
            filtered.map(p => (
              <div key={p.id} style={styles.prescriptionItem}>
                <div style={styles.prescriptionHeader}>
                  <div>
                    <div style={styles.prescriptionTitle}>
                      💊 {p.medicaments?.map(m => m.nom).join(', ')}
                    </div>
                    <div style={styles.prescriptionDetail}>
                      Dr. {p.dentiste?.nom_complet} — {p.date}
                    </div>
                  </div>
                  <span style={{ ...styles.badge, ...getBadge(p.statut) }}>
                    {p.statut}
                  </span>
                </div>

                {/* Médicaments */}
                <div style={styles.medsList}>
                  {p.medicaments?.map((med, i) => (
                    <div key={i} style={styles.medItem}>
                      <strong>{med.nom}</strong>
                      {' — '}{med.frequence}{' — '}{med.duree_jours} jours
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                {p.instructions_generales && (
                  <div style={styles.instructions}>
                    📋 {p.instructions_generales}
                  </div>
                )}

                {/* Bouton PDF */}
                <button
                  style={styles.btnPdf}
                  onClick={() => generatePDF(p)}
                >
                  📄 Télécharger PDF
                </button>
              </div>
            ))
          )}
        </div>
       </div>
</Layout>
  )
}

const styles = {
 
  title: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  sub: { color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.25rem',
  },
  filterBtn: {
    padding: '6px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '99px',
    background: 'white',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
  filterBtnActive: {
    background: '#0B1F3A',
    color: 'white',
    borderColor: '#0B1F3A',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#94A3B8',
  },
  prescriptionItem: {
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  prescriptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  prescriptionTitle: {
    fontWeight: '600',
    color: '#0B1F3A',
    fontSize: '0.95rem',
  },
  prescriptionDetail: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    marginTop: '3px',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  medsList: {
    marginBottom: '0.75rem',
  },
  medItem: {
    fontSize: '0.85rem',
    color: '#475569',
    padding: '4px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  instructions: {
    fontSize: '0.82rem',
    color: '#64748B',
    background: '#F8FAFC',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '0.75rem',
  },
  btnPdf: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
}

export default MyPrescriptions