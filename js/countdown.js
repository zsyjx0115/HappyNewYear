(function() {

	   console.log(typeof foo); // function pointer
	   console.log(typeof bar); // undefined
	
	   var foo = 'hello',
	       bar = function() {
	           return 'world';
	       };
	
	   function foo() {
	       return 'hello';
	   }
	
	}());
var WINDOW_WIDTH =  1324;
var WINDOW_HEIGHT = 528;
var R = 10;
var TOP = 100;
var LEFT = 100;

//var ball = {x:500, y:200, r:10, g:2, vx:-4, vy:-10, color:'red'};
var balls = [];
const ballColor = ["#449BE8", "#5A17F5", "#FB22D4", "#FB2270", "#54F54B",
			"#F51B1B", "#F5AA1B", "#D591EA", "#91D1EA", "#F783A2"];
window.onload = function(){
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;
	R = Math.floor(WINDOW_WIDTH * 3 / 4 / 110) - 1;
	LEFT = Math.floor(WINDOW_WIDTH / 8);
	TOP = Math.floor(WINDOW_HEIGHT / 3);
	//获取画布
	var canvas = document.getElementById("canvas");
	if(canvas.getContext("2d")){
		var context = canvas.getContext("2d");
		//使用context进行画布中图形的绘制
		canvas.width = WINDOW_WIDTH;
		canvas.height = WINDOW_HEIGHT;
		//endTime截止时间
		//var endTime = new Date(2016,1,9,0,0,0);
		var endTime = new Date();
		endTime.setTime(endTime.getTime()+ 60 * 60 * 1000);
		//endTime.setTime(endTime.getTime()+ 6* 1000);
		//remainTime剩余需要倒计时的时间
		var remainTime = getCurrentShowTime(endTime);
		//获取时间对象来保存倒计时的时、分、秒
		var showTime = getTime(remainTime);
		//绘制第一幅倒计时图
		drawClock(showTime,context);
		//设置定时器查询倒计时时间是否改变，若改变则更新倒计时显示
		var time = setInterval(function(){
			showTime = updateClock(endTime,showTime,context);
			if(balls.length < 130 && showTime.minute === 0 &&
				showTime.second === 0 && showTime.hour === 0){
				clearInterval(time);
				$("#canvas").remove();
				startType();
			}
		},50);
	}
	else{
		alert("当前浏览器不支持Canvas！");
	}

};

//绘制倒计时显示函数
function drawClock(time,context){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	drawDigit(LEFT, TOP, Math.floor(time.hour / 10), context);
	drawDigit(LEFT + 15 * (R + 1), TOP, time.hour % 10, context);
	drawDigit(LEFT + 30 * (R + 1), TOP, 10, context);
	drawDigit(LEFT + 40 * (R + 1), TOP, Math.floor(time.minute / 10), context);
	drawDigit(LEFT + 55 * (R + 1), TOP, time.minute % 10, context);
	drawDigit(LEFT + 70 * (R + 1), TOP, 10, context);
	drawDigit(LEFT + 80 * (R + 1), TOP, Math.floor(time.second / 10), context);
	drawDigit(LEFT + 95 * (R + 1), TOP, time.second % 10, context);

	//绘制小球
	for(i=0; i < balls.length; i++){
		context.fillStyle = balls[i].color;
		context.beginPath();
		context.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
	}
}
//根据改变时间的位置来添加小球
function addBall(nexttime, curtime, context){
	if(nexttime.second != curtime.second){
		addDigitBall(LEFT + 95 * (R + 1), TOP, nexttime.second % 10, context);
		if(Math.floor(nexttime.second / 10) != Math.floor(curtime.second / 10)){
			addDigitBall(LEFT + 80 * (R + 1), TOP, Math.floor(nexttime.second / 10), context);
		}
	}
	if(Math.floor(nexttime.minute % 10) != Math.floor(curtime.minute % 10)){
		addDigitBall(LEFT + 55 * (R + 1), TOP, Math.floor(nexttime.minute % 10), context);
	}
	if(Math.floor(nexttime.minute / 10) != Math.floor(curtime.minute / 10)){
		addDigitBall(LEFT + 40 * (R + 1), TOP, Math.floor(nexttime.minute / 10), context);
	}
	if(Math.floor(nexttime.hour % 10) != Math.floor(curtime.hour % 10)){
		addDigitBall(LEFT + 15 * (R + 1), TOP, Math.floor(nexttime.hour % 10), context);
	}
	if(Math.floor(nexttime.hour / 10) != Math.floor(curtime.hour / 10)){
		addDigitBall(LEFT, TOP, Math.floor(nexttime.hour / 10), context);
	}
}
//根据剩余时间秒数来获取倒计时对象
function getTime(remain){
	var showTime = {
		hour : 0,
		minute : 0,
		second : 0
	};
	showTime.hour = Math.floor(remain / 3600) ;
	showTime.minute = Math.floor(remain / 60) % 60;
	showTime.second = remain % 60;
	return showTime;
}

//检查倒计时时间是否发生变化，若变化则调用drawClock显示新的时间
function updateClock(endtime,showtime,context){
	var nextRemain = getCurrentShowTime(endtime);
	var nextTime = getTime(nextRemain);
	addBall(nextTime, showtime, context);
	if(nextTime.second != showtime.second){
		drawClock(nextTime, context);
		showtime = nextTime;
	}
	else{
		drawClock(showtime, context);
	}
	//更新小球下落位置
	for(var i=0; i < balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		//碰撞检测
		if(balls[i].y > WINDOW_HEIGHT - balls[i].r){
			balls[i].y = WINDOW_HEIGHT - balls[i].r;
			balls[i].vy = -balls[i].vy * 0.8;
		}
	}
	//将弹出屏幕的小球从球数组中删除
	var count = 0;
	for(i=0; i < balls.length; i++){
		if(balls[i].x + R > 0 && balls[i].x - R < WINDOW_WIDTH){
			balls[count++] = balls[i];
		}
	}
	count = count > 350 ? 350 : count;
	balls.splice(count, balls.length-count);
	console.log(balls.length);

	return showtime;
}

//获取当前时间距截止时间的时间差，返回秒级时间值
function getCurrentShowTime(endtime){
	var cur = new Date();
	var dir = endtime - cur;
	dir = dir >= 0 ? dir : 0;
	return  Math.floor(dir / 1000);
}

//绘制数字和冒号函数
function drawDigit(x, y, num, context){
	context.fillStyle = "#2ABF9E";
	var centerx = 0, centery = 0;
	for(var row = 0; row < digit[num].length; row++){
		for(var col = 0; col < digit[num][row].length; col++){
			if(digit[num][row][col] == 1){
				centerx = x + (col * 2 + 1) * (R + 1);
				centery = y + (row * 2 + 1) * (R + 1);
				context.beginPath();
				context.arc(centerx, centery, R, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
			}
		}
	}
}

//根据数字添加小球对象
function addDigitBall(x, y, num, context){
	for(var row = 0; row < digit[num].length; row++){
		for(var col = 0; col < digit[num][row].length; col++){
			if(digit[num][row][col] == 1){
				var ball = {};
				ball.x = x + (col * 2 + 1) * (R + 1);
				ball.y = y + (row * 2 + 1) * (R + 1);
				ball.r = R;
				ball.vx = Math.pow(-1, Math.ceil(Math.random() * 1000)) * Math.floor(Math.random() * 2 + 3);
				ball.vy = -5 - Math.floor(Math.random() * 5);
				ball.g = 1.5 + Math.random();
				ball.color = ballColor[Math.floor(Math.random() * 10)];
				balls.push(ball);
			}
		}
	}
}
