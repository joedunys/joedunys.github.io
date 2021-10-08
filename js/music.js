// JavaScript Document
var items = [];

window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}

$(document).ready(function() {
	var player1 = document.getElementById("audioplayer1");
	var cur = 0;
	var prev = cur-1;
	var next = cur+1;

	//Load sections at start
	var main = document.getElementById('main');
	var sections = main.getElementsByTagName('section');

	main.classList.toggle('js');

	for (let i = 0, len = sections.length; i < len; i++) {
		sections[i].id = "section_"+i;
		if(i === 0) {
			sections[i].classList.toggle('active');
		}
	}
	updates(); //update heights and stuff

	//Play first song on load
	player1.classList.toggle('active');
	player1.src = items[0][2];
	player1.load();
	player1.addEventListener('canplaythrough', function() {
		console.log(items[0][2].replace('audio/','').replace('.mp3','').replace(/_/gi,' ') + ' Loaded');
		player1.play();
		document.getElementById("currentTrack").querySelector("span").innerHTML = items[0][2].replace('audio/','').replace('.mp3','').replace(/_/gi,' ');
	}, false);

	// Scrolling Function
	$(window).scroll(function() {
		var bot = $(window).scrollTop() + $(window).innerHeight();
		var top = $(window).scrollTop();

		//if ((items[cur][0] < top && top < items[cur][1]) || (items[cur][0] < bot && bot < items[cur][1])){
		if ( bot < items[cur][0] && cur > 0 ){ //scroll up
			cur --;
			next--;
			prev--;
			document.getElementsByTagName("section")[cur].classList.toggle('active');
			document.getElementsByTagName("section")[next].classList.toggle('active');
			play_song(items[cur][2]);
		} else if ( bot > items[cur][1] && cur < (items.length-1) ) { //scroll down
			cur++;
			next++;
			prev++;
			document.getElementsByTagName("section")[cur].classList.toggle('active');
			document.getElementsByTagName("section")[prev].classList.toggle('active');
			play_song(items[cur][2]);
		}
	});

	window.addEventListener("resize", updates);
	document.addEventListener("load", updates);
	window.addEventListener("orientationchange", updates);

	//Buttons to force music
	var musicbtns = document.getElementsByClassName("music");
	for(var i = 0; i < musicbtns.length; i++) {
		var anchor = musicbtns[i];
		anchor.onclick = function() {
			var song = this.getAttribute('href');
			play_song(song);
			event.preventDefault();
			event.stopPropagation();
		}
	}
});

function play_song(mp3Url){
	var player1 = document.getElementById("audioplayer1");
	var player2 = document.getElementById("audioplayer2");
	var src1 = player1.getAttribute('src');
	var src2 = player2.getAttribute('src');
	var message = document.getElementById("currentTrack").querySelector("span");
	var song = mp3Url.replace('audio/','').replace('.mp3','').replace(/_/gi,' ');

	if( player2.classList.contains('active') ) {

		if (src2 != mp3Url){
			player1.classList.toggle('active');
			player1.src = mp3Url;
			player1.load();
			player1.addEventListener('canplaythrough', function() {
				player1.play();
				audiofade(player2,player1);
				message.innerHTML = song;
				player2.classList.toggle('active');
			}, false);

		}
	} else {
		if (src1 != mp3Url){
			player2.classList.toggle('active');
			player2.src = mp3Url;
			player2.load();
			player2.addEventListener('canplaythrough', function() {
				player2.play();
				audiofade(player1,player2);
				message.innerHTML = song;
				player1.classList.toggle('active');
			}, false);
		}
	}
}

function audiofade(x,y){
	if(x.volume){
		var InT = 1;
		var OutT = 0;
		var setVolume = 0;  // Target volume level for old song 
		var speed = 0.005;  // Rate of volume decrease
		x.volume = InT;
		y.volume = OutT;
		var fAudio = setInterval(function(){
			InT -= speed;
			OutT += speed;
			x.volume = InT.toFixed(1);
			y.volume = OutT.toFixed(1);
			if(InT.toFixed(1) <= setVolume){
				clearInterval(fAudio);
				x.pause();
				x.src="";
				//alert('clearInterval fAudio'+ InT.toFixed(1));
			}
		},25);
	}
}

function muteaudio(){
	var player1 = document.getElementById("audioplayer1");
	var player2 = document.getElementById("audioplayer2");
	var mute = document.getElementById("mute");
	var unmute = document.getElementById("unmute");

	player1.muted=!player1.muted;
	player2.muted=!player2.muted;
	mute.classList.toggle('active');
	unmute.classList.toggle('active');
	
}

function updates(){
	console.log("Updated");
	var ups = [];
	$("section").each(function(){
		var te = [];
		var tt = this.offsetTop;
		var tb = this.offsetTop + this.offsetHeight;
		var ta = this.getElementsByTagName("a")[0].getAttribute("href");

		te.push(tt,tb,ta);
		ups.push(te);
	})
	items = ups;
}
