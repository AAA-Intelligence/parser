"use strict";
const moment = require("moment");

var fs = require("fs");

// Constants
let USER_1 = process.argv[2];
let USER_2 = process.argv[3];
let OS = process.argv[4];

var DATE_START = 0;
var DATE_END = 18;
var USER_START = 21;
var PARSE_CONSTANT = 6

if (OS == 1) {
  DATE_START = 1;
  DATE_END = 19;
  USER_START = 21;
  PARSE_CONSTANT = 4
}

console.log("User 1: ", USER_1);
console.log("User 2: ", USER_2);
console.log("OS: ", OS);

// @parseText read .txt file and converts it to a String
function parseText(input) {
  var remaining = "";

  input.on("data", function(data) {
    remaining += data;
  });

  input.on("end", function() {
    paragraphTexts(remaining);
  });
}

// @paragraphText fixes \n so that one Text is in one line
// additionally replaces user name with A and B
// deletes texts with http Links or <Medien weggelassen> tags
function paragraphTexts(data) {
  var text = "";

  var lines = data.split("\n");

  for (var i = 0; i < lines.length; i++) {
    // get rid of \n from one text

    var line = lines[i];
    let k = 0;

    if (i + 1 < lines.length) {
      var line2 = lines[i + 1];

      while (parseDate(line2) == false && i + k + 1 < lines.length - 1) {
        k++;

        line = line + " " + line2;
        line2 = lines[i + 1 + k];
      }
    }
    

    line = line + "\n";

    var regex = /<.+ [a-zA-Z]+>/;
    var result = line.match(regex);

    if (line.indexOf("http") > -1 || line.match(regex)) {
      line = "";
    } else {
    }

    line = line.replace("\n\n", "\n");
    line = line.replace(USER_1, "A");
    line = line.replace(USER_2, "B");

    i = i + k;
    text += line;
  }

  groupTexts(text);
}

// @groupTexts groups Texts from the same author
// additionally add blank line if the conversation has a gap of TIME_DIFFERENCE
function groupTexts(data) {
  var groupedText = "";

  var lines = data.split("\n");
  for (var i = 0; i < lines.length - 1; i++) {
    var line = lines[i];

    if (i + 1 < lines.length) {
      var line2 = lines[i + 1];

      let k = 0;
      
      while (line.charAt(USER_START) === line2.charAt(USER_START)) {
        k++;
        line2 = line2.substring(USER_START + 2, line2.length);

        if (
          line.charAt(line.length - 1) != "." &&
          line.charAt(line.length - 1) != "?" &&
          line.charAt(line.length - 1) != "!"
        ) {
          line = line + ".";
        }

        line = line + line2;

        line2 = lines[i + 1 + k];
      }
      i = i + k;
    }
  

    groupedText = groupedText + line + "\n";
  }
  
  formatting(groupedText);
}

function formatting(data) {
  var lines = data.split("\n");
  var formattedText = "";
  for (var i = 0; i < lines.length - 1; i++) {
    var line = lines[i];
    line = line.substring(DATE_END + PARSE_CONSTANT, line.length);
    formattedText = formattedText + line + "\n";
  }
  createFile(formattedText);
}

// @createFile creates .txt file for given input
function createFile(data) {
  fs.writeFile("export/chat.txt", data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// @parseDate create a Date of given input
// returns false if input is invalid
// neccessary to calculate time diffrence between texts
function parseDate(inputText) {
  let input = inputText.substring(DATE_START, DATE_END);

  // replaces characters so that the string can be splitted
  if (OS != 1) {
    input = input.replace(" um ", ", ");
  }
  // because of reasons you need to add 2 hours and subtract 1 month (dont ask me why)
  const date = moment(input, "DD.MM.YY, hh:mm").toDate();

  if (date.toString() == "Invalid Date") {
    return false;
  }
  return date;
}

// reads chat_full.txt into input
// .txt file must be in the root path
var input = fs.createReadStream("chat.txt");

// parses Text with given input
parseText(input);
