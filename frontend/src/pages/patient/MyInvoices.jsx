import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import jsPDF from 'jspdf'

function MyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/factures')
        setInvoices(res.data)
      } catch {
        setInvoices([
          { id: 34, numero: 'FA-2026-034', date: '2026-02-10', statut: 'EN_ATTENTE', montant_total: 220, patient: { nom_complet: 'Yasmine El Mansouri' }, dentiste: { nom_complet: 'Ahmed Bennani' }, operations: [{ nom: 'Consultation', cout: 0 }, { nom: 'Radio. panoramique', cout: 120 }] },
          { id: 39, numero: 'FA-2026-039', date: '2026-04-09', statut: 'PAYÉE', montant_total: 430, patient: { nom_complet: 'Yasmine El Mansouri' }, dentiste: { nom_complet: 'Ahmed Bennani' }, operations: [{ nom: 'Détartrage', cout: 150 }, { nom: 'Polissage', cout: 80 }] },
          { id: 36, numero: 'FA-2026-036', date: '2026-03-02', statut: 'PAYÉE', montant_total: 560, patient: { nom_complet: 'Yasmine El Mansouri' }, dentiste: { nom_complet: 'Ahmed Bennani' }, operations: [{ nom: 'Remplissage composite', cout: 350 }, { nom: 'Radiographie', cout: 110 }] },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const generatePDF = (f) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setTextColor(15, 72, 66)
    doc.text('Cabinet Dentaire DentaApp', 20, 20)
    doc.setFontSize(12)
    doc.setTextColor(50)
    doc.text(`Facture N°: ${f.numero}`, 20, 35)
    doc.text(`Date: ${formatDate(f.date)}`, 20, 43)
    doc.text(`Patient: ${f.patient?.nom_complet}`, 20, 51)
    doc.text(`Dentiste: Dr. ${f.dentiste?.nom_complet}`, 20, 59)
    let y = 75
    doc.setFontSize(13)
    doc.text('Détail:', 20, y)
    doc.text('Frais de base', 25, y + 10)
    doc.text('100 MAD', 160, y + 10)
    y += 20
    f.operations?.forEach(op => {
      doc.setFontSize(11)
      doc.text(`• ${op.nom}`, 25, y)
      doc.text(`${op.cout} MAD`, 160, y)
      y += 10
    })
    y += 5
    doc.line(20, y, 190, y)
    y += 8
    doc.setFontSize(13)
    doc.text('Total:', 130, y)
    doc.text(`${f.montant_total} MAD`, 160, y)
    doc.save(`${f.numero}.pdf`)
  }

  const enAttente = invoices.filter(f => f.statut === 'EN_ATTENTE')
  const payees = invoices.filter(f => f.statut === 'PAYÉE')
  const totalARegler = enAttente.reduce((s, f) => s + f.montant_total, 0)

  const InvoiceRow = ({ f }) => (
    <div
      style={styles.invoiceRow}
      onClick={() => setSelectedInvoice(f)}
    >
      <div style={{
        ...styles.invoiceIcon,
        background: f.statut === 'EN_ATTENTE' ? 'var(--amber-soft)' : 'var(--accent-soft)',
        color: f.statut === 'EN_ATTENTE' ? 'var(--gold)' : 'var(--accent)',
      }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/>
          <path d="M9 8h6M9 12h6M9 16h4"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <b style={styles.invoiceTitle}>Facture {f.numero}</b>
        <small style={styles.invoiceMeta}>
          {f.statut === 'PAYÉE'
            ? `Payée le ${formatDate(f.date)} · visite du ${formatDate(f.date)}`
            : `Visite du ${formatDate(f.date)}`}
        </small>
      </div>
      <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: '15px', fontWeight: '500', marginRight: '16px', color: 'var(--ink)' }}>
        {f.montant_total} MAD
      </div>
      <span style={{
        ...styles.chip,
        ...(f.statut === 'EN_ATTENTE'
          ? { background: 'var(--amber-soft)', color: '#8d6a2b' }
          : { background: 'var(--success-soft)', color: 'var(--success)' })
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.statut === 'EN_ATTENTE' ? 'var(--gold)' : 'var(--success)', display: 'inline-block' }}/>
        {f.statut === 'EN_ATTENTE' ? 'À régler' : 'Payée'}
      </span>
      <button
        style={styles.btnPDF}
        onClick={e => { e.stopPropagation(); generatePDF(f) }}
      >
        ↓ PDF
      </button>
    </div>
  )

  return (
    <Layout>
      <div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={styles.pageTitle}>
              Mes <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>factures</em>
            </h1>
            <p style={styles.pageSub}>
              Factures générées après chaque visite. Paiement en espèces uniquement, à la clinique.
            </p>
          </div>
          {totalARegler > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '4px' }}>Total à régler</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: '400', color: 'var(--gold)', letterSpacing: '-0.02em' }}>
                {totalARegler} <span style={{ fontSize: '14px' }}>MAD</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>Chargement...</p>
        ) : (
          <>
            {enAttente.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={styles.sectionLabel}>À régler</div>
                {enAttente.map(f => <InvoiceRow key={f.id} f={f} />)}
              </div>
            )}
            {payees.length > 0 && (
              <div>
                <div style={styles.sectionLabel}>Payées</div>
                {payees.map(f => <InvoiceRow key={f.id} f={f} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Drawer détail facture ─── */}
      {/* Overlay */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: '#1a201f55',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          opacity: selectedInvoice ? 1 : 0,
          pointerEvents: selectedInvoice ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
        onClick={() => setSelectedInvoice(null)}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '520px', maxWidth: '94vw',
        background: 'var(--bg)',
        zIndex: 51,
        transform: selectedInvoice ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(.3,.7,.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px #1a201f22',
      }}>
        {selectedInvoice && (
          <>
            {/* Drawer header */}
            <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)' }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: '400', fontSize: '22px', margin: 0, letterSpacing: '-0.01em', color: 'var(--ink)', flex: 1 }}>
                Facture {selectedInvoice.numero}
              </h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', border: '1px solid var(--line)', background: 'var(--card)', cursor: 'pointer', fontSize: '14px', color: 'var(--ink-2)' }}
              >
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ padding: '24px 28px', overflow: 'auto', flex: 1 }}>

              {/* Chip statut */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  ...styles.chip,
                  ...(selectedInvoice.statut === 'EN_ATTENTE'
                    ? { background: 'var(--amber-soft)', color: '#8d6a2b' }
                    : { background: 'var(--success-soft)', color: 'var(--success)' })
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selectedInvoice.statut === 'EN_ATTENTE' ? 'var(--gold)' : 'var(--success)', display: 'inline-block' }}/>
                  {selectedInvoice.statut === 'EN_ATTENTE' ? 'À régler' : 'Payée'}
                </span>
              </div>

              {/* Infos */}
              {[
                { label: 'PATIENT', value: selectedInvoice.patient?.nom_complet },
                { label: 'DENTISTE', value: `Dr. ${selectedInvoice.dentiste?.nom_complet}` },
                { label: 'DATE DE VISITE', value: formatDate(selectedInvoice.date) },
                { label: 'RÉFÉRENCE', value: selectedInvoice.numero },
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                  <label style={{ fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{row.label}</label>
                  <span style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{row.value}</span>
                </div>
              ))}

              {/* Détail facturation */}
              <div style={{ marginTop: '22px', marginBottom: '10px' }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: '500', fontSize: '15px', color: 'var(--accent)', paddingBottom: '6px', borderBottom: '1px solid var(--line)', margin: '0 0 10px' }}>
                  Détails de la facturation
                </h3>
              </div>

              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '20px' }}>
                {/* Frais de base */}
                <div style={styles.invLine}>
                  <span>Frais de visite de base</span>
                  <span style={{ fontFamily: '"Geist Mono", monospace' }}>100 MAD</span>
                </div>
                {/* Opérations */}
                {selectedInvoice.operations?.map((op, i) => (
                  <div key={i} style={styles.invLine}>
                    <span style={{ color: 'var(--ink-2)' }}>· {op.nom}</span>
                    <span style={{ fontFamily: '"Geist Mono", monospace' }}>{op.cout} MAD</span>
                  </div>
                ))}
                {/* Total */}
                <div style={{ ...styles.invLine, borderBottom: 'none', borderTop: '1px solid var(--line-strong)', marginTop: '6px', paddingTop: '14px', fontWeight: '500' }}>
                  <span>Total</span>
                  <span style={{ fontFamily: '"Geist Mono", monospace' }}>{selectedInvoice.montant_total} MAD</span>
                </div>
              </div>

              {/* Note paiement */}
              {selectedInvoice.statut === 'EN_ATTENTE' && (
                <div style={{ background: 'var(--amber-soft)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginTop: '16px', fontSize: '13px', color: '#8d6a2b', lineHeight: '1.5' }}>
                  ✦ Règlement en espèces à la clinique. La secrétaire marquera la facture comme payée à la réception du paiement.
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px', background: 'var(--surface)' }}>
              <button
                style={{ ...styles.btnPrimary, flex: 1 }}
                onClick={() => generatePDF(selectedInvoice)}
              >
                ↓ Télécharger en PDF
              </button>
              <button
                style={{ ...styles.btnGhost }}
                onClick={() => window.print()}
              >
                Imprimer
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

const styles = {
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: '400',
    fontSize: '36px',
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
    margin: '0 0 6px',
    lineHeight: '1.1',
  },
  pageSub: { color: 'var(--ink-2)', fontSize: '14px', margin: 0 },
  sectionLabel: {
    fontSize: '10.5px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: '1px solid var(--line)',
  },
  invoiceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  invoiceIcon: {
    width: '42px', height: '42px',
    borderRadius: '10px',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
  },
  invoiceTitle: {
    fontSize: '14.5px', fontWeight: '500',
    fontFamily: "'Fraunces', serif",
    display: 'block', marginBottom: '2px',
    color: 'var(--ink)',
  },
  invoiceMeta: { color: 'var(--ink-3)', fontSize: '12.5px' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '3px 10px', borderRadius: '999px',
    fontSize: '11.5px', fontWeight: '500', flexShrink: 0,
  },
  btnPDF: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 12px', borderRadius: '8px',
    fontSize: '12.5px', fontWeight: '500',
    background: 'transparent', border: '1px solid var(--line-strong)',
    color: 'var(--ink)', cursor: 'pointer',
    fontFamily: 'inherit', flexShrink: 0,
  },
  invLine: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '13.5px', padding: '8px 0',
    borderBottom: '1px dashed var(--line)',
    color: 'var(--ink)',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '10px 16px', borderRadius: '10px',
    fontSize: '13.5px', fontWeight: '500',
    background: 'var(--accent)', color: '#fff',
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 16px', borderRadius: '10px',
    fontSize: '13.5px', fontWeight: '500',
    background: 'transparent', border: '1px solid var(--line-strong)',
    color: 'var(--ink)', cursor: 'pointer', fontFamily: 'inherit',
  },
}

export default MyInvoices