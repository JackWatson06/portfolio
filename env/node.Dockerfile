FROM node:20-alpine AS base
ARG USER=1000
ARG GROUP=1000

RUN sudo chown -R $USER:$GROUP /.npm
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