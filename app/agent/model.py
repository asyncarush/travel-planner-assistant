from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from pydantic import BaseModel, Field, ConfigDict


class Place(BaseModel):
    """Represents a tourist attraction or notable place in a city."""
    name: str = Field(..., description="Name of the place to visit")
    description: str = Field(..., description="Short description of the place and why it's recommended")
    rating: float = Field(..., ge=0, le=5, description="User/guide rating of the place (0-5 scale)")
    recommended_visit_duration_hours: Optional[float] = Field(
        None, ge=0, description="Suggested time to spend at the place (in hours)"
    )

    model_config = ConfigDict(extra="allow") 


class CityPlan(BaseModel):
    """City-wise breakdown of the travel plan."""
    source: str = Field(..., description="The starting location of this leg of the journey")
    destination: str = Field(..., description="The destination city for this leg of the journey")
    total_kilometer: float = Field(..., ge=0, description="Total distance covered from source to destination in kilometers")

    departure_time: datetime = Field(..., description="Planned departure time from source (ISO 8601 format)")
    arrival_time: datetime = Field(..., description="Planned arrival time at destination (ISO 8601 format)")
    estimated_duration_hours: Optional[float] = Field(
        None, ge=0, description="Estimated travel duration in hours for this leg"
    )
    notes: Optional[str] = Field(None, description="Special notes about this travel leg (e.g., overnight bus, flight, etc.)")

    best_places: List[Place] = Field(
        default_factory=list, description="List of top places to visit in the destination city"
    )

    model_config = ConfigDict(extra="allow")  # allow custom fields


class TravelPlan(BaseModel):
    """Overall structured travel plan."""
    source: str = Field(..., description="The starting point of the entire journey")
    destination: str = Field(..., description="The final destination of the entire journey")
    total_distance: float = Field(..., ge=0, description="Total distance of the travel in kilometers")

    start_date: datetime = Field(..., description="Start date/time of the overall journey (ISO 8601 format)")
    end_date: datetime = Field(..., description="End date/time of the overall journey (ISO 8601 format)")

    city_wise_plan: List[CityPlan] = Field(..., description="Breakdown of the travel plan city by city")

    model_config = ConfigDict(extra="allow")  # allow custom fields


class TravelDetails(BaseModel):
    """Extracted Details for the travel plan"""

    # required fields
    source: str = Field(..., description="The starting point of the entire journey")
    destination: str = Field(..., description="The final destination of the entire journey")

    # optional fields
    total_travelling_days: Optional[int] = Field(
        None, description="The total number of days user has to travel and return to source location"
    )
    prefer_transport_medium: Optional[str] = Field(
        None, description="User's preferred travelling medium, e.g., train, bus, flight"
    )
    # optional fields    
    other_suggestions: Optional[str] = Field(None, description="Other suggestions like best places to eat, to stay, adventurous places, hiking places for mountains")

