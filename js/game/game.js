Vector2f = GameMath.Vector2f;
somevar = true;
function BasicGame(){
    var screenDims;

    var backgroundWhite;
    var backgroundBlack;

    var bodies = [];

    this.preload = function(pane){
        screenDims = new Vector2f(window.innerWidth-5,window.innerHeight-5);
        pane.setSize(screenDims.x,screenDims.y);

        backgroundWhite = new Image();
        backgroundWhite.src = '../img/backgroundWhite.png'
        backgroundBlack = new Image();
        backgroundBlack.src = '../img/backgroundBlack.png'
    }

	this.startup = function(){
        console.log("starting up");
        this.preload(document.getElementById("canvas").getContext("2d"));

        var startPos = screenDims.times(0.5).clone();

        bodies.push(Presets.STAR.create(startPos));
        bodies.push(Presets.PLANET.create(startPos));
        bodies.push(Presets.PLANET2.create(startPos));
        bodies.push(Presets.SATURN.create(startPos));
        bodies.push(Presets.MOON.create(startPos));
	}

	this.update = function(fracOfSecond,pane){
        for(var i=0;i<bodies.length;i++){
            bodies[i].update(fracOfSecond,bodies);
        }

        fadeoutTime -= fracOfSecond;
        if(fadeoutTime<0){
            fadeoutTime =0;
        }
	}

    var maxFadeoutTime =10;
    var fadeoutTime = maxFadeoutTime;

	this.render = function(pane){
        pane.fillStyle="#111";
        pane.cover();

        for(var i=0;i<bodies.length;i++){
            bodies[i].render(pane);
        }

        pane.tileBackground(backgroundWhite,1);
        if(somevar){
        pane.tileBackground(backgroundBlack);

        pane.tileBackground(backgroundBlack);
        }

        pane.fillStyle = "rgba(0,0,0,"+fadeoutTime/maxFadeoutTime+")";
        pane.cover();
	}
}


function initializeEngine(){
    game = new Engine(new BasicGame(),"canvas");
    console.log("initialized!");
}

