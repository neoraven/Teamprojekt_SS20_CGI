#!/bin/bash
/home/jonas/stockmarketapp/Teamprojekt_SS20_CGI/backend/stocksbackend/venv/bin/gunicorn -c /home/jonas/stockmarketapp/Teamprojekt_SS20_CGI/backend/stocksbackend/venv/gunicorn_config.py stocksbackend.wsgi
