from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_image_from_bytes

app = FastAPI()

# ✅ CORS (allow frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Health check (VERY IMPORTANT for Render)
@app.get("/")
def home():
    return {"message": "AgroMind ML API is running 🚀"}

# ✅ Prediction API
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    result = predict_image_from_bytes(contents)
    return result