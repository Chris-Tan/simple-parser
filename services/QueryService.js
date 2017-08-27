'use strict';
const _ = require('lodash');

// - terms are implicitly AND'd together unless quoted
// - terms are implicitly an exact match
// - multiple search terms can be nested using ()'s
// - negation can be done using ! in front of search term
// - OR'ing search terms can be done by explicitly using "OR" keyword
// - AND'ing search terms can optionally be done by explicitly using "AND" keyword
// - using '>', '>=', '<', '=<' denotes a non exact match on the term following respective symbol
// - using '=' denotes an exact match on the term following respective symbol
// - len(#) will allow us to match length of JSON data instead of actual value
// - 'true', 'false' will be matched to their boolean values instead of string values



module.exports = () => {
  function parseValue(value) {
    if (value === "false") {
      value = false;
    }
    else if (value === "true") {
      value = true;
    }
    else if (_.startsWith(value, "len(")) {
      value = {"$len": parseInt(value.substring(4, value.length - 1))};
    }
    else if (_.startsWith(value, '"') && _.endsWith(value, '"')) {
      value = {"$quoted": value.substring(1, value.length - 1)};
    }
    return value;
  }
  function commandToJSON(command) {
    var result = {};
    var isNegation = false;
    var type = null;

    if (_.startsWith(command, "!")) {
      isNegation = true;
      command = command.substring(1);
    }

    var value = command;

    if (_.startsWith(command, ">=")) {
      type = "$gte";
      value = command.substring(2);
    }
    else if (_.startsWith(command, ">")) {
      type = "$gt";
      value = command.substring(1);
    }
    else if (_.startsWith(command, "<=")) {
      type = "$lte";
      value = command.substring(2);
    }
    else if (_.startsWith(command, "<")) {
      type = "$lt";
      value = command.substring(1);
    }
    else if (_.startsWith(command, "=")) {
      type = "$eq";
      value = command.substring(1);
    }

    if (type)
      result[type] = parseValue(value);
    else
      result = parseValue(value);

    if (isNegation) {
      return {
        "$not": result
      };
    }

    return result;
  }
  function formatCommandsToJSON(commandsArray) {
    var result = {
      "$and": [],
      "$or": []
    };
    var command;
    for (var i=0; i<commandsArray.length; i++) {
      command = commandsArray[i];
      if (commandsArray[i].value.constructor === Array) {
        command.value = formatCommandsToJSON(commandsArray[i].value);
      }

      if (command.operation === "AND") {
        result["$and"].push(commandToJSON(command.value));
        continue;
      }
      if (command.operation === "OR") {
        result["$or"].push(commandToJSON(command.value));
      }
    }

    // remove unnecessary ORs
    if (result["$or"].length === 0)
      delete result["$or"];

    // remove unnecessary ANDs
    if (result["$and"].length === 0)
      delete result["$and"];

    // if there was only 1 command
    if (commandsArray.length === 1) {
      result = result["$and"][0];
    }
    return result;
  }

  function extractTextBetween(textToSearch, startChar, endChar) {
    var startIndex = null;
    var startCount = 0, endCount = 0;
    for (var i = 0; i < textToSearch.length; i++) {
      if (textToSearch[i] == startChar) {
        if (!startIndex)
          startIndex = i;
        startCount++;
      }
      else if (textToSearch[i] == endChar)
        endCount++;

      if (startCount === endCount) {
        return textToSearch.substring(startIndex+1, i);
      }
    }
    return "";
  }
  // check if alphanumberic for quote

  function formatQueryToCommands(queryString) {
    var remaining = queryString;
    var splitString, command, nextOperation = "AND";
    var commandsArray = [];
    var temp, commandLength;

    // while there's more commands in string
    while (remaining.length > 0) {
      // parse next command
      command = remaining.split(" ", 1)[0];

      if (_.startsWith(command, "(")) {
        // get closing ) position that's not len()'s or nested ()'s
        temp = extractTextBetween(remaining, '(', ')');
        command = formatQueryToCommands(temp);
        // remove front and back brackets so that it doesn't infinitely loop
        commandLength = temp.length + 2;
      }
      // if there's quotes in the command, grab remaining quoted part of string
      else if (command.indexOf('"') !== -1) {
        temp = remaining.split('"', 2);
        // ASSUMPTION command quotes always come in pairs and the second quote is proceeded by a space
        command = temp[0] + '"' + temp[1] + '"';
        commandLength = command.length;
      }
      else {
        commandLength = command.length;
      }

      remaining = remaining.substring(commandLength + 1);

      // if command is an AND or OR, update the last command with it
      if (command === "AND")
        continue;
      if (command === "OR") {
        commandsArray[commandsArray.length - 1].operation = "OR"
        nextOperation = "OR";
        continue;
      }

      commandsArray.push({
        value: command,
        operation: nextOperation
      });

      nextOperation = "AND"; // always default to AND
    }
    return commandsArray;
  }

  function format(queryString) {
    var commandsArray = formatQueryToCommands(queryString);
    var result = formatCommandsToJSON(commandsArray);
    return result;
  }
  return {
    format: format
  };
};
