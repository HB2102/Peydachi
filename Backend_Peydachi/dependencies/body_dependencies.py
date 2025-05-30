from typing import Annotated
from fastapi import Body

NAME_BODY = Annotated[str, Body(embed=True)]
ID_BODY = Annotated[int, Body(embed=True)]
ID_BODY_OR_NONE = Annotated[int, Body(embed=True)] | None