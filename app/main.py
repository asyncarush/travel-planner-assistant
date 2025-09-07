
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/health")
async def check_health():
  return {"message":"Server is healthy"}

if __name__ == "__main__":
  uvicorn.run("main:app", port=8000, reload=True, log_level='info')
