# JOBY — Trouvez. Vendez. Connectez.

Prototype applicatif full-stack (MVP) pour Goma, RDC. **Comprend du code source, pas un logiciel déjà hébergé ni un paiement en production.**

## Contenu

- `frontend/` : React 18 + Vite, interface francophone responsive, recherche, annonces, connexion, espace annonceur, administration.
- `backend/` : API Express, authentification JWT/bcrypt, contrôles de rôle, endpoints annonces, modération, CRUD administratif.
- `backend/sql/01_schema.sql` : MySQL/MariaDB, 18 tables métier et 3 vues de rapports.
- `backend/sql/02_home_banners.sql` : migration idempotente pour les bannières administrables de la page d’accueil.
- `reference/` : maquettes Stitch originales reçues (HTML, PNG et charte DESIGN.md).
- `frontend/public/joby-brand-reference.jpg` : identité Joby fournie en référence.

## Pré-requis

Node.js 20+, npm, MySQL 8+ ou MariaDB récent. Exécuter dans deux terminaux distincts.

## 1. Préparer MySQL

```bash
sudo mariadb
```

```sql
SOURCE /CHEMIN/ABSOLU/joby_platform/backend/sql/01_schema.sql;
SOURCE /CHEMIN/ABSOLU/joby_platform/backend/sql/02_home_banners.sql;
CREATE USER IF NOT EXISTS 'joby_app'@'localhost' IDENTIFIED BY 'REMPLACER_PAR_MOT_DE_PASSE_SOLIDE';
GRANT SELECT, INSERT, UPDATE, DELETE ON joby.* TO 'joby_app'@'localhost';
FLUSH PRIVILEGES;
```

**Attention :** si `DB_HOST=127.0.0.1`, MariaDB peut distinguer `joby_app`@`127.0.0.1` de `joby_app`@`localhost`. Adapter la configuration utilisateur/hôte selon la machine et son mode de connexion.

## 2. Démarrer l'API

```bash
cd backend
cp .env.example .env
# Modifier DB_USER, DB_PASSWORD, DB_HOST, JWT_SECRET (secret aléatoire >= 32 caractères)
npm install
npm run dev
```

API : `http://localhost:4000/api/health`.

## 3. Démarrer React

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Interface : `http://localhost:5173`.

## 4. Créer le premier administrateur

1. Créer un compte normal via l'écran Inscription.
2. **Depuis le terminal MySQL administrateur uniquement**, promouvoir ce compte :

```sql
USE joby;
UPDATE users SET role='admin' WHERE email='VOTRE_EMAIL_INSCRIT';
```

3. Se déconnecter puis se reconnecter et ouvrir **Administration**.

Ne jamais créer de compte administrateur avec un mot de passe prédéfini en code ou dans une sauvegarde publique.

## Fonctionnalités intégrées

- Recherche publique par type et mot-clé ; annonces publiées uniquement.
- Inscription et connexion, espace personnel et statut des annonces.
- CRUD utilisateur sur ses annonces, envoi à la modération après création ou modification ; images par URL ou sélection locale (JPG, PNG, WebP, 5 Mo max. par photo et 5 par annonce).
- Les photos envoyées sont stockées dans `backend/uploads/` et servies par l'API ; configurez `API_PUBLIC_URL` si l'API n'est pas accessible sur `http://localhost:4000`.
- Tableau de bord administratif basé sur la base ; modération ; création et gestion des utilisateurs, annonces, catégories, villes, districts, formules, promotions, paiements manuels en attente, pages, annonces institutionnelles et signalements ; consultation du journal d'audit et export CSV des finances.
- Carrousel de bannières de la page d’accueil géré depuis **Administration → Bannières d’accueil** : texte, image importée ou URL, lien d’action, ordre et activation.
- Journal d’audit présenté en français avec des descriptions compréhensibles ; interface adaptative avec animations respectant la préférence de réduction des mouvements.
- Vues MySQL `v_listing_summary`, `v_monthly_revenue`, `v_listing_stats` ; demande de promotion.
- Paiements **manuels et vérifiés par admin uniquement**, sans intégration Mobile Money ou prestataire de paiement.

## Limites du MVP / à faire avant mise en production

- Remplacer le stockage local de photos par un stockage objet durable avant déploiement multi-instance ; supprimer les dépendances Google Fonts si usage hors ligne.
- Intégrer un fournisseur de paiement et ses webhooks signés ; pas de paiement automatique ni preuve de paiement.
- Implémenter une véritable gestion de campagnes et un moteur de diffusion/mesure des impressions/clics (schéma prévu, interface CRUD disponible).
- Ajouter processus mot de passe oublié, vérification e-mail, notification automatisée, consentement des utilisateurs, CGU/confidentialité, anti-spam et tests automatisés.
- Renforcer validations champ par champ sur tous les modules d'administration, politiques CSP/CORS, protections contre abus, revue de sécurité, logs serveur, backups et supervision.
- Ajouter pagination et filtrage avancés sur les tableaux admin, graphiques réels historiques et export Excel/PDF.
- Automatiser l'expiration des annonces/promotions et la programmation de campagnes via tâches planifiées.
- Installer HTTPS, configurer un domaine et un serveur de production, gérer migrations versionnées et créer une stratégie de restauration.
- Les documents Stitch sont des références ; la version React reprend leur palette sans être une transposition pixel-perfect de toutes les maquettes.

## Dictionnaire rapide API

- Public : `GET /api/listings`, `GET /api/listings/:id`, `GET /api/categories`, `GET /api/cities`, `GET /api/plans`, `GET /api/banners`.
- Auth : `POST /api/auth/register`, `POST /api/auth/login`, `GET/PATCH /api/me`.
- Annonceur : `GET/POST /api/my/listings`, `PUT/DELETE /api/my/listings/:id`, `GET/POST /api/my/promotions`, `GET /api/my/payments`.
- Administrateur : `GET /api/admin/stats`, `GET /api/admin/listings`, `PATCH /api/admin/listings/:id/status`, `GET/POST/PATCH/DELETE /api/admin/modules/:module`, `GET /api/admin/audit` et `GET /api/admin/finance`.

## Licence

Code fourni comme point de départ adaptable. Les maquettes Stitch et l'image de marque restent les éléments de référence du projet.
