import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function ManagePayments() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/factures')
        setFactures(res.data)
      } catch (err) {
        console.error('Erreur chargement factures')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Marquer PAYÉE ───
  const handlePaid = async (id) => {
    if (!window.confirm('Confirmer le paiement ?')) return
    try {
      await api.post(`/factures/${id}/payment`)
      const updated = factures.map(f =>
        f.id === id ? { ...f, statut: 'PAYÉE' } : f
      )
      setFactures(updated)
      alert('💳 Paiement enregistré — Email envoyé au patient')
    } catch (err) {
      alert('Erreur lors du paiement')
    }
  }

  const enAttente = factures.filter(f => f.statut === 'EN_ATTENTE')
  const payees = factures.filter(f => f.statut === 'PAYÉE')

  return (
   <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}> Gestion des <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>paiements</em></h2>
          <p style={styles.sub}>Enregistrez les paiements des patients</p>
        </div>

        {/* Stats rapides */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#FEF3C7'}}>⏳</div>
            <div>
              <div style={styles.statNum}>{enAttente.length}</div>
              <div style={styles.statLbl}>En attente</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#D1FAE5'}}>✅</div>
            <div>
              <div style={styles.statNum}>{payees.length}</div>
              <div style={styles.statLbl}>Payées</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#E6FAF6'}}>💰</div>
            <div>
              <div style={styles.statNum}>
                {payees.reduce((sum, f) => sum + f.montant_total, 0)} MAD
              </div>
              <div style={styles.statLbl}>Total encaissé</div>
            </div>
          </div>
        </div>

        {/* Factures EN_ATTENTE */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⏳ Factures en attente de paiement</h3>

          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : enAttente.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>✅</div>
              <p>Toutes les factures sont payées !</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>N° Facture</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date visite</th>
                  <th style={styles.th}>Prestations</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {enAttente.map(f => (
                  <tr key={f.id}>
                    <td style={styles.td}>
                      <strong>{f.numero}</strong>
                    </td>
                    <td style={styles.td}>
                      <strong>{f.patient?.nom_complet}</strong>
                      <br />
                      <small style={{ color: '#94A3B8' }}>
                        {f.patient?.telephone}
                      </small>
                    </td>
                    <td style={styles.td}>{f.date}</td>
                    <td style={styles.td}>
                      {f.operations?.map(o => o.nom).join(', ') || '—'}
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: '#0B1F3A', fontSize: '1rem' }}>
                        {f.montant_total} MAD
                      </strong>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnPaid}
                        onClick={() => handlePaid(f.id)}
                      >
                        💳 Marquer PAYÉE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Factures PAYÉES */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>✅ Factures payées</h3>
          {payees.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>Aucune facture payée</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>N° Facture</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {payees.map(f => (
                  <tr key={f.id}>
                    <td style={styles.td}><strong>{f.numero}</strong></td>
                    <td style={styles.td}>{f.patient?.nom_complet}</td>
                    <td style={styles.td}>{f.date}</td>
                    <td style={styles.td}><strong>{f.montant_total} MAD</strong></td>
                    <td style={styles.td}>
                      <span style={styles.badgePaid}>✅ Payée</span>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  statNum: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#0B1F3A',
    lineHeight: 1,
  },
  statLbl: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    marginTop: '4px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.05rem',
    color: '#0B1F3A',
    margin: '0 0 1rem 0',
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
  btnPaid: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
  badgePaid: {
    background: '#D1FAE5',
    color: '#065F46',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
}

export default ManagePayments