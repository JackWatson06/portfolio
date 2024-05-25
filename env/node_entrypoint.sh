#!/bin/sh

test -d node_modules || npm ci

ls -al

npm run "$@"
