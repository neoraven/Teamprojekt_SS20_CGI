#!/bin/bash
/home/jonas/stockmarket-app/Teamprojekt_SS20_CGI/backend/stocksbackend/venv/bin/gunicorn -c /home/jonas/stockmarket-app/Teamprojekt_SS20_CGI/backend/stocksbackend/venv/gunicorn_config.py stocksbackend.wsgi
