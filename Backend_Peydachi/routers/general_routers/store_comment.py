from fastapi import APIRouter
from functions import store_comment_functions
from dependencies.dependencies import DB_DEPENDENCY
from dependencies.access_dependencies import USER_DEPENDENCY
from dependencies.body_dependencies import ID_BODY
from dependencies.limiter_dependencies import LIMIT_10_PER_MINUTE_DEPENDENCY
from schemas.store_comments_schemas import AddStoreCommentModel, StoreCommentDisplay, FullStoreCommentDisplay


router = APIRouter(
    prefix='/store_comment',
    tags=['Store Comment'],
    dependencies=[LIMIT_10_PER_MINUTE_DEPENDENCY]
)


@router.post('/add_store_comment', status_code=201, response_model=StoreCommentDisplay)
async def add_store_comment(store_comment: AddStoreCommentModel, db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await store_comment_functions.add_store_comment(store_comment=store_comment, db=db, user_id=user.id)


@router.post('/get_store_comments', status_code=200, response_model=list[StoreCommentDisplay])
async def get_store_comments(store_id: ID_BODY, db: DB_DEPENDENCY):
    return await store_comment_functions.get_store_comments(store_id=store_id, db=db)


@router.post('/get_last_5_store_comments', status_code=200, response_model=list[StoreCommentDisplay])
async def get_last_5_store_comments(store_id: ID_BODY, db: DB_DEPENDENCY):
    return await store_comment_functions.get_last_5_store_comments(store_id=store_id, db=db)


@router.post('/get_store_comment_by_id', status_code=200, response_model=StoreCommentDisplay)
async def get_store_comment_by_id(store_comment_id: ID_BODY, db: DB_DEPENDENCY):
    return await store_comment_functions.get_store_comment_by_id(store_comment_id=store_comment_id, db=db)


@router.delete('/user_delete_store_comment', status_code=200)
async def user_delete_store_comment(store_comment_id: ID_BODY, db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await store_comment_functions.user_delete_store_comment(store_comment_id=store_comment_id, user_id=user.id, db=db)


@router.get('/get_user_store_comments', status_code=200, response_model=list[StoreCommentDisplay])
async def get_user_store_comments(user: USER_DEPENDENCY, db: DB_DEPENDENCY):
    return await store_comment_functions.get_user_store_comments(user_id=user.id, db=db)


@router.get('/get_self_full_store_comments', status_code=200, response_model=list[FullStoreCommentDisplay])
async def get_self_full_store_comments(db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await store_comment_functions.get_user_full_store_comments(user_id=user.id, db=db)