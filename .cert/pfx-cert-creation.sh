#!/bin/bash

REPO_DIR=$(git rev-parse --show-toplevel)
CERT_DIR=$REPO_DIR/.cert
SECRET_FILE="${CERT_DIR}/secrets_tls.yaml"

if ! [[ -f "$SECRET_FILE" ]]; then
  printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Error: File $SECRET_FILE not found. You probably want to run $SOPS_FILE -o decrypt -a personalAccountChange."
  exit 1
fi

KEY=$(yq -r .ssl_key $SECRET_FILE )
CERT=$(yq -r .ssl_cert $SECRET_FILE )
PASSWORD=$(yq -r .password $SECRET_FILE)
PFX_FILE=${CERT_DIR}/tls_domain_cert.pfx

printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Creating ${PFX_FILE} file"
openssl pkcs12 -export -out ${PFX_FILE} -inkey <(echo "${KEY}") -in <(echo "${CERT}") -password pass:${PASSWORD}