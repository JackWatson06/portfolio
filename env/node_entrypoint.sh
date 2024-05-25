#!/bin/sh

test -d node_modules || npm ci

echo "$@"

npm run "$@"
