#!/bin/bash

usage() { echo "Usage: $0 -o encrypt|decrypt -a inAutomation|manualChange|personalAccountChange|{empty_string} " >&2; }

#######################################

# Check that the appropriate number of arguments are passed in
if [ $# -lt 4 ]; then
  usage;
  exit 1;
fi

#######################################

# Check if you have the minimal apps to run the script

if [ "$(command -v yq)" == "" ]; then
    echo "YQ not installed... Install it and try again"
    exit 3
fi

if [ "$(command -v sops)" == "" ]; then
    echo "SOPS not installed... Install it and try again"
    exit 3
fi

#######################################

# Process the arguments to determine values for required parameters
while getopts a:o: opt
do
  case "$opt" in
    a) AUTH_TYPE="$OPTARG";;
    o) OPTION="$OPTARG";;
    *) usage;
       exit 1;;
  esac
done

export AZURE_AUTH_METHOD="clientcredentials"
export AZURE_KEY_VAULT="https://osksharedkv.vault.azure.net/keys/sops/8ff5183491dd47beb0bf877f44e50445"

if [ "$AUTH_TYPE" == "inAutomation" ]; then
    export AZURE_TENANT_ID=$tenantId
    export AZURE_CLIENT_ID=$servicePrincipalId
    export AZURE_CLIENT_SECRET=$servicePrincipalKey
elif [ "$AUTH_TYPE" == "manualChange" ]; then
    if [[ ! -f "./secrets_azure.yaml" ]]; then
        echo "secrets_azure.yaml file does not exist. Decrypt that first run the script again."
    fi
    export AZURE_TENANT_ID=$(yq .tenant_id $(git rev-parse --show-toplevel)/.cert/secrets_azure.yaml)
    export AZURE_CLIENT_ID=$(yq .client_id $(git rev-parse --show-toplevel)/.cert/secrets_azure.yaml)
    export AZURE_CLIENT_SECRET=$(yq .client_secret $(git rev-parse --show-toplevel)/.cert/secrets_azure.yaml)
elif [ "$AUTH_TYPE" == "personalAccountChange" ]; then
    export AZURE_AUTH_METHOD=
    echo "Using personal az account. Be sure that you're logged in to the correct subscription otherwise next az commands will fail."
elif [ "$AUTH_TYPE" == "" ]; then
    if [[ "$ARM_TENANT_ID" != "" && "$ARM_CLIENT_ID" != "" && "$ARM_CLIENT_SECRET" != "" ]]; then
        export AZURE_TENANT_ID=$ARM_TENANT_ID
        export AZURE_CLIENT_ID=$ARM_CLIENT_ID
        export AZURE_CLIENT_SECRET=$ARM_CLIENT_SECRET
    else
        echo "Error: ARM_TENANT_ID, ARM_CLIENT_ID, ARM_CLIENT_SECRET environment variables need to be set."
        exit 1
    fi
else
    echo "Error: Authentication type not recognized."
    usage
    exit 1
fi

if [ "$OPTION" == "encrypt" ]; then
    for file in $(find .cert -type f \( -iname "secrets_*.yaml" ! -iname "*.enc.yaml" \) ); do
        printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Looking for changes in $file file"
        diff ${file} <(sops --decrypt --azure-kv ${AZURE_KEY_VAULT} ${file%%.yaml}.enc.yaml) > /dev/null 2>&1
        if [ $? -eq 1 ]; then
            printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Encrypting $file file"
            sops --encrypt --azure-kv "${AZURE_KEY_VAULT}" ${file} > ${file%%.yaml}.enc.yaml
        fi
    done
elif [ "$OPTION" == "decrypt" ]; then
    for file in $(find .cert -type f \( -iname "secrets_*.enc.yaml" \) ); do
        printf '%s %s\n' "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")]" "Decrypting $file file"
        sops --decrypt --azure-kv ${AZURE_KEY_VAULT} ${file} > ${file%%.enc.yaml}.yaml
    done
else
    echo "Error: Action not recognized. Allowed options are encrypt and decrypt."
    exit 1
fi