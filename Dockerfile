FROM arturoalcaniz/node-image:latest
RUN --mount=type=secret,id=env \
    git clone "https://$(grep TOKEN_GIT /run/secrets/env | cut -d'=' -f 2-)@github.com/ArturoAlcaniz/MailerService.git" /app/MailerService/
RUN chown -R node:node /app/MailerService
RUN chmod -R 755 /app/MailerService
USER node
EXPOSE 3021