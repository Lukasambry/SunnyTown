# SunnyTown

SunnyTown est un jeu incrémental de type "idle game" où les joueurs construisent et gèrent leur propre ville.

## Prérequis

- PHP 8.1 ou supérieur
- Composer
- Node.js (version 16 ou supérieure)
- Docker et Docker Compose
- MySQL 8.0 ou supérieur
- npm (pour le développement frontend)
- Make (pour les commandes de gestion)

## Installation et démarrage

1. Cloner ce dépôt :
   ```bash
   git clone <url-du-depot> sunnytown
   cd sunnytown
   ```

2. Démarrer l'application :
   ```bash
   make up
   ```

3. Installer les dépendances :
   ```bash
   make install
   ```

4. Initialiser la base de données :
   ```bash
   make migrate
   make seed
   ```

## Commandes Makefile disponibles

- `make help` : Afficher l'aide avec la liste des commandes disponibles.

## Accès à l'application

Une fois l'application démarrée, elle est accessible à l'adresse :
- Frontend : http://sunnytown.localhost
- Serveur Vite : http://localhost:5173
- Adminer : http://adminer.sunnytown.localhost (pour la gestion de la base de données)

## Structure Docker

Le projet utilise Docker Compose avec les services suivants :
- `traefik` : Reverse proxy (accessible sur le port 80)
- `app` : Application Laravel
- `web` : Serveur Nginx
- `db` : Base de données MySQL
- `node` : Serveur Vite pour le développement frontend

## Structure du projet

- `app/` : Code source principal Laravel
- `resources/` : Fichiers Vue.js et assets frontend
- `public/` : Fichiers accessibles publiquement
- `database/` : Migrations et seeds
- `composer.json` : Dépendances PHP
- `package.json` : Dépendances npm

## Licence

Ce projet est sous licence MIT.
