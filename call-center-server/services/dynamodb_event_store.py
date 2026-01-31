import os
import time
import uuid
from typing import Any, Dict, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError


class DynamoDBEventStore:
    def __init__(
        self,
        events_table: str,
        audit_table: str,
        endpoint_url: Optional[str] = None,
        region_name: str = "us-east-1",
    ):
        self._resource = boto3.resource(
            "dynamodb",
            region_name=region_name,
            endpoint_url=endpoint_url,
        )
        self._events_table = self._resource.Table(events_table)
        self._audit_table = self._resource.Table(audit_table)

    @classmethod
    def from_env(cls) -> Optional["DynamoDBEventStore"]:
        events_table = os.getenv("DYNAMODB_EVENTS_TABLE", "events-bus")
        audit_table = os.getenv("DYNAMODB_AUDIT_TABLE", "audit")
        endpoint_url = os.getenv("DYNAMODB_ENDPOINT")
        region_name = os.getenv("AWS_REGION", "us-east-1")
        if not events_table or not audit_table:
            return None
        return cls(
            events_table=events_table,
            audit_table=audit_table,
            endpoint_url=endpoint_url,
            region_name=region_name,
        )

    def write_event(self, event: Dict[str, Any], topic: Optional[str] = None) -> bool:
        event_id = event.get("id") or str(uuid.uuid4())
        payload = {
            "event_id": event_id,
            "event_type": event.get("type"),
            "topic": topic,
            "payload": event,
            "created_at": time.time(),
        }
        try:
            self._events_table.put_item(Item=payload)
        except (ClientError, BotoCoreError):
            return False
        return True

    def write_audit(self, event: Dict[str, Any], source: str) -> bool:
        audit_id = str(uuid.uuid4())
        payload = {
            "audit_id": audit_id,
            "event_type": event.get("type"),
            "source": source,
            "payload": event,
            "created_at": time.time(),
        }
        try:
            self._audit_table.put_item(Item=payload)
        except (ClientError, BotoCoreError):
            return False
        return True
