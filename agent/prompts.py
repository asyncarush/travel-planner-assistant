from langchain_core.prompts import PromptTemplate


TRAVEL_PLANNING_TEMPLATE = """
You are an expert Travel Planner. Using the given details, create a **day-by-day detailed travel plan** 
for the user. Be creative but practical.

Requirements:
- Suggest best routes from source to destination.
- Recommend awesome places to stay (hotels, homestays, resorts).
- List must-visit attractions, cultural experiences, and hidden gems.
- Suggest best food places (street food, restaurants, local specialties).
- Provide estimated travel time and ideal transport options.
- Make sure the plan feels like a **real itinerary**, not just a list.

Input Details:
Source: {source}
Destination: {destination}
Total Travelling Days: {total_travelling_days}
Preferred Transport Medium: {prefer_transport_medium}
Preferred Options: {other_suggestions}
"""



TRAVEL_DETAIL_EXTRACTOR_TEMPLATE = """
You are a travel assistant. Extract structured travel details from the given user query.

user input:
{input}

TravelDetails:
- source (str, required): The starting point of the entire journey.
- destination (str, required): The final destination of the entire journey.
- total_travelling_days (int, optional): The total number of days the user plans to travel, including the return to source.
- prefer_transport_medium (str, optional): The user’s preferred travelling medium. Must be one of: ["train", "bus", "flight", "car"].
- other_suggestions (str, optional) : Other suggestions like best places to eat, to stay, adventurous places, hiking places for mountains
If the user does not mention an optional field, set it to null.

Example Input:
"I want to travel from Delhi to Goa for 7 days by flight"

Now extract the travel details from this query:
"""


FINAL_OUTPUT_TEMPLATE = """
You are an enthusiastic and expert Travel Agent. 
Your task is to transform the following structured travel plan (provided as a dictionary) 
into a detailed trip planning.

Guidelines:
1. break the plan into multple days like Day 1, morning, afternoon, evening, night stay and same for Day 2, plan according to total travelling days.
2. Format the output in more cleans ways, puts some emoji for the fun.
3. If possible puts some interesting fun facts for the best places available in input dictionary(you will need parse it and fetch the information city wise.)


Input (dictionary format):
{travel_plan_dict}

Output:
Return a **continuous, engaging narration** of the journey that unfolds step by step.
"""





travel_planning_prompt = PromptTemplate.from_template(template=TRAVEL_PLANNING_TEMPLATE)
travel_detail_extract_prompt = PromptTemplate.from_template(template=TRAVEL_DETAIL_EXTRACTOR_TEMPLATE)
final_output_prompt = PromptTemplate.from_template(template=FINAL_OUTPUT_TEMPLATE)