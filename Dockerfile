FROM mhart/alpine-node:base-7

ADD assets/ /opt/resource/
RUN chmod +x /opt/resource/*

