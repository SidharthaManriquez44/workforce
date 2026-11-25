FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 WORKFORCE_ROOT=/app

COPY pyproject.toml ./
COPY src/ ./src/
RUN pip install --no-cache-dir .
COPY database/ ./database/
COPY index.html ./
COPY assets/ ./assets/

CMD ["python", "-m", "uvicorn", "workforce.app.server:app", "--host", "0.0.0.0", "--port", "8000"]
