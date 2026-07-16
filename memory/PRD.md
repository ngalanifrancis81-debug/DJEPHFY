# Djeph — PRD

## Problème / Objectif
Plateforme de mise en relation entre particuliers et professionnels qualifiés à Douala, Cameroun. Les visiteurs découvrent les domaines de services et contactent facilement un pro adapté. Exigence clé : domaines facilement gérables sans reconstruire le site (via panneau admin).

## Personas
- Particulier à Douala (mobile-first) cherchant un artisan/prestataire fiable.
- Administrateur Djeph gérant les domaines et les demandes reçues.

## Architecture
- Backend: FastAPI + MongoDB (motor). Routes préfixées `/api`. Collections: `categories`, `requests`.
- Auth admin: mot de passe partagé simple (env `ADMIN_PASSWORD`), header `X-Admin-Password`.
- Frontend: React (react-router), Tailwind, lucide-react, sonner. Pages: `/` (Landing), `/admin`.
- Design: palette chaude africaine (ocre/terracotta/crème), Manrope + Inter, mobile-first.

## Choix utilisateur
- Contact: DB + panneau admin + redirection WhatsApp combinés.
- Admin: accès mot de passe simple (djeph2024).
- WhatsApp: +237693819424. Style moderne coloré. Espace prestataires: plus tard.

## Implémenté (2026-07-16)
- Landing: Hero, grille de 16 services avec recherche, Comment ça marche (3 étapes), À propos, formulaire de contact.
- Formulaire de contact: enregistre en DB + ouvre WhatsApp pré-rempli.
- Panneau admin: login, CRUD domaines (nom, description, icône, couleur, actif) via modale avec sélecteur d'icônes, gestion des demandes (statut + suppression).
- Bouton WhatsApp flottant, liens réseaux sociaux (placeholders), quartiers de Douala.
- Backend + frontend testés: 100% (18/18 pytest, flux frontend validés).

## Backlog
- P1: Intégration email (Resend/SendGrid) pour notifier les demandes — nécessite clé API.
- P1: Espace "Nos professionnels" (inscription des prestataires).
- P2: Rate limiting / anti-spam sur POST /api/requests.
- P2: Configuration des liens réseaux sociaux via admin.
- P2: Migrer @app.on_event vers lifespan handler.

## Prochaines actions
- Fournir une clé email si notifications souhaitées.
- Décider du périmètre de l'espace prestataires.
