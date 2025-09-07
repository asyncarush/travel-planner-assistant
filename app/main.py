from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from agent.agent import final_chain, plan_trip
from fastapi.responses import StreamingResponse

app = FastAPI()

origins = ["http://localhost:5173"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],          
)

@app.get("/health")
async def check_health():
  return {"message":"Server is healthy"}


class QueryRequest(BaseModel):
    query: str

@app.post("/agent/query")
async def ask_travel_agent(request: QueryRequest):
    print("User asked:", request.query)
    print("Fetching the result.....")

    trip_plan = plan_trip(request.query)

    def event_generator():
        for chunk in final_chain.stream(trip_plan):
            yield chunk.content

    return StreamingResponse(event_generator(), media_type="text/plain")


if __name__ == "__main__":
  uvicorn.run("main:app", port=8000, reload=True, log_level='info')
