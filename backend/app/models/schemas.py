from pydantic import BaseModel

""" Schemas for the API requests and responses."""
class Profile(BaseModel):
    skinType: str
    sensitivity: str
    acne: str
    fragrance: str
    pregnancySafe: str


class AnalyseRequest(BaseModel):
    product: str
    profile: Profile