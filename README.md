# Traefik ACME Exporter

A small Bun service that watches Traefik's `acme.json` file and exports the certificates and private keys it contains as
separate files.

This is useful when another service needs to consume certificates managed by Traefik.

## How it works

The exporter:

1. Watches `/input/acme.json` for changes.
2. Removes previously exported `.crt` and `.key` files from `/output`.
3. Reads certificates from Traefik's ACME storage.
4. Decodes the base64-encoded PEM values.
5. Writes certificate and private-key files to `/output`.
6. Restricts private-key permissions to `0600`.

The service uses polling because filesystem events do not (reliably) pass through Docker bind mounts.

## Output files

Files are named using the ACME resolver and certificate domain:

```text
<resolver>_<domain>.crt
<resolver>_<domain>.key
```

For example using letsencrypt resolver on the domain `example.com`:

```text
letsencrypt_example.com.crt
letsencrypt_example.com.key
```

Wildcards are replaced by wildcard- prefixes, so *.example.com becomes:

```text
letsencrypt_wildcard-example.com.crt
letsencrypt_wildcard-example.com.key
```

## Usage

```yaml
services:
  # ...
  traefik-acme-exporter:
    image: ghcr.io/stakewa/traefik-acme-exporter
    restart: unless-stopped
    volumes:
      - /path/to/traefik/letsencrypt:/input:ro
      - /path/to/certificates:/output
```