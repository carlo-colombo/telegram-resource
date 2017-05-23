* change [version](https://github.com/carlo-colombo/telegram-resource/blob/master/version) to the next version (`0.4.0-dev.42` -> `0.5.0-dev.0`)
* `docker pull carlocolombo/telegram-resource:latest-dev` (or other version)
* `docker tag carlocolombo/telegram-resource:latest-dev carlocolombo/telegram-resource:latest`
* `docker tag carlocolombo/telegram-resource:latest-dev carlocolombo/telegram-resource:<FINAL_VERSION>`
* `docker push carlocolombo/telegram-resource:latest`
* `docker push carlocolombo/telegram-resource:<FINAL_VERSION>`
