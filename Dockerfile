FROM node:18-alpine

WORKDIR /frontend/

# Копирование всех необходимых файлов
COPY package.json package-lock.json ./

# Установка зависимостей
COPY package.json package-lock.json ./

RUN npm install


COPY public/ ./public/
COPY src/ ./src/

# Expose порт (опционально)
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
