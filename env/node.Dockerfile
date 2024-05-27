FROM node:20-alpine AS base
ARG USER=1000
ARG GROUP=1000

RUN test 1000 != $GROUP && addgroup -g $GROUP node_local; \
  test 1000 != $USER && adduser -u $USER -G $(getent group $GROUP | awk -F: '{print $1}') -D node_local

USER $USER:$GROUP
WORKDIR /srv/portfolio

FROM base AS development
ENV NODE_ENV=development

COPY --chown=$USER:$GROUP env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "dev" ]

FROM base AS test
ENV NODE_ENV=test

COPY --chown=$USER:$GROUP env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "test" ]