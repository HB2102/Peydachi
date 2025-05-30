from fastapi.exceptions import HTTPException
from fastapi import status



COMMENT_REPORT_NOT_FOUND_ERROR = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                               detail='Comment Report Not Found.')


NO_COMMENT_REPORT_FOUND_ERROR = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                              detail='No Matched Comment Report Was Found')

NO_PRODUCT_COMMENT_REPORT_FOUND_ERROR = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                                      detail='No Product Comment Report Was Found')

NO_STORE_COMMENT_REPORT_FOUND_ERROR = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                                    detail='No Store Comment Report Was Found')


COMMENT_REPORT_ALREADY_REVIEWED_ERROR = HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                                                      detail="Comment Report already reviewed")