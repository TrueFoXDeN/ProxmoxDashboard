FROM nginx:stable-alpine3.17-slim

COPY dist/proxmox/browser /usr/share/nginx/html
