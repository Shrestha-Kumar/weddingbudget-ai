# 🚢 AI Production Deployment Strategy

## The Challenge: Vercel Serverless Limits
Standard Next.js applications are routinely deployed on Vercel. However, our Python FastAPI backend (`api.main:app`) runs heavy synchronous Machine Learning workloads containing:
- **ONNX Runtime** (Binary architectures)
- **OpenCV** (Image processing & matrix bindings)
- **Pandas / Numpy** (Heavy C-extensions)

Vercel Serverless Functions have a hard cap of **250MB** (or **50MB** on Hobby tier) total unzipped lambda size, and strict timeout durations (10-60 seconds). A standard Python ML environment easily exceeds 500MB+ and image inference can spike beyond execution limits. **The ML Backend CANNOT be deployed to Vercel/Netlify.**

## The Solution: Containerized Microservices

### 1. Frontend: Vercel
The Next.js 14 frontend will be deployed directly to Vercel. It is completely decoupled and expects an external `NEXT_PUBLIC_API_URL` pointing to the backend.

### 2. Backend: Docker + Cloud Run / AWS Fargate
The FastAPI application must be Dockerized and pushed to a serverless container environment like **Google Cloud Run**, **AWS Fargate**, or **Render/Railway**. Container deployments lack the 250MB size limit and allow customized scaling limits (e.g. 2GB+ Memory allocations specifically for ONNX computation).

---

### Dockerfile Blueprint

To deploy the backend to production, use this multi-stage `Dockerfile`:

```dockerfile
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
```

### CI/CD Pipeline
1. Github Actions will detect a push to the `main` branch.
2. The Action will build the multi-stage Docker image and push it to AWS ECR (Elastic Container Registry) or Google GCR.
3. The cluster (Cloud Run / Fargate) will seamlessly pull the new `latest` container tag and commence a zero-downtime rolling update.
4. The `NEXT_PUBLIC_API_URL` on Vercel remains locked to the fixed highly-available load balancer.
