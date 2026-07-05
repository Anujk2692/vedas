FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve@14.2.4
COPY --from=build /app/dist/vedas-web/browser /app
WORKDIR /app
# Render injects PORT at runtime
CMD ["sh", "-c", "serve -s . -l ${PORT:-10000}"]
