FROM node:22-alpine AS base
ARG USER=1000
ARG GROUP=1000

RUN test 1000 != $GROUP && addgroup -g $GROUP node_local; \
  test 1000 != $USER && adduser -u $USER -G $(getent group $GROUP | awk -F: '{print $1}') -D node_local; \
  exit 0

USER $USER:$GROUP
WORKDIR /srv/portfolio

FROM base AS development
ENV NODE_ENV=development

COPY --chown=$USER:$GROUP env/development_entrypoint.sh /development_entrypoint.sh

ENTRYPOINT [ "/development_entrypoint.sh" ]

FROM base AS test
ENV NODE_ENV=test

COPY --chown=$USER:$GROUP env/test_entrypoint.sh /test_entrypoint.sh

ENTRYPOINT [ "/test_entrypoint.sh" ]