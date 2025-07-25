import datetime
from schemas.base_schemas import BaseSchema
from schemas.store_schema import StoreDisplay


class ProductModel(BaseSchema):
    name: str
    description: str | None = None
    quantity: int | None = None


class UpdateProductModel(BaseSchema):
    id: int
    name: str | None = None
    description: str | None = None


class ProductDisplay(BaseSchema):
    id: int
    name: str
    store_id: int
    description: str | None = None
    quantity: int | None = None
    date_added: datetime.datetime
    city_id: int
    pic_url: str | None = None
    average_rating: float | None = None


class ProductSearchModels(BaseSchema):
    name: str
    city_id: int
    location_latitude: str
    location_longitude: str
    range_km: float | None = None


class SearchNearProductDisplay(BaseSchema):
    store: StoreDisplay
    product: ProductDisplay
    distance: float | None = None


class FullSearchStoreProductModel(BaseSchema):
    search_text: str | None = None
    store_id: int
    show_limit: int | None = 10
    page: int | None = 1
    order: str | None = None        # newest, oldest, favorite