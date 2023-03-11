// game.js

// ----- Global Variables ----- //

// Note: Could use parseInt from style.width & style.height of "gameArea" in order to make this more dynamic (and easier to update)
var playAreaW = 640;
var playAreaH = 400;
var moveAreaW = 640;
var moveAreaH = 288;

var dTimer = 3000;

var bgY = -64;
var bgLF = +new Date;

var flashLF = +new Date;
var flashCountGap = Math.floor((Math.random()*10000)+5000);
var flashed = false;

var loadCount = 0;
var loadCountMax = 100;

var theOption;
var lines, responses;

var playerFlash = new Image();
var npcFlash = new Image();

var room = "The Front Desk";

var minimized = false;

var pInteractArray = ["Who ARE you?", "What do you want from me!?", "Why are you bothering me!?", "STOP!"];
var pInteractCount = 0;

var touchMoved = false;

// -- Device specific check
var isiOS = navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPod") != -1;
var isOpera = navigator.userAgent.indexOf("Opera") != -1;

// Player
var player = {
    	element:		null,
    	context:		null,
    	img:			new Image(),
    	imgFlash:		new Image(),
    	imgReady:		false,
    	imgFlashReady:	false,
    	dElement:		null,
    	dContext:		null,
    	dWidth:			0,
    	dHeight:		19,
    	dWLoc:			150,
    	dHLoc:			120,
		dTimeOut:		null,
    	isSpeaking:		false,
		isInteracting:	false,
    	dColor:			"rgb(255, 255, 255)",
    	offAreaText:	"Nothing important over there.",
    	moveDistance:	16,
		w:				64, // set the player’s width
		h:				192, // set the player’s height
		mid:			32,
		sx:				0, // set the player’s image’s source x position
		sy:				384, // set the player’s image’s source y position
		facing:			"right",
		faceRight:		true, // this will tell the code our player is facing right to start
		faceLeft:		false, // this is set to false so our player will face right
		faceForward:	false,
		faceBack:		false,
		counter:		0, // counter we use to know when to change frames
		endStep:		6,  // when counter equals this number, everything resets and we go back to the first frame
		loc:			0, // set the player’s x position
		lastFrame:		+new Date,
		start: { // sets the start postions of our source
			rightX:		0, // start x position when facing right
			leftX:		64, // start x position when facing left
			forwardX:	128,
			backX:		192,
			y:			384 // start y position is the same for both
			}
		};

// NPC
var isNpc = false;

var npc = {
    	element:		null,
    	context:		null,
    	img:			new Image(),
    	imgFlash:		new Image(),
    	imgReady:		false,
    	imgFlashReady:	false,
    	dElement:		null,
    	dContext:		null,
    	dWidth:			0,
    	dHeight:		19,
    	dWLoc:			150,
    	dHLoc:			80,
    	dialogueLoc:	150,
    	dColor:			"rgb(225, 218, 36)",
		dTimeOut:		null,
    	isSpeaking:		false,
		w:				100,
		h:				105,
		mid:			50,
		sx:				0,
		sy:				0,
		counter:		0,
		endStep:		2,
		loc:			400,
		lastFrame:		+new Date,
		start: {
			leftX:		0,
			y:			0
			}
		};

// Control Variables
var key = {right: false, left: false};

var click = {right: true, left: false};

var clickLocX = 180;
var clickLocY = 0;

// ------------------------------------------------------------------------------------------ //

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller -- fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0; var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {clearTimeout(id);};
}());

if(!Date.now){Date.now=function now(){return +(new Date);};}
// ------------------------------------------------------------------------------------------ //

// Get Cursor Position
//   Finds the cursor position on screen, also relative to playing area, and performs misc actions as such.
//   Returns: True if mouse click was in the playable area.
function getCursorPosition(e) {
	var x;
	var y;

	// Find the click location within the window
	if (e.pageX && e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else if (e.changedTouches[0].pageX) {
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	// Offset that location with the containers origin
	x -= document.getElementById("gameArea").offsetLeft;
	y -= document.getElementById("gameArea").offsetTop;

	if (!player.isInteracting && isNpc) {
		switch (room) {
			case "The Front Desk":
				if (x > 20 && x < 120 && y > 171 && y < 241) {
					x = 120;

					clickLocX = x;
					clickLocY = y;
					
					player.facing = "left";

					player.isInteracting = true;

					click.right = false;
					click.left = false;
					key.right = false;
					key.left = false;

					clearDialogueText(player, false);
					interact();
					
					return true;
				}
				break;
			default:
				if (x > 400 && x < 500 && y > 171 && y < 241) {
					x = 410;

					clickLocX = x;
					clickLocY = y;
					
					player.facing = "right";

					player.isInteracting = true;

					click.right = false;
					click.left = false;
					key.right = false;
					key.left = false;

					clearDialogueText(player, false);
					interact();
					
					return true;
				}
				break;
		}
	} else if (player.isInteracting) {
		if (x >= 0 && x <= moveAreaW) {
			if (y > 288 && y <= 400) {
				theOption = Math.floor((y - 288) / 35) + 1;

				interact();
			} else {
				player.isInteracting = false;
				interact();
			}
		} else {
			player.isInteracting = false;
			interact();
		}
	}

	if (!player.isInteracting && y >= 0 && y <= playAreaH) {
		if (x >= 0) {
			if (x <= moveAreaW) {
				// Set the location Y relative to the containers origin - Gives us proper coordinates.
				clickLocX = x;
				clickLocY = y;

				if (y <= moveAreaH) {
					return true;
				} else {
					return false;
				}
			} else {
				player.facing = "right";

				drawDialogueText(player, player.offAreaText);
				click.right = false;
				click.left = false;
				key.right = false;
				key.left = false;
			}
		} else {
			player.facing = "left";

			drawDialogueText(player, player.offAreaText);
			click.right = false;
			click.left = false;
			key.right = false;
			key.left = false;
		}
	}

	return false;
}

// Can take upto 3 options 40 characters long each
// Needs to take an array and output accordingly
function drawDialogueOptions(clearText) {
	var element = document.getElementById("dialogueOptions");
	var context = element.getContext("2d");

	// Clear canvas
	context.clearRect(0, 0, 640, 112);
	
	if (clearText) {return;}
	
	// Set Dialogue/Text Styles
	context.font = "normal 16px 'Press Start 2P'";
	context.textBaseline = "top";
	context.fillStyle = "rgb(0, 153, 0)";

	context.fillText(lines[0], 0, 0);
	context.fillText(lines[1], 0, 35);
	context.fillText(lines[2], 0, 70);
}

function drawMultiDialogueText(sObj, dTextArray, optionChoosen, dTextCount) {
	// take an array of text which is your multi-lines
	// setup a for loop and a counter
	// with a simple callback on a setTimeout if there is less counter then array length
	// maybe setup an override on click to skip to the next bit of text?
	// Set Dialogue/Text Styles

	sObj.dContext.font = "normal 16px 'Press Start 2P'";
	sObj.dContext.textBaseline = "top";
	sObj.dContext.shadowBlur = 0;
	sObj.dContext.shadowColor = "rgba(0, 0, 0, 1)";

	var dWidth = sObj.dContext.measureText(dTextArray[optionChoosen][dTextCount]).width + 3;
	var dCenter = Math.round(dWidth / 2);
	var x = (sObj.loc + sObj.mid) - dCenter;

	// Check for text going outsize canvas boundries
	if (x < 0) {x = 0;}

	if ((x + dWidth) > playAreaW) {
		x = playAreaW - dWidth;
	}

	// Move Canvas
	sObj.dElement.style.left = x + "px";
	sObj.dElement.style.top = sObj.dHLoc + "px";

	// Resize canvas
	sObj.dWidth = dWidth;
	sObj.dElement.width = sObj.dWidth;

	// Clear canvas
	clearDialogueText(player, npc);

	// Set Dialogue/Text Styles - Duplicate because of canvas resizing
	sObj.dContext.font = "normal 16px 'Press Start 2P'";
	sObj.dContext.textBaseline = "top";
	sObj.dContext.shadowBlur = 0;
	sObj.dContext.shadowColor = "rgba(0, 0, 0, 1)";
	sObj.dContext.fillStyle = sObj.dColor;

	// Set negative offsets for stroke
	//   Note: Opera shadowOffset for some reason goes off the x y from fillText instead of the x y of text origin.
	var offX = -1;
	var offY = -1;
	
	if (isOpera) {
		offX = -2;
		offY = -2;
	}

	// Draw Text
	sObj.dContext.shadowOffsetX = 1;
	sObj.dContext.shadowOffsetY = 1;
	sObj.dContext.fillText(dTextArray[optionChoosen][dTextCount], 1, 1);

	sObj.dContext.shadowOffsetX = offX;
	sObj.dContext.shadowOffsetY = offY;
	sObj.dContext.fillText(dTextArray[optionChoosen][dTextCount], 1, 1);
	
	sObj.dContext.shadowOffsetX = 1;
	sObj.dContext.shadowOffsetY = offY;
	sObj.dContext.fillText(dTextArray[optionChoosen][dTextCount], 1, 1);

	sObj.dContext.shadowOffsetX = offX;
	sObj.dContext.shadowOffsetY = 1;
	sObj.dContext.fillText(dTextArray[optionChoosen][dTextCount], 1, 1);

	sObj.dContext.shadowOffsetX = 2;
	sObj.dContext.shadowOffsetY = 2;
	sObj.dContext.fillText(dTextArray[optionChoosen][dTextCount], 1, 1);

	sObj.isSpeaking = true;

	if (dTextCount < responses[optionChoosen].length) {
		dTextCount++;

		sObj.dTimeOut = setTimeout(function() { drawMultiDialogueText(sObj, dTextArray, optionChoosen, dTextCount) }, dTimer);
	} else {
		clearDialogueText(sObj, false);
	}
}

// Draw Dialogue Text
//   This function takes a context, x & y coordinates, a string, and a color
//   The string will be displayed at given coordinates on the given context in the given color
//   Note: For pixel text, stroke produced an undesirable effect
//         - shadows provided perfect control for a pixel font stroke.
function drawDialogueText(sObj, dText) {
	// Set Dialogue/Text Styles
	sObj.dContext.font = "normal 16px 'Press Start 2P'";
	sObj.dContext.textBaseline = "top";
	sObj.dContext.shadowBlur = 0;
	sObj.dContext.shadowColor = "rgba(0, 0, 0, 1)";

	var dWidth = sObj.dContext.measureText(dText).width + 3;
	var dCenter = Math.round(dWidth / 2);
	var x = (sObj.loc + sObj.mid) - dCenter;

	// Check for text going outsize canvas boundries
	if (x < 0) {x = 0;}

	if ((x + dWidth) > playAreaW) {
		x = playAreaW - dWidth;
	}

	// Move Canvas
	sObj.dElement.style.left = x + "px";
	sObj.dElement.style.top = sObj.dHLoc + "px";

	clearTimeout(sObj.dTimeOut);

	// Resize canvas
	sObj.dWidth = dWidth;
	sObj.dElement.width = sObj.dWidth;

	// Clear canvas
	sObj.dContext.clearRect(0, 0, sObj.dWidth, sObj.dHeight);

	// Set Dialogue/Text Styles - Duplicate because of canvas resizing
	sObj.dContext.font = "normal 16px 'Press Start 2P'";
	sObj.dContext.textBaseline = "top";
	sObj.dContext.shadowBlur = 0;
	sObj.dContext.shadowColor = "rgba(0, 0, 0, 1)";
	sObj.dContext.fillStyle = sObj.dColor;

	// Set negative offsets for stroke
	//   Note: Opera shadowOffset for some reason goes off the x y from fillText instead of the x y of text origin.
	var offX = -1;
	var offY = -1;
	
	if (isOpera) {
		offX = -2;
		offY = -2;
	}

	// Draw Text
	sObj.dContext.shadowOffsetX = 1;
	sObj.dContext.shadowOffsetY = 1;
	sObj.dContext.fillText(dText, 1, 1);

	sObj.dContext.shadowOffsetX = offX;
	sObj.dContext.shadowOffsetY = offY;
	sObj.dContext.fillText(dText, 1, 1);
	
	sObj.dContext.shadowOffsetX = 1;
	sObj.dContext.shadowOffsetY = offY;
	sObj.dContext.fillText(dText, 1, 1);

	sObj.dContext.shadowOffsetX = offX;
	sObj.dContext.shadowOffsetY = 1;
	sObj.dContext.fillText(dText, 1, 1);

	sObj.dContext.shadowOffsetX = 2;
	sObj.dContext.shadowOffsetY = 2;
	sObj.dContext.fillText(dText, 1, 1);

	sObj.isSpeaking = true;

	sObj.dTimeOut = setTimeout(function(){clearDialogueText(sObj, false)}, dTimer);
}

function clearDialogueText(sObj, sObjTwo) {
	if (sObj) {
		clearTimeout(sObj.dTimeOut);

		sObj.dContext.clearRect(0, 0, sObj.dWidth, sObj.dHeight);
		sObj.isSpeaking = false;
	}
	
	if (sObjTwo) {
		clearTimeout(sObjTwo.dTimeOut);

		sObjTwo.dContext.clearRect(0, 0, sObjTwo.dWidth, sObjTwo.dHeight);
		sObjTwo.isSpeaking = false;
	}
}

// animateSprite
//   Animates a sprite at a given framerate consistantly
function animateSprite(sObj, cycle) {
	var yPos = cycle * sObj.h;

	if (sObj.counter >= sObj.endStep) {
		sObj.sx = 0;
		sObj.counter = 0;
	} else {
		if (sObj.sy == sObj.start.y) {
			sObj.sx = 0;
		} else if (sObj.sy == yPos) {
			sObj.sx += sObj.w;
		}

		sObj.sy = yPos;
	}

	sObj.counter++;
}

// reset
//   Resets the characters animation back to start
function reset(sObj) {
	sObj.sy = sObj.start.y;
	sObj.counter = 0;

	renderSprite(sObj);
}

function renderSprite(sObj) {
	sObj.context.clearRect(0, 0, sObj.w, sObj.h);
	sObj.context.drawImage(sObj.img, sObj.sx, sObj.sy, sObj.w, sObj.h, 0, 0, sObj.w, sObj.h);

	sObj.lastFrame = Date.now();
}

function drawSprite(sObj) {
	if (sObj.isSpeaking) {
		animateSprite(sObj, 1);
	} else {
		npc.sx = npc.start.leftX;
		reset(sObj);
	}
	
	renderSprite(npc);
}

// Draw Player Sprite
//   Draws the sprite to the screen
function drawPSprite() {
	// Player Dialogue Variables
	var dWidth = player.dElement.width;
	var dCenter = Math.round(dWidth / 2);
	var x = (player.loc + player.mid) - dCenter;

	// Check for text going outsize canvas boundries
	if (x < 0) { x = 0; }

	if ((x + dWidth) > playAreaW) { x = playAreaW - dWidth; }

	// Mouse Click to the right of player
	if (click.right) {
		if (player.loc < clickLocX - player.mid) {
			animateSprite(player, 0);

			player.loc += player.moveDistance;
			player.element.style.left = player.loc + "px";

			player.dElement.style.left = x + "px";
		} else {
			click.right = false;
		}
	}

	// Mouse Click to the left of player
	if (click.left) {
		if (player.loc > clickLocX - player.mid) {
			animateSprite(player, 1);

			player.loc -= player.moveDistance;
			player.element.style.left = player.loc + "px";

			player.dElement.style.left = x + "px";
		} else {
			click.left = false;
		}
	}

	// Key Press to the right of player
	if (key.right) {
		if (player.loc <= playAreaW - player.w - player.moveDistance) {
			animateSprite(player, 0);

			player.loc += player.moveDistance;
			player.element.style.left = player.loc + "px";

			player.dElement.style.left = x + "px";
		} else {
			drawDialogueText(player, player.offAreaText);
			player.sx = player.start.rightX;
			reset(player);
		}
	}

	// Key Press to the left of player
	if (key.left) {
		if (player.loc >= player.moveDistance) {
			animateSprite(player, 1);

			player.loc -= player.moveDistance;
			player.element.style.left = player.loc + "px";

			player.dElement.style.left = x + "px";
		} else {
			drawDialogueText(player, player.offAreaText);
			player.sx = player.start.leftX;
			reset(player);
		}
	}

	if (!click.right && !key.right && !click.left && !key.left) {
		if (player.facing == "right") {
			if (player.isSpeaking) {
				animateSprite(player, 3);
			} else {
				player.sx = player.start.rightX;
				reset(player);
			}
		}

		if (player.facing == "left") {
			if (player.isSpeaking) {
				animateSprite(player, 4);
			} else {
				player.sx = player.start.leftX;
				reset(player);
			}
		}

		if (player.facing == "forward") {
			if (player.isSpeaking) {
				animateSprite(player, 5);
			} else {
				player.sx = player.start.forwardX;
				reset(player);
			}
		}

		if (player.facing == "back") {
			if (player.isSpeaking) {
				animateSprite(player, 6);
			} else {
				player.sx = player.start.backX;
				reset(player);
			}
		}
	}
	
	renderSprite(player);
}

// ----- Event Listeners ----- //

// touchMove
//   Kills the left click
function touchMove() { touchMoved = true; }

// leftClick
//   Performs actions on left mouse click
function leftClick(e) {
	var inPlayableRegion = getCursorPosition(e);

	if (!touchMoved) {
		if (inPlayableRegion) {
			if (clickLocX > player.loc) {
				click.right = true;

				player.facing = "right";
			} else {
				click.left = true;

				player.facing = "left";
			}
		}
	}

	touchMoved = false;
}

// keyDown
//   Performs actions on key down
function keyDown(e) {
	if (!player.isInteracting) {
		switch(e.keyCode) {
			case 68: // Right
				key.right = true;
				click.right = false;
				click.left = false;

				player.facing = "right";
				break;
			case 65: // Left
				key.left = true;
				click.right = false;
				click.left = false;

				player.facing = "left";
				break;
			case 112: // F1
				e.preventDefault();

				player.facing = "forward";

				drawDialogueText(player, "Help?! In a web game?");
				click.right = false;
				click.left = false;
				key.right = false;
				key.left = false;
				
				return false;
				break;
			case 116: // F5
				e.preventDefault();

				player.facing = "forward";

				drawDialogueText(player, "Save?! In a web game?");
				click.right = false;
				click.left = false;
				key.right = false;
				key.left = false;
				
				return false;
				break;
			case 83: // Down
				player.facing = "forward";

				playerInteract();
				click.right = false;
				click.left = false;
				key.right = false;
				key.left = false;
				break;
			case 87: // Up
				player.facing = "back";

				drawDialogueText(player, "Yuck! What a wet mess!");
				click.right = false;
				click.left = false;
				key.right = false;
				key.left = false;
				break;
			default:
				break;
		}
	}
}

// keyUp
//   Performs actions on key up
function keyUp(e) {
	if (e.keyCode == 68) {
		key.right = false;
		click.right = false;
		click.left = false;
	} else if (e.keyCode == 65) {
		key.left = false;
		click.right = false;
		click.left = false;
	}
}

// udpate
//   Updates game per frame
function update() {
	if (!minimized){requestAnimationFrame(update);}

	var now = Date.now();
	var deltaTime = now - player.lastFrame;
	var flashDeltaTime = now - flashLF;
	var bgDeltaTime = now - bgLF;
	var npcDeltaTime = now - npc.lastFrame;

	if (flashDeltaTime >= flashCountGap && !flashed) {
		playerFlash = player.img;
		player.img = player.imgFlash;
		drawPSprite();

		if (isNpc) {
			npcFlash = npc.img;
			npc.img = npc.imgFlash;
			drawSprite(npc);
		}

		if (room != "The Lab") {
			document.getElementById("glass").style.backgroundImage = "url('images/glass_flash.png')";
		}

		if (room != "The Gallery") {
			document.getElementById("navArrow").style.backgroundImage = "url('images/ui_icons_flash.png')";
		}

		document.getElementById("logo").style.backgroundImage = "url('images/ui_icons_flash.png')";
		document.getElementById("location").style.backgroundImage = "url('images/ui_icons_flash.png')";
		document.getElementById("location").style.color = "#000";
		document.getElementById("nav").style.backgroundImage = "url('images/ui_icons_flash.png')";

		switch(room) {
			case "The Front Desk":
				document.getElementById("floor").style.backgroundImage = "url('images/floor_flash.png')";
				break;
			case "The Archives":
				document.getElementById("archives").style.backgroundImage = "url('images/archives_flash.png')";
				document.getElementById("floorNon").style.backgroundImage = "url('images/floor_non_flash.png')";
				break;
			case "The Elevator":
				document.getElementById("floor").style.backgroundImage = "url('images/floor_flash.png')";
				break;
			case "The Gallery":
				document.getElementById("navAltArrow").style.backgroundImage = "url('images/ui_icons_flash.png')";
				document.getElementById("floor").style.backgroundImage = "url('images/floor_flash.png')";
				break;
			case "The Office":
				document.getElementById("blinds").style.backgroundImage = "url('images/blinds_flash.png')";
				document.getElementById("floorBlinds").style.backgroundImage = "url('images/floor_blinds_flash.png')";
				break;
			case "The Lab":
				document.getElementById("glassBroken").style.backgroundImage = "url('images/glass_flash.png')";
				document.getElementById("glassBroken").style.backgroundRepeat = "repeat";
				document.getElementById("floorBroken").style.backgroundImage = "url('images/floor_flash.png')";
				document.getElementById("floorBroken").style.backgroundRepeat = "repeat";
				break;
			default:
				break;
		}

		flashCountGap = Math.floor((Math.random()*10000)+5000);

		flashed = true;
		
		flashLF = now;
	} else if (flashed && flashDeltaTime >= 250) {
		player.img = playerFlash;
		drawPSprite();

		if (isNpc) {
			npc.img = npcFlash;
			drawSprite(npc);
		}

		if (room != "The Lab") {
			document.getElementById("glass").style.backgroundImage = "url('images/glass.png')";
		}

		if (room != "The Gallery") {
			document.getElementById("navArrow").style.backgroundImage = "url('images/ui_icons.png')";
		}

		document.getElementById("logo").style.backgroundImage = "url('images/ui_icons.png')";
		document.getElementById("location").style.backgroundImage = "url('images/ui_icons.png')";
		document.getElementById("location").style.color = "#4fa05d";
		document.getElementById("nav").style.backgroundImage = "url('images/ui_icons.png')";

		switch(room) {
			case "The Front Desk":
				document.getElementById("floor").style.backgroundImage = "url('images/floor.png')";
				break;
			case "The Archives":
				document.getElementById("archives").style.backgroundImage = "url('images/archives.png')";
				document.getElementById("floorNon").style.backgroundImage = "url('images/floor_non.png')";
				break;
			case "The Elevator":
				document.getElementById("floor").style.backgroundImage = "url('images/floor.png')";
				break;
			case "The Gallery":
				document.getElementById("navAltArrow").style.backgroundImage = "url('images/ui_icons.png')";
				document.getElementById("floor").style.backgroundImage = "url('images/floor.png')";
				break;
			case "The Office":
				document.getElementById("blinds").style.backgroundImage = "url('images/blinds.png')";
				document.getElementById("floorBlinds").style.backgroundImage = "url('images/floor_blinds.png')";
				break;
			case "The Lab":
				document.getElementById("glassBroken").style.backgroundImage = "url('images/lab_glass.png')";
				document.getElementById("glassBroken").style.backgroundRepeat = "no-repeat";
				document.getElementById("floorBroken").style.backgroundImage = "url('images/floor_broken.png')";
				document.getElementById("floorBroken").style.backgroundRepeat = "no-repeat";
				break;
			default:
				break;
		}

		flashed = false;
	}
	
	if (deltaTime >= 167){drawPSprite();}
	
	if (isNpc){if(npcDeltaTime >= 167){drawSprite(npc);}}

	if (!Modernizr.cssanimations) {
		if (bgDeltaTime >= 18){
			bgY += 4;

			if (bgY > 0) {bgY = -64;}

			document.getElementById("rain").style.backgroundPosition = "0px " + bgY +"px";
			document.getElementById("floorRef").style.backgroundPosition = "0px " + -bgY +"px";
		}
	}
}

function openSeq() {
	if (loadCount >= loadCountMax) {
		drawDialogueText(player, room);

		player.context.globalAlpha = 1;
		
		roomIsReady = true;

		requestAnimationFrame(update);

		// Setup Event Listeners
		window.addEventListener("keydown", keyDown, false);
		window.addEventListener("keyup", keyUp, false);
		window.addEventListener("click", leftClick, false);
		window.addEventListener("touchend", leftClick, false);
		window.addEventListener("touchmove", touchMove, false);
	} else {
		requestAnimationFrame(roomStart);

		var now = Date.now();
		var deltaTime = now - player.lastFrame;

		loadCount++;

		player.context.globalAlpha = loadCount / 100;

		if (deltaTime >= 167){drawPSprite();}
	}
}

// roomStart
//   Checks if assets are ready & peforms any opening sequences
function roomStart() {
	if (isNpc) {
		if (player.imgReady && player.imgFlashReady && npc.imgReady && npc.imgFlashReady) {
			renderSprite(npc);

			openSeq();
		}
	} else if (player.imgReady && player.imgFlashReady) {
		openSeq();
	}
}

function init(roomString) {
	if (Modernizr.canvas && Modernizr.canvastext) {
		room = roomString;
		
		if (room == "The Front Desk" || room == "The Lab" || room == "The Archives"){isNpc = true;}

		// Setup Canvas Elements
		player.element = document.getElementById("pSprite");
		player.dElement = document.getElementById("pDialogue");

		// Setup Canvas Contexts
		if (player.element.getContext) {
			player.context = player.element.getContext("2d");
			player.dContext = player.dElement.getContext("2d");
		} else {
			toggleMode();
			getElementById("gameControls").style.visibility = "hidden";
		}

		// Setup Sprites
		player.img.src = "images/detective_ss.png";
		player.imgFlash.src = "images/detective_ss_flash.png";

		// Load Images
		player.img.onload = function() {player.imgReady = true;roomStart();}
		player.imgFlash.onload = function() {player.imgFlashReady = true;roomStart();}

		// NPC Setup - if neccessary
		if (isNpc) {
			npc.element = document.getElementById("npcSprite");
			npc.dElement = document.getElementById("npcDialogue");

			if (npc.element.getContext) {
				npc.context = npc.element.getContext("2d");
				npc.dContext = npc.dElement.getContext("2d");
			} else {
				toggleMode();
				getElementById("gameControls").style.visibility = "hidden";
			}

			switch (room) {
				case "The Front Desk":
					npc.img.src = "images/receptionist.png";
					npc.imgFlash.src = "images/receptionist_flash.png";
					npc.element.style.left = "20px";
					npc.loc = 20;
					
					lines = ["What is this place?", "Did you hear about the accident?", "Tell me about The Master Goblin"];
					responses = [
									["GGS is a game development studio…",
									"We focus on creating unique games…",
									"in the adventure and RPG space."],

									["Oh, isn’t it terrible?…",
									"He was working so hard…",
									"I bet he was pushed!…",
									"He doesn’t get along well with…",
									"THE GOBLIN MASTERMIND!"],

									["He is the man behind the company…",
									"He’s a fighter! He won’t give up!…",
									"Surviving that fall just proves it!…",
									"Give him some time and you’ll see…",
									"great things, I know it!"]
								];
					break;
				case "The Lab":
					npc.img.src = "images/developer.png";
					npc.imgFlash.src = "images/developer_flash.png";
					npc.dColor = "rgb(200, 255, 200)";
					
					lines = ["A little sassy are we?", "What happened here?", "Tell me about The Goblin Duo"];
					responses = [
									["You would be too if that fucker…",
									"had left you with all the work."],

									["That fucker fell out the window…",
									"Can’t you see that?…",
									"Leaving me with all the work!"],

									["The Master Goblin is the creator…",
									"that fucker!…",
									"The Goblin Mastermind is the destroyer…",
									"that bastard!…",
									"Together they are…",
									"the heart and mind of this company…",
									"Dicks!…",
									"Perpetually at war, they either…",
									"make or break this company…",
									"Then they leave all the work to me!…",
									"fuckers!"]
								];
					break;
				case "The Archives":
					npc.img.src = "images/archivist.png";
					npc.imgFlash.src = "images/archivist_flash.png";
					npc.dColor = "rgb(206, 117, 85)";
					
					lines = ["What has the studio produced before?", "What has changed?", "Tell me about The Goblin Mastermind?"];
					responses = [
									["Nothing publicly available…",
									"Though we do have thousands of records…",
									"of titles, notes, systems, concepts,…",
									"partial mockups, code, you name it."],

									["The Master Goblin made a bid to oust…",
									"The Goblin Mastermind…",
									"He is determined to make…",
									"this company a success…",
									"and end the war between them."],

									["He is the other to The Master Goblin…",
									"The cunning, conniving, manipulative…",
									"evil CEO of the studio."]
								];
					break;
				default:
					isNpc = false;
			}

			npc.img.onload = function() {npc.imgReady = true;roomStart();}
			npc.imgFlash.onload = function() {npc.imgFlashReady = true;roomStart();}
		}

		if (isiOS) {
			window.addEventListener("orientationchange", hideAddressBar, false);

			if(!window.pageYOffset) {
				hideAddressBar();
			}
		}
	}
}

function playerInteract() {
	drawDialogueText(player, pInteractArray[pInteractCount]);
	
	if (pInteractCount < pInteractArray.length - 1) {
		pInteractCount++;
	} else {
		pInteractCount = 0;
	}
}

function toggleVisibility(id) {
	var element = document.getElementById(id);

	if (element.style.visibility == "visible") {
		element.style.visibility = "hidden";
	} else {
		element.style.visibility = "visible";
	}
}

function toggleMode() {
	if (!minimized) {
		document.getElementById("min_max").style.backgroundPosition = "-244px -44px";

		document.documentElement.className += " minimized";

		minimized = true;
	} else {
		document.getElementById("min_max").style.backgroundPosition = "-200px -44px";

		document.documentElement.className = document.documentElement.className.replace( /(?:^|\s)minimized(?!\S)/ , '' );
	
		minimized = false;
		requestAnimationFrame(update);
	}
}

function hideAddressBar() {
	if(!window.location.hash) {
		if(document.height < window.outerHeight) {
			document.body.style.height = (window.outerHeight + 50) + 'px';
		}

		setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
	}
}

function interact() {
	if (player.isInteracting) {
		switch (room) {
			case "The Front Desk":
				drawDialogueText(npc, "Welcome to Goblin Garage Studios!");
				if (theOption) {
					drawMultiDialogueText(npc, responses, theOption - 1, 0);
					theOption = null;
				}
				break;
			case "The Lab":
				drawDialogueText(npc, "WHAT!?");
				if (theOption) {
					drawMultiDialogueText(npc, responses, theOption - 1, 0);
					theOption = null;
				}
				break;
			case "The Gallery":
				break;
			case "The Office":
				break;
			case "The Archives":
				drawDialogueText(npc, "Yes?");
				if (theOption) {
					drawMultiDialogueText(npc, responses, theOption - 1, 0);
					theOption = null;
				}
				break;
			case "The Elevator":
				break;
			default:
				break;
		}
		
		drawDialogueOptions(false);
	} else {
		drawDialogueOptions(true);
		clearDialogueText(player, npc);
	}
}

/* ----- Notes to complete! -----
	- Resize!
	- Safari (at least on Windows) ignoreing preventDefault on F5
	- Set a state for the info box. On click, anywhere, hide it as well
*/