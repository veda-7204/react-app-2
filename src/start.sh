#!/bin/bash
gunicorn server.py:app --bind 0.0.0.0:$PORT
