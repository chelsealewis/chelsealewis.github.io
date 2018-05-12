var draw = function(snakeToDraw, flower) {
  var drawableSnake = { color: "Teal", pixels: snakeToDraw };
  var drawableFlower = { color: "Purple", pixels: [flower] };
  var drawableObjects = [drawableSnake, drawableFlower];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  if (segment.direction === "down") {
    return { top: segment.top + 1, left: segment.left }
  } else if (segment.direction === "up") {
    return { top: segment.top - 1, left: segment.left }
  } else if (segment.direction === "right") {
    return { top:segment.top, left:segment.left + 1 }
  } else if (segment.direction === "left") {
    return { top: segment.top, left: segment.left - 1 }
  } else {
    return segment;
  }
}

var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

//   var newSnake = [];
//   snake.forEach(function(oldSegment) {
//     var newSegment = moveSegment(oldSegment);
//     newSegment.direction = oldSegment.direction;
//     newSnake.push(newSegment);
//   });
//   return newSnake;
// }

/*
var oldSegment = snake[0];
  var newSegment = moveSegment(oldSegment);
  newSegment.direction = oldSegment.direction;
  var newSnake = [newSegment];
  return newSnake;
}
*/

var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Don't eat yourself, ya doofus.");
  }

  if (ate(newSnake, [flower])) {
    newSnake = growSnake(newSnake);
    flower = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You done effed up!");
  }

  snake = newSnake;
  draw(snake, flower);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var segmentFurtherForwardThan = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];

var flower = { top: 8, left: 10 };

CHUNK.executeNTimesPerSecond(advanceGame, 5);
CHUNK.onArrowKey(changeDirection);
/*
    var snake = [
      { top: 0, left: 3},
      { top: 0, left: 4},
      { top: 0, left: 5}
    ];
    var egg = [
      { top: 8, left: 8},
    ];
    var drawableSnake = { color: "Teal", pixels: snake };
    var drawableEgg = { color: "BlanchedAlmond", pixels: egg };
    // we are creating an array
    var drawableObjects = [
      drawableSnake,
      drawableEgg
    ];
    CHUNK.draw(drawableObjects);
*/
