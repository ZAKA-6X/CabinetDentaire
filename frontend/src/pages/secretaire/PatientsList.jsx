import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function PatientsList() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [rdvPatient, setRdvPatient] = useState([])
  const [loadingRdv, setLoadingRdv] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/patients')
        setPatients(res.data)
      } catch (err) {
        console.error('Erreur chargement patients')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Voir historique RDV patient ───
  const handleViewRdv = async (patient) => {
    setSelectedPatient(patient)
    setLoadingRdv(true)
    try {
      const res = await api.get(`/patients/${patient.id}/rendez-vous`)
      setRdvPatient(res.data)
    } catch (err) {
      console.error('Erreur chargement RDV patient')
    } finally {
      setLoadingRdv(false)
    }
  }

  // ─── Badge statut ───
  const getBadge = (statut) => {
    const badges = {
      'EN_ATTENTE': { background: '#FEF3C7', color: '#92400E' },
      'CONFIRMÉ':   { background: '#D1FAE5', color: '#065F46' },
      'ANNULÉ':     { background: '#FEE2E2', color: '#991B1B' },
      'COMPLÉTÉ':   { background: '#DBEAFE', color: '#1E40AF' },
    }
    return badges[statut] || {}
  }

  // ─── Filtrer patients ───
  const filtered = patients.filter(p =>
    p.nom_complet?.toLowerCase().includes(search.toLowerCase()) ||
    p.telephone?.includes(search)
  )

  return (
    <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}> Liste des <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>patients</em></h2>
          <p style={styles.sub}>Consultez les informations et historiques</p>
        </div>

        <div style={styles.grid}>

          {/* ─── Liste patients ─── */}
          <div style={styles.card}>
            <div style={styles.searchBar}>
              <input
                style={styles.searchInput}
                placeholder="🔍 Rechercher par nom ou téléphone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p style={{ color: '#94A3B8' }}>Chargement...</p>
            ) : filtered.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: '3rem' }}>👥</div>
                <p>Aucun patient trouvé</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Téléphone</th>
                    <th style={styles.th}>Date naissance</th>
                    <th style={styles.th}>Historique</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(patient => (
                    <tr
                      key={patient.id}
                      style={{
                        background: selectedPatient?.id === patient.id
                          ? '#F0FDF9' : 'white'
                      }}
                    >
                      <td style={styles.td}>
                        <div style={styles.patientInfo}>
                          <div style={styles.avatar}>
                            {patient.nom_complet?.charAt(0)?.toUpperCase()}
                          </div>
                          <strong>{patient.nom_complet}</strong>
                        </div>
                      </td>
                      <td style={styles.td}>{patient.telephone}</td>
                      <td style={styles.td}>{patient.date_naissance}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.btnView}
                          onClick={() => handleViewRdv(patient)}
                        >
                          Voir RDV →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ─── Historique RDV ─── */}
          {selectedPatient && (
            <div style={styles.card}>
              <div style={styles.patientHeader}>
                <div style={styles.avatarLg}>
                  {selectedPatient.nom_complet?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <strong style={{ color: '#0B1F3A', fontSize: '1rem' }}>
                    {selectedPatient.nom_complet}
                  </strong>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                    📞 {selectedPatient.telephone}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                    🎂 {selectedPatient.date_naissance}
                  </div>
                </div>
              </div>

              <h3 style={styles.cardTitle}>📋 Historique rendez-vous</h3>

              {loadingRdv ? (
                <p style={{ color: '#94A3B8' }}>Chargement...</p>
              ) : rdvPatient.length === 0 ? (
                <p style={{ color: '#94A3B8' }}>
                  Aucun rendez-vous trouvé
                </p>
              ) : (
                rdvPatient.map(rdv => (
                  <div key={rdv.id} style={styles.rdvItem}>
                    <div style={styles.rdvTime}>
                      <div style={styles.rdvHour}>
                        {rdv.heure?.slice(0, 5)}
                      </div>
                      <div style={styles.rdvDate}>{rdv.date}</div>
                    </div>
                    <div style={styles.rdvDivider}></div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.rdvNotes}>
                        {rdv.notes || 'Pas de notes'}
                      </div>
                    </div>
                    <span style={{
                      ...styles.badge,
                      ...getBadge(rdv.statut)
                    }}>
                      {rdv.statut}
                    </span>
                  </div>
                ))
              )}
            </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: selectedPatient => selectedPatient ? '1fr 1fr' : '1fr',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
  },
  searchBar: { marginBottom: '1.25rem' },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box',
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
    verticalAlign: 'middle',
  },
  patientInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0B1F3A',
    flexShrink: 0,
  },
  btnView: {
    background: '#F1F5F9',
    color: '#0B1F3A',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
  patientHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#F0FDF9',
    borderRadius: '8px',
  },
  avatarLg: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#0B1F3A',
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#0B1F3A',
    margin: '0 0 1rem 0',
  },
  rdvItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  rdvTime: { textAlign: 'center', minWidth: '55px' },
  rdvHour: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0B1F3A',
  },
  rdvDate: {
    fontSize: '0.72rem',
    color: '#94A3B8',
  },
  rdvDivider: {
    width: '2px',
    height: '35px',
    background: '#B2F0E8',
    borderRadius: '1px',
  },
  rdvNotes: {
    fontSize: '0.85rem',
    color: '#475569',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
}

export default PatientsList