var fs = require('fs');

var user1 = "Leon Erath"
var user2 = "Daniel Salomon"
var DATE_START  = 0
var DATE_END    = 15
var USER_START  = 17



function readLines(input, func) {
    var remaining = '';
    var test = ""
  
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;

        // get rid of first line
        var line1 = remaining.substring(last, index);
        last = index + 1;
        index = remaining.indexOf('\n', last);
        
        while (index > -1) {
            // get rid of \n from one text

            var line = remaining.substring(last, index);
            last = index + 1;
            index = remaining.indexOf('\n', last);
            var line2 = remaining.substring(last, index);
            
            while(parseDate(line2) == false){
                line = line+" "+line2
                last = index + 1;
                index = remaining.indexOf('\n', last);
                line2 = remaining.substring(last, index);
            }
            
            // group texts from the same author within 2 hours
            

            line = line.replace(user1,"A")
            line = line.replace(user2,"B")
            line2 = line2.replace(user1,"A")
            line2 = line2.replace(user2,"B")

            var boolean = true
            while(boolean){    
                if(line.charAt(18)== line2.charAt(18)){
                  
                    var date1 = parseDate(line)
                    var date2 = parseDate(line2)
                    let timeDifference = Math.abs(date2.getTime() - date1.getTime());
                    let differentHours = Math.ceil(timeDifference / (1000 * 3600));
                    
                    if(differentHours <= 2){
                        line2 = line2.substring(20,line2.length)
                        if(line.charAt(line.length-1)!= "."&&line.charAt(line.length-1)!= "?"&&line.charAt(line.length-1)!= "!"){
                            line = line +"."
                        }
                        line = line + line2
                        
                        
                        last = index + 1;
                        index = remaining.indexOf('\n', last);
                        line2 = remaining.substring(last, index);
                        line2 = line2.replace(user1,"A")
                        line2 = line2.replace(user2,"B")

                        
                        
                    }else{
                        boolean = false
                    }
                }else{
                    boolean = false
                }
            }
            
            test += func(line) 
        }
      
  
      remaining = remaining.substring(last);
    });
  
    
    input.on('end', function() {
      if (remaining.length > 0) {
        test += func(remaining)
       
      }
      createFile(test)
    });
  
    
}


function createFile(data){
    fs.writeFile("export/chat.txt", data, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}


function parseDate(input) {
    input = input.substring(0,15)
    input = input.replace(",",".")
    input = input.replace(":",".")
    input = input.replace(" ","")
    var parts = input.split('.');

    var date = new Date("20"+parts[2], parts[1]-1, parts[0],parts[3],parts[4]).addHours(2); 
    if(date.toString() == "Invalid Date"){
        return false
    }
    return date
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function func(data) {

    data = data.substring(17,data.length)
    data = data.replace(user1,"A")
    data = data.replace(user2,"B")

    if(data.indexOf("http") > -1 || data.indexOf("<Medien weggelassen>") > -1 ) {
        data = ""
    }else{
        data = data +"\n"
    }
    
    return data
  }

var input = fs.createReadStream('chat.txt');
readLines(input, func);
