var fs = require('fs');



function readLines(input, func) {
    var remaining = '';
    var test = ""
  
    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      var last  = 0;
     
      while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        test += func(line) 
       
           
        index = remaining.indexOf('\n', last);
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
  

  function func(data) {
    var user1 = "Leon Erath"
    var user2 = "Daniel Salomon"

    data = data.substring(17,data.length)
    data = data.replace(user1,"A")
    data = data.replace(user2,"B")
    data = data.replace("\n"," ")

    if(data.indexOf("http") > -1 || data.indexOf("<Medien weggelassen>") > -1 ) {
        data = ""
    }else{
        data = data +"\n"
    }
    
    return data
  }

var input = fs.createReadStream('chat.txt');
readLines(input, func);
