# .CERT USAGE

## Scenario
Certificates usually expires after 3 months if acme.sh has been used with default values.
Creating a tool that allowed us to simplify the renewal was required.

## USAGE
From repository home, run .cert/cert-renovation.sh and it should renew the existing certificate, send it to the CA and create a new PFX to update on azure portal.
For now certificate should be picked up from .cert directory and should be manually updated on the app service. Password can be found in secrets_tls.yaml file.

Certificate upload CAN be automated via CLI, Powershell or terraform/terragrunt

## Future integrations
- CI / CD automatic certificate renewal with trigger each Monday.