# Use a slim Python 3.11 environment
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install build dependencies for OpenCV and ONNX
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install them
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend /app/backend
WORKDIR /app/backend

# Expose the standard FastAPI port (7860 for Hugging Face Spaces)
EXPOSE 7860

# Start Uvicorn bound to 0.0.0.0 on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
