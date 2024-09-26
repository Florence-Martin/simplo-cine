FROM prom/prometheus:latest

COPY ./prometheus.yml /etc/prometheus/prometheus.yml

EXPOSE 9090

# Définir le répertoire de travail
WORKDIR /prometheus

# Démarrer Prometheus avec la commande par défaut
CMD ["--config.file=/etc/prometheus/prometheus.yml"]