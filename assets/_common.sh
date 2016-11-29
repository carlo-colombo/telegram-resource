
set -ex

exec 3>&1 # make stdout available as fd 3 for the result
exec 1>&2 # redirect all output to stderr for logging

payload=$TMPDIR/telegram-resource-request
updates=$TMPDIR/getUpdates

cat > $payload <&0

telegram_key=$(jq -r '.source.telegram_key' < $payload )
latest=$(jq -r '.version.update_id // 0' < $payload)


base_url="https://api.telegram.org/bot${telegram_key}/getUpdates?offset=$latest"

curl $base_url > $updates
