#!/bin/sh

ls -al
id -u
whoami

mkdir node_mdoules_testing

test -d node_modules || npm ci

ls -al
whoami
id -u

npm run "$@"
