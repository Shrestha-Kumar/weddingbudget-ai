import requests
import json

print("Testing /predict...")
req = {"image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"}
try:
    res = requests.post("http://localhost:8000/predict", json=req)
    if res.status_code == 200:
        data = res.json()["data"]
        print(f"Success! Keys: {list(data.keys())}")
        print(f"GradCAM length: {len(data.get('gradcam_image', ''))}")
    else:
        print("API Response Error:", res.status_code, res.text)
except Exception as e:
    print("API Connection Error:", e)
