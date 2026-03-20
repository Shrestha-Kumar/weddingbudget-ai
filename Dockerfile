# Use a slim Python 3.11 environment
FROM python:3.11-slim as builder

# Set the working directory
WORKDIR /app

# Install build dependencies for OpenCV and ONNX
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install dependencies (ignoring cache to reduce layer size)
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend /app/backend
WORKDIR /app/backend

# Expose the standard FastAPI port
EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
