# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./
RUN npm ci

# Copier le reste du code source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM node:18-alpine
WORKDIR /app

# Copier les dépendances et les fichiers de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]