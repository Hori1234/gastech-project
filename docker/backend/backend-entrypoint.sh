#!/bin/bash

while true; do
    flask db upgrade heads
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done
#source venv/bin/activate
exec gunicorn -w 2 --threads 2 -b 0.0.0.0:5000 --access-logfile - --error-logfile - wsgi:app