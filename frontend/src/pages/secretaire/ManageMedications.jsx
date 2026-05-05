import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function ManageMedications() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    forme: 'Comprimé',
    dosage: '',
    prix_unitaire: '',
  })

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      const res = await api.get('/medicaments')
      setMedications(res.data)
    } catch (err) {
      console.error('Erreur chargement médicaments')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ─── Ouvrir modal ajout ───
  const openAdd = () => {
    setEditItem(null)
    setFormData({
      nom: '', description: '',
      forme: 'Comprimé', dosage: '', prix_unitaire: ''
    })
    setModal(true)
  }

  // ─── Ouvrir modal modification ───
  const openEdit = (med) => {
    setEditItem(med)
    setFormData({
      nom: med.nom,
      description: med.description,
      forme: med.forme,
      dosage: med.dosage,
      prix_unitaire: med.prix_unitaire,
    })
    setModal(true)
  }

  // ─── Enregistrer ───
  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/medicaments/${editItem.id}`, formData)
        setMedications(medications.map(m =>
          m.id === editItem.id ? { ...m, ...formData } : m
        ))
        alert('✅ Médicament modifié')
      } else {
        const res = await api.post('/medicaments', formData)
        setMedications([...medications, res.data])
        alert('✅ Médicament ajouté')
      }
      setModal(false)
    } catch (err) {
      alert('Erreur lors de l\'enregistrement')
    }
  }

  // ─── Supprimer ───
  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await api.delete(`/medicaments/${id}`)
      setMedications(medications.filter(m => m.id !== id))
      alert('🗑️ Médicament supprimé')
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <Layout>
  <div>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>💊 Gestion des médicaments</h2>
            <p style={styles.sub}>Ajoutez et gérez le catalogue</p>
          </div>
          <button style={styles.btnAdd} onClick={openAdd}>
            + Ajouter médicament
          </button>
        </div>

        <div style={styles.card}>
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : medications.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>💊</div>
              <p>Aucun médicament trouvé</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Forme</th>
                  <th style={styles.th}>Dosage</th>
                  <th style={styles.th}>Prix unitaire</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medications.map(med => (
                  <tr key={med.id}>
                    <td style={styles.td}>
                      <strong>{med.nom}</strong>
                      <br />
                      <small style={{ color: '#94A3B8' }}>
                        {med.description}
                      </small>
                    </td>
                    <td style={styles.td}>{med.forme}</td>
                    <td style={styles.td}>{med.dosage}</td>
                    <td style={styles.td}>
                      <strong>{med.prix_unitaire} MAD</strong>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnEdit}
                        onClick={() => openEdit(med)}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        style={styles.btnDelete}
                        onClick={() => handleDelete(med.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── Modal ─── */}
      {modal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editItem ? '✏️ Modifier médicament' : '+ Ajouter médicament'}
            </h3>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom</label>
                <input
                  style={styles.input}
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom du médicament"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Forme</label>
                <select
                  style={styles.input}
                  name="forme"
                  value={formData.forme}
                  onChange={handleChange}
                >
                  <option>Comprimé</option>
                  <option>Gélule</option>
                  <option>Sirop</option>
                  <option>Injectable</option>
                  <option>Crème</option>
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dosage</label>
                <input
                  style={styles.input}
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="Ex: 500mg"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prix unitaire (MAD)</label>
                <input
                  style={styles.input}
                  type="number"
                  name="prix_unitaire"
                  value={formData.prix_unitaire}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description courte..."
              />
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.btnOutline}
                onClick={() => setModal(false)}
              >
                Annuler
              </button>
              <button style={styles.btnSave} onClick={handleSave}>
                💾 Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

const styles = {
 
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  sub: { color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' },
  btnAdd: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
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
  btnEdit: {
    background: '#EEF2FF',
    color: '#3730A3',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    marginRight: '6px',
  },
  btnDelete: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(11,31,58,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 8px 40px rgba(11,31,58,0.2)',
  },
  modalTitle: {
    fontFamily: 'Georgia, serif',
    color: '#0B1F3A',
    marginBottom: '1.25rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
  modalFooter: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  btnOutline: {
    background: 'white',
    color: '#475569',
    border: '1.5px solid #E2E8F0',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
  btnSave: {
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
}

export default ManageMedications