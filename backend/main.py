from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Impor semua router
from routers import metrics, charts, campaigns, metadata

app = FastAPI(title="Ad Campaign Intelligence API")

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router
app.include_router(metrics.router)
app.include_router(charts.router)
app.include_router(campaigns.router)
app.include_router(metadata.router)

@app.get("/")
async def root():
    return {"message": "Ad Campaign Intelligence API is running with modular structure"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
