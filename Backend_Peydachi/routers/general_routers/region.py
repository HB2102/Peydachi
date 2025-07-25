from fastapi import APIRouter
from functions import region_functions
from dependencies.dependencies import DB_DEPENDENCY
from dependencies.body_dependencies import NAME_BODY, ID_BODY
from dependencies.limiter_dependencies import LIMIT_10_PER_MINUTE_DEPENDENCY
from schemas.region_schemas import RegionDisplay


router = APIRouter(
    prefix='/region',
    tags=['Region'],
    dependencies=[LIMIT_10_PER_MINUTE_DEPENDENCY]
)


@router.post('/get_region_by_id', response_model=RegionDisplay)
async def get_region_by_id(id: ID_BODY, db: DB_DEPENDENCY):
    return await region_functions.get_region_by_id(id, db)


@router.get('/get_all_regions', response_model=list[RegionDisplay])
async def get_all_regions(db: DB_DEPENDENCY):
    return await region_functions.get_all_regions(db)


@router.post('/search_region_by_name', response_model=list[RegionDisplay])
async def search_region_by_name(region_name: NAME_BODY, db: DB_DEPENDENCY):
    return await region_functions.search_region_by_name(region_name=region_name, db=db)


