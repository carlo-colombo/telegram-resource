# telegram-resource

Act as a telegram bot tracking and sending messages

## Source Configuration

* `telegram_key` _Required_ . Ask it to the [BotFather](https://telegram.me/BotFather)
* `filter` _Optional_. A regex string eg `"/start"`
* `flags` _Optional_. String of flags eg `"mi"` for multiline and case insensitive. Check more on [mdn](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags)

## Example

```
resources:
- name: start
  type: telegram
  source:
    filter: '/start'
    flags: i
    telegram_key: {{telegram_bot_token}}
```
