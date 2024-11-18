FROM docker.io/alpine:3.18.4 as base
RUN apk update 
RUN apk add --update-cache python3 
RUN rm -rf /var/cache/apk/*
RUN python3 -m ensurepip 
RUN pip3 install protobuf==3.20.2 
RUN pip3 install Flask 
RUN pip3 install flask-login
RUN pip3 install ankaios-sdk

RUN apk add nodejs npm yarn 

RUN npm install -g @quasar/cli

FROM base as dev

RUN apk update && apk add --update-cache \
    # Development tools
    protoc 
RUN if [ -d /var/cache/apk ]; then rm -rf /var/cache/apk/*; fi

# prod stage
FROM base
# /workspaces/ankaios-dashboard
COPY /workspaces/ankaios-dashboard/app /ankaios-dashboard 

WORKDIR /ankaios-dashboard/client
RUN npm install
RUN quasar build

WORKDIR /ankaios-dashboard
ENTRYPOINT ["python3", "-u", "main.py"]
