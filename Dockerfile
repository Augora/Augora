FROM nginx:1.15.7

# Copying conf & assets
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY build /usr/share/nginx/html

EXPOSE 80

# Preparing the ocntainer to run nginx with no deamon
CMD ["nginx", "-g", "daemon off;"]
