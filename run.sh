#!/usr/bin/env bash

if [ -x "$(command -v pkill)" ]; then
    pkill -f "node history_by_date_dev.js"
fi

node history_by_date_dev.js
