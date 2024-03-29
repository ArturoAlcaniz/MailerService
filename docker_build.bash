DOCKER_BUILDKIT=1 docker build --no-cache --secret id=env,src=.env -t arturoalcaniz/mailer-service:latest -t arturoalcaniz/mailer-service:$(npm pkg get version | tr -d '"') -f Dockerfile .. --network host
if [ "$1" ]
  then
    printf $1 | docker login --username arturoalcaniz --password-stdin
fi
docker push arturoalcaniz/mailer-service:$(npm pkg get version | tr -d '"')
docker push arturoalcaniz/mailer-service:latest
