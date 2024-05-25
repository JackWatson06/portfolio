FROM node:20-alpine AS base
ARG USER=1000

USER $USER:$USER
WORKDIR /srv/portfolio

FROM base AS development
ENV NODE_ENV=development

COPY --chown=$USER:$USER env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "dev" ]

FROM base AS test
ENV NODE_ENV=test

COPY --chown=$USER:$USER env/node_entrypoint.sh /node_entrypoint.sh

ENTRYPOINT [ "/node_entrypoint.sh" ]
CMD [ "test" ]