#!/bin/bash

INIT_DIR=$(pwd)
REPO_DIR=$(git rev-parse --show-toplevel)
CERT_DIR="$REPO_DIR/.cert"

export DOMAIN="twoje-osk.pl"
CONF_FILE="$CERT_DIR/tls_renew.conf"
SECRETS_FILE="$CERT_DIR/secrets_tls.yaml"
SECRETS_AZURE="$CERT_DIR/secrets_azure.yaml"
SOPS_FILE="$(git rev-parse --show-toplevel)/.cert/sops-all-in-one.sh"

if ! [[ -f "$SECRETS_AZURE" ]]; then
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Error: File $SECRETS_AZURE not found. You probably want to run $SOPS_FILE -o decrypt -a personalAccountChange."
  exit 1
fi

if ! [[ -f "$SECRETS_FILE" ]]; then
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Error: File $SECRETS_FILE not found. You probably want to run $SOPS_FILE -o decrypt -a personalAccountChange."
  exit 1
fi

export AZUREDNS_SUBSCRIPTIONID=$(yq -r .subscription_id $SECRETS_AZURE)
export AZUREDNS_TENANTID=$(yq -r .tenant_id $SECRETS_AZURE)
export AZUREDNS_APPID=$(yq -r .app_id $SECRETS_AZURE)
export AZUREDNS_CLIENTSECRET=$(yq -r .client_secret $SECRETS_AZURE)

# ------------------
# Prepare working directory
# ------------------

mkdir -p ~/.acme.sh/${DOMAIN}
yq -r .ssl_cert $SECRETS_FILE > ~/.acme.sh/${DOMAIN}/fullchain.cer
yq -r .ssl_key $SECRETS_FILE > ~/.acme.sh/${DOMAIN}/${DOMAIN}.key
if [[ -f "$CONF_FILE" ]]; then
  cp $CONF_FILE ~/.acme.sh/${DOMAIN}/${DOMAIN}.conf
fi

PASSWORD=$(yq -r .password $SECRETS_FILE)

# ------------------
# Run acme.sh
# ------------------

cd ~ && git clone https://github.com/acmesh-official/acme.sh.git

bash ~/acme.sh/acme.sh --renew --dns dns_azure --dnssleep 30 -d ${DOMAIN} -d *.${DOMAIN} --server letsencrypt

EXIT_CODE=$?
rm -R -f ~/acme.sh/

if [[ $EXIT_CODE -eq 0 ]]; then
  # ------------------
  # extract results
  # ------------------
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Certificate is updated. Updating files..."
  cd $REPO_DIR

  echo "ssl_cert: |" > $SECRETS_FILE
  while IFS="" read -r p || [ -n "$p" ]
  do
    [ "$p" == "" ] && continue
    printf '    %s\n' "$p" >> $SECRETS_FILE
  done < ~/.acme.sh/${DOMAIN}/fullchain.cer
  echo "ssl_key: |" >> $SECRETS_FILE
  while IFS="" read -r p || [ -n "$p" ]
  do
    printf '    %s\n' "$p" >> $SECRETS_FILE
  done < ~/.acme.sh/${DOMAIN}/${DOMAIN}.key
  echo "password: ${PASSWORD}" >> $SECRETS_FILE

  cp ~/.acme.sh/${DOMAIN}/${DOMAIN}.conf $CONF_FILE

  bash $CERT_DIR/pfx-cert-creation.sh
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Done"
fi

rm -rf ~/.acme.sh

if [ $EXIT_CODE -eq 1 ]; then 
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Error in renewing the certificate. Exiting."
  exit 2
elif [ $EXIT_CODE -eq 2 ]; then 
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Not renowal time. Certificate is valid."
  exit 0
fi