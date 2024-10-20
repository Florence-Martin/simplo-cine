FROM nginx:latest


COPY ./nginx.conf /etc/nginx/nginx.conf


EXPOSE 8080

# Lancer NGINX (le processus de démarrage est celui de l'image officielle)
CMD ["nginx", "-g", "daemon off;"]