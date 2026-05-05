import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function RecordVisit() {
  const { rdv_id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    diagnostic: '',
    traitement_fourni: '',
    notes: '',
  })
  const [operations, setOperations] = useState([])
  const [selectedOps, setSelectedOps] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(200)

  // ─── Charger operations et patients ───
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opsRes, patientsRes] = await Promise.all([
          api.get('/operations'),
          api.get('/patients'),
        ])
        setOperations(opsRes.data)
        setPatients(patientsRes.data)
      } catch (err) {
        console.error('Erreur chargement données')
      }
    }
    fetchData()
  }, [])

  // ─── Calculer total en temps réel ───
  useEffect(() => {
    const sumOps = selectedOps.reduce((sum, op) => sum + Number(op.cout), 0)
    setTotal(200 + sumOps)
  }, [selectedOps])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ─── Ajouter opération ───
  const handleAddOp = (e) => {
    const id = e.target.value
    if (!id) return
    const op = operations.find(o => o.id === parseInt(id))
    if (op && !selectedOps.find(s => s.id === op.id)) {
      setSelectedOps([...selectedOps, op])
    }
    e.target.value = ''
  }

  // ─── Supprimer opération ───
  const handleRemoveOp = (id) => {
    setSelectedOps(selectedOps.filter(op => op.id !== id))
  }

  // ─── Enregistrer visite ───
  const handleSubmit = async () => {
    if (!formData.diagnostic) {
      alert('Entrez un diagnostic')
      return
    }
    try {
      setLoading(true)
      await api.post('/visites', {
        ...formData,
        rendez_vous_id: rdv_id,
        patient_id: selectedPatient,
        operations: selectedOps.map(op => op.id),
      })
      alert('✅ Visite enregistrée — Facture générée automatiquement !')
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
          <h2 style={styles.title}>📝 Enregistrer une visite</h2>
          <p style={styles.sub}>Complétez les informations de la visite</p>
        </div>

        <div style={styles.grid}>

          {/* ─── Colonne gauche ─── */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🏥 Informations cliniques</h3>

            {/* Patient */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Patient</label>
              <select
                style={styles.input}
                value={selectedPatient}
                onChange={e => setSelectedPatient(e.target.value)}
              >
                <option value="">-- Choisir un patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nom_complet}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnostic */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Diagnostic</label>
              <textarea
                style={styles.textarea}
                name="diagnostic"
                rows={4}
                placeholder="Décrivez le diagnostic..."
                value={formData.diagnostic}
                onChange={handleChange}
              />
            </div>

            {/* Traitement */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Traitement fourni</label>
              <textarea
                style={styles.textarea}
                name="traitement_fourni"
                rows={4}
                placeholder="Décrivez le traitement effectué..."
                value={formData.traitement_fourni}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes complémentaires</label>
              <textarea
                style={styles.textarea}
                name="notes"
                rows={3}
                placeholder="Notes supplémentaires..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ─── Colonne droite ─── */}
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>⚙️ Opérations effectuées</h3>

              {/* Ajouter opération */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ajouter une opération</label>
                <select style={styles.input} onChange={handleAddOp}>
                  <option value="">-- Choisir --</option>
                  {operations.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.nom} — {op.cout} MAD
                    </option>
                  ))}
                </select>
              </div>

              {/* Liste opérations sélectionnées */}
              {selectedOps.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  Aucune opération ajoutée
                </p>
              ) : (
                selectedOps.map(op => (
                  <div key={op.id} style={styles.opRow}>
                    <span style={{ flex: 1 }}>{op.nom}</span>
                    <span style={styles.opCout}>{op.cout} MAD</span>
                    <button
                      style={styles.btnRemove}
                      onClick={() => handleRemoveOp(op.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}

              {/* Frais de base */}
              <div style={styles.opRow}>
                <span style={{ flex: 1, color: '#94A3B8' }}>
                  Frais de base
                </span>
                <span style={styles.opCout}>200 MAD</span>
              </div>

              {/* Total */}
              <div style={styles.totalBar}>
                <span style={styles.totalLabel}>
                  💰 Total
                </span>
                <span style={styles.totalAmount}>
                  {total} MAD
                </span>
              </div>
            </div>

            {/* ─── Boutons ─── */}
            <div style={styles.card}>
              <button
                style={styles.btnPrimary}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : '✅ Marquer comme COMPLÉTÉ'}
              </button>
              <button
                style={styles.btnOutline}
                onClick={() => navigate(`/dentiste/ordonnance/${selectedPatient}`)}
              >
                💊 Émettre une ordonnance
              </button>
            </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    alignItems: 'start',
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
  opRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid #F1F5F9',
    fontSize: '0.88rem',
  },
  opCout: {
    color: '#00C9A7',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'right',
  },
  btnRemove: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '3px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.78rem',
  },
  totalBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#E6FAF6',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '1rem',
  },
  totalLabel: {
    fontWeight: '500',
    color: '#0B1F3A',
  },
  totalAmount: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#00C9A7',
    fontFamily: 'Georgia, serif',
  },
  btnPrimary: {
    width: '100%',
    padding: '13px',
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  },
  btnOutline: {
    width: '100%',
    padding: '13px',
    background: 'white',
    color: '#0B1F3A',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default RecordVisit