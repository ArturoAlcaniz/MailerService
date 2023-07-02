FROM arturoalcaniz/node-image:latest
RUN --mount=type=secret,id=env \
    git clone "https://$(grep TOKEN_GIT /run/secrets/env | cut -d'=' -f 2-)@github.com/ArturoAlcaniz/entities-lib.git" /app/entities-lib/ && \
    git clone "https://$(grep TOKEN_GIT /run/secrets/env | cut -d'=' -f 2-)@github.com/ArturoAlcaniz/MailerService.git" /app/MailerService/
RUN chown -R node:node /app/MailerService
RUN chown -R node:node /app/entities-lib
RUN chmod -R 755 /app/MailerService
RUN chmod -R 755 /app/entities-lib
USER node
EXPOSE 3021