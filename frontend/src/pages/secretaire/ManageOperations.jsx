import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function ManageOperations() {
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editCout, setEditCout] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/operations')
        setOperations(res.data)
      } catch (err) {
        console.error('Erreur chargement opérations')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Modifier tarif ───
  const handleSave = async (id) => {
    if (!editCout) { alert('Entrez un tarif'); return }
    try {
      await api.put(`/operations/${id}`, { cout: editCout })
      setOperations(operations.map(op =>
        op.id === id ? { ...op, cout: editCout } : op
      ))
      setEditId(null)
      setEditCout('')
      alert('✅ Tarif mis à jour')
    } catch (err) {
      alert('Erreur lors de la mise à jour')
    }
  }

  return (
    <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}> Catalogue des <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>opérations</em></h2>
          <p style={styles.sub}>Gérez les tarifs des opérations dentaires</p>
        </div>

        <div style={styles.card}>
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : operations.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>⚙️</div>
              <p>Aucune opération trouvée</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Opération</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Coût actuel</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {operations.map(op => (
                  <tr key={op.id}>
                    <td style={styles.td}>
                      <strong>{op.nom}</strong>
                    </td>
                    <td style={styles.td}>
                      {op.description || '—'}
                    </td>
                    <td style={styles.td}>

                      {/* Mode édition */}
                      {editId === op.id ? (
                        <div style={styles.editRow}>
                          <input
                            style={styles.editInput}
                            type="number"
                            value={editCout}
                            onChange={e => setEditCout(e.target.value)}
                            placeholder="Nouveau tarif"
                            autoFocus
                          />
                          <span style={{ color: '#94A3B8' }}>MAD</span>
                        </div>
                      ) : (
                        <strong style={{ color: '#0B1F3A' }}>
                          {op.cout} MAD
                        </strong>
                      )}
                    </td>
                    <td style={styles.td}>

                      {/* Boutons selon mode */}
                      {editId === op.id ? (
                        <>
                          <button
                            style={styles.btnSave}
                            onClick={() => handleSave(op.id)}
                          >
                            💾 Enregistrer
                          </button>
                          <button
                            style={styles.btnCancel}
                            onClick={() => {
                              setEditId(null)
                              setEditCout('')
                            }}
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          style={styles.btnEdit}
                          onClick={() => {
                            setEditId(op.id)
                            setEditCout(op.cout)
                          }}
                        >
                          ✏️ Modifier tarif
                        </button>
                      )}
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
    verticalAlign: 'middle',
  },
  editRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  editInput: {
    padding: '7px 10px',
    border: '1.5px solid #00C9A7',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    width: '120px',
    fontFamily: 'inherit',
  },
  btnEdit: {
    background: '#EEF2FF',
    color: '#3730A3',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
  btnSave: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
    marginRight: '6px',
  },
  btnCancel: {
    background: '#F1F5F9',
    color: '#475569',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
}

export default ManageOperations