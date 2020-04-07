// Basic variable setup ----------------------------

// keeps track of the last place the mouse was
var lastX = 0
var lastY = 0

var col = randCol(); // The color for randomly colored things
var tool = "" // Keeps track of the current tool being used

// The button/tool names
buttonNames = ["raytraceButton", "eraserButton", "drawButton", "fireworkButton", "potatoButton"];
toolNames  = ["raytrace", "eraser", "draw", "firework", "potato"];
// -----------------------------------------

// Setting up canvas
var canvas = document.querySelector("canvas");
updateCanvasSize()
var c = canvas.getContext("2d");
c.font = "50px Arial";
c.fillText("CANVAS CRAZY DRAW THING!", 50, 50)
// ---

// Generic Functions ---------------------------------
function updateCanvasSize()
{
    console.log("test");
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.75;
}

function mousePosition(canvas, evt) {
  var box = canvas.getBoundingClientRect();
  var X = evt.clientX - box.left;
  var Y = evt.clientY - box.top;
  return {x:X, y:Y};
}

function randCol() {
  var length = 16;
  var chars = "0123456789ABCDEF";
  var color = "";
  for (var i = 0; i < 3; i++) {
      var rand = Math.floor(Math.random() * length);
      color += chars[rand];
  }
  return '#'+color;
}
// ---------------------------------------------------

// Tool Functions ---------------------------------
// Functions that will be bound to each function
buttonFunctions = {
    raytrace:     function () {},
    eraser:       function () {},
    draw:         function () {},
    firework:     function () {},
    potato:       function () {}
}

// Functions for when the mouse moves
mouseMoveFunctions = {
    raytrace:  function(evt) {
        // Returning if lastX/lastY aren't valid, or the mouse is not down.
        if(!mouseIsDown || lastX == 0 || lastY == 0)
            return;
        var pos = mousePosition(canvas, evt);

        // Drawing lines to current mouse position form lastX/lastY
        c.save();
        c.beginPath();
        c.strokeStyle = col;
        c.lineWidth = 1;
        c.moveTo(lastX, lastY);
        c.lineTo(pos.x, pos.y);
        c.stroke();
        c.restore();
    },
    eraser: function(evt) {
        if(!mouseIsDown || lastX == 0 || lastY == 0)
            return;
        console.log("drawing");
        var pos = mousePosition(canvas, evt);
        var x = pos.x
        var y = pos.y

        c.save();

        c.beginPath();
        c.strokeStyle = "white";
        c.lineWidth = 8;
        c.moveTo(lastX, lastY);
        c.lineTo(x, y);
        c.stroke();

        c.restore();

        lastX = x;
        lastY = y;
    },
    draw: function(evt) {
        if(lastX == 0 || lastY == 0 || !mouseIsDown)
        {
            lastX = x;
            lastY = y;
            return;
        }
        console.log("drawing");
        var pos = mousePosition(canvas, evt);
        var x = pos.x
        var y = pos.y

        c.save();

        c.beginPath();
        c.strokeStyle = "black";
        c.lineWidth = 3;
        c.moveTo(lastX, lastY);
        c.lineTo(x, y);
        c.stroke();

        c.restore();

        lastX = x;
        lastY = y;
    },
    firework:     function(evt) {}, // Does nothing
    potato:       function(evt) {} // Does nothing
}

// Functions for when the mouse goes up
mouseDownFunctions = {
    // raytrace, eraser, and draw, collect mouse position info
    raytrace: function(evt) {
        col = randCol();
        var pos = mousePosition(canvas, evt);
        lastX = pos.x;
        lastY = pos.y;
    },
    eraser: function(evt) {
        var pos = mousePosition(canvas, evt);
        lastX = pos.x;
        lastY = pos.y;
    },
    draw: function(evt) {
        var pos = mousePosition(canvas, evt);
        lastX = pos.x;
        lastY = pos.y;
    },
    firework: function(evt) {
        col = randCol();

        var maxDiff = 70;
        var maxParticles = 30;
        var minParticles = 10;
        var particleCount = minParticles + Math.floor(Math.random() * (maxParticles-minParticles));
        var pos = mousePosition(canvas, evt);

        for(var i = 0; i < particleCount; i++)
        {
            var xdiff = 2* ((Math.random() * maxDiff) - (maxDiff/2));
            var ydiff = 2* ((Math.random() * maxDiff) - (maxDiff/2));

            c.save();

            c.beginPath();
            c.strokeStyle = col;
            c.lineWidth = 3;
            c.setLineDash([5, 3]);

            c.moveTo(pos.x, pos.y);
            c.lineTo(pos.x+xdiff, pos.y+ydiff);
            c.stroke();

            c.restore();

        }
    },
    potato: function(evt) {
        var pos = mousePosition(canvas, evt);

        potato = new Image();
        potato.src = "potato.jpg";
        potato.onload = function(){
        c.drawImage(potato, pos.x-40, pos.y-25, 80, 50);
      }
  }
}

// Functions for when the mouse gets pushed down
mouseUpFunctions = {
    // raytrace, eraser, and draw, reset the last-coord values on mouse up
    raytrace: function(evt) {
        lastX = 0;
        lastY = 0;
    },
    eraser: function(evt) {
        lastX = 0;
        lastY = 0;
    },
    draw: function(evt)
    {
        lastX = 0;
        lastY = 0;
    },
    firework:     function(evt) {}, // Does nothing
    potato:       function(evt) {} // Does nothing
}
// ---------------------------------------------

// Setting event listeners ------------------------------
canvas.addEventListener("mousemove", function (evt) {
    if(toolNames.includes(tool)) {
        mouseMoveFunctions[tool](evt);
    } else {
        console.log(tool);
    }
});

window.addEventListener("resize", updateCanvasSize);

var mouseIsDown = false;
canvas.addEventListener("mousedown", function (evt) {
    mouseIsDown = true;
    if(toolNames.includes(tool)) {
        mouseDownFunctions[tool](evt);
    } else {
        console.log(tool);
    }
});
canvas.addEventListener("mouseup",   function (evt) {
    mouseIsDown = false;
    if(toolNames.includes(tool)) {
        mouseUpFunctions[tool](evt);
    } else {
        console.log(tool);
    }
});
document.getElementById("clearButton").onclick = function ()
{
    c.clearRect(0, 0, canvas.width, canvas.height);
}

// Adding event listeners to each tool button
buttonNames.forEach(function (name, index) {
    console.log(name);

    // Creating button functions
    buttonFunctions[toolNames[index]] = function () {
        lastX = 0;
        lastY = 0;
        tool = toolNames[index];
    };
    // Making tool buttons call the right function
    document.getElementById(name).onclick = buttonFunctions[toolNames[index]];
});
// -----------------------------------------
