from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_image_from_bytes

app = FastAPI()

# 🔥 ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)


@app.post("/predict")
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    result = predict_image_from_bytes(contents)

    return result
