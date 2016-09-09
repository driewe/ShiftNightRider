/*
Using Intel Edison with my shift register shield.
Clock = pin 3
data = pin 3
latch = pin 4
*/
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

var bitPattern1 = [128,64,32,16,8,4,2,1,2,4,8,16,32,64]
var bitPattern2 = [136, 68, 34, 17, 34, 68]
var bitPattern3 = [136, 68, 34, 17, 0]
var bitPattern4 = [17, 34, 68, 136, 0]
var bitPattern5 = [128, 8,  64, 4, 32, 2, 16, 1]
var bitPattern6 = [1, 16, 2, 32, 4, 64, 8, 128]
var bitPattern = bitPattern1;
var speed = 100;
var index = 0;
var patternNumber = 1;

//var colors = Object.keys(require("css-color-names"));

board.on("ready", () => {
    var button = new five.Button(5);
    var potSpeed = new five.Sensor({
        pin: "A0",
        freq: 250
    });
    var register = new five.ShiftRegister({
        pins: {
            clock: "3",
            data: "2",
            latch: "4",
        }
    });
    
    var lcd = new five.LCD({
        controller: "JHD1313M1"
    });
    
    /* When the button is pressed cycle to the next 
     * Pattern.
     */
    
    button.on("press", (button) => {
        if(bitPattern === bitPattern1) {
            bitPattern = bitPattern2;
            patternNumber = 2;
        } else if(bitPattern === bitPattern2) {
            bitPattern = bitPattern3;
            patternNumber = 3;
        } else if(bitPattern === bitPattern3){
            bitPattern = bitPattern4;
            patternNumber = 4;
        } else if(bitPattern === bitPattern4) {
            bitPattern = bitPattern5;
            patternNumber = 5;
        } else if(bitPattern == bitPattern5) {
            bitPattern = bitPattern6;
            patternNumber = 6;
        }
        else {
            bitPattern = bitPattern1;
            patternNumber = 1;
        }
        index = 0;
        updateDisplay();
    });
    
    potSpeed.on("change", function() {
        //console.log(this.value, this.raw);
        speed = (this.value >> 2 );
        updateDisplay();
    });
    
    
// main loop
/*
    board.loop(speed, () => {
        register.send(bitPattern[index])
        index += 1;
        if (index === bitPattern.length) {
            index = 0;
        }
    })
  */  

    function updateDisplay() {
        var str1 = "Pattern: ";
        var str2 = "Delay: ";
        var res = str1+patternNumber;
        lcd.cursor(0, 0).print(res);

        res = str2+pad(speed, 3);
        lcd.cursor(1, 0).print(res);
    }
    
    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function next() {
        register.send(bitPattern[index])
        index += 1;
        if (index === bitPattern.length) {
            index = 0;
        }
        setTimeout(next, speed);
    }
    //lcd.bgColor("#ffff00");
    next();
    
});
