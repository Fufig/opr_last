# 1. Сборка приложения
FROM node:18-alpine AS builder
WORKDIR /app

# Копируем манифесты и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем весь исходный код и билдим
COPY . .
RUN npm run build

# 2. Небольшой nginx для отдачи статических файлов
FROM nginx:alpine
# Удаляем дефолтный контент
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранный билд из стадии builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Пробросим стандартный HTTP-порт
EXPOSE 80

# Запуск nginx в фореграунде
CMD ["nginx", "-g", "daemon off;"]
