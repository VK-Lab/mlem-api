#!/bin/bash

# docker build --pull --rm -f "Dockerfile" -t cylmitbackend:latest "."

export REGISTY_URL=registry.gitlab.com/blhl1210/hub:mlem-api

docker build --pull --rm -f "Dockerfile" -t mlem:latest "."

docker login registry.gitlab.com -u blhl1210 -p "JPoymMxDag6skMxtE-o7"

docker tag mlem:latest ${REGISTY_URL}

docker push ${REGISTY_URL}
