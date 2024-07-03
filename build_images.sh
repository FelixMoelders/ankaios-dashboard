#!/bin/bash

# Set environment variables for security
export GHCR_USERNAME=
export GHCR_PASSWORD=

# Set version variable
export VERSION=

podman login --username $GHCR_USERNAME --password $GHCR_PASSWORD ghcr.io
# You need to be logged in to ghcr.io
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

podman build --ignorefile ./.containerignore -t ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-amd64 --platform linux/amd64 -f ./Dockerfile ${SCRIPT_DIR}/../../
podman build --ignorefile ./.containerignore -t ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-arm64 --platform linux/arm64 -f ./Dockerfile ${SCRIPT_DIR}/../../

podman push ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-amd64
podman push ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-arm64

podman manifest create ankaios-dashboard
podman manifest add ankaios-dashboard ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-amd64
podman manifest add ankaios-dashboard ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}-arm64

podman manifest push --all ankaios-dashboard ghcr.io/felixmoelders/ankaios-dashboard:${VERSION}
podman manifest push --all ankaios-dashboard ghcr.io/felixmoelders/ankaios-dashboard:latest
