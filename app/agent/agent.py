from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv


from .model import TravelPlan, TravelDetails
from .prompts import travel_detail_extract_prompt, travel_planning_prompt, final_output_prompt

load_dotenv()

llm = ChatMistralAI(model="open-mixtral-8x22b")

extract_travel_detail_chain = (travel_detail_extract_prompt | llm.with_structured_output(TravelDetails))    
travel_planner_chain = (travel_planning_prompt | llm.with_structured_output(TravelPlan))    


final_chain = (final_output_prompt | llm)

def plan_trip(query:str):
  travel_detail = extract_travel_detail_chain.invoke({"input" : query})
  print("Planning for your destination, please wait for little while: ")
  travel_plan = travel_planner_chain.invoke(dict(travel_detail))
  return {"travel_plan_dict" : dict(travel_plan)}


# if __name__ == "__main__":  
#   travel_detail = extract_travel_detail_chain.invoke({"input" : "I want to plan a trip from New Delhi to Manali.I’ll be traveling for 5 days in total, including return.Preferably want to travel by bus.Please suggest good stays, local sightseeing spots, adventure activities, and food places to try in each city on the way."})
#   print("Planning for your destination, please wait for little while: ")
#   travel_plan = travel_planner_chain.invoke(dict(travel_detail))
#   print("Plan is ready : ")
  
#   for chunk in final_chain.stream({"travel_plan_dict" : dict(travel_plan)}):  
#     print(chunk.content, end="", flush=True)
