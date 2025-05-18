# Используем официальный Python-образ
FROM python:3.11-slim

# Установим рабочую директорию
WORKDIR /app

# Не сохранять .pyc и не буферизовать вывод
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Скопируем переменные окружения (если вы используете .flaskenv и python-dotenv)
COPY .flaskenv ./

# Установим зависимости
RUN pip install --upgrade pip \
 && pip install \
    flask \
    flask-cors \
    flask-sqlalchemy \
    flask-migrate \
    flask-bcrypt \
    psycopg2-binary \
    python-dotenv \
    gunicorn \
    pytest \
    pytest-flask


# Скопируем весь код приложения
COPY app/ ./app/
# COPY migrations/ ./migrations/
COPY wsgi.py ./

# Пробросим порт (тот, что используется Flask/Gunicorn)
EXPOSE 5000

# Запуск через gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "wsgi:app"]
