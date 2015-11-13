FROM tutum/buildstep
RUN add-apt-repository -y ppa:lovell/trusty-backport-vips
RUN apt-get update
RUN apt-get install -y libvips-dev libgsf-1-dev
CMD ["node", "server.js"]
