import getpass
from huggingface_hub import HfApi

print("==================================================")
print("Hugging Face Spaces - AI Model Uploader (Bypass 10MB limit)")
print("==================================================")

token = getpass.getpass("Paste your Hugging Face token here (it will be hidden as you type) and press Enter: ")

api = HfApi(token=token)

print("\nStarting upload... This handles large ONNX models without Git timeouts.")
print("This usually takes around 20-40 seconds.")

api.upload_folder(
    folder_path=".", 
    repo_id="Shrestha2007/weddingbudget-api", 
    repo_type="space", 
    ignore_patterns=[".git/*", "frontend/.next/*", "frontend/node_modules/*", "backend/.venv/*"]
)

print("\nSUCCESS! Your code & ONNX model were securely pushed directly to Hugging Face Spaces!")
print("Go check your Space dashboard. Once it says 'Running', update Vercel with your new hf.space URL.")
