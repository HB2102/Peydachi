from redis import Redis
from ippanel import Client
from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session
from database.database import get_db
from database.redis_db import get_redis
from fastapi.security import OAuth2PasswordBearer
from sms_service.sms_service import get_sms_service
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

# Database dependencies
DB_DEPENDENCY = Annotated[Session, Depends(get_db)]


# Redis dependencies
REDIS_DEPENDENCY = Annotated[Redis, Depends(get_redis)]


# SMS Service dependencies
SMS_DEPENDENCY = Annotated[Client, Depends(get_sms_service)]

# Authentication dependencies
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='authentication/token')
TOKEN_DEPENDENCY = Annotated[str, Depends(oauth2_scheme)]
AUTHENTICATION_DEPENDENCY = Annotated[OAuth2PasswordRequestForm, Depends()]


