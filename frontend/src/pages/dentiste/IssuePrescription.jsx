import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function IssuePrescription() {
  const { visite_id } = useParams()
  const navigate = useNavigate()

  const [medicaments, setMedicaments] = useState([])
  const [selectedMeds, setSelectedMeds] = useState([])
  const [instructions, setInstructions] = useState('')
  const [patient, setPatient] = useState('')
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)

  // ─── Charger médicaments et patients ───
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsRes, patientsRes] = await Promise.all([
          api.get('/medicaments'),
          api.get('/patients'),
        ])
        setMedicaments(medsRes.data)
        setPatients(patientsRes.data)
      } catch (err) {
        console.error('Erreur chargement données')
      }
    }
    fetchData()
  }, [])

  // ─── Ajouter médicament ───
  const handleAddMed = (e) => {
    const id = e.target.value
    if (!id) return
    const med = medicaments.find(m => m.id === parseInt(id))
    if (med && !selectedMeds.find(s => s.id === med.id)) {
      setSelectedMeds([...selectedMeds, {
        ...med,
        frequence: '',
        duree_jours: 7,
      }])
    }
    e.target.value = ''
  }

  // ─── Modifier fréquence ou durée ───
  const handleMedChange = (id, field, value) => {
    setSelectedMeds(selectedMeds.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  // ─── Supprimer médicament ───
  const handleRemoveMed = (id) => {
    setSelectedMeds(selectedMeds.filter(m => m.id !== id))
  }

  // ─── Enregistrer ordonnance ───
  const handleSubmit = async () => {
    if (selectedMeds.length === 0) {
      alert('Ajoutez au moins un médicament')
      return
    }
    if (selectedMeds.some(m => !m.frequence)) {
      alert('Remplissez la fréquence de tous les médicaments')
      return
    }
    try {
      setLoading(true)
      await api.post('/ordonnances', {
        visite_id,
        patient_id: patient,
        instructions_generales: instructions,
        statut: 'ACTIF',
        medicaments: selectedMeds.map(m => ({
          id: m.id,
          frequence: m.frequence,
          duree_jours: m.duree_jours,
        }))
      })
      alert('💊 Ordonnance enregistrée avec succès !')
      navigate('/dentiste/dashboard')
    } catch (err) {
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
   <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>💊 Émettre une ordonnance</h2>
          <p style={styles.sub}>Prescrivez les médicaments nécessaires</p>
        </div>

        <div style={styles.card}>

          {/* Patient */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Patient</label>
            <select
              style={styles.input}
              value={patient}
              onChange={e => setPatient(e.target.value)}
            >
              <option value="">-- Choisir un patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom_complet}
                </option>
              ))}
            </select>
          </div>

          {/* Ajouter médicament */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Ajouter un médicament</label>
            <select style={styles.input} onChange={handleAddMed}>
              <option value="">-- Choisir --</option>
              {medicaments.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nom} {m.dosage}
                </option>
              ))}
            </select>
          </div>

          {/* Liste médicaments sélectionnés */}
          {selectedMeds.length === 0 ? (
            <div style={styles.emptyMeds}>
              <div style={{ fontSize: '2rem' }}>💊</div>
              <p>Aucun médicament ajouté</p>
            </div>
          ) : (
            <div style={styles.medsList}>
              <label style={styles.label}>
                Médicaments prescrits
              </label>
              {selectedMeds.map(med => (
                <div key={med.id} style={styles.medItem}>

                  {/* Nom médicament */}
                  <div style={styles.medHeader}>
                    <strong style={{ color: '#0B1F3A' }}>
                      💊 {med.nom} {med.dosage}
                    </strong>
                    <button
                      style={styles.btnRemove}
                      onClick={() => handleRemoveMed(med.id)}
                    >
                      ✕ Retirer
                    </button>
                  </div>

                  {/* Fréquence et durée */}
                  <div style={styles.medFields}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Fréquence</label>
                      <input
                        style={styles.input}
                        placeholder="Ex: 3 fois par jour"
                        value={med.frequence}
                        onChange={e =>
                          handleMedChange(med.id, 'frequence', e.target.value)
                        }
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Durée (jours)</label>
                      <input
                        style={styles.input}
                        type="number"
                        min="1"
                        value={med.duree_jours}
                        onChange={e =>
                          handleMedChange(med.id, 'duree_jours', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions générales */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Instructions générales</label>
            <textarea
              style={styles.textarea}
              rows={4}
              placeholder="Ex: Prendre les médicaments après les repas..."
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>

          {/* Boutons */}
          <div style={styles.btnGroup}>
            <button
              style={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : '💾 Enregistrer l\'ordonnance'}
            </button>
            <button
              style={styles.btnOutline}
              onClick={() => navigate('/dentiste/dashboard')}
            >
              Annuler
            </button>
          </div>

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
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  emptyMeds: {
    textAlign: 'center',
    padding: '2rem',
    color: '#94A3B8',
    background: '#F8FAFC',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  medsList: { marginBottom: '1rem' },
  medItem: {
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  medHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  medFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  btnRemove: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.78rem',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '0.5rem',
  },
  btnPrimary: {
    flex: 1,
    padding: '13px',
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  btnOutline: {
    padding: '13px 24px',
    background: 'white',
    color: '#475569',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
}

export default IssuePrescription