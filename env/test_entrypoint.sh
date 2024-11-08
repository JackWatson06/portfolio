#!/bin/sh

test -d node_modules || npm ci

npm run migrate
npm run test
