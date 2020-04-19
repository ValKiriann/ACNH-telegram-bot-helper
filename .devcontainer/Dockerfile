#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.112.0/containers/javascript-node-12/.devcontainer/Dockerfile
FROM node:12.16.2-stretch
RUN apt-get update && apt-get install vim locales -y 
RUN mkdir /root/.aws && touch /root/.aws/credentials
ENV LANGUAGE=es_ES.UTF-8 
ENV LANG=es_ES.UTF-8 
ENV LC_ALL=es_ES.UTF-8
RUN ln -fs /usr/share/zoneinfo/Europe/Madrid /etc/localtime && \
    apt install locales-all && \
    update-locale LC_ALL=es_ES.UTF-8
# locale -k LC_TIME