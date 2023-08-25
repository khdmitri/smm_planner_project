#!/bin/sh
cd /app
alembic revision --autogenerate -m "first db creation"
alembic upgrade head
cd ./app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
