FROM frolvlad/alpine-python3

ADD assets/ /opt/resource/
RUN chmod +x /opt/resource/*

