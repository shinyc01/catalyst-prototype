#!/bin/bash
# Offline single-file copy of the app: share/catalyst-prototype.html
exec python3 -I "$(dirname "$0")/build-standalone.py" "$@"
