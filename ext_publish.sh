#!/usr/bin/env bash

npm run build && \
	rm -f chrome_ext.zip && \
	zip -r chrome_ext.zip chrome_ext


echo "
==== ALL DONE ====
To publish, upload ./chrome_ext.zip here: https://chrome.google.com/webstore/devconsole"
