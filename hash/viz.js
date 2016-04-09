tt = Sha256.hash("hello world");

var app = angular.module('hasher', []);

app.directive("compile", ["$compile", function($compile){
	return function(scope, element, attrs){
		scope.$watch(
			function(scope){
				return scope.$eval(attrs.compile);
			},
			function(value){
				element.html(value);
				$compile(element.contents())(scope);
			}
		);
	};
}]);

app.controller('hashControl', ['$scope', '$sce', function($scope, $sce) {
	$scope.toHash = "hello world";

	$scope.block = 0;
	$scope.blocks = [0];

	$scope.detail = "";
	$scope.detail2= "";
	$scope.detail3= "";

	$scope.active = false;
	$scope.active2= false;
	$scope.active3= false;

	$scope.genTable = function(){
		//console.log("wut")
	    var y = "<table width='100%'>";
	    var style = "";
	    for(var i=0;i<64;i++){
	        y+="<tr>"
	        for(var o=0;o<8;o++){
	        	if(o==0 || o==4){
	        		style="style='border-bottom: 1px dashed red;'";
	        	}else{
	        		style="";
	        	}
	            y+="<td class='main-table-cell' ng-mouseover='tableMouseover("+i+","+o+")' ng-mouseleave='tableMouseout("+i+","+o+")' ng-click='tableClick("+i+","+o+")' id='y"+i+"x"+o+"'><span " + style + " >{{fillBigTable("+i+","+o+")}}</span></td>"
	        }
	        y+="</tr>"
	    }
	    y+="</table>"

	    return y;
	}

	$scope.genBlockSelect = function(){
		//console.log("test");
		var out = "";
		for(var i=0;i<tt[1].length;i++){
			out += "<a ng-click='changeBlock("+i+")' href='#'>"+(i+1)+"</a> |"
		}
		//console.log(out);
		return out;
	}

	$scope.changeBlock = function(n){
		//console.log(n);
		$scope.block = n;
		$scope.getW();
	}

	$scope.toTrusted = function(html_code) {
		return $sce.trustAsHtml(html_code);
	}


	$scope.reHash = function(raw){
		//console.log(raw)
		tt = Sha256.hash(raw);
	}

	$scope.result = function(n){
		return Sha256.toHexStr(tt[1][$scope.block][tt[1][tt[1].length-1].length-1][n]);
	}

	$scope.rawResult = function(n){
		return tt[1][tt[1].length-1][tt[1][tt[1].length-1].length-1][n];
	}

	$scope.prettyH = function(i){
		return Sha256.toHexStr($scope.H[i]);
	}

	$scope.ander = function(n, x){
		return Sha256.toHexStr(($scope.H[n]+x) & 0xffffffff);
	}

	$scope.fillBigTable = function(y,x){
		var addon = "";
		return Sha256.toHexStr(tt[1][$scope.block][y][x]);
	}

	$scope.hex2ascii = function(d) {
		return unescape(('' + d).replace(/(..)/g, '%$1'))
	}

	$scope.getW = function(){
		//console.log(tt[1][$scope.block][0][10])
		tt = Sha256.hash($scope.toHash);
		var W = new Array(64);
		for (var t=0;  t<16; t++) W[t] = tt[2][$scope.block][t];
        for (var t=16; t<64; t++) W[t] = (Sha256.thing1(W[t-2]) + W[t-7] + Sha256.thing0(W[t-15]) + W[t-16]) & 0xffffffff;
		
		var out = "<h2>Message Schedule</h2>";
		for(var i=0;i<W.length;i++){
			out += "<span style='border-bottom: 1px dashed red;' ng-click='scheduleDetail("+i+")'>" + Sha256.toHexStr(W[i]) + "</span> ";
		}

		eval($scope.active)
		eval($scope.active2)
		eval($scope.active3)
		
		if($scope.activeWN != -1){
			$scope.scheduleDetail($scope.activeWN);
		}
		var temp=[0];
		for(var i=0;i<tt[1].length-1;i++){
			temp.push(i+1);
		}

		$scope.blocks = temp;
		return out;
	}

	$scope.W_detail = "";

	$scope.activeWN = -1;

	$scope.scheduleDetail = function(n){
		$scope.activeWN = n;
		if(n<16){
			var out = "<h3>Schedule Detail</h3><table width='50%'><tr><td>";
			temp = Sha256.toHexStr(tt[1][$scope.block][0][10][n].toString());
			for(var i=0;i<temp.length;i++){
				out += "" + temp[i];
				if(i%2==1){
					out+= "</td><td>";
				}
			}
			out += "</tr><tr>"
			for(var i=0;i<8;i=i+2){
				out += "<td>" + $scope.hex2ascii(temp[i]+temp[i+1]) + "</td>";
			}
			out += "</tr></table>";
			$scope.W_detail = out;
		}else{
			//TODO
			out = "<h3>Schedule Detail</h3>" + Sha256.toHexStr(tt[1][$scope.block][y-1][4]) + "<br>Rotate Right 2 bits:    " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 2) + "<br>Rotate Right 13 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 13) + "<br>Rotate Right 22 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 22) + "<br>Rotate Left 30 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 26) + "<br>Rotate Left 19 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 21) + "<br>Rotate Left 10 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 10);
		}
	}

	$scope.K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

	$scope.H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

	$scope.hilightCell = function(y,x){
		if($scope.currentHilight){
			if(!$scope.clickLock[y-1][x]){
				$("#y"+($scope.currentHilight[0]-1)+"x"+$scope.currentHilight[1]).css("background-color", "white");
			}else{
				$("#y"+($scope.currentHilight[0]-1)+"x"+$scope.currentHilight[1]).css("background-color", "cyan");
				//console.log(y,x)
			}
		}
		$("#y"+(y-1)+"x"+x).css("background-color", "pink");
		$scope.currentHilight = [y,x];
		$(".choose_input").css("background-color", "white");
		$("#choose_"+y+"-"+x).css("background-color", "pink");
	}

	$scope.currentHilight = false;

	$scope.T1Detail = function(y){
		$scope.active2 = "$scope.T1Detail("+y+")";
		$scope.detail2 = "<h3>T1 Calculation</h3>" + Sha256.toHexStr(tt[1][$scope.block][y-1][7]) + " + <span style='border-bottom: 1px dashed red;' ng-click='sum1Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][13]) + "</span> + <span style='border-bottom: 1px dashed red;' ng-click='chooseDetail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][11]) + "</span> + " + Sha256.toHexStr($scope.K[tt[1][$scope.block][y][15]]) + " + " + Sha256.toHexStr(tt[1][$scope.block][y][10][tt[1][$scope.block][y][15]]) + " = " + Sha256.toHexStr(tt[1][$scope.block][y][8]);
		//$scope.active3 = false;
		//$scope.detail3 = "";
	}

	$scope.T2Detail = function(y){
		$scope.active2 = "$scope.T2Detail("+y+")";
		$scope.detail2 = "<h3>T2 Calculation</h3><span style='border-bottom: 1px dashed red;' ng-click='sum0Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][12]) + "</span> + <span style='border-bottom: 1px dashed red;' ng-click='majorityDetail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][14]) + "</span> = " + Sha256.toHexStr(tt[1][$scope.block][y][9]);
		//$scope.active3 = false;
		//$scope.detail3 = "";
	}

	$scope.sum1Detail = function(y){
		$scope.active3 = "$scope.sum1Detail("+y+")";
		$scope.detail3 = "<h3>Sum 1 Calculation</h3>" + Sha256.toHexStr(tt[1][$scope.block][y-1][4]) + "<br>Rotate Right 6 bits:    " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 6) + "<br>Rotate Right 11 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 11) + "<br>Rotate Right 22 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 22) + "<br>Rotate Left 26 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 26) + "<br>Rotate Left 21 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 21) + "<br>Rotate Left 10 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 10);
	}

	$scope.sum0Detail = function(y){
		//console.log("what");
		$scope.active3 = "$scope.sum0Detail("+y+")";
		$scope.detail3 = "<h3>Sum 0 Calculation</h3>" + Sha256.toHexStr(tt[1][$scope.block][y-1][4]) + "<br>Rotate Right 2 bits:    " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 2) + "<br>Rotate Right 13 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 13) + "<br>Rotate Right 22 bits:  " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] >>> 22) + "<br>Rotate Left 30 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 26) + "<br>Rotate Left 19 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 21) + "<br>Rotate Left 10 bits:   " + Sha256.toHexStr(tt[1][$scope.block][y-1][4] << 10);
	}

	$scope.chooseDetail = function(y){
		$scope.active3 = "$scope.chooseDetail("+y+")";
		$scope.detail3 = "<h3>Choose Calculation</h3><span class='choose_input' id='choose_"+y+"-"+"4' ng-click='hilightCell("+y+",4)' style='border: 1px dashed red;'>e: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][4])) + "</span><br><span class='choose_input' id='choose_"+y+"-"+"5' ng-click='hilightCell("+y+",5)' style='border: 1px dashed red;'>f: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][5])) + "</span><br><span class='choose_input' id='choose_"+y+"-"+"6' ng-click='hilightCell("+y+",6)' style='border: 1px dashed red;'>g: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][6])) + "</span><br><br><span style='border: 1px dashed red;'>r: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y][11])) + "</span> =<br>" + Sha256.toHexStr(tt[1][$scope.block][y][11]);
	}

	$scope.majorityDetail = function(y){
		$scope.active3 = "$scope.majorityDetail("+y+")";
		$scope.detail3 = "<h3>Majority Calculation</h3>a: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][0])) + "<br>b: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][1])) + "<br>c: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y-1][2])) + "<br><br>r: " + Sha256.hex2bin(Sha256.toHexStr(tt[1][$scope.block][y][14])) + " =<br>" + Sha256.toHexStr(tt[1][$scope.block][y][14]);
	}

	$scope.hilightD = function(y){
		//console.log("trip");
		$("#y"+(y-1)+"x3").css("background-color", "pink");
		//$scope.clickLock[y-1][3] = true;
	}

	$scope.tableMouseover = function(y,x){
		if($scope.active == false){
			$scope.detail = y+","+x;
		}
		
		$("#y"+y+"x"+x).css("background-color", "cyan");

		if(x==0 || x==4){
			//if($scope.active == false){
				if(x==0){
					$scope.detail = "<span style='border-bottom: 1px dashed red;' ng-click='T1Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][8]) + "</span> + <span style='border-bottom: 1px dashed red;' ng-click='T2Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][9]) + "</span> = " + Sha256.toHexStr(tt[1][$scope.block][y][0]);
				}else{
					$scope.detail = "<span style='border-bottom: 1px dashed red;' ng-click='hilightD(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y-1][3]) + "</span> + <span style='border-bottom: 1px dashed red;' ng-click='T1Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][8]) + "</span> = " + Sha256.toHexStr(tt[1][$scope.block][y][4]);
				}
			//}
				if(y < 63){
					if($scope.clickLock[y+1][x+1] == false){
						$("#y"+(y+1)+"x"+(x+1)).css("background-color", "cyan");
					}
					if(y < 62){
						if($scope.clickLock[y+2][x+2] == false){
							$("#y"+(y+2)+"x"+(x+2)).css("background-color", "cyan");
						}
						if(y < 61){
							if($scope.clickLock[y+3][x+3] == false){
								$("#y"+(y+3)+"x"+(x+3)).css("background-color", "cyan");
							}
						}
					}
				}
			//}
		}
		if(x==1 || x==5){
			if(y > 0){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "cyan");
			}
			if(y < 63){
				//console.log($scope.clickLock[y+1][y+1]);
				if($scope.clickLock[y+1][x+1] == false){
					$("#y"+(y+1)+"x"+(x+1)).css("background-color", "cyan");
				}
				if(y < 62){
					if($scope.clickLock[y+2][x+2] == false){
						$("#y"+(y+2)+"x"+(x+2)).css("background-color", "cyan");
					}
				}
			}
		}
		if(x==2 || x==6){
			if(y > 0){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "cyan");
				if(y>1){
					$("#y"+(y-2)+"x"+(x-2)).css("background-color", "cyan");
				}
			}
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$("#y"+(y+1)+"x"+(x+1)).css("background-color", "cyan");
				}
			}
		}
		if(x==3 || x==7){
			if(y > 0){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "cyan");
				if(y>1){
					$("#y"+(y-2)+"x"+(x-2)).css("background-color", "cyan");
					if(y>2){
						$("#y"+(y-3)+"x"+(x-3)).css("background-color", "cyan");
					}
				}
			}
		}
		/*if(x==4){
			if($scope.active == false){
				$scope.detail = "<table><tr><td>" + Sha256.toHexStr(tt[1][$scope.block][y][3]) +" + <td ng-click='T1Detail(" + y + ")'>" + Sha256.toHexStr(tt[1][$scope.block][y][8]) + "</td><td> = " + Sha256.toHexStr(tt[1][$scope.block][y][4]) + "</td></tr></table>"
			}
		}
		
		if(x==5 && y > 0){
			$("#y"+(y-1)+"x"+(x-1)).css("background-color", "green");
		}
		if(x==6 && y > 0){
			$("#y"+(y-1)+"x"+(x-1)).css("background-color", "green");
			if(y>1){
				$("#y"+(y-2)+"x"+(x-2)).css("background-color", "green");
			}
		}
		if(x==7 && y > 0){
			$("#y"+(y-1)+"x"+(x-1)).css("background-color", "green");
			if(y>1){
				$("#y"+(y-2)+"x"+(x-2)).css("background-color", "green");
				if(y>2){
					$("#y"+(y-3)+"x"+(x-3)).css("background-color", "green");
				}
			}
		}*/
	}

	$scope.tableMouseout = function(y,x){
		if($scope.active == false){
			$scope.detail = "";
		}
		if($scope.clickLock[y][x] == false){
			$("#y"+(y)+"x"+(x)).css("background-color", "white");
		}

		if(x==0 || x==4){
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$("#y"+(y+1)+"x"+(x+1)).css("background-color", "white");
				}
				if(y < 62){
					if($scope.clickLock[y+2][x+2] == false){
						$("#y"+(y+2)+"x"+(x+2)).css("background-color", "white");
					}
					if(y < 61){
						if($scope.clickLock[y+3][x+3] == false){
							$("#y"+(y+3)+"x"+(x+3)).css("background-color", "white");
						}
					}
				}
			}
		}

		if(x==1 || x==5){
			if(y > 0){
				if($scope.clickLock[y-1][x-1] == false){
					$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
				}
			}
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$("#y"+(y+1)+"x"+(x+1)).css("background-color", "white");
				}
				if(y < 62){
					if($scope.clickLock[y+2][x+2] == false){
						$("#y"+(y+2)+"x"+(x+2)).css("background-color", "white");
					}
				}
			}
		}
		if(x==2 || x==6){
			if(y > 0){
				if($scope.clickLock[y-1][x-1] == false){
					$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
				}
				if(y>1){
					if($scope.clickLock[y-2][x-2] == false){
						$("#y"+(y-2)+"x"+(x-2)).css("background-color", "white");
					}
				}
			}
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$("#y"+(y+1)+"x"+(x+1)).css("background-color", "white");
				}
			}
		}
		if((x==3 && y > 0) || (x==7 && y > 0)){
			if($scope.clickLock[y-1][x-1] == false){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
			}
			if(y>1){
				if($scope.clickLock[y-2][x-2] == false){
					$("#y"+(y-2)+"x"+(x-2)).css("background-color", "white");
				}
				if(y>2){
					if($scope.clickLock[y-3][x-3] == false){
						$("#y"+(y-3)+"x"+(x-3)).css("background-color", "white");
					}
				}
			}
		}

		/*if(x==5 && y > 0){
			if($scope.clickLock[y-1][x-1] == false){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
			}
		}
		if(x==6 && y > 0){
			if($scope.clickLock[y-1][x-1] == false){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
			}
			if(y>1){
				if($scope.clickLock[y-2][x-2] == false){
					$("#y"+(y-2)+"x"+(x-2)).css("background-color", "white");
				}
			}
		}
		if(x==7 && y > 0){
			if($scope.clickLock[y-1][x-1] == false){
				$("#y"+(y-1)+"x"+(x-1)).css("background-color", "white");
			}
			if(y>1){
				if($scope.clickLock[y-2][x-2] == false){
					$("#y"+(y-2)+"x"+(x-2)).css("background-color", "white");
				}
				if(y>2){
					if($scope.clickLock[y-3][x-3] == false){
						$("#y"+(y-3)+"x"+(x-3)).css("background-color", "white");
					}
				}
			}
		}*/
	}

	$scope.initClickLock = function(){
		$scope.clickLock = new Array(64);
		for(i=0;i<64;i++){
			$scope.clickLock[i] = [false,false,false,false,false,false,false,false];
		}
	}
	$scope.initClickLock();

	$scope.tableClick = function(y,x){
		if($scope.active == false){
			$scope.active = "$scope.tableMouseover("+y+","+x+")";
		}else{
			//console.log("werid")
			$scope.active = false;
			$scope.tableMouseover(y,x);
			$scope.active = "$scope.tableMouseover("+y+","+x+")";
		}
		if($scope.active2 == false){
			//$scope.active2 = true;
		}else{
			$scope.active2 = false;
			$scope.detail2 = "";
		}
		if($scope.active3 == false){
			//$scope.active3 = true;
		}else{
			$scope.active3 = false;
			$scope.detail3 = "";
		}

		$scope.initClickLock();
		$(".main-table-cell").css("background-color", "white");
		$scope.tableMouseover(y,x);
		$scope.clickLock[y][x] = true;

		if(x==0 || x==4){
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$scope.clickLock[y+1][x+1] = !$scope.clickLock[y+1][x+1]
				}
				if(y < 62){
					if($scope.clickLock[y+2][x+2] == false){
						$scope.clickLock[y+2][x+2] = !$scope.clickLock[y-1][x-1]
					}
					if(y < 61){
						if($scope.clickLock[y+3][x+3] == false){
							$scope.clickLock[y+3][x+3] = !$scope.clickLock[y+3][x+3]
						}
					}
				}
			}
		}
		if(x==1 || x==5){
			if(y > 0){
				if($scope.clickLock[y-1][x-1] == false){
					$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1]
				}
			}
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$scope.clickLock[y+1][x+1] = !$scope.clickLock[y+1][x+1]
				}
				if(y < 62){
					if($scope.clickLock[y+2][x+2] == false){
						$scope.clickLock[y+1][x+1] = !$scope.clickLock[y+1][x+1]
					}
				}
			}
		}
		if(x==2 || x==6){
			if(y > 0){
				if($scope.clickLock[y-1][x-1] == false){
					$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1]
				}
				if(y>1){
					if($scope.clickLock[y-2][x-2] == false){
						$scope.clickLock[y-2][x-2] = !$scope.clickLock[y-2][x-2]
					}
				}
			}
			if(y < 63){
				if($scope.clickLock[y+1][x+1] == false){
					$scope.clickLock[y+1][x+1] = !$scope.clickLock[y+1][x+1]
				}
			}
		}
		if((x==3 && y > 0) || (x==7 && y > 0)){
			if($scope.clickLock[y-1][x-1] == false){
				$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1]
			}
			if(y>1){
				if($scope.clickLock[y-2][x-2] == false){
					$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1]
				}
				if(y>2){
					if($scope.clickLock[y-3][x-3] == false){
						$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1]
					}
				}
			}
		}

		if(x==5 && y > 0){
			$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1];
		}
		if(x==6 && y > 0){
			$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1];
			if(y>1){
				$scope.clickLock[y-2][x-2] = !$scope.clickLock[y-2][x-2];
			}
		}
		if(x==7 && y > 0){
			$scope.clickLock[y-1][x-1] = !$scope.clickLock[y-1][x-1];
			if(y>1){
				$scope.clickLock[y-2][x-2] = !$scope.clickLock[y-2][x-2];
				if(y>2){
					$scope.clickLock[y-3][x-3] = !$scope.clickLock[y-3][x-3];
				}
			}
		}
	}
}]);