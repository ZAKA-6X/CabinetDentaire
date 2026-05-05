================================================================================
  SYSTÈME DE GESTION DE CLINIQUE DENTAIRE
  DÉTAILS DU PROJET ET SPÉCIFICATIONS FONCTIONNELLES (MISE À JOUR)
================================================================================

TITRE DU PROJET: Système de Gestion de Clinique Dentaire
INSTITUTION: Université Chouaib Doukkali – ENSET El Jadida
PROGRAMME: 2ITE S2 – Développement Web (Printemps 2026)
DÉLAI DE SOUMISSION: 24 mai 2026
TYPE DE PROJET: Application Web CRUD basée sur les Paires

================================================================================
SECTION 1: APERÇU DU PROJET
================================================================================

1.1 ÉNONCÉ DU PROBLÈME
──────────────────────

Les cliniques dentaires traditionnelles font face à plusieurs défis opérationnels :

• Planification manuelle des rendez-vous

- Les patients téléphonent pour prendre rendez-vous
- Conflits d'horaires et réservations doubles
- Pas de visibilité centralisée du calendrier
- Processus de confirmation fastidieux

• Dossiers patients désorganisés

- Fichiers médicaux sur papier (stockage physique, difficiles à récupérer)
- Historique de traitement dispersé dans plusieurs documents
- Perte d'informations si le patient change de clinique
- Difficulté à suivre la progression du patient

• Facturation et paiements inefficaces

- Calcul manuel des factures sujet aux erreurs
- Difficulté à suivre l'état des paiements
- Pas de registre numérique des transactions
- Temps consacré aux formalités administratives

• Mauvaise communication

- Les patients ne connaissent pas l'état du rendez-vous
- Aucun mécanisme de remise d'ordonnance
- Distribution manuelle des documents
- Manque de visibilité de l'historique de traitement

• Coordination du personnel limitée

- La secrétaire ne peut pas gérer efficacement l'inscription des nouveaux patients
- Le dentiste n'a pas un accès rapide à la liste des rendez-vous
- Aucun flux de travail systématique pour la documentation du traitement
- Les processus d'approbation/confirmation sont improvisés

1.2 SOLUTION PROPOSÉE
─────────────────────

Un système de gestion de clinique dentaire basé sur le web qui :

✓ Permet l'inscription des patients avec activation immédiate du compte
✓ Permet la réservation en ligne et la confirmation des rendez-vous
✓ Centralise les dossiers médicaux et l'historique des visites
✓ Génère automatiquement les ordonnances
✓ Fournit un accès basé sur les rôles (Patient, Secrétaire, Dentiste)
✓ Assure la protection sécurisée des données
✓ Rationalise la communication entre toutes les parties
✓ Crée un historique d'audit de toutes les transactions

1.3 OBJECTIFS COMMERCIAUX
──────────────────────────

Objectifs Primaires :

- Réduire le travail administratif manuel de 70%
- Éliminer les rendez-vous en double
- Améliorer l'expérience du patient avec un portail d'autonomie
- Assurer la sécurité des données et la conformité de type HIPAA
- Permettre un accès rapide à l'historique du patient pour les dentistes
- Rationaliser la gestion et la confirmation des rendez-vous
- Créer une base de données patients centralisée et consultable

Objectifs Secondaires :

- Réduire l'utilisation du papier (passer aux documents numériques)
- Améliorer l'efficacité du personnel et réduire la charge de travail
- Permettre l'analyse des données (modèles de rendez-vous, suivi des revenus)
- Fournir un historique d'audit pour la conformité réglementaire
- Réduire les absence aux rendez-vous avec un système de confirmation

================================================================================
SECTION 2: PÉRIMÈTRE ET FONCTIONNALITÉS
================================================================================

2.1 FONCTIONNALITÉS INCLUSES DANS LE PÉRIMÈTRE (Obligatoires - MVP)
───────────────────────────────────────────────────────────────────

A. GESTION DES PATIENTS
   ├─ Inscription des patients
   │  ├─ Inscription par email et mot de passe
   │  ├─ Entrée des informations personnelles (nom, téléphone, adresse, date de naissance)
   │  ├─ Compte activé immédiatement (pas d'approbation de la secrétaire)
   │  └─ Le patient peut se connecter immédiatement après l'inscription
   │
   ├─ Profil du patient
   │  ├─ Afficher et mettre à jour les informations personnelles
   │  ├─ Changer le mot de passe
   │  └─ Afficher les informations de contact du dossier
   │
   └─ Tableau de bord du patient
      ├─ Greeting d'accueil
      ├─ Aperçu rapide des rendez-vous à venir (cartes de résumé)
      ├─ Actions en attente (p. ex., « En attente de confirmation »)
      ├─ Raccourcis rapides vers :
      │  ├─ Réserver un nouveau rendez-vous
      │  ├─ Mon profil
      │  ├─ Mes visites (avec dossiers médicaux)
      │  ├─ Mes ordonnances
      │  └─ Mes factures
      └─ Indicateur d'état du compte (actif)

B. GESTION DES RENDEZ-VOUS (Réservations)
   ├─ Patient réserve un rendez-vous
   │  ├─ Choisir la date et l'heure dans les créneaux disponibles
   │  ├─ Optionnel : ajouter des notes sur la raison de la visite
   │  ├─ Soumettre la réservation (statut : EN ATTENTE)
   │  └─ Recevoir un message de confirmation
   │
   ├─ La secrétaire examine les réservations en attente
   │  ├─ Afficher tous les rendez-vous en attente de confirmation
   │  ├─ Vérifier les détails du rendez-vous (patient, date, heure)
   │  ├─ Vérifier l'absence de conflits d'horaires
   │  ├─ Confirmer le rendez-vous (statut : CONFIRMÉ)
   │  │  └─ Envoyer une notification par email au patient
   │  └─ Option de refuser avec raison (statut : ANNULÉ)
   │
   ├─ Le dentiste affiche l'horaire
   │  ├─ Afficher un calendrier de rendez-vous quotidien/hebdomadaire
   │  ├─ Afficher uniquement les rendez-vous confirmés
   │  ├─ Afficher le nom du patient, le téléphone, les notes
   │  └─ Marquer comme terminé après la visite
   │
   └─ Patient gère les réservations
      ├─ Afficher toutes les réservations (en attente, confirmées, complétées, annulées)
      ├─ Vérifier l'état des réservations actuelles
      ├─ Annuler uniquement les réservations en attente
      └─ Recevoir les mises à jour d'état par email

C. GESTION DES VISITES (Dossiers Médicaux)
   ├─ Le dentiste enregistre la visite
   │  ├─ Accéder au dossier et à l'historique du patient
   │  ├─ Enregistrer le diagnostic/les résultats
   │  ├─ Noter le traitement fourni
   │  ├─ Marquer la visite comme terminée
   │  └─ Procéder à l'entrée de l'ordonnance (optionnel)
   │
   ├─ Patient affiche l'historique des visites
   │  ├─ Liste de toutes les visites antérieures avec dates
   │  ├─ Cliquer pour afficher les détails de la visite :
   │  │  ├─ Date et dentiste qui a effectué la visite
   │  │  ├─ Diagnostic enregistré
   │  │  ├─ Traitements effectués
   │  │  ├─ Ordonnance délivrée (le cas échéant)
   │  │  └─ Détails de la facture
   │  ├─ Rechercher/filtrer par plage de dates
   │  └─ Trier par plus récent en premier
   │
   └─ Actions automatiques du système
      └─ Créer une ordonnance pour que le patient la consulte (si elle a été délivrée)

D. GESTION DES ORDONNANCES
   ├─ Le dentiste délivre une ordonnance
   │  ├─ Sélectionner les médicaments dans la liste disponible
   │  ├─ Pour chaque médicament sélectionné :
   │  │  ├─ Nom du médicament et petite description affichés
   │  │  └─ Spécifier la fréquence (p. ex., « 2 fois par jour pendant 7 jours »)
   │  ├─ Ajouter des instructions/notes générales (optionnel)
   │  │  ├─ Prendre avec la nourriture
   │  │  ├─ Éviter l'alcool
   │  │  ├─ Suivre le cours complet
   │  │  └─ Notes personnalisées
   │  └─ Enregistrer l'ordonnance (liée à la visite)
   │
   ├─ Patient affiche les ordonnances
   │  ├─ Liste de toutes les ordonnances délivrées
   │  ├─ Filtrer par statut (actif, complété, annulé)
   │  ├─ Afficher les détails de l'ordonnance :
   │  │  ├─ Médicaments répertoriés avec description
   │  │  ├─ Date de délivrance
   │  │  └─ Instructions générales (le cas échéant)
   │  ├─ Télécharger l'ordonnance au format PDF
   │  └─ Imprimer pour la visite à la pharmacie
   │
   └─ Informations sur les médicaments
      ├─ Chaque médicament a :
      │  ├─ Nom (p. ex., « Amoxicilline »)
      │  └─ Petite description (p. ex., « Antibiotique pour les infections bactériennes »)
      └─ Médicaments disponibles maintenus par la secrétaire

E. FACTURATION ET FACTURATION
   ├─ Génération de la facture
   │  ├─ Facture créée automatiquement lors de l'enregistrement de la visite
   │  ├─ Le système calcule le total :
   │  │  ├─ Frais de visite de base (frais fixes de la clinique)
   │  │  ├─ Plus les opérations/procédures effectuées par le dentiste (le cas échéant frais supplémentaires)
   │  │  └─ Total = Frais de visite + Coût des opérations
   │  ├─ La facture comprend :
   │  │  ├─ Numéro de facture unique
   │  │  ├─ Nom et contact du patient
   │  │  ├─ Date de la visite
   │  │  ├─ Nom du dentiste
   │  │  ├─ Notes des traitements effectués
   │  │  └─ Montant total (calculé automatiquement par le système)
   │  └─ Statut : EN ATTENTE (paiement non encore confirmé)
   │
   ├─ Patient affiche les factures
   │  ├─ Liste de toutes les factures (en attente et payées)
   │  ├─ Filtrer par statut de paiement
   │  ├─ Afficher les détails de la facture
   │  ├─ Télécharger la facture au format PDF
   │  │  ├─ Formaté pour impression
   │  │  ├─ Détails complets de la transaction
   │  │  └─ Signature numérique du système (optionnel)
   │  ├─ Afficher l'historique de paiement
   │  └─ Marquer comme payée (une fois payée par le patient)
   │
   ├─ La secrétaire confirme le paiement
   │  ├─ Afficher les factures en attente
   │  ├─ Vérifier le paiement en espèces auprès du patient
   │  ├─ Confirmer la réception (marquer comme PAYÉE)
   │  ├─ Générer un reçu
   │  └─ Envoyer une confirmation par email au patient
   │
   ├─ Frais et tarification
   │  ├─ Frais de visite de base : définis par la clinique (p. ex., 200 MAD)
   │  ├─ Opérations : chaque procédure a un coût
   │  │  ├─ Détartrage : 150 MAD
   │  │  ├─ Remplissage : 300 MAD
   │  │  ├─ Dévitalisation : 400 MAD
   │  │  └─ Etc.
   │  └─ La secrétaire peut mettre à jour les tarifs (optionnel)
   │
   └─ Rapport financier (optionnel)
      ├─ Afficher les revenus totaux par mois
      ├─ Afficher les factures payées et en attente
      └─ Imprimer le rapport pour la comptabilité

F. GESTION DES UTILISATEURS ET RÔLES
   ├─ Patient
   │  ├─ S'inscrire et se connecter
   │  ├─ Gérer le profil personnel
   │  ├─ Réserver des rendez-vous
   │  ├─ Afficher les visites et les dossiers médicaux
   │  ├─ Télécharger les ordonnances et les factures en PDF
   │  └─ Pas d'accès aux données d'autres patients
   │
   ├─ Secrétaire
   │  ├─ Se connecter avec les informations d'identification administrateur
   │  ├─ Confirmer les rendez-vous
   │  ├─ Gérer les informations sur les patients (afficher uniquement)
   │  ├─ Confirmer les paiements
   │  ├─ Gérer la liste des médicaments disponibles
   │  ├─ Générer des rapports de paiement
   │  ├─ Accéder à tous les rendez-vous
   │  └─ Pas d'accès pour enregistrer les visites ou les diagnostics
   │
   └─ Dentiste
      ├─ Se connecter avec les informations d'identification administrateur
      ├─ Afficher l'horaire des rendez-vous
      ├─ Enregistrer les visites et les diagnostics
      ├─ Marquer les rendez-vous comme terminés
      ├─ Émettre des ordonnances
      ├─ Afficher l'historique du patient
      └─ Pas d'accès à la gestion administrative

2.2 FONCTIONNALITÉS EXCLUES DU PÉRIMÈTRE (Nice to Have)
──────────────────────────────────────────────────────────

✗ Paiements par carte de crédit/virement bancaire
✗ Intégration de passerelle de paiement en ligne
✗ Notifications par SMS
✗ Intégration avec des tiers (Google Calendar, etc.)
✗ Application mobile native
✗ Système de cotes/commentaires avancé
✗ Analyse avancée et rapports
✗ Chatbot ou support automatisé
✗ Intégration d'imagerie médicale
✗ Synchronisation multi-cliniques

================================================================================
SECTION 3: RÔLES ET PERMISSIONS
================================================================================

3.1 RÔLES UTILISATEUR DÉFINIS
───────────────────────────────

┌─────────────────────────────────────────────────────────────────────┐
│ RÔLE 1 : PATIENT                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Qui : Personne cherchant un traitement dentaire                      │
│                                                                         │
│ Accès :                                                                │
│   ✓ S'inscrire et créer un compte                                    │
│   ✓ Se connecter à tout moment                                       │
│   ✓ Afficher son profil personnel                                    │
│   ✓ Mettre à jour les informations personnelles                      │
│   ✓ Changer le mot de passe                                          │
│   ✓ Réserver un rendez-vous (créer une réservation)                 │
│   ✓ Afficher l'état de la réservation                                │
│   ✓ Annuler la réservation (si elle est en attente)                 │
│   ✓ Afficher l'historique des visites passées                        │
│   ✓ Afficher les détails de la visite (diagnostic, traitement)      │
│   ✓ Afficher les ordonnances délivrées                               │
│   ✓ Télécharger l'ordonnance en PDF                                  │
│   ✓ Afficher toutes les factures                                     │
│   ✓ Télécharger la facture en PDF                                    │
│   ✓ Consulter le statut de paiement de la facture                   │
│                                                                         │
│ Restrictions :                                                          │
│   ✗ Pas d'accès aux données d'autres patients                        │
│   ✗ Pas d'accès aux fonctions administratives                        │
│   ✗ Pas d'accès à la gestion des rendez-vous d'autres patients      │
│   ✗ Ne peut pas modifier les tarifs ou les médicaments              │
│   ✗ Ne peut pas enregistrer les visites                              │
│   ✗ Ne peut pas confirmer les paiements                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ RÔLE 2 : SECRÉTAIRE                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Qui : Personnel administratif gérant le fonctionnement de la clinique│
│                                                                         │
│ Accès :                                                                │
│   ✓ Se connecter au système administratif                            │
│   ✓ Afficher tous les rendez-vous en attente                         │
│   ✓ Afficher les détails du rendez-vous                              │
│   ✓ Confirmer ou rejeter le rendez-vous                              │
│   ✓ Afficher les dossiers des patients (lecture seule)               │
│   ✓ Afficher l'historique des rendez-vous d'un patient               │
│   ✓ Afficher les factures de tous les patients                       │
│   ✓ Confirmer le paiement reçu (marquer comme PAYÉ)                 │
│   ✓ Afficher les revenus totaux/rapports de paiement                 │
│   ✓ Gérer la liste des médicaments disponibles (ajouter, éditer)    │
│   ✓ Voir les ordonnances décrites (lecture seule)                    │
│                                                                         │
│ Restrictions :                                                          │
│   ✗ Pas d'accès aux mots de passe des patients                       │
│   ✗ Pas d'accès à l'enregistrement des visites                       │
│   ✗ Pas d'accès à la saisie des diagnostics                          │
│   ✗ Pas d'accès à la délivrance des ordonnances                      │
│   ✗ Pas d'accès à la modification des informations du patient        │
│   ✗ Pas d'accès à la suppression de données (sauf annulation)        │
│   ✗ Ne peut pas voir les détails des autres comptes de secrétaire   │
│   ✗ Pas d'accès à la gestion des rôles/utilisateurs                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ RÔLE 3 : DENTISTE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Qui : Professionnel médical effectuant les traitements dentaires    │
│                                                                         │
│ Accès :                                                                │
│   ✓ Se connecter au système clinique                                 │
│   ✓ Afficher l'horaire quotidien/hebdomadaire                        │
│   ✓ Afficher uniquement les rendez-vous confirmés                    │
│   ✓ Afficher les détails du rendez-vous (patient, notes)            │
│   ✓ Accéder au dossier complet du patient                            │
│   ✓ Afficher l'historique des visites antérieures                    │
│   ✓ Afficher les diagnostics antérieurs                              │
│   ✓ Afficher les ordonnances antérieures                             │
│   ✓ Enregistrer les visites (diagnostic, traitement)                 │
│   ✓ Marquer le rendez-vous comme terminé                             │
│   ✓ Émettre une ordonnance après la visite                           │
│   ✓ Sélectionner les médicaments à prescrire                         │
│   ✓ Définir la fréquence des médicaments                             │
│   ✓ Ajouter des instructions générales à l'ordonnance                │
│   ✓ Afficher les tarifs de traitement (lecture seule)                │
│                                                                         │
│ Restrictions :                                                          │
│   ✗ Pas d'accès aux modifications de profil des patients             │
│   ✗ Pas d'accès à la réservation de rendez-vous                      │
│   ✗ Pas d'accès à la gestion administrative                          │
│   ✗ Pas d'accès à la confirmation des paiements                      │
│   ✗ Pas d'accès à la gestion des utilisateurs                        │
│   ✗ Ne peut pas modifier les tarifs                                  │
│   ✗ Ne peut pas ajouter de nouveaux médicaments                      │
│   ✗ Pas d'accès aux rapports financiers                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘

3.2 MATRICE DE CONTRÔLE D'ACCÈS
────────────────────────────────

│ Fonctionnalité / Rôle      │ Patient │ Secrétaire │ Dentiste │
├─────────────────────────────┼─────────┼────────────┼──────────┤
│ S'inscrire / Se connecter    │    ✓    │     ✓      │    ✓     │
│ Afficher le profil          │    ✓    │     ✓      │    ✓     │
│ Modifier le profil          │    ✓    │     ✗      │    ✓     │
│ Réserver un rendez-vous      │    ✓    │     ✗      │    ✗     │
│ Afficher les rendez-vous     │    ✓*   │     ✓      │    ✓**   │
│ Confirmer les rendez-vous    │    ✗    │     ✓      │    ✗     │
│ Annuler les rendez-vous      │    ✓*   │     ✗      │    ✗     │
│ Enregistrer les visites      │    ✗    │     ✗      │    ✓     │
│ Afficher les visites         │    ✓    │     ✓      │    ✓     │
│ Émettre une ordonnance       │    ✗    │     ✗      │    ✓     │
│ Afficher les ordonnances     │    ✓    │     ✓      │    ✓     │
│ Télécharger ordonnance PDF   │    ✓    │     ✗      │    ✗     │
│ Générer les factures         │    ✗    │     ✗      │    ✓     │
│ Afficher les factures        │    ✓    │     ✓      │    ✗     │
│ Confirmer le paiement        │    ✗    │     ✓      │    ✗     │
│ Gérer les médicaments        │    ✗    │     ✓      │    ✗     │
│ Afficher les rapports        │    ✗    │     ✓      │    ✗     │

* Patient ne peut afficher que ses propres rendez-vous et annuler uniquement s'ils sont EN ATTENTE
** Dentiste ne voit que les rendez-vous confirmés

================================================================================
SECTION 4: DIAGRAMMES DE CAS D'UTILISATION
================================================================================

4.1 FLUX DE TRAVAIL PATIENT
───────────────────────────

FLUX 1 : INSCRIPTION ET CONNEXION
┌──────────────────┐
│    Visiteur      │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────┐
    │ Ouvrir le site  │
    └────────┬────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Cliquer sur "S'inscrire"│
    └────────┬─────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Remplir le formulaire           │
    │ - Email / Mot de passe          │
    │ - Nom, téléphone, adresse       │
    │ - Date de naissance             │
    └────────┬──────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Soumettre (créer le compte)     │
    │ Compte = ACTIF                  │
    └────────┬──────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Message de succès               │
    │ Redirection vers la connexion    │
    └────────┬──────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Entrer email et mot de passe    │
    │ Cliquer sur "Se connecter"      │
    └────────┬──────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Authentification réussie         │
    │ Accéder au tableau de bord       │
    └──────────────────────────────────┘

FLUX 2 : RÉSERVER UN RENDEZ-VOUS
┌──────────────────┐
│ Patient connecté │
└────────┬─────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ Cliquer sur               │
    │ "Réserver un rendez-vous"    │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Afficher les créneaux libres │
    │ Sélectionner la date/heure   │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ (Optionnel)                  │
    │ Ajouter des notes/raison     │
    │ (ex: mal de dents)           │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Soumettre la réservation     │
    │ Statut = EN ATTENTE          │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Message de confirmation      │
    │ "Rés. en attente. Vous       │
    │ serez contacté bientôt"      │
    └──────────────────────────────┘

FLUX 3 : CONFIRMER LA RÉSERVATION (Secrétaire)
┌──────────────────────┐
│ Secrétaire connectée │
└────────┬─────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │ Aller à "Rendez-vous en attente"   │
    └────────┬──────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Afficher la liste des réservations  │
    └────────┬──────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Vérifier les détails du RDV        │
    │ Vérifier les conflits               │
    │ Statut := EN ATTENTE → CONFIRMÉ   │
    └────────┬──────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Envoyer l'email de confirmation    │
    │ au patient                          │
    └─────────────────────────────────────┘

FLUX 4 : VISITER LA CLINIQUE ET ENREGISTRER LA VISITE
┌──────────────────────────────────────────┐
│ Rendez-vous confirmé (heure d'arrivée)   │
└────────┬─────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────┐
    │ Patient arrive à la clinique     │
    │ Secrétaire marque présent        │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Patient voit le dentiste         │
    │ Traitement effectué              │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Dentiste enregistre la visite    │
    │ (connexion au système)           │
    │ - Diagnostic                     │
    │ - Traitement fourni              │
    │ - Notes complémentaires          │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Marquer rendez-vous COMPLÉTÉ     │
    │ Auto-créer une facture            │
    │ (Base + Opérations coût)          │
    │ Facture statut = EN ATTENTE      │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ (Optionnel)                       │
    │ Dentiste émet ordonnance          │
    │ (si médicaments nécessaires)      │
    │ Ordonnance créée                  │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Visite enregistrée avec succès   │
    │ Patient peut consulter sa visite │
    │ Patient voit la facture           │
    └──────────────────────────────────┘

================================================================================
SECTION 5: ENTITÉS DE DONNÉES
================================================================================

5.1 MODÈLE DE DONNÉES PRINCIPAL (SCHÉMA CONCEPTUEL)
─────────────────────────────────────────────────────

TABLE UTILISATEURS
├─ id (Clé primaire)
├─ email (unique)
├─ password (haché)
├─ role (enum: patient, secretaire, dentiste, admin)
├─ statut (enum: actif, inactif, suspendu)
├─ date_creation
└─ derniere_connexion

TABLE PATIENTS
├─ id (Clé primaire)
├─ utilisateur_id (FK → utilisateurs)
├─ nom
├─ prenom
├─ telephone
├─ adresse
├─ date_naissance
├─ sexe (enum: masculin, feminin)
├─ contact_urgence
├─ date_inscription
└─ notes_generales

TABLE SECRETAIRES
├─ id (Clé primaire)
├─ utilisateur_id (FK → utilisateurs)
├─ nom
├─ prenom
├─ numero_employe (unique)
└─ date_embauche

TABLE DENTISTES
├─ id (Clé primaire)
├─ utilisateur_id (FK → utilisateurs)
├─ nom
├─ prenom
├─ specialite
├─ biographie
└─ photo

TABLE RENDEZ_VOUS
├─ id (Clé primaire)
├─ patient_id (FK → patients)
├─ dentiste_id (FK → dentistes)
├─ secretaire_id (FK → secretaires, nullable)
├─ date_heure
├─ duree (minutes, défaut 30)
├─ raison (texte, nullable)
├─ statut (enum: en_attente, confirme, annule, complete)
├─ notes (nullable)
├─ cree_le
└─ confirme_le (nullable)

TABLE VISITES
├─ id (Clé primaire)
├─ rendezvous_id (FK → rendez_vous, nullable)
├─ patient_id (FK → patients)
├─ dentiste_id (FK → dentistes)
├─ date_visite
├─ diagnostic (texte, nullable)
├─ traitement_fourni (texte, nullable)
├─ notes (texte, nullable)
├─ statut (enum: en_cours, complete, annulee)
└─ cree_le

TABLE OPERATION_DENTAIRES  ← snapshot au moment de la visite
├─ id (Clé primaire)
├─ visite_id (FK → visites)
├─ nom_operation
├─ description (nullable)
├─ cout
└─ date_effectuee

TABLE CATALOGUE_OPERATIONS  ← tarifs de référence modifiables
├─ id (Clé primaire)
├─ nom
├─ description (nullable)
└─ cout

TABLE ORDONNANCES
├─ id (Clé primaire)
├─ visite_id (FK → visites)
├─ patient_id (FK → patients)
├─ dentiste_id (FK → dentistes)
├─ date_delivrance
├─ instructions_generales (texte, nullable)
├─ statut (enum: active, expiree, annulee)
└─ cree_le

TABLE ORDONNANCE_MEDICAMENTS
├─ id (Clé primaire)
├─ ordonnance_id (FK → ordonnances)
├─ medicament_id (FK → medicaments)
├─ frequence (ex: "2 fois par jour")
├─ duree_jours
└─ instructions_speciales (texte, nullable)

TABLE MEDICAMENTS
├─ id (Clé primaire)
├─ nom (ex: Amoxicilline)
├─ description (nullable)
├─ forme (nullable)
├─ dosage (nullable)
├─ cree_le
└─ mis_a_jour_le

TABLE FACTURES
├─ id (Clé primaire)
├─ numero_facture (unique)
├─ visite_id (FK → visites)
├─ patient_id (FK → patients)
├─ secretaire_id (FK → secretaires, nullable)
├─ date_facture
├─ frais_visite_base
├─ frais_operations
├─ montant_total (auto-calculé)
├─ statut (enum: en_attente, payee, annulee, partiellement_payee)
├─ date_paiement (nullable)
└─ notes (nullable)

TABLE PAIEMENTS
├─ id (Clé primaire)
├─ facture_id (FK → factures)
├─ secretaire_id (FK → secretaires, nullable)
├─ montant_recu
├─ date_paiement
├─ methode_paiement (enum: especes, carte, virement, cheque)
├─ numero_recu (nullable)
└─ notes (nullable)

TABLE AUDITS
├─ id (Clé primaire)
├─ utilisateur_id (FK → utilisateurs, nullable)
├─ action (enum: create, update, delete, login, logout)
├─ table_affectee (ex: rendez_vous, visites, ordonnances, factures)
├─ id_enregistrement (nullable)
├─ ancienne_valeur (JSON, nullable)
├─ nouvelle_valeur (JSON, nullable)
├─ horodatage
└─ adresse_ip (nullable)

TABLE NOTIFICATIONS  ← in-app, par utilisateur
├─ id (Clé primaire)
├─ utilisateur_id (FK → utilisateurs)
├─ type (enum: rdv_confirme, rdv_rejete, paiement_recu)
├─ titre
├─ message
├─ donnees (JSON, nullable)  ← ex: rendezvous_id, facture_id
├─ lu (boolean, défaut false)
└─ lu_le (datetime, nullable)

================================================================================
SECTION 6: PROTOTYPES D'INTERFACE UTILISATEUR (WIREFRAMES)
================================================================================

6.1 PAGE DE CONNEXION
─────────────────────

┌─────────────────────────────────────────┐
│ CLINIQUE DENTAIRE AL-AKWA               │
│ (Logo)                                   │
├─────────────────────────────────────────┤
│                                          │
│              SE CONNECTER                │
│                                          │
│  Email : [ _________________________ ]   │
│                                          │
│  Mot de passe : [ _________________ ]   │
│                                          │
│           [ CONNEXION ]                  │
│                                          │
│  Première visite ? [ S'INSCRIRE ICI ]   │
│  Mot de passe oublié ? [ RÉINITIALISER ]│
│                                          │
└─────────────────────────────────────────┘

6.2 TABLEAU DE BORD PATIENT
─────────────────────────────

┌─────────────────────────────────────────────────┐
│ TABLEAU DE BORD PATIENT                          │
│ Bienvenue, [Nom du Patient] !                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌─────────────────┐  ┌─────────────────┐       │
│ │ Prochain RDV   │  │ Actions En Attente│      │
│ │ 15 Mai, 10:00 │  │ □ Paiement en attente│   │
│ │ avec Dr. Ahmed │  │ □ Ordonnance à                    │
│ │                │  │    consulter        │            │
│ └─────────────────┘  └─────────────────┘       │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Raccourcis rapides                        │   │
│ │                                            │   │
│ │ [ Réserver ] [ Mon Profil ] [ Visites ]  │   │
│ │ [ Ordonnances ] [ Factures ]              │   │
│ │                                            │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Historique récent des rendez-vous        │   │
│ │ 1. 8 Mai 2026 - Détartrage - Dr. Ahmed  │   │
│ │    [Voir Visite]                         │   │
│ │ 2. 1 Mai 2026 - Détartrage - Dr. Ahmed  │   │
│ │    [Voir Visite]                         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
└─────────────────────────────────────────────────┘

6.3 PAGE DE RÉSERVATION
────────────────────────

┌─────────────────────────────────────────┐
│ RÉSERVER UN RENDEZ-VOUS                  │
├─────────────────────────────────────────┤
│                                          │
│ Sélectionner la date :                   │
│ [ _________________________ ] (calendrier) │
│                                          │
│ Créneaux disponibles :                   │
│ □ 09:00 - 09:30  □ 09:30 - 10:00        │
│ □ 10:00 - 10:30  □ 10:30 - 11:00        │
│ □ 14:00 - 14:30  □ 14:30 - 15:00        │
│ □ 15:00 - 15:30  □ 15:30 - 16:00        │
│                                          │
│ Raison de la visite (optionnel) :        │
│ [ _________________________ ]            │
│                                          │
│         [ RÉSERVER ]   [ ANNULER ]       │
│                                          │
└─────────────────────────────────────────┘

6.4 PAGE D'HISTORIQUE DES VISITES
──────────────────────────────────

┌─────────────────────────────────────────┐
│ MES VISITES                              │
├─────────────────────────────────────────┤
│ Filtrer par : [Toutes ▼]  Chercher : [ ]│
├─────────────────────────────────────────┤
│                                          │
│ 8 MAI 2026                               │
│ ├─ Dentiste : Dr. Ahmed Bennani        │
│ ├─ Diagnostic : Accumulation de tartre │
│ ├─ Traitement : Détartrage professionnel│
│ ├─ Facture : #INV-001 (200 MAD)         │
│ └─ [Voir Détails] [Imprimer]            │
│                                          │
│ 1 MAI 2026                               │
│ ├─ Dentiste : Dr. Ahmed Bennani        │
│ ├─ Diagnostic : Contrôle de routine    │
│ ├─ Traitement : Examen général          │
│ ├─ Facture : #INV-002 (100 MAD)         │
│ └─ [Voir Détails] [Imprimer]            │
│                                          │
└─────────────────────────────────────────┘

================================================================================
SECTION 7: FLUX DE TRAVAIL DÉTAILLÉS
================================================================================

7.1 FLUX DE TRAVAIL DE RÉSERVATION
──────────────────────────────────

1. Patient réserve un rendez-vous
   - Clique sur "Réserver un rendez-vous"
   - Sélectionne la date et l'heure
   - (Optionnel) Ajoute des notes
   - Soumet le formulaire
   - Statut de la réservation = EN ATTENTE
   - Message : "Votre réservation a été enregistrée et est en attente de confirmation"

2. Système valide la réservation
   - Vérifie l'absence de double réservation
   - Vérifie la disponibilité du créneau
   - Crée l'enregistrement en base de données

3. Secrétaire reçoit la réservation
   - Accède à l'interface de gestion des rendez-vous
   - Affiche toutes les réservations en attente
   - Revoit les détails (patient, date, heure)
   - Recherche un conflit d'horaires
   - Confirm ou rejette

4. Confirmation
   - Clique sur "Confirmer"
   - Statut = CONFIRMÉ
   - Système envoie email au patient : "Votre rendez-vous a été confirmé pour [date] à [heure]"

5. Patient voit la confirmation
   - Reçoit l'email
   - Se connecte au système et voit le statut CONFIRMÉ
   - Peut télécharger le détail du rendez-vous

6. Annulation (Alternative à l'étape 4)
   - Secrétaire clique sur "Rejeter"
   - Saisit une raison (optionnel)
   - Statut = ANNULÉ
   - Système envoie email au patient : "Votre réservation a été annulée. Raison : [raison]"
   - Patient peut réserver à nouveau

7.2 FLUX DE TRAVAIL DE VISITE
─────────────────────────────

1. Jour du rendez-vous
   - Rendez-vous = CONFIRMÉ et date/heure est maintenant
   - Patient arrive à la clinique
   - Secrétaire confirme la présence

2. Dentiste effectue le traitement
   - Patient voit le dentiste
   - Traitement/examen effectué
   - (À proximité du bureau du dentiste/ordinateur clinique)

3. Dentiste enregistre la visite
   - Se connecte au système
   - Accède à "Mes rendez-vous d'aujourd'hui"
   - Clique sur le rendez-vous confirmé
   - Saisit :
     ├─ Diagnostic (p. ex., "Accumulation de tartre")
     ├─ Traitement fourni (p. ex., "Détartrage professionnel")
     ├─ Notes supplémentaires
     └─ (Optionnel) Opérations supplémentaires avec coûts
   - Clique sur "Marquer comme complété"
   - Système crée automatiquement :
     ├─ Enregistrement VISITE
     └─ Facture avec statut EN ATTENTE

4. Dentiste émet une ordonnance (optionnel)
   - Sélectionne "Émettre ordonnance"
   - Choisit parmi les médicaments disponibles
   - Pour chaque médicament :
     ├─ Saisit la fréquence (p. ex., "2 fois par jour")
     ├─ Saisit la durée (p. ex., "7 jours")
     └─ Ajoute des instructions spéciales si nécessaire
   - Clique sur "Sauvegarder l'ordonnance"
   - Système crée l'enregistrement ORDONNANCE

5. Visite enregistrée
   - Dentiste voit le message : "Visite enregistrée avec succès"
   - Rendez-vous statut = COMPLÉTÉ
   - Visite statut = COMPLÉTÉ

6. Patient voit les mises à jour
   - Se connecte au système
   - Voit "Visite complétée le [date]"
   - Peut :
     ├─ Consulter les détails de la visite
     ├─ Consulter la facturation
     ├─ Télécharger la facture (PDF)
     ├─ Consulter l'ordonnance (si émise)
     └─ Télécharger l'ordonnance (PDF)

================================================================================
SECTION 8: INTÉGRATIONS TECHNIQUES
================================================================================

8.1 TECHNOLOGIES REQUISES (EMPILAGE TECHNOLOGIQUE)
──────────────────────────────────────────────────

Frontend :
├─ ReactJS (dernière version LTS)
├─ HTML5 & CSS3
├─ axios ou fetch API (appels API)
├─ React Router (navigation)
├─ DatePicker (composant calendrier)
├─ React Table ou DataTables (affichage des données)
├─ PDF Library (jsPDF ou react-pdf)
└─ Responsive Design (mobile-first)

Backend :
├─ Laravel 11 (PHP)
├─ MySQL 8.0 ou MariaDB
├─ Laravel Sanctum (authentification API)
├─ CORS middleware
├─ Postman (tests API)
├─ Mailtrap ou similaire (emails de test)
└─ Validation côté serveur

DevOps & Outils :
├─ Git & GitHub (contrôle de version)
├─ Composer (gestionnaire PHP)
├─ NPM ou Yarn (gestionnaire Node.js)
├─ Node.js (environnement JS)
└─ VS Code ou PhpStorm (éditeurs recommandés)

8.2 POINTS D'INTÉGRATION DE L'API
──────────────────────────────────

Authentification :
├─ POST /register (créer un compte patient)
├─ POST /login (connexion)
├─ POST /logout (déconnexion)
└─ GET /profile (récupérer le profil connecté)

Gestion des patients :
├─ GET /api/patients (liste — secrétaire/dentiste)
├─ GET /api/patients/{id} (profil complet)
├─ PUT /api/patients/{id} (modifier profil)
└─ GET /api/patients/{id}/history (visites + ordonnances + factures)

Gestion des rendez-vous :
├─ POST /api/rendez-vous (créer — patient)
├─ GET /api/rendez-vous (liste selon rôle)
├─ GET /api/rendez-vous/{id} (détails)
├─ DELETE /api/rendez-vous/{id} (annuler si en_attente — patient)
├─ PUT /api/rendez-vous/{id}/confirm (confirmer — secrétaire)
├─ PUT /api/rendez-vous/{id}/reject (rejeter avec raison — secrétaire)
├─ GET /api/rendez-vous/available-slots?date=YYYY-MM-DD (créneaux libres)
└─ GET /api/dentiste/schedule (RDV confirmés du jour — dentiste)

Gestion des visites :
├─ POST /api/visites (créer depuis RDV confirmé — dentiste)
├─ GET /api/visites/{id} (détails avec opérations, ordonnance, facture)
├─ GET /api/patient/{id}/visites (historique patient)
└─ GET /api/dentiste/visites/today (visites du jour)

Gestion des opérations (catalogue) :
├─ GET /api/operations (liste catalogue — tous connectés)
└─ PUT /api/operations/{id} (modifier tarif — secrétaire)

Gestion des médicaments :
├─ GET /api/medicaments (liste — dentiste/secrétaire)
├─ POST /api/medicaments (ajouter — secrétaire)
├─ PUT /api/medicaments/{id} (modifier — secrétaire)
└─ DELETE /api/medicaments/{id} (supprimer — secrétaire)

Gestion des ordonnances :
├─ POST /api/ordonnances (créer liée à visite — dentiste)
├─ GET /api/ordonnances/{id} (détails avec médicaments)
└─ GET /api/patient/{id}/ordonnances (liste + filtre statut)

Gestion des factures :
├─ GET /api/factures (liste toutes — secrétaire)
├─ GET /api/factures/report (rapport revenus — secrétaire)
├─ GET /api/factures/{id} (détails)
├─ GET /api/patient/{id}/factures (liste patient)
└─ POST /api/factures/{id}/payment (enregistrer paiement — secrétaire)

Notifications :
├─ GET /api/notifications (liste notifications user connecté)
├─ PATCH /api/notifications/read-all (tout marquer lu)
└─ PATCH /api/notifications/{id}/read (marquer une notification lue)

================================================================================
SECTION 9: CALENDRIER DE DÉVELOPPEMENT (5 SEMAINES)
================================================================================

Semaine 1 (21-27 avril) : Planification et mise en place
├─ Réunion de démarrage de projet
├─ Mise en place du référentiel GitHub
├─ Création de la structure de base du projet (frontend + backend)
├─ Configuration de Git et des branches
├─ Documentation initiale du projet
├─ Configuration de la base de données locale
└─ Création du schéma initial

Semaine 2 (28 avril - 4 mai) : Développement backend
├─ Configuration du projet Laravel
├─ Création de la structure des modèles de base de données
├─ Création des modèles et relations
├─ Système d'authentification (inscription, connexion, déconnexion)
├─ Implémentation middleware basé sur les rôles
├─ Création des contrôleurs API et des routes
├─ Mise en place du flux de travail de rendez-vous
└─ Test des points d'extrémité API avec Postman

Semaine 3 (5-11 mai) : Développement frontend
├─ Configuration de la structure du projet React
├─ Pages d'authentification (connexion, inscription)
├─ Tableau de bord du patient
├─ Interface de réservation de rendez-vous
├─ Vue de l'historique des visites
├─ Vues des factures/ordonnances
├─ Navigation et mise en page
└─ Connexion frontend à l'API backend

Semaine 4 (12-18 mai) : Intégration et tests
├─ Tests de bout en bout (tous les flux utilisateur)
├─ Tests de sécurité (autorisation, protection des données)
├─ Corrections de bogues et affinements
├─ Optimisation des performances
├─ Tests multi-navigateurs
├─ Tests de réactivité mobile
└─ Tests d'acceptation des utilisateurs (si possible avec l'enseignant)

Semaine 5 (19-24 mai) : Documentation et soumission
├─ Rédaction du README.md avec instructions d'installation
├─ Création de la documentation utilisateur (comment utiliser chaque fonctionnalité)
├─ Enregistrement de la vidéo de démonstration (5 minutes)
├─ Exportation du schéma de base de données en fichier .sql
├─ Révision final du code et nettoyage
├─ Envoi vers GitHub
└─ Soumission avant le 24 mai 2026

================================================================================
SECTION 10: CRITÈRES DE SUCCÈS ET LIVRABLES
================================================================================

10.1 CRITÈRES DE SUCCÈS FONCTIONNELS
─────────────────────────────────────

Le projet est considéré comme réussi si :

✓ Le patient peut s'inscrire et se connecter immédiatement
✓ Le patient peut réserver un rendez-vous (statut : EN ATTENTE → CONFIRMÉ)
✓ Le dentiste peut enregistrer une visite avec diagnostic et notes de traitement
✓ La facture est générée automatiquement à partir de la visite
✓ Le dentiste peut émettre une ordonnance avec médicaments et fréquence
✓ Le patient peut afficher et télécharger la facture en PDF
✓ Le patient peut afficher et télécharger l'ordonnance en PDF
✓ La secrétaire peut confirmer le paiement
✓ Le contrôle d'accès basé sur les rôles est appliqué (les patients, secrétaires, dentistes voient différentes vues)
✓ Toutes les opérations CRUD fonctionnent (Créer, Lire, Mettre à jour, Supprimer)
✓ La gestion des erreurs fonctionne sur le frontend et le backend
✓ Le système est réactif (ordinateur de bureau et mobile)
✓ Aucun bogue critique ou problème de perte de données

10.2 LIVRABLES REQUIS
──────────────────────

1. Code source (Référentiel GitHub)
   ├─ Code frontend (ReactJS)
   ├─ Code backend (Laravel)
   ├─ .gitignore correctement configuré
   ├─ Historique de validation propre
   └─ README.md (installation, fonctionnalités, utilisation)

2. Schéma de la base de données
   ├─ Fichier SQL avec schéma complet
   ├─ Toutes les tables et relations
   ├─ Données d'exemple (optionnel, mais utile pour la démonstration)
   └─ Bien documenté

3. Vidéo de démonstration
   ├─ Longueur maximale de 5 minutes
   ├─ Montre les caractéristiques clés :
   │  ├─ Inscription des patients et connexion immédiate
   │  ├─ Réservation et confirmation du rendez-vous
   │  ├─ Enregistrement de la visite
   │  ├─ Délivrance de l'ordonnance
   │  ├─ Génération et paiement de la facture
   │  └─ Accès basé sur les rôles
   ├─ Audio clair (narration ou audio d'enregistrement d'écran)
   ├─ Bonne visibilité de l'écran (texte lisible)
   └─ Présentation professionnelle (parcours lent et clair)

4. Documentation
   ├─ README.md avec :
   │  ├─ Description du projet
   │  ├─ Comment installer et exécuter
   │  ├─ Aperçu des fonctionnalités
   │  ├─ Technologies utilisées
   │  └─ Noms des membres de l'équipe
   ├─ Documentation API (ou lien vers la collection Postman)
   └─ Guide utilisateur (optionnel, mais utile)

10.3 AMÉLIORATIONS OPTIONNELLES (Si le temps le permet)
────────────────────────────────────────────────────

✓ Notifications par email (confirmations de patient, reçus de paiement)
✓ Annulation du rendez-vous par le dentiste
✓ Recherche/filtrage avancé des patients
✓ Système d'évaluation/retours du patient
✓ Seeder de base de données avec données d'exemple
✓ Gestion des erreurs et validation avancées
✓ Mode sombre pour l'interface utilisateur
✓ Fonctionnalité de réinitialisation du mot de passe
✓ Authentification à deux facteurs
✓ Reprogrammation du rendez-vous
✓ Avertissements sur les effets secondaires des médicaments

================================================================================
SECTION 11: HYPOTHÈSES ET CONTRAINTES
================================================================================

11.1 HYPOTHÈSES
────────────────

Hypothèses commerciales :
├─ La clinique fonctionne pendant les heures normales de bureau
├─ Les patients peuvent immédiatement utiliser le système après inscription
├─ Un dentiste effectue tous les traitements
├─ Les patients paient en personne à la clinique avec uniquement DES ESPÈCES
├─ Les ordonnances sont imprimées/téléchargées par le patient (pas d'envoi auto à la pharmacie)
├─ Les dossiers médicaux sont conservés indéfiniment (pas de suppression des données historiques)
├─ Le système est utilisé initialement par 100-200 patients
├─ Le système calcule automatiquement le total de la facture (frais de base + coût des opérations)
├─ La secrétaire confirme uniquement le paiement (pas d'ajustement de montant manuel)

Hypothèses techniques :
├─ La connectivité Internet est fiable
├─ Les utilisateurs ont accès à l'email (pour les notifications)
├─ Les navigateurs sont modernes et à jour
├─ La base de données peut être sauvegardée régulièrement
├─ L'accès au système est via HTTPS (connexion sécurisée)
└─ Les utilisateurs se souviennent de leurs mots de passe (réinitialisation basique)

11.2 CONTRAINTES
──────────────────

Contrainte de temps :
├─ Doit être complété avant le 24 mai 2026 (5 semaines)
├─ L'équipe dispose d'environ 20-30 heures par semaine
└─ Effort total : ~100-150 heures de développement

Contrainte technologique :
├─ Doit utiliser ReactJS (pas d'alternatives)
├─ Doit utiliser Laravel (pas d'alternatives)
├─ Doit utiliser MySQL/MariaDB (pas d'alternatives)
└─ Doit séparer frontend et backend (pas d'application monolithique)

Contrainte de périmètre :
├─ Opérations CRUD uniquement (pas de logique commerciale complexe)
├─ Rapport basique (optionnel)
├─ Pas d'apprentissage automatique ou d'IA
├─ Pas d'analyse avancée
├─ Pas d'intégrations tierces (paiement, SMS, etc.)
├─ Un dentiste par clinique
├─ Calcul automatique des factures (frais de base + coût des opérations)
├─ Paiement par ESPÈCES UNIQUEMENT (pas de chèques, de cartes ou de virements)

Contrainte utilisateur :
├─ Alphabétisation informatique supposée basique
├─ Support de la langue française
├─ Utilisateurs de bureau et mobile attendus
└─ Capacité à fournir des commentaires pendant le développement

Contrainte budgétaire (Projet académique) :
├─ Pas de services tiers payants (utiliser les niveaux gratuits)
├─ Coûts d'infrastructure minimaux
├─ Serveurs fournis par l'université (le cas échéant)
└─ Focus sur l'apprentissage, pas sur la viabilité commerciale

================================================================================
SECTION 12: GLOSSAIRE ET TERMINOLOGIE
================================================================================

Termes clés utilisés dans ce document :

TERMES :
├─ Rendez-vous : Demande du patient au dentiste pour traitement à un moment précis
├─ Confirmation : La secrétaire approuve ou rejette la demande de rendez-vous
├─ Dentiste : Professionnel médical effectuant les traitements
├─ Diagnostic : Résultats médicaux/problème identifié lors de la visite
├─ Facture/Facturation : Facture/reçu pour traitement fourni
├─ Antécédents médicaux : Antécédents de santé du patient (allergies, conditions)
├─ Médicament/Médicament : Médicament prescrit au patient
├─ Patient : Personne cherchant un traitement dentaire
├─ Paiement/Paiement : Argent reçu du patient pour régler la facture
├─ Ordonnance/Ordonnance : Liste de médicaments avec fréquence et instructions
├─ Secrétaire/Secrétaire : Personnel administratif gérant les opérations de la clinique
├─ Statut : État actuel du rendez-vous, de la facture ou de l'ordonnance
├─ Traitement : Soins dentaires fournis au patient
├─ Visite : Rendez-vous réel qui a été complété, enregistré dans le système
└─ CRUD : Créer, Lire, Mettre à jour, Supprimer (opérations de données de base)

STATUTS :
├─ Statuts de réservation : EN ATTENTE, CONFIRMÉ, ANNULÉ, COMPLÉTÉ
├─ Compte patient : ACTIF
├─ Paiement des factures : EN ATTENTE, PAYÉ, ANNULÉ
├─ Statut de l'ordonnance : ACTIF, COMPLÉTÉ, ANNULÉ
└─ Statut de la visite : EN COURS, COMPLÉTÉ

================================================================================
FIN DU DOCUMENT DÉTAILS DU PROJET
================================================================================

OBJECTIF DU DOCUMENT : Spécification fonctionnelle complète du système de gestion
de clinique dentaire sans détails d'implémentation technique. Ce document définit
CE QUE le système fait, pas COMMENT il le fait.

PUBLIC : Équipe de projet (développeurs), enseignant (évaluation).

VERSION : 2.0 (MISE À JOUR)
DATE : 19 avril 2026
STATUT : Mis à jour et prêt pour développement

================================================================================
