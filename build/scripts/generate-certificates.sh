#!/bin/bash

# set values for certificate DNs
# note: CN is set to different values in the sections below
ORG="000_Test_Certificates"

# set values that the commands will share
VALID_DAYS=360
CA_KEY=ca.key
CA_CERT=ca.crt
CLIENT_KEY=client.key
CLIENT_CERT=client.crt
CLIENT_CSR=client.csr
CLIENT_P12=client.p12
SERVER_KEY=server.key
SERVER_CERT=server.crt
SERVER_CSR=server.csr
KEY_BITS=2048

echo
echo "Create CA certificate..."
CN="Test CA"
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CA_KEY
openssl req -new -x509 -days $VALID_DAYS -key $CA_KEY -subj "/CN=$CN/O=$ORG" -out $CA_CERT
echo "Done."

echo
echo "Creating Server certificate..."
CN="localhost"
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $SERVER_KEY
openssl req -new -key $SERVER_KEY -subj "/CN=$CN/O=$ORG" -out $SERVER_CSR
openssl x509 -days $VALID_DAYS -req -in $SERVER_CSR -CAcreateserial -CA $CA_CERT -CAkey $CA_KEY -out $SERVER_CERT
echo "Done."

echo
echo "Creating Client certificate..."
CN="Test User 1"
USER_ID="testuser1"
P12_PASSWORD=
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:$KEY_BITS -out $CLIENT_KEY
openssl req -new -key $CLIENT_KEY -subj "/CN=$CN/O=$ORG/UID=$USER_ID" -out $CLIENT_CSR
openssl x509 -days $VALID_DAYS -req -in $CLIENT_CSR -CAcreateserial -CA $CA_CERT -CAkey $CA_KEY -out $CLIENT_CERT
openssl pkcs12 -in $CLIENT_CERT -inkey $CLIENT_KEY -export -password pass:$P12_PASSWORD -out $CLIENT_P12
echo "Done."

echo
echo "----- Don't forget to open your browser and install your $CA_CERT and $CLIENT_P12 certificates -----"
echo
