FROM mhart/alpine-node:7
RUN apk add --no-cache jq git bash curl
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN ln $HOME/.yarn/bin/yarn /usr/local/bin

ENV PATH /root/.yarn/bin:$PATH
