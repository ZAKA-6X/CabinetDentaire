import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import jsPDF from 'jspdf'

function MyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/factures')
        setInvoices(res.data)
      } catch (err) {
        console.error('Erreur chargement factures')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Générer PDF facture ───
  const generatePDF = (facture) => {
    const doc = new jsPDF()

    // En-tête
    doc.setFontSize(20)
    doc.setTextColor(11, 31, 58)
    doc.text('Cabinet Dentaire DentaApp', 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(`Facture N°: ${facture.numero}`, 20, 35)
    doc.text(`Date: ${facture.date}`, 20, 43)
    doc.text(`Patient: ${facture.patient?.nom_complet}`, 20, 51)
    doc.text(`Médecin: Dr. ${facture.dentiste?.nom_complet}`, 20, 59)

    // Ligne séparatrice
    doc.setDrawColor(0, 201, 167)
    doc.line(20, 66, 190, 66)

    // Détail opérations
    doc.setFontSize(14)
    doc.setTextColor(11, 31, 58)
    doc.text('Détail des prestations:', 20, 76)

    let y = 88
    // Frais de base
    doc.setFontSize(11)
    doc.setTextColor(50)
    doc.text('• Frais de consultation (base)', 25, y)
    doc.text('200 MAD', 160, y)
    y += 10

    // Opérations
    facture.operations?.forEach((op) => {
      doc.text(`• ${op.nom}`, 25, y)
      doc.text(`${op.cout} MAD`, 160, y)
      y += 10
    })

    // Total
    y += 5
    doc.setDrawColor(200)
    doc.line(20, y, 190, y)
    y += 8
    doc.setFontSize(13)
    doc.setTextColor(11, 31, 58)
    doc.text('Total:', 130, y)
    doc.setTextColor(0, 201, 167)
    doc.text(`${facture.montant_total} MAD`, 160, y)

    // Statut
    y += 15
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Statut: ${facture.statut}`, 20, y)

    doc.save(`facture_${facture.numero}.pdf`)
  }

  return (
    <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>💳 Mes factures</h2>
          <p style={styles.sub}>Consultez et téléchargez vos factures</p>
        </div>

        <div style={styles.card}>
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : invoices.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>🧾</div>
              <p>Aucune facture trouvée</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>N° Facture</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Prestations</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(facture => (
                  <tr key={facture.id}>
                    <td style={styles.td}>
                      <strong>{facture.numero}</strong>
                    </td>
                    <td style={styles.td}>{facture.date}</td>
                    <td style={styles.td}>
                      {facture.operations?.map(o => o.nom).join(', ') || '—'}
                    </td>
                    <td style={styles.td}>
                      <strong>{facture.montant_total} MAD</strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(facture.statut === 'PAYÉE'
                          ? { background: '#D1FAE5', color: '#065F46' }
                          : { background: '#FEF3C7', color: '#92400E' })
                      }}>
                        {facture.statut}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnPdf}
                        onClick={() => generatePDF(facture)}
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#94A3B8',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '13px 14px',
    fontSize: '0.88rem',
    borderBottom: '1px solid #F1F5F9',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  btnPdf: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
}

export default MyInvoices