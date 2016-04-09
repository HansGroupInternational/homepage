var alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var bsf = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomBit(){
	return Math.round(Math.random());
}

function randomBinary(len){
	var result = "";
	for(var i=0;i<len;i++){
		result = result + randomBit().toString();
	}
	return result; //yeah it's shitty but who gives a fuck.  Don't judge me.
}

function createWord(){
    var len = randomInt(15,26);
	var result = "";
	for(var i=0; i<len; i++){
		result = result + alpha[randomInt(0,26)]
	}
	return result;
}

function randomBSF(len){
	var result="";
	for(var i=0;i<len;i++){
		result = result + bsf[randomInt(0,63)];
	}
	return result;
}

function bsfBlock(lines, llen){
	var result=[];
	for(var i=0;i<lines;i++){
		result[i] = randomBSF(llen);
	}
	return result;
}

function blockString(block){
	var result="";
	for(var i=0;i<block.length;i++){
		for(var o=0;o<block[i].length;o++){
			result = result+"<label>"+block[i][o]+"</label>";
		}
	}
	return result;
}