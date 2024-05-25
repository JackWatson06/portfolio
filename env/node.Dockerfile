FROM node:20-alpine AS base
ARG USER=1000

WORKDIR /srv/portfolio

FROM base AS development
ENV NODE_ENV=development

USER $USER:$USER
COPY --chown=$USER:$USER env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "dev" ]

FROM base AS test
ENV NODE_ENV=test

USER $USER:$USER
COPY --chown=$USER:$USER env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "test" ]