# Utiliser l'image Node.js
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port de l'application
EXPOSE 3003

# Démarrer l'application
CMD ["npm", "run", "start"]
