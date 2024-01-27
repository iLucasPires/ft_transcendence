#!/usr/bin/env bash

npm run build
exec serve --no-clipboard --listen 5173 dist/
