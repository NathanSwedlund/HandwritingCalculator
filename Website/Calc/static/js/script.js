// Mouse
var lastX = 0; // last pos of mouse
var lastY = 0;
var mouseIsDown = false;
var emptyCanvas = true;

// Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
// updateCanvasSize();

function updateCanvasSize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.2;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.rect(0, 0, 4000, 4000);
  ctx.fill();
  ctx.restore();
}

// Helpers
function mousePosition(canvas, evt) {
  let box = canvas.getBoundingClientRect();
  return { x: evt.offsetX, y: evt.offsetY };
}

// Event Listeners
// window.addEventListener("resize", updateCanvasSize);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseleave", mouseLeave);
canvas.addEventListener("mouseup", mouseUp);

function mouseDown(e) {
  mouseIsDown = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
}

function mouseMove(e) {
  if (lastX == 0 || lastY == 0 || !mouseIsDown) {
    lastX = e.x;
    lastY = e.y;
    return;
  }
  emptyCanvas = false;

  let x = e.offsetX;
  let y = e.offsetY;

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
}

function mouseLeave(e) {
  mouseIsDown = false;
}

function mouseUp(e) {
  mouseIsDown = false;
  lastX = 0;
  lastY = 0;
}

// Refresh
function checkRefresh() {
  if (document.refreshForm.visited.value == "") {
    document.refreshForm.visited.value = "1";
  } else {
    emptyCanvas = True;
  }
}

// Clear
document.getElementById("clear-button").onclick = function () {
  emptyCanvas = true;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.rect(0, 0, 4000, 4000);
  ctx.fill();
  ctx.restore();
};

// Post
document.getElementById("submit-button").onclick = function (e) {
  if (!emptyCanvas) {
    var img = canvas.toDataURL("image/png");
    $.post("/Calc/", { img: img }, (result, status) => {
      console.log(status);
      $("span").html(result);
    });
  } else {
    $("span").html("Please provide more input before submitting.");
  }
};
