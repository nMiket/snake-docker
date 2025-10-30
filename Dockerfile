# Etapa de construcción - usando nginx alpine para imagen más ligera
FROM nginx:alpine

# Copiar archivos del juego al directorio de nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Etiquetas de metadata
LABEL maintainer="Snake Game"
LABEL description="Juego de Snake con interfaz web moderna"
LABEL version="1.0"

# El comando por defecto de nginx ya está en la imagen base
# nginx -g 'daemon off;'
