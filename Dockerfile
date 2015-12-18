FROM tutum/buildstep
RUN apt-get update
RUN apt-get install graphicsmagick -qy
CMD ["node", "server.js"]
