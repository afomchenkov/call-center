import json
import threading
from typing import Any, Callable, Dict, Optional

from kafka import KafkaConsumer


class KafkaEventConsumer:
    def __init__(
        self,
        brokers: str,
        topic: str,
        group_id: str,
        handler: Callable[[Dict[str, Any], str], None],
    ):
        self._brokers = [broker.strip() for broker in brokers.split(",") if broker.strip()]
        self._topic = topic
        self._group_id = group_id
        self._handler = handler
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)

    def _run(self) -> None:
        consumer = KafkaConsumer(
            self._topic,
            bootstrap_servers=self._brokers,
            group_id=self._group_id,
            auto_offset_reset="earliest",
            enable_auto_commit=True,
        )
        while not self._stop_event.is_set():
            records = consumer.poll(timeout_ms=500)
            for _tp, messages in records.items():
                for message in messages:
                    event = self._decode_event(message.value)
                    self._handler(event, self._topic)
        consumer.close()

    def _decode_event(self, value: Any) -> Dict[str, Any]:
        if isinstance(value, (bytes, bytearray)):
            try:
                return json.loads(value.decode("utf-8"))
            except json.JSONDecodeError:
                return {"type": "Unknown", "raw": value.decode("utf-8", errors="replace")}
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return {"type": "Unknown", "raw": value}
        if isinstance(value, dict):
            return value
        return {"type": "Unknown", "raw": str(value)}
