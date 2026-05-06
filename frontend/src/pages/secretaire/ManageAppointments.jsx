import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [rejectModal, setRejectModal] = useState(null)
  const [raison, setRaison] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/rendez-vous')
      setAppointments(res.data)
      setFiltered(res.data)
    } catch (err) {
      console.error('Erreur chargement RDV')
    } finally {
      setLoading(false)
    }
  }

  // ─── Filtrer ───
  const handleFilter = (statut) => {
    setFilter(statut)
    applyFilters(statut, search)
  }

  const handleSearch = (val) => {
    setSearch(val)
    applyFilters(filter, val)
  }

  const patientName = (rdv) =>
    `${rdv.patient?.prenom || ''} ${rdv.patient?.nom || ''}`.trim() || '—'

  const applyFilters = (statut, searchVal) => {
    let result = appointments
    if (statut) result = result.filter(r => r.statut === statut)
    if (searchVal) result = result.filter(r =>
      patientName(r).toLowerCase().includes(searchVal.toLowerCase())
    )
    setFiltered(result)
  }

  // ─── Confirmer RDV ───
  const handleConfirm = async (id) => {
    try {
      const res = await api.put(`/rendez-vous/${id}/confirm`)
      const updated = appointments.map(r => r.id === id ? res.data : r)
      setAppointments(updated)
      setFiltered(updated)
    } catch (err) {
      alert('Erreur lors de la confirmation')
    }
  }

  const handleReject = async () => {
    if (!raison) { alert('Entrez une raison'); return }
    try {
      const res = await api.put(`/rendez-vous/${rejectModal}/reject`, { raison })
      const updated = appointments.map(r => r.id === rejectModal ? res.data : r)
      setAppointments(updated)
      setFiltered(updated)
      setRejectModal(null)
      setRaison('')
    } catch (err) {
      alert('Erreur lors du rejet')
    }
  }

  // ─── Badge ───
  const getBadge = (statut) => {
    const badges = {
      'EN_ATTENTE': { background: '#FEF3C7', color: '#92400E' },
      'CONFIRMÉ':   { background: '#D1FAE5', color: '#065F46' },
      'ANNULÉ':     { background: '#FEE2E2', color: '#991B1B' },
      'COMPLÉTÉ':   { background: '#DBEAFE', color: '#1E40AF' },
    }
    return badges[statut] || {}
  }

  return (
    <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>📋 Gestion des rendez-vous</h2>
          <p style={styles.sub}>Confirmez ou rejetez les demandes</p>
        </div>

        <div style={styles.card}>

          {/* Filtres */}
          <div style={styles.filterBar}>
            <input
              style={styles.searchInput}
              placeholder="🔍 Rechercher patient..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {['', 'EN_ATTENTE', 'CONFIRMÉ', 'ANNULÉ', 'COMPLÉTÉ'].map((s) => (
              <button
                key={s}
                onClick={() => handleFilter(s)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === s ? styles.filterBtnActive : {})
                }}
              >
                {s || 'Tous'}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>📭</div>
              <p>Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date & Heure</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rdv => (
                  <tr key={rdv.id}>
                    <td style={styles.td}>
                      <strong>{patientName(rdv)}</strong>
                      <br />
                      <small style={{ color: '#94A3B8' }}>
                        {rdv.patient?.telephone}
                      </small>
                    </td>
                    <td style={styles.td}>
                      {rdv.date}
                      <br />
                      <small style={{ color: '#94A3B8' }}>
                        {rdv.heure}
                      </small>
                    </td>
                    <td style={styles.td}>{rdv.notes || '—'}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...getBadge(rdv.statut)
                      }}>
                        {rdv.statut}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {rdv.statut === 'EN_ATTENTE' && (
                        <>
                          <button
                            style={styles.btnConfirm}
                            onClick={() => handleConfirm(rdv.id)}
                          >
                            ✓ Confirmer
                          </button>
                          <button
                            style={styles.btnReject}
                            onClick={() => setRejectModal(rdv.id)}
                          >
                            ✕ Rejeter
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── Modal Rejet ─── */}
      {rejectModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>✕ Raison du rejet</h3>
            <textarea
              style={styles.modalTextarea}
              rows={4}
              placeholder="Expliquer la raison du rejet..."
              value={raison}
              onChange={e => setRaison(e.target.value)}
            />
            <div style={styles.modalFooter}>
              <button
                style={styles.btnOutline}
                onClick={() => { setRejectModal(null); setRaison('') }}
              >
                Annuler
              </button>
              <button style={styles.btnDanger} onClick={handleReject}>
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
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
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    minWidth: '200px',
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
  btnConfirm: {
    background: '#D1FAE5',
    color: '#065F46',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    marginRight: '6px',
  },
  btnReject: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '5px 12px',
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
    maxWidth: '480px',
    boxShadow: '0 8px 40px rgba(11,31,58,0.2)',
  },
  modalTitle: {
    fontFamily: 'Georgia, serif',
    color: '#0B1F3A',
    marginBottom: '1rem',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  },
  modalFooter: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
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
  btnDanger: {
    background: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
}

export default ManageAppointments