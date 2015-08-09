# hubot-star-wars-rpg

hubot scripts for playing Fantasy Flight Games' Star Wars Roleplaying games on Slack

See [`scripts`](./scripts) for a list of included scripts. Each script includes documentation.

## Installation

In hubot project repo, run:

`npm install hubot-star-wars-rpg --save`

Then add **hubot-star-wars-rpg** to your `external-scripts.json`:

```json
[
  "hubot-star-wars-rpg"
]
```

## Sample Interaction

```
user1>> hubot roll 3 ability, 2 difficulty
hubot>> You rolled 3 ability and 2 difficulty with the net result of no successes and 1 threat (full result: success, advantage, failure, threat, and threat).
user1>> hubot roll 3a, 2d
hubot>> You rolled 3 ability and 2 difficulty with the net result of 2 successes and 1 threat (full result: success, success, success, advantage, failure, threat, and threat).
```

## Testing

To test the scripts locally, interactively, run: `./bin/test`.
