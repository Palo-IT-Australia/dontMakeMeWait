#!/usr/bin/env bash

certbot certonly --manual --preferred-challenges=dns --email aloustaunau@palo-it.com --server https://acme-v02.api.letsencrypt.org/directory --agree-tos --domain "www.dontmakemewait.com.au" --work-dir ./cert --config-dir ./cert --logs-dir ./cert

# Add the given value to the dns on azure portal -> dmmw

#Change pem to pfx
openssl pkcs12 -inkey ./cert/live/www.dontmakemewait.com.au/privkey.pem -in ./cert/live/www.dontmakemewait.com.au/cert.pem -export -out ./cert/live/www.dontmakemewait.com.au/cert.pfx

#Go to web app; ssl/tls section and upload the private cert
#Bind it to the app
#Enjoy

#Some trouble ? Call adrien