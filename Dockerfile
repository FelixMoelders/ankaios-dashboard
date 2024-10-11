FROM docker.io/alpine:3.18.4 as base
RUN apk update && apk add --update-cache \
    # Development tools
    python3 \
    && rm -rf /var/cache/apk/* \
    && python3 -m ensurepip && pip3 install protobuf==3.20.2 && pip3 install Flask && pip3 install flask-login

RUN apk add nodejs npm yarn 

RUN npm install -g @quasar/cli

FROM base as dev

RUN apk update && apk add --update-cache \
    # Development tools
    protoc \
    && rm -rf /var/cache/apk/*

COPY /tmp/ankaios/api/proto/ank_base.proto /usr/local/lib/ankaios/ank_base.proto
COPY /tmp/ankaios/api/proto/control_api.proto /usr/local/lib/ankaios/control_api.proto
RUN protoc --python_out=/usr/local/lib/ankaios/ --proto_path=/usr/local/lib/ankaios/ ank_base.proto
RUN protoc --python_out=/usr/local/lib/ankaios/ --proto_path=/usr/local/lib/ankaios/ control_api.proto && touch /usr/local/lib/ankaios/__init__.py

# prod stage
FROM base
ENV PYTHONPATH="${PYTHONPATH}:/usr/local/lib/ankaios"
COPY --from=dev /usr/local/lib/ankaios /usr/local/lib/ankaios
COPY /workspaces/ankaios-dashboard/app /ankaios-dashboard

WORKDIR /ankaios-dashboard/client
RUN npm install
RUN quasar build

WORKDIR /ankaios-dashboard
ENTRYPOINT ["python3", "-u", "main.py"]
