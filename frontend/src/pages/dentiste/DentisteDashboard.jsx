import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function DentisteDashboard() {
  const navigate = useNavigate()
  const [rdvAujourdhui, setRdvAujourdhui] = useState([])
  const [stats, setStats] = useState({
    rdvAujourdhui: 0,
    visitesEnregistrees: 0,
    rdvAVenir: 0,
  })
  const [loading, setLoading] = useState(true)

  // ─── Charger agenda du jour ───
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dentiste/schedule')
        const rdvs = res.data
        setRdvAujourdhui(rdvs)
        setStats({
          rdvAujourdhui: rdvs.length,
          visitesEnregistrees: rdvs.filter(r => r.statut === 'COMPLÉTÉ').length,
          rdvAVenir: rdvs.filter(r => r.statut === 'CONFIRMÉ').length,
        })
      } catch (err) {
        console.error('Erreur chargement agenda')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
       <div>
        {/* Titre */}
        <div style={styles.welcome}>
          <h2 style={styles.welcomeTitle}>Agenda du jour 🦷</h2>
          <p style={styles.welcomeSub}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#E6FAF6'}}>📅</div>
            <div>
              <div style={styles.statNum}>{stats.rdvAujourdhui}</div>
              <div style={styles.statLbl}>RDV aujourd'hui</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#E8F4FD'}}>✅</div>
            <div>
              <div style={styles.statNum}>{stats.visitesEnregistrees}</div>
              <div style={styles.statLbl}>Visites enregistrées</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#FEF3C7'}}>⏳</div>
            <div>
              <div style={styles.statNum}>{stats.rdvAVenir}</div>
              <div style={styles.statLbl}>À venir</div>
            </div>
          </div>
        </div>

        {/* Liste RDV du jour */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📅 RDV confirmés du jour</h3>

          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : rdvAujourdhui.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '3rem' }}>📭</div>
              <p>Aucun rendez-vous aujourd'hui</p>
            </div>
          ) : (
            rdvAujourdhui.map(rdv => (
              <div key={rdv.id} style={styles.rdvItem}>

                {/* Heure */}
                <div style={styles.rdvTime}>
                  <div style={styles.rdvHour}>
                    {rdv.heure?.slice(0, 5)}
                  </div>
                  <div style={styles.rdvStatut}>Confirmé</div>
                </div>

                <div style={styles.rdvDivider}></div>

                {/* Infos patient */}
                <div style={{ flex: 1 }}>
                  <div style={styles.rdvName}>
                    {rdv.patient?.nom_complet}
                  </div>
                  <div style={styles.rdvDetail}>
                    📞 {rdv.patient?.telephone}
                    {rdv.notes && ` — ${rdv.notes}`}
                  </div>
                </div>

                {/* Bouton enregistrer visite */}
                <button
                  style={styles.btnVisite}
                  onClick={() => navigate(`/dentiste/visite/${rdv.id}`)}
                >
                  📝 Enregistrer visite
                </button>

              </div>
            ))
          )}
        </div>

        {/* Raccourcis */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚡ Raccourcis</h3>
          <div style={styles.shortcutGrid}>
            <div
              style={styles.shortcut}
              onClick={() => navigate('/dentiste/visite/nouvelle')}
            >
              <div style={styles.shortcutIcon}>📝</div>
              <span style={styles.shortcutLabel}>Enregistrer visite</span>
            </div>
            <div
              style={styles.shortcut}
              onClick={() => navigate('/dentiste/ordonnance/nouvelle')}
            >
              <div style={styles.shortcutIcon}>💊</div>
              <span style={styles.shortcutLabel}>Nouvelle ordonnance</span>
            </div>
            <div
              style={styles.shortcut}
              onClick={() => navigate('/dentiste/patients')}
            >
              <div style={styles.shortcutIcon}>👥</div>
              <span style={styles.shortcutLabel}>Historique patients</span>
            </div>
          </div>
        </div>

      </div>
</Layout>
  )
}

// ─── Styles ───
const styles = {

  welcomeTitle: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  welcomeSub: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    marginTop: '4px',
    textTransform: 'capitalize',
  },
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
    fontSize: '1.8rem',
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
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#94A3B8',
  },
  rdvItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  rdvTime: {
    textAlign: 'center',
    minWidth: '64px',
  },
  rdvHour: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#0B1F3A',
  },
  rdvStatut: {
    fontSize: '0.72rem',
    color: '#00C9A7',
    marginTop: '2px',
  },
  rdvDivider: {
    width: '2px',
    height: '40px',
    background: '#B2F0E8',
    borderRadius: '1px',
  },
  rdvName: {
    fontWeight: '500',
    color: '#0B1F3A',
  },
  rdvDetail: {
    fontSize: '0.8rem',
    color: '#94A3B8',
    marginTop: '2px',
  },
  btnVisite: {
    background: '#00C9A7',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  shortcutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
  },
  shortcut: {
    border: '1.5px solid #E2E8F0',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    cursor: 'pointer',
  },
  shortcutIcon: {
    fontSize: '2rem',
    marginBottom: '0.6rem',
  },
  shortcutLabel: {
    fontSize: '0.82rem',
    color: '#475569',
    fontWeight: '500',
  },
}

export default DentisteDashboard