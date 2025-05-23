import datetime
from schemas.base_schemas import BaseSchema


class SendNotificationModel(BaseSchema):
    user_id: int
    title: str
    text: str


class NotificationDisplay(SendNotificationModel):
    id: int
    date_added: datetime.datetime
    has_seen: bool


class AdminNotificationDisplay(NotificationDisplay):
    admin_id: int


class NotifCountShortDisplay(BaseSchema):
    notif_count: int
    first_three_notifs: list[NotificationDisplay]
