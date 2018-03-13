var fs = require('fs');

var USER_1 = "Leon Erath"
var USER_2 = "Daniel Salomon"
var DATE_START  = 0
var DATE_END    = 15
var USER_START  = 17



function parseText(input) {
    var remaining = '';
    
  
    input.on('data', function(data) {
        remaining += data;
       
    });
  
    
    input.on('end', function() {
        paragraphTexts(remaining)
    });  

}

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
        if(line.indexOf("http") > -1 || line.indexOf("<Medien weggelassen>") > -1 ) {
            line = ""
        }
        line = line.replace(USER_1,"A")
        line = line.replace(USER_2,"B")

        i = i+k
        text += line 

    }
    groupTexts(text)
}

function groupTexts(data){
  
    var groupedText = ""

    var lines = data.split('\n');
    for(var i = 0;i < lines.length-1;i++){
   
        var line = lines[i]
        var line2 = lines[i+1]
       
       
        var date1 = parseDate(line)
        var date2 = parseDate(line2)
       
        let timeDifference = Math.abs(date2.getTime() - date1.getTime());
        let differentHours = Math.ceil(timeDifference / (1000 * 3600));
            
        if(differentHours > 2){
            line = line + "\n"   
            boolean = false
        }
       

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
        console.log(line);   
    }
    createFile(groupedText)
  
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
    input = input.substring(DATE_START,DATE_END)
    
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


// reads chat.txt into input
var input = fs.createReadStream('chat_full.txt');

// parses Text with given input
// func is the given parsing function
parseText(input);

