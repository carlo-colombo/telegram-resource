
source $(dirname $0)/_common.sh

base_url="https://api.telegram.org/bot${telegram_key}/getUpdates?offset=$latest"

curl $base_url > $updates
