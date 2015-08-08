// Description
//   hubot scripts for rolling Star Wars dice
//
// Commands:
//   hubot how do I roll Star Wars dice?
//   hubot roll {Star Wars dice}
//
// Author:
//   Drew Miller <nemo@half-ogre.com>

var util = require("util");

const DIE_TYPE = {
  "BOOST": "boost",
  "SETBACK": "setback",
  "ABILITY": "ability",
  "DIFFICULTY": "difficulty",
  "PROFICIENCY": "proficiency",
  "CHALLENGE": "challenge",
  "FORCE": "force"
};

const DIE_RESULT = {
  "SUCCESS": {
    "label": "success",
    "groupResult": function(groupedResult) {
      groupResult("SUCCESS", groupedResult, function() {
        groupedResult["SUCCESS"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "success", "successes", "failures");
    }
  },
  "ADVANTAGE": {
    "label": "advantage",
    "groupResult": function(groupedResult) {
      groupResult("ADVANTAGE", groupedResult, function() {
        groupedResult["ADVANTAGE"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "advantage", "advantage", "threat");
    }
  },
  "FAILURE": {
    "label": "failure",
    "groupResult": function(groupedResult) {
      groupResult("SUCCESS", groupedResult, function() {
        groupedResult["SUCCESS"]--;
      });
    }
  },
  "THREAT": {
    "label": "threat",
    "groupResult": function(groupedResult) {
      groupResult("ADVANTAGE", groupedResult, function() {
        groupedResult["ADVANTAGE"]--;
      });
    }
  },
  "TRIUMPH": {
    "label": "triumph",
    "groupResult": function(groupedResult) {
      groupResult("TRIUMPH", groupedResult, function() {
        groupedResult["SUCCESS"]++;
        groupedResult["TRIUMPH"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "triumph", "triumph");
    }
  },
  "DESPAIR": {
    "label": "despair",
    "groupResult": function(groupedResult) {
      groupResult("DESPAIR", groupedResult, function() {
        groupedResult["SUCCESS"]--;
        groupedResult["DESPAIR"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "despair", "despair");
    }
  },
  "DARK_SIDE": {
    "label": "dark side point",
    "groupResult": function(groupedResult) {
      groupResult("DARK_SIDE", groupedResult, function() {
        groupedResult["DARK_SIDE"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "dark side point", "dark side points");
    }
  },
  "LIGHT_SIDE": {
    "label": "light side point",
    "groupResult": function(groupedResult) {
      groupResult("LIGHT_SIDE", groupedResult, function() {
        groupedResult["LIGHT_SIDE"]++;
      });
    },
    "formatNetResult": function(number) {
      return formatNetResult(number, "light side point", "light side points");
    }
  }
};

const DIE_MAP = {
  "boost": {
    "dieType": DIE_TYPE.BOOST,
    "sides": 6,
    "regex": /^b$|^\s+boost$/i,
    "1": [ ],
    "2": [ ],
    "3": [ DIE_RESULT.SUCCESS ],
    "4": [ DIE_RESULT.SUCCESS, DIE_RESULT.ADVANTAGE ],
    "5": [ DIE_RESULT.ADVANTAGE, DIE_RESULT.ADVANTAGE ],
    "6": [ DIE_RESULT.ADVANTAGE ]
  },
  "setback": {
    "dieType": DIE_TYPE.SETBACK,
    "sides": 6,
    "regex": /^s$|^\s+setback$/i,
    "1": [ ],
    "2": [ ],
    "3": [ DIE_RESULT.FAILURE ],
    "4": [ DIE_RESULT.FAILURE ],
    "5": [ DIE_RESULT.THREAT ],
    "6": [ DIE_RESULT.THREAT ]
  },
  "ability": {
    "dieType": DIE_TYPE.ABILITY,
    "sides": 8,
    "regex": /^a$|^\s+ability$/i,
    "1": [ ],
    "2": [ DIE_RESULT.SUCCESS ],
    "3": [ DIE_RESULT.SUCCESS ],
    "4": [ DIE_RESULT.SUCCESS, DIE_RESULT.SUCCESS ],
    "5": [ DIE_RESULT.ADVANTAGE ],
    "6": [ DIE_RESULT.ADVANTAGE ],
    "7": [ DIE_RESULT.SUCCESS, DIE_RESULT.ADVANTAGE ],
    "8": [ DIE_RESULT.ADVANTAGE, DIE_RESULT.ADVANTAGE ]
  },
  "difficulty": {
    "dieType": DIE_TYPE.DIFFICULTY,
    "sides": 8,
    "regex": /^d$|^\s+difficulty$/i,
    "1": [ ],
    "2": [ DIE_RESULT.FAILURE ],
    "3": [ DIE_RESULT.FAILURE, DIE_RESULT.FAILURE ],
    "4": [ DIE_RESULT.THREAT ],
    "5": [ DIE_RESULT.THREAT ],
    "6": [ DIE_RESULT.THREAT ],
    "7": [ DIE_RESULT.THREAT, DIE_RESULT.THREAT ],
    "8": [ DIE_RESULT.FAILURE, DIE_RESULT.THREAT ]
  },
  "proficiency": {
    "dieType": DIE_TYPE.PROFICIENCY,
    "sides": 12,
    "regex": /^p$|^\s+proficiency$/i,
    "1": [ ],
    "2": [ DIE_RESULT.SUCCESS ],
    "3": [ DIE_RESULT.SUCCESS ],
    "4": [ DIE_RESULT.SUCCESS, DIE_RESULT.SUCCESS ],
    "5": [ DIE_RESULT.SUCCESS, DIE_RESULT.SUCCESS ],
    "6": [ DIE_RESULT.ADVANTAGE ],
    "7": [ DIE_RESULT.SUCCESS, DIE_RESULT.ADVANTAGE ],
    "8": [ DIE_RESULT.SUCCESS, DIE_RESULT.ADVANTAGE ],
    "9": [ DIE_RESULT.SUCCESS, DIE_RESULT.ADVANTAGE ],
    "10": [ DIE_RESULT.ADVANTAGE, DIE_RESULT.ADVANTAGE ],
    "11": [ DIE_RESULT.ADVANTAGE, DIE_RESULT.ADVANTAGE ],
    "12": [ DIE_RESULT.TRIUMPH ]
  },
  "challenge": {
    "dieType": DIE_TYPE.CHALLENGE,
    "sides": 12,
    "regex": /^c$|^\s+challenge$/i,
    "1": [ ],
    "2": [ DIE_RESULT.FAILURE ],
    "3": [ DIE_RESULT.FAILURE ],
    "4": [ DIE_RESULT.FAILURE, DIE_RESULT.FAILURE ],
    "5": [ DIE_RESULT.FAILURE, DIE_RESULT.FAILURE ],
    "6": [ DIE_RESULT.THREAT ],
    "7": [ DIE_RESULT.THREAT ],
    "8": [ DIE_RESULT.FAILURE, DIE_RESULT.THREAT ],
    "9": [ DIE_RESULT.FAILURE, DIE_RESULT.THREAT ],
    "10": [ DIE_RESULT.THREAT, DIE_RESULT.THREAT ],
    "11": [ DIE_RESULT.THREAT, DIE_RESULT.THREAT ],
    "12": [ DIE_RESULT.DESPAIR ]
  },
  "force": {
    "dieType": DIE_TYPE.FORCE,
    "sides": 12,
    "regex": /^f$|^\s+force$/i,
    "1": [ DIE_RESULT.DARK_SIDE ],
    "2": [ DIE_RESULT.DARK_SIDE ],
    "3": [ DIE_RESULT.DARK_SIDE ],
    "4": [ DIE_RESULT.DARK_SIDE ],
    "5": [ DIE_RESULT.DARK_SIDE ],
    "6": [ DIE_RESULT.DARK_SIDE ],
    "7": [ DIE_RESULT.DARK_SIDE, DIE_RESULT.DARK_SIDE ],
    "8": [ DIE_RESULT.LIGHT_SIDE ],
    "9": [ DIE_RESULT.LIGHT_SIDE ],
    "10": [ DIE_RESULT.LIGHT_SIDE, DIE_RESULT.LIGHT_SIDE ],
    "11": [ DIE_RESULT.LIGHT_SIDE, DIE_RESULT.LIGHT_SIDE ],
    "12": [ DIE_RESULT.LIGHT_SIDE, DIE_RESULT.LIGHT_SIDE ]
  }
};

function formatList(list)
{
  if (list.length == 1) {
    return list[0];
  }

  var optionalComma = list.length > 2 ? "," : "";
  var lastResult = list.pop();
  return util.format(
    "%s%s and %s",
    list.join(", "),
    optionalComma,
    lastResult);
};

function formatNetResult(number, singlePositive, multiplePositive, multipleNegative) {
  if (number == 0) {
    return util.format("no %s", multiplePositive);
  } else if (number == 1) {
    return util.format("1 %s", singlePositive);
  } else if (number > 1) {
    return util.format("%d %s", number, multiplePositive);
  } else if (number < 0) {
    return util.format("%d %s", Math.abs(number), multipleNegative);
  }
}

function formatResults(rolledDice, results)
{
  var groupedResults = { };

  results.forEach(function(result) {
    result.groupResult(groupedResults);
  });

  var netResults = [ ];

  for (var groupedResult in groupedResults) {
    netResults.push(DIE_RESULT[groupedResult].formatNetResult (groupedResults[groupedResult]));
  }

  return util.format(
    "You rolled %s with the net result of %s (full result: %s).",
    rolledDice,
    formatList(netResults),
    formatList(results.map(function(result){ return result.label; })));
}

function formatRolledDice(rolledDice)
{
  var groupedRolledDice = rolledDice.reduce(function(previous, next) {
    if (!previous[next]) {
      previous[next] = 1;
    } else {
      previous[next]++;
    }
    return previous;
  }, { });

  var labeledGroupedRolledDice = [ ];
  for (var dieType in groupedRolledDice) {
    labeledGroupedRolledDice.push(util.format("%d %s", groupedRolledDice[dieType], dieType));
  }

  return formatList(labeledGroupedRolledDice);
}

function getDieMap(dieExpressionTypePart)
{
  for (var dieType in DIE_MAP) {
    if (dieExpressionTypePart.match(DIE_MAP[dieType].regex)) {
      return DIE_MAP[dieType];
    }
  }

  throw util.formt("No die map matches '%s'.", dieExpressionTypePart);
}

function groupResult(netResultType, groupedResult, group)
{
  if (!groupedResult[netResultType]) {
    groupedResult[netResultType] = 0;
  }

  group(groupedResult);
}

function rollDie(sides)
{
  return 1 + Math.floor(Math.random() * sides);
};

module.exports = function(robot) {
  robot.respond(/roll\s(((\d+)\s*(b|s|a|d|p|c|f|boost|setback|ability|difficulty|proficiency|challenge|force)(\,|\,\s+)?)+$)/i, function(msg) {
    const dieExpressionRegex = /(\d+)\s*(b|s|a|d|p|c|f|boost|setback|ability|difficulty|proficiency|challenge|force)/i;

    var diceExpression = msg.match[1];
    var rolledDice = [ ];
    var results = [ ];

    diceExpression.split(',')
      .forEach(function(dieExpression) {
        var match = dieExpression.match(dieExpressionRegex);
        var number = match[1];
        var dieMap = getDieMap(match[2]);

        for (var n = 0; n < number; n++) {
          rolledDice.push(dieMap.dieType);
          dieMap[rollDie(dieMap.sides)]
            .forEach(function(e) {
                results.push(e);
            });
        }
      });

    msg.reply(
      formatResults(
        formatRolledDice(rolledDice),
      results));
  });

  robot.respond(/how (do i|do you||to) roll star wars( dice)?\??/i, function(msg) {
    msg.reply("To roll Star Wars dice, say `r2 roll {dice}` where `{dice}` is a comma-separated list of Star Wars die types, including: `boost`, `setback`, `ability`, `difficulty`, `proficiency`, `challenge`, and `force`. You can abbreviate a die type by using just its first letter. Examples: `r2 roll 2 ability, 1 proficiency, 3 difficulty` and `r2 roll 2a, 1p, 3d`.");
  });
}
