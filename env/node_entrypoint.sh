#!/bin/sh

test -d node_modules || npm ci

npm run "$@"
