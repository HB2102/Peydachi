from schemas.base_schemas import BaseSchema
from typing import Dict

class StoreModel(BaseSchema):
    name: str
    owner_id: int | None = None
    contact_info: Dict[str, str] | None = None
    description: str | None = None
    location_longitude: str | None = None
    location_latitude: str | None = None
    city_id: int | None = None


class StoreDisplay(StoreModel):
    id: int
    average_rating: float | None = None
    average_product_rating: float | None = None
    is_banned: bool | None = None


class UpdateStoreModel(BaseSchema):
    name: str | None = None
    contact_info: Dict[str, str] | None = None
    description: str | None = None
    location_longitude: str | None = None
    location_latitude: str | None = None


class SearchStoreInCity(BaseSchema):
    city_id: int
    search: str | None = None