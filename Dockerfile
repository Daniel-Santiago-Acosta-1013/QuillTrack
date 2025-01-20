FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json para instalar dependencias primero (mejora la cacheabilidad)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto configurado en vite.config.ts
EXPOSE 4001

# Define el comando por defecto para ejecutar el servidor en modo de previsualización
CMD ["npm", "run", "preview", "--", "--host"]
