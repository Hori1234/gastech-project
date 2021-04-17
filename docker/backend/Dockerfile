FROM python:3.8.6-slim-buster

RUN pip install -U \
    pip \
    setuptools \
    wheel

WORKDIR /backend

RUN useradd -m -r backend && \
    chown backend /backend

COPY ./backend/requirements.txt .

RUN apt-get update && \
 apt-get install -y gcc libpq-dev libpq5 && \
 rm -rf /var/lib/apt/lists/* && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 python3 -m pip install gunicorn && \
 apt-get purge -y --auto-remove gcc libpq-dev

COPY ./backend backend
COPY wsgi.py .
COPY ./docker/backend/backend-entrypoint.sh /backend-entrypoint.sh
RUN mv ./backend/migrations migrations
RUN chmod +x /backend-entrypoint.sh
USER backend