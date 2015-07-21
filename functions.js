function animateFlip(msg){
	var elementArray = (""+msg).split(","); 
	if((elementArray[0]) && (elementArray[1]) ){
		$("#playerContainer"+elementArray[0] + " #flipper"+elementArray[1]).addClass("effectFlip");
	}
}
function animateUnFlip(msg){
	var elementArray = (""+msg).split(",");
	if((elementArray[0]) && (elementArray[1]) ){
		$("#playerContainer"+elementArray[0] + " #flipper"+elementArray[1]).removeClass("effectFlip");
	}
}
function playerFinished(msg){
	var playerID = parseInt(msg);
	if(playerID == 1){
		clearTimeout(timerPlayer1);
	}else{
		clearTimeout(timerPlayer2);
	}
}