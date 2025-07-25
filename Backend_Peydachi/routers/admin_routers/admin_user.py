from fastapi import APIRouter
from functions import user_functions
from dependencies.dependencies import DB_DEPENDENCY
from dependencies.body_dependencies import ID_BODY, NAME_BODY
from dependencies.access_dependencies import ROUTER_ADMIN_DEPENDENCY
from dependencies.limiter_dependencies import LIMIT_10_PER_MINUTE_DEPENDENCY
from schemas.user_schemas import UserDisplay


router = APIRouter(
    prefix='/admin/user',
    tags=['Admin User'],
    dependencies=[ROUTER_ADMIN_DEPENDENCY, LIMIT_10_PER_MINUTE_DEPENDENCY]
)


@router.post('/search_users', status_code=200, response_model=list[UserDisplay])
async def search_username(username: NAME_BODY, db: DB_DEPENDENCY):
    return await user_functions.search_user_by_username(user_name=username, db=db)


@router.get('/get_all_users', status_code=200, response_model=list[UserDisplay])
async def get_all_users(db: DB_DEPENDENCY):
    return await user_functions.get_all_users(db=db)


@router.post('/get_user_by_username', status_code=200, response_model=UserDisplay)
async def get_user_by_username(username: NAME_BODY, db: DB_DEPENDENCY):
    return await user_functions.get_user_by_username(username=username, db=db)


@router.post('/get_user_by_phone_number', status_code=200, response_model=UserDisplay)
async def get_user_by_phone_number(phone_number: NAME_BODY, db: DB_DEPENDENCY):
    return await user_functions.get_user_by_phone_number(phone_number=phone_number, db=db)


@router.post('/get_user_by_id', status_code=200, response_model=UserDisplay)
async def get_user_by_id(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.get_user_by_id(user_id=user_id, db=db)


@router.get('/get_all_banned_users', status_code=200, response_model=list[UserDisplay])
async def get_all_banned_users(db: DB_DEPENDENCY):
    return await user_functions.get_all_banned_users(db=db)


@router.delete('/delete_user', status_code=200)
async def admin_delete_user(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.admin_delete_user(user_id=user_id, db=db)


@router.put('/ban_user', status_code=200)
async def ban_user(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.ban_user(user_id=user_id, db=db)


@router.put('/unban_user', status_code=200)
async def unban_user(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.unban_user(user_id=user_id, db=db)


@router.post('/search_in_banned_users', status_code=200, response_model=list[UserDisplay])
async def search_in_banned_user(user_name: NAME_BODY, db: DB_DEPENDENCY):
    return await user_functions.search_in_banned_users(user_name=user_name, db=db)


@router.post('/promote_user_to_seller', status_code=200, response_model=UserDisplay)
async def promote_user_to_seller(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.promote_user_to_seller(user_id=user_id, db=db)


@router.post('/search_in_sellers', status_code=200, response_model=list[UserDisplay])
async def search_in_sellers(user_name: NAME_BODY, db: DB_DEPENDENCY):
    return await user_functions.search_in_sellers(user_name=user_name, db=db)


@router.put('/demote_seller_to_user', status_code=200, response_model=UserDisplay)
async def demote_seller_to_user(user_id: ID_BODY, db: DB_DEPENDENCY):
    return await user_functions.demote_seller_to_user(user_id=user_id, db=db)
