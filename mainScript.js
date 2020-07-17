let score = 0;												//punkty
let zycie = 2;

const nextS = document.getElementById("next");				//nastepna piosenka
let S = 1;
const list = [
 "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/none_given/Rolemusic/Rolemusic_-_Singles/Rolemusic_-_Step_to_Space.mp3",
 "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Rolemusic/Rolemusic_-_Singles/Rolemusic_-_the_river.mp3"
 ];

const bgm = document.getElementById("BgAudio"); 				//bgaudio
bgm.volume = 0.1;
bgm.src = list[0];

const mute = document.getElementById("onoff");				//pocisk dla muzyki on/off
let i = 1;

const canvas = document.getElementById("MainCanvas");			//tworzenie canvas
const ctx = canvas.getContext("2d");							//2d, t.z. plaszczyzna

let temp_w = document.documentElement.clientWidth / 14;		//dynamicznie dopasowanie rozmiaru
let temp_h = document.documentElement.clientHeight / 12;

const c_width = document.documentElement.clientWidth - temp_w;
const c_height = document.documentElement.clientHeight - temp_h;

canvas.setAttribute("width", c_width);						//dopasowanie rozmiaru canvasu do rozmiaru okna
canvas.setAttribute("height", c_height);
canvas.style.background = "black";
canvas.style.cursor = "none";								//wylaczenia kursoru

const positionx = canvas.width/2;								//pozycja i rozmiar napisu "punkty i zycia"
const positiony = canvas.height/30;
const sizeFont = (canvas.width+canvas.height)/109;

const ballRadius = (canvas.height)*0.017;						//rozmiar pilki
let x = (canvas.width)/2;									//polozenia poczatkowe 
let y = (canvas.height)-50;
let vx = (canvas.height)*0.004;								//predkosc dynamicznie zalezaca od rozmiaru okna
let vy = -(canvas.height)*0.004;

let paddle_h = (canvas.height)/34;							//dynamicznie ustawienia rozmiaru plaszczyzny dla odbicia
let paddle_w = (canvas.width)/10;
let paddle_x = (canvas.width - paddle_w)/2;					//wspol.; y nie jest potrzebny

const ceglaWierszIlosc = 5;
const ceglaColumnIlosc = (canvas.width - (((canvas.width)/24) + ((canvas.width)/96)*((canvas.width)/(canvas.width/12))))/(canvas.width/12); //dynamiczne dopasowanie Ilosci plaszczyzn
const ceglaWidth = (canvas.width)/12;							//dynamicznie dopasowanie rozmiarow cegl i odstepow
const ceglaHeight = (canvas.height)/32;
const ceglaPadding = (canvas.width)/96;
const ceglaOffsetTop = (canvas.height)/21;
const ceglaOffsetLeft = (canvas.width)/28;

let cegly = [];												//tworzymy cegly
for(let c = 0; c<ceglaColumnIlosc; c++) {
    cegly[c] = [];
    for(let w = 0; w<ceglaWierszIlosc; w++) {
        cegly[c][w] = { x: 0, y: 0, temp: 1};
    }
}

mute.onclick = function(){									//funkcja do on/off muzyki
	if (i%2==1){
	bgm.volume = 0.0; 
	}
	else{
	bgm.volume = 0.1; 
	}
	i++;
}

nextS.onclick = function(){									//funkcja dla wloczenia nastepnej piosenki
	bgm.src = list[S];
	S++;
	if (S==4){S=0}
}

function playAudio(){										//funkcja dzwieku
	let myAudio = new Audio;
	myAudio.src = "https://sound-pack.net/download/Sound_11994.wav";
	myAudio.play();
}

function random(number){									//funkcja generujaca losowy liczby
	return Math.floor(Math.random()*(number+1));
}

function rndColor(){
	rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';	//zmienna rndCol jaka generuje losowyj kolor
	return rndCol;
}

function drawBall() {										//namalowac pilku
    ctx.beginPath();										//tworzenie szlaku
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);				//tworzenie pilki na canvas
    ctx.fillStyle = rndColor();								//kolor pilki (losowyj)
    ctx.fill();												//zastosowanie koloru
    ctx.closePath();
}

function drawPaddle() {										//namalowac plaszczyznu
    ctx.beginPath();
    ctx.rect(paddle_x, canvas.height - paddle_h, paddle_w, paddle_h);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

document.getElementById("MainCanvas").onmousemove = function(event) {moving(event)};	//funkcja dla kierowania plaszczyzna za pomocy myszy
function moving(e) {
    paddle_x = e.clientX - (paddle_w/2);
}

function drawCegly() {										//namalowac cegly
    for(let c=0; c<ceglaColumnIlosc; c++) {
        for(let w=0; w<ceglaWierszIlosc; w++) {
			if(cegly[c][w].temp == 1) {
				let ceglaX = (c * (ceglaWidth+ceglaPadding))+ceglaOffsetLeft;
				let ceglaY = (w * (ceglaHeight+ceglaPadding))+ceglaOffsetTop;
			
				cegly[c][w].x = ceglaX;
				cegly[c][w].y = ceglaY;
			
				ctx.beginPath();
				ctx.rect(ceglaX, ceglaY, ceglaWidth, ceglaHeight);
				ctx.fillStyle = "lime";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function dotyk() {											//funkcja dotyku pilki do cegly
  for(let c=0; c<ceglaColumnIlosc; c++) {
    for(let w=0; w<ceglaWierszIlosc; w++) {
      let b = cegly[c][w];
      if(b.temp == 1) {
        if(x > b.x && x < b.x + ceglaWidth && y > b.y && y < b.y + ceglaHeight) {
          vy = -vy;
          b.temp = 0;
		  playAudio();
		  score++;
		  if(score === ceglaColumnIlosc*ceglaWierszIlosc) {	//kiedy rozbijamy wszystkie cegly to wygramy :)
          alert("Gratulacje!");
          document.location.reload();
		  }
        }
      }
    }
  }
}

function drawScore() {												//namalowac punkty na canvas
    ctx.font = sizeFont + "px Suez One";
    ctx.fillStyle = "white";
    ctx.fillText("Punkty: " + score, positionx, positiony);
}

function drawZycie() {												//namalowac zycia na canvas
    ctx.font = sizeFont + "px Suez One";
    ctx.fillStyle = "white";
    ctx.fillText("Zycia: " + zycie, positionx-(canvas.width)/12, positiony);
}

function draw() {													//glowna funkcja
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle();
    drawBall();
	drawCegly();
	dotyk();
	drawScore();
	drawZycie();		
	if(x + vx > canvas.width - ballRadius || x + vx < ballRadius) {	//odbicie od scian
        vx = -vx;
    }	
    if(y + vy < ballRadius) {
        vy = -vy;
    }	
	if(y + vy > (canvas.height - paddle_h - ballRadius)){			//odbicie od plaszczyzny 
		if(x > paddle_x && x < paddle_x + paddle_w){
			vy = -vy;											
		}
		else if (y + vy > canvas.height-ballRadius){
		zycie--;													//2 zycia (gdy pilka potrafi nie na plaszczyznu)
		x = (canvas.width)/2;										//zwraca pilki na polozenie poczatkowe
		y = (canvas.height)-30;
		vx = (canvas.height)*0.004;	
		vy = -(canvas.height)*0.004;	
			if(zycie===0){
			alert("Przegrales :(");
			document.location.reload();
			}
		}
	}
	x += vx;														//zmiana polozenia
    y += vy;	
}

setInterval(draw, 10);												//powtorzenie funkcji
