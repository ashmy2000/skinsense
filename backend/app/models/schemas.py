from pydantic import BaseModel


class Profile(BaseModel):
    skinType: str
    sensitivity: str
    acne: str
    fragrance: str
    pregnancySafe: str


class AnalyseRequest(BaseModel):
    product: str
    profile: Profile