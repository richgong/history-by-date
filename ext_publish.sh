#!/usr/bin/env bash

npm run build
rm chrome_ext.zip
zip -r chrome_ext.zip src
