'use strict';
const chalk = require('chalk');
var program = require('commander');
var inquirer = require('inquirer');
const ora = require('ora');
var fs = require('fs');
const spinner = ora('Loading unicorns').start();
// @parseText read .txt file and converts it to a String
function parseText(input) {
    var remaining = '';
    
  
    input.on('data', function(data) {
        remaining += data;
       
    });
  
    
    input.on('end', function() {
        parse_feelings(remaining)
    });  

}

function parse_feelings(data){
    var lines = data.split('\n');
    var questions = [];

   
    for(var i = 0;i < lines.length-1;i++){
        // get rid of \n from one text
        
        var line = lines[i]
        if(line.trim() != ""){
            questions.push(
                {
                    type: 'list',
                    name: "mood"+i,
                    message: line,
                    
                    choices: [
                   new inquirer.Separator(),
                    {name:'positive',value :'1'},
                    {name:'neutral',value :'0'},
                    {name:'negative',value :'-1'},
                    new inquirer.Separator()
                    ]
                }
            )
        }
    }

    spinner.succeed("Loaded Chat")
    
    inquirer.prompt(questions).then(answers => {
        console.log(answers);
        
        
    }).catch(function (error_render) {

        console.log("error_render");
        callback(error_render);
    });

}


// reads chat_full.txt into input
// .txt file must be in the root path

var input = fs.createReadStream('export/chat.txt');

// parses Text with given input
parseText(input);

