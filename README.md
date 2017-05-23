# telegram-resource

Act as a telegram bot tracking and sending messages

## Add to a pipeline configuration

```yaml
resource_types:
- name: telegram
  type: docker-image
  source:
    repository: carlocolombo/telegram-resource
```

### Tags
* `latest` stable build
* `latest-dev` build from the latest commit

https://hub.docker.com/r/carlocolombo/telegram-resource/tags/


## Source Configuration

* `telegram_key` _Required_ . Ask it to the [BotFather](https://telegram.me/BotFather)
* `filter` _Optional_. A regex string eg `"/start"`
* `flags` _Optional_. String of flags eg `"mi"` for multiline and case insensitive. Check more on [mdn](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags)

## Example

```yaml
resources:
- name: start
  type: telegram
  source:
    filter: '/start'
    flags: i
    telegram_key: {{telegram_bot_token}}
```

Fetching messages:

```yaml
- get: start
  trigger: true
```

Send a full featured [message](https://core.telegram.org/bots/api#sendmessage):

```yaml
- put: answer
  params:
    message: answer/message
```


Send a simple message:

```yaml
- put: answer
  params:
    chat_id: answer/chat_id
    text: answer/text
```

## Behavior

### `check`: Check for new messages

Returns the recent messages sent to the telegram bot, if filter is defined it will return only the messages matching the regex

### `in`: Read a message

Outputs 1 file:
* `message`: Contains the message as retrieved from telegram api, it is a json rappresenting an [update object](https://core.telegram.org/bots/api#update). Only update of type `message` are supported right now

### `out`: Send a message

#### Parameters

`text` and `chat_id` or `message` are required, if all present `message` has precedence over the pair `chat_id` `text`

* `text`: Text of the message to be sent
* `chat_id`: Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
* `message`: A json rappresenting a full message to be sent using the api, https://core.telegram.org/bots/api#sendmessage

## Example Configurations

* [Example pipeline](https://github.com/carlo-colombo/telegram-resource/blob/master/pipeline.yml)
* [CI pipeline](https://github.com/carlo-colombo/telegram-resource/blob/master/ci/pipeline.yml#L134-L162)

