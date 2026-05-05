import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function BookAppointment() {
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // ─── Charger les créneaux disponibles ───
  const handleDateChange = async (e) => {
    const selectedDate = e.target.value
    setDate(selectedDate)
    setSelectedSlot(null)
    setSlots([])

    if (!selectedDate) return

    try {
      setLoadingSlots(true)
      const res = await api.get(`/rendez-vous/available-slots?date=${selectedDate}`)
      setSlots(res.data)
    } catch (err) {
      alert('Erreur lors du chargement des créneaux')
    } finally {
      setLoadingSlots(false)
    }
  }

  // ─── Soumettre la réservation ───
  const handleSubmit = async () => {
    if (!date) { alert('Choisissez une date'); return }
    if (!selectedSlot) { alert('Choisissez un créneau'); return }

    try {
      setLoading(true)
      await api.post('/rendez-vous', {
        date,
        heure: selectedSlot,
        notes,
      })
      alert('✅ Rendez-vous soumis — En attente de confirmation')
      navigate('/patient/rendez-vous')
    } catch (err) {
      alert('Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
        <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>📅 Réserver un rendez-vous</h2>
          <p style={styles.sub}>Choisissez une date et un créneau disponible</p>
        </div>

        <div style={styles.card}>

          {/* Choisir date */}
          <div style={styles.formGroup}>
            <label style={styles.label}>📅 Date souhaitée</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              style={styles.input}
            />
          </div>

          {/* Créneaux disponibles */}
          {loadingSlots && (
            <p style={{ color: '#94A3B8' }}>Chargement des créneaux...</p>
          )}

          {slots.length > 0 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>🕐 Créneaux disponibles</label>
              <div style={styles.slotsGrid}>
                {slots.map(slot => (
                  <div
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      ...styles.slot,
                      ...(selectedSlot === slot ? styles.slotSelected : {})
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              📝 Notes (optionnel)
            </label>
            <textarea
              placeholder="Décrivez votre problème ou motif de visite..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={styles.textarea}
            />
          </div>

          {/* Bouton confirmer */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.btn}
          >
            {loading ? 'Envoi...' : '✅ Confirmer la réservation'}
          </button>
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
  sub: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
  },
  formGroup: { marginBottom: '1.5rem' },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '8px',
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#F8FAFC',
    width: '250px',
  },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '8px',
  },
  slot: {
    padding: '10px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#475569',
    background: 'white',
  },
  slotSelected: {
    borderColor: '#00C9A7',
    background: '#E6FAF6',
    color: '#00C9A7',
  },
  textarea: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#F8FAFC',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  btn: {
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    padding: '13px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default BookAppointment