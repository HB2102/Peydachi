from fastapi import APIRouter
from dependencies.body_dependencies import NAME_BODY
from authentication import phone_verification_functions
from dependencies.limiter_dependencies import LIMIT_5_PER_3MIN_DEPENDENCY
from dependencies.dependencies import REDIS_DEPENDENCY, DB_DEPENDENCY, SMS_DEPENDENCY
from schemas.phone_verification_schemas import PhoneVerifyCheckModel, ForgetPasswordVerifyCheck

router = APIRouter(
    prefix='/phone_verification',
    tags=['Phone Verification'],
    dependencies=[LIMIT_5_PER_3MIN_DEPENDENCY]
)


@router.post('/user_sign_up_phone_verification', status_code=200)
async def user_sign_up_phone_verification(phone_number: NAME_BODY, redis_db: REDIS_DEPENDENCY, db: DB_DEPENDENCY, sms_service: SMS_DEPENDENCY):
    return await phone_verification_functions.user_sign_up_phone_verification(phone_number=phone_number, redis_db=redis_db, db=db, sms_service=sms_service)


@router.post('/user_signup_phone_verification_check', status_code=200)
async def user_signup_phone_verification_check(verification_info: PhoneVerifyCheckModel, redis_db: REDIS_DEPENDENCY):
    return await phone_verification_functions.user_signup_phone_verification_check(verification_info=verification_info, redis_db=redis_db)


@router.post('/user_forget_password', status_code=200)
async def user_forget_password(username:NAME_BODY, redis_db: REDIS_DEPENDENCY, db: DB_DEPENDENCY, sms_service: SMS_DEPENDENCY):
    return await phone_verification_functions.user_forget_password(username=username, redis_db=redis_db, db=db, sms_service=sms_service)


@router.post('/user_forget_password_check', status_code=200)
async def user_forget_password_check(verification_info: ForgetPasswordVerifyCheck, redis_db: REDIS_DEPENDENCY, db: DB_DEPENDENCY):
    return await phone_verification_functions.user_forget_password_check(verification_info=verification_info, redis_db=redis_db, db=db)