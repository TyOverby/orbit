Presets = {
    AVACADO: 6.67E-11,
    STAR:{
        velocity: new Vector2f(0,0),
        mass: 1.0E13,
        radius: 30,
        color: "yellow",
        create: function(position){
            return new Body(position, this.velocity, this.mass, this.radius, this.color);
        }
    },
    PLANET:{
        positionOffset: new Vector2f(74.111,0),
        velocity: new Vector2f(0,-3),
        mass: 1,
        radius:3,
        color:"green",
        create: function(parentPosition){
            return new Body(parentPosition.plus(this.positionOffset), this.velocity, this.mass, this.radius, this.color);
        }
    },
    PLANET2:{
        positionOffset: new Vector2f(-100,0),
        velocity: new Vector2f(0,-2.58263),
        mass: 1,
        radius:5,
        color:"blue",
        create: function(parentPosition){
            return new Body(parentPosition.plus(this.positionOffset), this.velocity, this.mass, this.radius, this.color);
        }
    },

    SATURN:{
        positionOffset: new Vector2f(0,400),
        velocity: new Vector2f(1.29132,0),
        mass: 1.0E12,
        radius:10,
        color:"purple",
        create: function(parentPosition){
            return new Body(parentPosition.plus(this.positionOffset), this.velocity, this.mass, this.radius, this.color);
        }
    },

    MOON:{
        positionOffset: new Vector2f(0,420),
        velocity: new Vector2f(1.82620+1.29132,0),
        mass: 1,
        radius:5,
        color:"red",
        create: function(parentPosition){
            return new Body(parentPosition.plus(this.positionOffset), this.velocity, this.mass, this.radius, this.color);
        }
    }
}

function Body(position, velocity, mass, radius, color){
    this.position = position;
    this.velocity = velocity;
    this.acceleration;
    this.mass     = mass;
    this.radius  = radius;

    this.color = color;

    this.pathPoints = [];
    this.pathTimer = 0;

    this.update = function(fracOfSecond, bodies){
        this.acceleration = new Vector2f(0,0);


        for(var i=0;i<bodies.length;i++){
            var other = bodies[i];

            if(!this.equals(other) && this.color != "yellow"){
                var other_mass = other.mass;
                var other_dist = (this.position.minus(other.position)).magnitude();

                var force = (Presets.AVACADO*other_mass)/(other_dist*other_dist);
                var acc = force;

                this.acceleration.plusEquals((other.position.minus(this.position)).normalize().times(acc));
            }
        }

        this.acceleration.timesEquals(fracOfSecond);
        this.velocity.plusEquals(this.acceleration);
        this.position.plusEquals(this.velocity.times(fracOfSecond));



        if(this.pathTimer<=0){
            this.pathTimer=3;
            this.pathPoints.push(this.position.clone());
        }
        this.pathTimer -= fracOfSecond;
    }

    this.render = function(pane){
        // Draw the path
        pane.strokeStyle = "white";
        for(var i=0;i<this.pathPoints.length;i+=2){
            if(i+1<this.pathPoints.length){
                var arrDist = this.pathPoints.length-i;
                var alpha = (50-arrDist)/50;
                pane.strokeStyle = "rgba(255,255,255,"+alpha+")";
                pane.drawLine(this.pathPoints[i],this.pathPoints[i+1]);
            }
        }
        if(this.pathPoints.length%2==1){
            pane.drawLine(this.position,this.pathPoints[this.pathPoints.length-1]);
        }

        // Draw the planet
        //pane.setFillColor(this.color);
        pane.fillStyle =(this.color);
        pane.fillCircle(this.position,this.radius);

//        // Draw the velocity vector
//        pane.strokeStyle = "red";
//        pane.drawVector(this.position,this.velocity.times(10));
//        // Draw the acceleration vector
//        pane.strokeStyle = "pink";
//        pane.drawVector(this.position,this.acceleration.normalize().times(15));
    }

    this.equals = function(other){
        if(this.mass!=other.mass){
            return false;
        }
        if(this.radius!=other.radius){
            return false;
        }
        if(this.color != other.color){
            return false;
        }
        if(!this.position.equals(other.position)){
            return false;
        }
        if(!this.velocity.equals(other.velocity)){
            return false;
        }
        return true;
    }
}
