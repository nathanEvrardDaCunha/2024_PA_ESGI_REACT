# Étape 1 : Construction de la phase de construction
FROM node:14 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2 : Phase d'exécution
FROM nginx:alpine

# Copier les fichiers build de la phase précédente
COPY --from=build /app/build /usr/share/nginx/html

# Copier le fichier de configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
