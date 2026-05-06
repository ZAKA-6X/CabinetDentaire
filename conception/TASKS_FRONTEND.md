# Tâches Frontend — Membre B
**Stack:** React 19 + Vite | **Deadline:** 24 mai 2026

---

## Semaine 1 — Setup ✅ TERMINÉ

- [x] Nettoyer projet React existant
- [x] Installer dépendances : `axios`, `react-router-dom`, `react-toastify`, `jspdf`
- [x] Créer structure dossiers (`pages/`, `components/`, `context/`, `services/`)
- [x] Créer `api.js` : base URL `http://localhost:8000/api`, intercepteur Bearer token, handler 401 global

---

## Semaine 2 — Auth ✅ TERMINÉ

- [x] `AuthContext.jsx` : `{token, user: {id, nom, role}}` dans localStorage
- [x] Page `Login` : split-screen, formulaire email + mot de passe, boutons démo (Patient/Secrétaire/Dentiste)
- [x] Page `Register` : formulaire complet
- [x] `ProtectedRoute.jsx` : redirection `/login` si pas de token ou rôle non autorisé
- [x] Redirection post-login selon rôle (PATIENT / SECRETAIRE / DENTISTE)
- [x] `Layout.jsx` : sidebar dynamique par rôle, topbar, bouton déconnexion

---

## Semaine 3 — Pages

### Pages Patient

- [x] **`PatientDashboard`** (`/patient/dashboard`)
  - Prochain RDV confirmé, stats rapides, grille actions, liste RDV récents
  - Appels API : `GET /api/rendez-vous`

- [ ] **`BookAppointment`** (`/patient/reserver`)
  - [ ] Calendrier → `GET /api/rendez-vous/available-slots?date=`
  - [ ] Afficher créneaux libres, sélectionner créneau
  - [ ] Champ notes (optionnel)
  - [ ] `POST /api/rendez-vous` → toast "En attente de confirmation"

- [ ] **`MyAppointments`** (`/patient/rendez-vous`)
  - [ ] Liste tous RDV avec badge statut
  - [ ] Bouton Annuler si EN_ATTENTE → `DELETE /api/rendez-vous/{id}`

- [ ] **`MyVisits`** (`/patient/visites`)
  - [ ] Liste visites triées par date décroissante, filtre plage dates
  - [ ] Page détail `/patient/visites/{id}` : diagnostic, traitement, opérations+coûts, ordonnance liée, facture liée

- [ ] **`MyPrescriptions`** (`/patient/ordonnances`)
  - [ ] Liste avec filtre statut ACTIF / COMPLÉTÉ / ANNULÉ
  - [ ] Bouton "Télécharger PDF" → jsPDF : nom patient, date, dentiste, tableau médicaments, instructions

- [ ] **`MyInvoices`** (`/patient/factures`)
  - [ ] Liste avec statut EN_ATTENTE / PAYÉE
  - [ ] Bouton "Télécharger PDF" → jsPDF : numéro, date, dentiste, patient, frais base + opérations + total, statut

- [ ] **`MyProfile`** (`/patient/profil`)
  - [ ] Afficher/modifier : nom_complet, telephone, adresse, date_naissance, sexe
  - [ ] Champs médicaux : antecedents_medicaux, allergies, contact_urgence
  - [ ] Formulaire changement mot de passe (ancien + nouveau)

---

### Pages Secrétaire

- [x] **`SecretaireDashboard`** (`/secretaire/dashboard`)
  - Stats 4 cartes, shortcuts, tableau RDV en attente avec Confirmer/Rejeter

- [ ] **`ManageAppointments`** (`/secretaire/rendez-vous`)
  - [x] Tableau tous RDV avec filtre statut
  - [x] Bouton Confirmer → `PUT /api/rendez-vous/{id}/confirm`
  - [x] Bouton Rejeter → modal raison → `PUT /api/rendez-vous/{id}/reject`
  - [ ] Vérifier envoi email backend déclenché correctement

- [ ] **`ManagePayments`** (`/secretaire/paiements`)
  - [ ] Tableau factures EN_ATTENTE : nom patient, montant, date visite
  - [ ] Bouton Marquer PAYÉE → `POST /api/factures/{id}/payment` → toast + email

- [ ] **`ManageMedications`** (`/secretaire/medicaments`)
  - [ ] Liste médicaments
  - [ ] Modal Ajouter/Modifier : nom, description, forme, dosage, prix_unitaire
  - [ ] Bouton Supprimer avec confirmation

- [ ] **`ManageOperations`** (`/secretaire/operations`)
  - [ ] Liste catalogue : nom, description, coût actuel
  - [ ] Bouton Modifier tarif → inline edit → `PUT /api/operations/{id}`

- [ ] **`PatientsList`** (`/secretaire/patients`)
  - [ ] Liste patients : nom, téléphone, date_naissance
  - [ ] Cliquer → historique rendez-vous du patient

---

### Pages Dentiste

- [x] **`DentisteDashboard`** (`/dentiste/dashboard`)
  - Agenda jour, stats 3 cartes, RDV confirmés avec bouton "Enregistrer visite"

- [ ] **`RecordVisit`** (`/dentiste/visite/:rdv_id`)
  - [ ] Champs diagnostic, traitement_fourni, notes
  - [ ] Section opérations : liste depuis `GET /api/operations`, multi-ajout, coût unitaire affiché
  - [ ] Total en temps réel : 200 MAD (base) + sum(opérations)
  - [ ] `POST /api/visites` → proposer émettre ordonnance après succès

- [ ] **`IssuePrescription`** (`/dentiste/ordonnance/:visite_id`)
  - [ ] Multi-select médicaments depuis `GET /api/medicaments`
  - [ ] Par médicament : fréquence, durée_jours
  - [ ] Instructions générales
  - [ ] `POST /api/ordonnances` statut=ACTIF

- [ ] **`PatientHistory`** (`/dentiste/patient/:id/historique`)
  - [ ] Profil patient : nom, antécédents, allergies
  - [ ] Liste visites passées : diagnostic + traitements
  - [ ] Liste ordonnances précédentes

---

## Semaine 4 — Intégration & Tests (12–18 mai)

- [ ] Remplacer tous les mocks/données statiques par vrais appels API dans toutes les pages
- [ ] Intercepteur axios → toast erreur global si 401 / 403 / 422 / 500
- [ ] Tester flux complet end-to-end :
  1. Inscription patient → connexion
  2. Réserver RDV → secrétaire confirme → email patient
  3. Dentiste enregistre visite + opérations → facture auto-créée
  4. Dentiste émet ordonnance
  5. Patient télécharge facture PDF + ordonnance PDF
  6. Secrétaire marque PAYÉE → email reçu
- [ ] Responsive : tester 375px mobile + 768px tablette
- [ ] Multi-navigateurs : Chrome, Firefox, Edge

---

## Semaine 5 — Documentation & Soumission (19–24 mai)

- [ ] Section frontend `README.md` : prérequis, `npm install`, `npm run dev`, `VITE_API_URL`
- [ ] Vidéo démo ≤5 min :
  - Inscription + connexion patient
  - Réservation RDV → confirmation secrétaire
  - Enregistrement visite dentiste + opérations
  - Émission ordonnance
  - Facture + paiement secrétaire
  - Téléchargement PDF ordonnance + facture
  - 3 dashboards distincts (rôles)
- [ ] Nettoyage : supprimer `console.log`, commentaires inutiles
- [ ] Push propre sur `main`

---

## État actuel (6 mai 2026)

| Zone | Statut |
|------|--------|
| Setup (Vite, deps, structure) | ✅ |
| Auth (context, login, register, protected routes) | ✅ |
| Layout (sidebar dynamique, topbar, logout) | ✅ |
| PatientDashboard | ✅ |
| SecretaireDashboard | ✅ |
| DentisteDashboard | ✅ |
| ManageAppointments (confirm/reject) | ✅ |
| BookAppointment | ⚠️ À connecter API |
| MyAppointments | ⚠️ À connecter API |
| MyVisits + VisitDetail | ⚠️ À implémenter |
| MyPrescriptions (+ PDF) | ⚠️ À connecter + PDF |
| MyInvoices (+ PDF) | ⚠️ À connecter + PDF |
| MyProfile | ⚠️ À connecter API |
| ManagePayments | ⚠️ À implémenter |
| ManageMedications | ⚠️ À implémenter |
| ManageOperations | ⚠️ À implémenter |
| PatientsList | ⚠️ À connecter API |
| RecordVisit | ⚠️ À connecter + opérations |
| IssuePrescription | ⚠️ À connecter API |
| PatientHistory | ⚠️ À connecter API |
