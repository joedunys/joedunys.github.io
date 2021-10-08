// JavaScript Document
var items = [];

window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}

$(document).ready(function() {
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
	play_song( items[0].link );

	// Scrolling Function
	var lastScrollTop = 0;

	window.addEventListener("scroll", function(){
		var st = window.pageYOffset || document.documentElement.scrollTop;
		var bot = window.pageYOffset + ( window.innerHeight * 0.8 );
		var top = window.pageYOffset;

		if (st > lastScrollTop){
			// downscroll
			if ( bot > items[cur].down && cur < (items.length-1) ) {
				cur++;
				next++;
				prev++;
				document.getElementsByTagName("section")[cur].classList.toggle('active');
				document.getElementsByTagName("section")[prev].classList.toggle('active');
				play_song(items[cur].link,'false');
			}
		} else {
			// upscroll
			if ( bot < items[cur].up && cur != 0 ) {
				cur--;
				next--;
				prev--;
				document.getElementsByTagName("section")[cur].classList.toggle('active');
				document.getElementsByTagName("section")[next].classList.toggle('active');
				play_song(items[cur].link,'false');
			}
		}
		lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
	}, false);

	window.addEventListener("resize", updates);
	document.addEventListener("load", updates);
	window.addEventListener("orientationchange", updates);

	//Buttons to force music
	var musicbtns = document.getElementsByClassName("music");
	for(var i = 0; i < musicbtns.length; i++) {
		var anchor = musicbtns[i];
		anchor.onclick = function() {
			var song = this.getAttribute('href');
			play_song(song,'TRUE');
			event.preventDefault();
			event.stopPropagation();
		}
	}
});

function play_song(mp3Url,force){
	var message = document.getElementById("currentTrack").querySelector("span");
	var song = mp3Url.replace('audio/','').replace('.mp3','').replace(/_/gi,' ');

	//find which track it is
	var current;
	for (var i = 0; i < items.length; i++){
		if( items[i].link === mp3Url ){
			current = items[i].id;
		}
	}

	//pick a player
	var newplayer, oldplayer;
	if(current % 2 === 0){
		newplayer = document.getElementById("audioplayer2");
		oldplayer = document.getElementById("audioplayer1");
	} else {
		newplayer = document.getElementById("audioplayer1");
		oldplayer = document.getElementById("audioplayer2");
	}

	newplayer.src = mp3Url;
	newplayer.load();
	newplayer.addEventListener('canplaythrough', function() {
		if (force == 'TRUE'){
			newplayer.play();
			newplayer.volume = 1;

			//stop old music
			oldplayer.pause();
			oldplayer.volume = 0;
			oldplayer.src = "";

			//update the song name
			message.innerHTML = song;
		} else {
			audiofade(oldplayer,newplayer,song);
		}
	}, false);
}

function audiofade(x,y,song){
	var message = document.getElementById("currentTrack").querySelector("span");

	if(x.volume){
		var InT = 1;
		var OutT = 0;
		var setVolume = 0;  // Target volume level for old song 
		var speed = 0.005;  // Rate of volume decrease

		// Initialise
		x.volume = InT;
		y.volume = OutT;
		y.play();
		message.innerHTML = song;

		// Timer
		var fAudio = setInterval(function(){
			InT -= speed;
			OutT += speed;
			x.volume = InT.toFixed(1);
			y.volume = OutT.toFixed(1);

			//if has finished
			if(InT.toFixed(1) <= setVolume){
				clearInterval(fAudio);

				//delete old
				x.pause();
				x.src="";
				x.classList.remove('active');

				y.classList.add('active');
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
	var ups = [];
	var i = 0;

	$("section").each(function(){
		var tt = this.offsetTop;
		var tb = this.offsetTop + this.offsetHeight;
		var ta = this.getElementsByTagName("a")[0].getAttribute("href");
		var tn = ta.replace('audio/','').replace('.mp3','').replace(/_/gi,' ');

		var te = {
			id: i,
			title: tn,
			up: tt,
			down: tb,
			link: ta,
		};
		ups.push(te);
		i++;
	})
	items = ups;
}
