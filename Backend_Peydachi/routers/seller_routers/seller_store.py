from fastapi import APIRouter
from functions import store_functions
from dependencies.dependencies import DB_DEPENDENCY
from dependencies.access_dependencies import SELLER_DEPENDENCY
from dependencies.limiter_dependencies import LIMIT_10_PER_MINUTE_DEPENDENCY
from schemas.store_schema import StoreDisplay, UpdateStoreModel

router = APIRouter(
    prefix='/seller/store',
    tags=['Seller Store'],
    dependencies=[LIMIT_10_PER_MINUTE_DEPENDENCY]
)


@router.put('/update_store_info', status_code=200, response_model=StoreDisplay)
async def update_store_info(request: UpdateStoreModel, db: DB_DEPENDENCY, seller: SELLER_DEPENDENCY):
    return await store_functions.update_store_info(user_id=seller.id, request=request, db=db)


@router.get('/get_self_store', status_code=200, response_model=StoreDisplay)
async def get_self_store(db: DB_DEPENDENCY, seller: SELLER_DEPENDENCY):
    return await store_functions.get_self_store(user_id=seller.id, db=db)


@router.delete('/delete_store', status_code=200)
async def delete_store(db: DB_DEPENDENCY, seller: SELLER_DEPENDENCY):
    return await store_functions.delete_store(user_id=seller.id, db=db)


