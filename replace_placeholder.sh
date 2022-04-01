#!/bin/bash
APP_BASE_PATH=/usr/share/nginx/html/assets
envsubst < $APP_BASE_PATH/config/config.prod.json > $APP_BASE_PATH/config/config.json

exec "$@"