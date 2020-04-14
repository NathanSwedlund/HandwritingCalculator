// keeps track of the last place the mouse was
var lastX = 0;
var lastY = 0;

// Setting up canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
updateCanvasSize();
// ---


// Generic Functions ---------------------------------
function updateCanvasSize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.2;
  ctx.save()
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.rect(0, 0, 4000, 4000);
  ctx.fill();
  ctx.restore()
}

function mousePosition(canvas, evt) {
  var box = canvas.getBoundingClientRect();
  //   var X = evt.clientX - box.left;
  //   var Y = evt.clientY - box.top;
  return { x: evt.offsetX, y: evt.offsetY };
}

function mouseLeave(e) {
  mouseIsDown = false;
}

// Setting event listeners ------------------------------
window.addEventListener("resize", updateCanvasSize);
canvas.addEventListener("mouseleave", mouseLeave);

canvas.addEventListener("mousemove", (evt) => {
  if (lastX == 0 || lastY == 0 || !mouseIsDown) {
    lastX = x;
    lastY = y;
    return;
  }

  console.log("drawing");
  //   var pos = mousePosition(canvas, evt);
  var x = evt.offsetX;
  var y = evt.offsetY;

  // Strokes from the previous mouse location to the current one
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();

  // Updating last known mouse location
  lastX = x;
  lastY = y;
});

var mouseIsDown = false;
canvas.addEventListener("mousedown", (evt) => {
  mouseIsDown = true;
  //   var pos = mousePosition(canvas, evt);
  lastX = evt.offsetX;
  lastY = evt.offsetY;
});
canvas.addEventListener("mouseup", function (evt) {
  mouseIsDown = false;
  lastX = 0;
  lastY = 0;
});

document.getElementById("clearButton").onclick = function () {
    ctx.save()
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(0, 0, 4000, 4000);
    ctx.fill();
    ctx.restore()
};

// Sends the canvas as an image to python
document.getElementById("exportButton").onclick = function () {
  var img = canvas.toDataURL("image/png");
  // Sending image to python
  $.post("/evaluate", { testVal: img }, function (response) {
    if (response === "success") {
      console.log("POST image success!  ln:84, file:script.js");
    } else {
      alert("Error POST-ing: ln:84, file:script.js");
    }
  });
};
