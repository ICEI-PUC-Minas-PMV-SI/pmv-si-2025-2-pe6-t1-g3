#!/bin/sh

# Generate config.js with runtime environment variables
cat > /usr/share/nginx/html/config.js << EOF
// Runtime configuration for environment variables
window.__RUNTIME_CONFIG__ = {
  VITE_API_URL: '${VITE_API_URL:-http://localhost:3000}',
  VITE_VIACEP_API_URL: '${VITE_VIACEP_API_URL:-https://viacep.com.br/ws}',
  VITE_CONTACT_EMAIL: '${VITE_CONTACT_EMAIL:-contato@exemplo.com.br}',
  VITE_GITHUB_REPOSITORY_URL: '${VITE_GITHUB_REPOSITORY_URL:-https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g3}',
  VITE_TOAST_AUTOCLOSE_DURATION: '${VITE_TOAST_AUTOCLOSE_DURATION:-3000}',
  VITE_SEARCH_DEBOUNCE_MS: '${VITE_SEARCH_DEBOUNCE_MS:-500}',
  VITE_CEP_FETCH_DELAY_MS: '${VITE_CEP_FETCH_DELAY_MS:-500}'
};
EOF

sed -i '/<script src="\/config.js"><\/script>/d' /usr/share/nginx/html/index.html
sed -i '/<title>Zabbix Store<\/title>/a\    <script src="/config.js"></script>' /usr/share/nginx/html/index.html

# Start Nginx
exec nginx -g "daemon off;"