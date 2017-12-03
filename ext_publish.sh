#!/usr/bin/env bash

npm run build && \
	rm -f chrome_ext.zip && \
	zip -r chrome_ext.zip chrome_ext
