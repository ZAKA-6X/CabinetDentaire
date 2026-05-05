import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function PatientHistory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [visites, setVisites] = useState([])
  const [ordonnances, setOrdonnances] = useState([])
  const [loading, setLoading] = useState(false)

  // ─── Charger liste patients ───
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients')
        setPatients(res.data)
        if (id) {
          const patient = res.data.find(p => p.id === parseInt(id))
          if (patient) loadPatientData(patient)
        }
      } catch (err) {
        console.error('Erreur chargement patients')
      }
    }
    fetchPatients()
  }, [])

  // ─── Charger données patient ───
  const loadPatientData = async (patient) => {
    setSelectedPatient(patient)
    setLoading(true)
    try {
      const [visitesRes, ordonnancesRes] = await Promise.all([
        api.get(`/patients/${patient.id}/visites`),
        api.get(`/patients/${patient.id}/ordonnances`),
      ])
      setVisites(visitesRes.data)
      setOrdonnances(ordonnancesRes.data)
    } catch (err) {
      console.error('Erreur chargement historique')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPatient = (e) => {
    const patient = patients.find(p => p.id === parseInt(e.target.value))
    if (patient) loadPatientData(patient)
  }

  return (
   <Layout>
      <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>👥 Historique patient</h2>
          <p style={styles.sub}>Consultez le dossier complet du patient</p>
        </div>

        {/* Sélectionner patient */}
        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Sélectionner un patient</label>
            <select
              style={{ ...styles.input, maxWidth: '350px' }}
              onChange={handleSelectPatient}
              defaultValue=""
            >
              <option value="">-- Choisir un patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom_complet}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Données patient */}
        {selectedPatient && (
          <div style={styles.grid}>

            {/* ─── Profil patient ─── */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>👤 Profil patient</h3>

              {/* Avatar */}
              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  {selectedPatient.nom_complet?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <strong style={{ color: '#0B1F3A', fontSize: '1rem' }}>
                    {selectedPatient.nom_complet}
                  </strong>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                    Patient depuis {selectedPatient.created_at?.slice(0, 4)}
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Téléphone</label>
                  <p style={styles.infoValue}>
                    📞 {selectedPatient.telephone}
                  </p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Date naissance</label>
                  <p style={styles.infoValue}>
                    🎂 {selectedPatient.date_naissance}
                  </p>
                </div>
              </div>

              {/* Allergies */}
              {selectedPatient.allergies && (
                <div style={styles.alertBox}>
                  <strong style={{ color: '#991B1B' }}>
                    ⚠️ Allergies :
                  </strong>
                  <span style={{ color: '#991B1B', marginLeft: '8px' }}>
                    {selectedPatient.allergies}
                  </span>
                </div>
              )}

              {/* Antécédents */}
              {selectedPatient.antecedents_medicaux && (
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Antécédents médicaux</label>
                  <p style={styles.infoValue}>
                    {selectedPatient.antecedents_medicaux}
                  </p>
                </div>
              )}

              {/* Bouton nouvelle ordonnance */}
              <button
                style={styles.btnMint}
                onClick={() =>
                  navigate(`/dentiste/ordonnance/${selectedPatient.id}`)
                }
              >
                💊 Nouvelle ordonnance
              </button>
            </div>

            {/* ─── Colonne droite ─── */}
            <div>

              {/* Visites passées */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🏥 Visites passées</h3>

                {loading ? (
                  <p style={{ color: '#94A3B8' }}>Chargement...</p>
                ) : visites.length === 0 ? (
                  <p style={{ color: '#94A3B8' }}>Aucune visite trouvée</p>
                ) : (
                  visites.map(visite => (
                    <div key={visite.id} style={styles.visiteItem}>
                      <div style={styles.visiteDate}>
                        {visite.date}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.visiteDiag}>
                          {visite.diagnostic}
                        </div>
                        <div style={styles.visiteTraitement}>
                          {visite.traitement_fourni}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={styles.visiteMontant}>
                          {visite.facture?.montant_total} MAD
                        </div>
                        <span style={{
                          ...styles.badge,
                          ...(visite.facture?.statut === 'PAYÉE'
                            ? { background: '#D1FAE5', color: '#065F46' }
                            : { background: '#FEF3C7', color: '#92400E' })
                        }}>
                          {visite.facture?.statut || 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Ordonnances précédentes */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>💊 Ordonnances précédentes</h3>

                {loading ? (
                  <p style={{ color: '#94A3B8' }}>Chargement...</p>
                ) : ordonnances.length === 0 ? (
                  <p style={{ color: '#94A3B8' }}>
                    Aucune ordonnance trouvée
                  </p>
                ) : (
                  ordonnances.map(ord => (
                    <div key={ord.id} style={styles.ordItem}>
                      <div style={styles.ordHeader}>
                        <span style={styles.ordDate}>{ord.date}</span>
                        <span style={{
                          ...styles.badge,
                          ...(ord.statut === 'ACTIF'
                            ? { background: '#D1FAE5', color: '#065F46' }
                            : { background: '#F1F5F9', color: '#475569' })
                        }}>
                          {ord.statut}
                        </span>
                      </div>
                      <div style={styles.ordMeds}>
                        {ord.medicaments?.map((m, i) => (
                          <span key={i} style={styles.medTag}>
                            {m.nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}
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
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.05rem',
    color: '#0B1F3A',
    margin: '0 0 1.25rem 0',
  },
  formGroup: { marginBottom: '1rem' },
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
    padding: '1rem',
    background: '#F8FAFC',
    borderRadius: '8px',
  },
  avatar: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#0B1F3A',
    flexShrink: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  infoItem: { marginBottom: '0.75rem' },
  infoLabel: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '3px',
  },
  infoValue: {
    fontSize: '0.88rem',
    color: '#0B1F3A',
    fontWeight: '500',
    margin: 0,
  },
  alertBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '1rem',
  },
  btnMint: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '500',
    width: '100%',
    marginTop: '0.5rem',
  },
  visiteItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'flex-start',
  },
  visiteDate: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    minWidth: '80px',
    fontWeight: '500',
  },
  visiteDiag: {
    fontSize: '0.88rem',
    fontWeight: '500',
    color: '#0B1F3A',
  },
  visiteTraitement: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    marginTop: '3px',
  },
  visiteMontant: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#0B1F3A',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  ordItem: {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  ordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  ordDate: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    fontWeight: '500',
  },
  ordMeds: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  medTag: {
    background: '#EEF2FF',
    color: '#3730A3',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.78rem',
    fontWeight: '500',
  },
}

export default PatientHistory