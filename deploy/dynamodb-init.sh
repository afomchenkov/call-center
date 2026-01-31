#!/bin/sh
set -e

endpoint="${DYNAMODB_ENDPOINT:-http://dynamodb:8000}"
region="${AWS_REGION:-us-east-1}"

echo "Waiting for DynamoDB at ${endpoint}"
for i in 1 2 3 4 5 6 7 8 9 10; do
  if aws dynamodb list-tables --endpoint-url "$endpoint" --region "$region" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

create_table_if_missing() {
  table_name="$1"
  hash_key="$2"
  existing_tables="$(aws dynamodb list-tables --endpoint-url "$endpoint" --region "$region" --output text)"
  if echo "$existing_tables" | grep -q "$table_name"; then
    echo "Table $table_name already exists"
    return
  fi
  aws dynamodb create-table \
    --endpoint-url "$endpoint" \
    --region "$region" \
    --table-name "$table_name" \
    --attribute-definitions AttributeName="$hash_key",AttributeType=S \
    --key-schema AttributeName="$hash_key",KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
}

create_table_if_missing "events-bus" "event_id"
create_table_if_missing "audit" "audit_id"
create_table_if_missing "call-center-state" "state_id"

echo "DynamoDB tables initialized"
