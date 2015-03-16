#!/bin/sh
export PATH=/usr/local/bin:$PATH
forever start --sourceDir /var/www/sennep app.js port=80 >> /sennep.txt 2>&1

