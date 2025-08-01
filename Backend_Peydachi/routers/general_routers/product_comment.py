from fastapi import APIRouter
from functions import product_comment_functions
from dependencies.dependencies import DB_DEPENDENCY
from dependencies.access_dependencies import USER_DEPENDENCY
from dependencies.body_dependencies import ID_BODY
from dependencies.limiter_dependencies import LIMIT_10_PER_MINUTE_DEPENDENCY
from schemas.product_comment_schemas import AddProductCommentModel, ProductCommentDisplay, FullProductCommentDisplay


router = APIRouter(
    prefix='/product_comment',
    tags=['Product Comment'],
    dependencies=[LIMIT_10_PER_MINUTE_DEPENDENCY]
)


@router.post('/add_product_comment', status_code=201, response_model=ProductCommentDisplay)
async def add_product_comment(product_comment: AddProductCommentModel, user: USER_DEPENDENCY, db: DB_DEPENDENCY):
    return await product_comment_functions.add_product_comment(product_comment=product_comment, db=db, user_id=user.id)


@router.post('/get_product_comments', status_code=200, response_model=list[ProductCommentDisplay])
async def get_product_comments(product_id: ID_BODY, db: DB_DEPENDENCY):
    return await product_comment_functions.get_product_comments(product_id=product_id, db=db)


@router.post('/get_product_comment_by_id', status_code=200, response_model=ProductCommentDisplay)
async def get_product_comment_by_id(product_comment_id: ID_BODY, db: DB_DEPENDENCY):
    return await product_comment_functions.get_product_comment_by_id(product_comment_id=product_comment_id, db=db)


@router.delete('/user_delete_product_comment', status_code=200)
async def user_delete_product_comment(product_comment_id: ID_BODY, db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await product_comment_functions.user_delete_product_comment(product_comment_id=product_comment_id, user_id=user.id, db=db)


@router.get('/get_self_product_comments', status_code=200, response_model=list[ProductCommentDisplay])
async def get_self_product_comments(db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await product_comment_functions.get_user_product_comments(user_id=user.id, db=db)


@router.get('/get_self_full_product_comments', status_code=200, response_model=list[FullProductCommentDisplay])
async def get_self_full_product_comments(db: DB_DEPENDENCY, user: USER_DEPENDENCY):
    return await product_comment_functions.get_user_full_product_comments(user_id=user.id, db=db)