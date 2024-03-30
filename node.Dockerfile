FROM node:20-alpine
ARG USER=1000

USER $USER:$USER

WORKDIR /srv/portfolio

ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]
