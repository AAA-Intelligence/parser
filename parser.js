var fs = require('fs');

// Constants
let USER_1 = "Leon Erath"
let USER_2 = "Daniel Salomon"
let DATE_START  = 0
let DATE_END    = 15
let USER_START  = 17


// @parseText read .txt file and converts it to a String
function parseText(input) {
    var remaining = '';
    
  
    input.on('data', function(data) {
        remaining += data;
       
    });
  
    
    input.on('end', function() {
        paragraphTexts(remaining)
    });  

}


// @paragraphText fixes \n so that one Text is in one line
// additionally replaces user name with A and B
// deletes texts with http Links or <Medien weggelassen> tags
function paragraphTexts(data){
    var text = ""
    
    var lines = data.split('\n');
    for(var i = 1;i < lines.length-1;i++){
        // get rid of \n from one text
        
        var line = lines[i]
        var line2 = lines[i+1]
       
        
        k=0
        while(parseDate(line2) == false && i+k+1 < lines.length-1){
            k++
            line = line+" "+line2
            line2 = lines[i+1+k]
        }
        line = line +"\n"

        var regex = /<.+ [a-zA-Z]+>/
        var result = line.match(regex);   

        if(line.indexOf("http") > -1 || line.match(regex) ) {
            line = ""
        }else{

        }

        line = line.replace("\n\n","\n")
        line = line.replace(USER_1,"A")
        line = line.replace(USER_2,"B")
        
       
        i = i+k
        text += line 

    }
    groupTexts(text)
  
}

// @groupTexts groups Texts from the same author
// additionally add blank line if the conversation has a gap of TIME_DIFFERENCE
function groupTexts(data){
  
    var groupedText = ""

    var lines = data.split('\n');
    for(var i = 0;i < lines.length-1;i++){
   
        var line = lines[i]
        var line2 = lines[i+1]
       

        k= 0;
      
        
        while(line.charAt(18)== line2.charAt(18)){  
            k++
            line2 = line2.substring(20,line2.length)
            
            if(line.charAt(line.length-1)!= "."&&line.charAt(line.length-1)!= "?"&&line.charAt(line.length-1)!= "!"){
                line = line +"."
            }

            line = line + line2
            line2 = lines[i+1+k]               

        }
        i = i +k

      
      
        groupedText = groupedText+line+"\n";
    }
    
  
    
    formatting(groupedText)
}


function formatting(data){
    var lines = data.split('\n');
    var formattedText = ""
    for(var i = 0;i < lines.length-1;i++){
        var line = lines[i]
        line = line.substring(DATE_END+6,line.length)
        formattedText = formattedText + line +"\n";
        
    }
    createFile(formattedText)
}

// @createFile creates .txt file for given input
function createFile(data){
    fs.writeFile("export/chat.txt", data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

// @parseDate create a Date of given input
// returns false if input is invalid
// neccessary to calculate time diffrence between texts
function parseDate(input) {
    input = input.substring(DATE_START,DATE_END)
    
    // replaces characters so that the string can be splitted
    input = input.replace(",",".")
    input = input.replace(":",".")
    input = input.replace(" ","")
    var parts = input.split('.');

    // because of reasons you need to add 2 hours and subtract 1 month (dont ask me why)
    var date = new Date("20"+parts[2], parts[1]-1, parts[0],parts[3],parts[4]).addHours(2); 
    if(date.toString() == "Invalid Date"){
        return false
    }
    return date
}

// @addHours helper function for parseDate
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}


// reads chat_full.txt into input
// .txt file must be in the root path
var input = fs.createReadStream('chat.txt');

// parses Text with given input
parseText(input);

