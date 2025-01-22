FROM node:20

# Instala PM2 globalmente
RUN npm install -g pm2

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Expone el puerto de Vite (asegúrate de que coincide con tu configuración)
EXPOSE 4001

# Usa PM2 para ejecutar la aplicación en producción
CMD ["pm2-runtime", "start", "npm", "--", "run", "preview", "--", "--host"]