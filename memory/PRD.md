# MWCREW — Site d'inscription Édition 03

## Problem Statement (original)
> crée moi un site web pour crée un formulaire pour le MWCREW limité à 25 places sur le formulaire les gens doivent mettre leurs prénoms et dire quelle bmw ils ont avec un endroit pour mettre une photo de leurs voiture et en dessous tu demande pour les prochaines si eux il serait prêt à payer pour par exemple 1 journée ou on visite des choses restaurant et tout ou 2 jour avec hotel avec nous et tu met un espace ou il mettent leurs numéro de téléphone et avec les images que je t'ai donné tu met un coin pour dire que la première image c'était la première édition et la 2 image la deuxième édition

## User Choices
- Stockage: DB + (Email à venir) + Admin password
- Nom: MWCREW (sans slogan)
- Pas de tarifs affichés, juste intérêt
- Style: noir/blanc minimaliste façon BMW M
- Édition 3: 19 juillet, Lac de l'Eau d'Heure
- Admin password: `mwcrew2025`

## Architecture
- Backend: FastAPI + MongoDB (motor async)
  - `GET /api/registrations/count`
  - `POST /api/registrations` (limit 25)
  - `POST /api/admin/login`
  - `GET /api/admin/registrations` (X-Admin-Token)
  - `DELETE /api/admin/registrations/{id}`
- Frontend: React + Tailwind + Shadcn (sonner toasts)
  - `/` Home (hero, marquee, compteur, galerie éditions 1 & 2, formulaire)
  - `/admin` Login + table inscriptions + modal photo + suppression
- Photo: upload côté client → base64 data URL → stocké en Mongo (≤ 5 Mo)

## User Personas
- **Membre BMW** : remplit le formulaire d'inscription pour réserver sa place
- **Organisateur MWCREW** : consulte la liste, contacte les inscrits, supprime si besoin

## Core Requirements
- Limite stricte 25 places (compteur live + état "complet")
- Champs: prénom, modèle BMW, photo voiture, téléphone, intérêt
- Galerie 2 éditions (images fournies par user)
- Admin protégé par mot de passe
- 100% français
- Style BMW M (noir, blanc, accents tri-color M très sobres)

## Implemented (2026-02)
- ✅ Backend complet + 13 tests pytest (100% pass)
- ✅ Home: hero plein écran avec image moody, compteur géant (places restantes), marquee BMW M, galerie éditions, formulaire complet
- ✅ Formulaire avec validation + preview photo + 4 choix d'intérêt
- ✅ État succès (numéro de place) + état sold-out (≥ 25)
- ✅ Admin: login, table, photo modal, suppression, déconnexion
- ✅ Typographie Oswald + IBM Plex Mono + Manrope (Google Fonts)
- ✅ Tous les éléments interactifs ont `data-testid`
- ✅ Testé end-to-end (testing_agent_v3) — aucun bug

## Backlog (P1/P2)
- **P1** Notifications email à chaque inscription (Resend ou SendGrid — nécessite clé API)
- **P1** Export CSV des inscriptions depuis l'admin
- **P2** Galerie photos publique avec les voitures des inscrits (mosaïque)
- **P2** Compte à rebours J-X jusqu'au 19 juillet
- **P2** Page de remerciement après inscription avec partage WhatsApp/Instagram
- **P2** Multilingue FR/NL pour Belgique
- **P2** Upload via object storage (Emergent) au lieu de base64 en DB
