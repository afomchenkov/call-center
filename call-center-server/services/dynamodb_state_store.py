import os
from typing import Any, Dict, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError


class DynamoDBStateStore:
    def __init__(
        self,
        table_name: str,
        state_id: str = "call-center",
        endpoint_url: Optional[str] = None,
        region_name: str = "us-east-1",
    ):
        self.table_name = table_name
        self.state_id = state_id
        self._resource = boto3.resource(
            "dynamodb",
            region_name=region_name,
            endpoint_url=endpoint_url,
        )
        self._table = self._resource.Table(table_name)

    @classmethod
    def from_env(cls) -> Optional["DynamoDBStateStore"]:
        table_name = os.getenv("DYNAMODB_STATE_TABLE", "call-center-state")
        endpoint_url = os.getenv("DYNAMODB_ENDPOINT")
        region_name = os.getenv("AWS_REGION", "us-east-1")
        if not table_name:
            return None
        return cls(table_name=table_name, endpoint_url=endpoint_url, region_name=region_name)

    def load_state(self) -> Optional[Dict[str, Any]]:
        try:
            response = self._table.get_item(Key={"state_id": self.state_id})
        except (ClientError, BotoCoreError):
            return None
        item = response.get("Item")
        if not item:
            return None
        return item.get("state")

    def save_state(self, state: Dict[str, Any]) -> bool:
        try:
            self._table.put_item(
                Item={
                    "state_id": self.state_id,
                    "state": state,
                }
            )
        except (ClientError, BotoCoreError):
            return False
        return True
