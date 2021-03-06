// base class of both types of pendulum, need this so I can have two different constructors
// -without being forced to call the constructor of the base class
class AbstractPendulum {
    constructor(){}

    updateRodAngle(){
        this.rodElement.style.transform =  "rotate("+this.angle*-180/Math.PI+"deg)";
    }

    // use pythagoras to find the length of the pendulum
    calcLength(){
        return Math.sqrt(Math.pow(this.calcWidth(), 2) + Math.pow(this.calcHeight(), 2)); 
    }

    // calculate the width and height of the triangle formed by the pendulum and a vertical line through the center
    calcWidth(){return this.headXPos - this.centerXPos;}
    calcHeight(){return this.headYPos - this.centerYPos;}

    // finds the angle in radians between the pendulum and a vertical line
    updateAngle(){
        let width = this.calcWidth();
        let height = this.calcHeight();

        let angle = Math.atan(width/height);

        // put angle in correct quadrant
        if (width < 0 && height < 0){
            angle -= Math.PI;
        }
        else if (width > 0 && height < 0){
            angle += Math.PI;
        }
        
        this.angle = angle;
    }

    // calculates the force due to tension in newtons
    updateTension(){
        let totalVelocity = Math.sqrt(Math.pow(this.horizontalVelocity, 2) + Math.pow(this.verticalVelocity, 2)); // pythagoras
        this.tensionForce = (gravity*Math.cos(this.angle) + Math.pow(totalVelocity, 2)/this.length);
    }

    // updates the horizontal and vertical forces
    updateForces(){
        // split force due to tension into horizontal and vertical components, then add gravity to the verticalForce
        this.horizontalForce = -this.tensionForce*Math.sin(this.angle);
        this.verticalForce = gravity - this.tensionForce*Math.cos(this.angle);
    }

    // updates the horizontal and vertical velocity by applying acceleration
    updateVelocity(){
        // note all Pendulums have a mass of 1 so Force = Acceleration
        this.horizontalVelocity += this.horizontalForce*timeInterval;
        this.verticalVelocity += this.verticalForce*timeInterval;
    }

    // updates the horizontal and vertical position by applying velocity
    updatePosition(){
        // use x = u + v*t
        this.headXPos += this.horizontalVelocity*timeInterval;
        this.headYPos += this.verticalVelocity*timeInterval;
    }

    // recalculates the values after a short amount of time (simulated time, not actual time) has passed
    // must be overriden in sub classes to work
    calculateValues(){
        this.updateVelocity();
        this.updatePosition();

        // correct small inacurracies by keeping the pendulum's length constant
        this.updateAngle();
        this.headXPos = this.length*Math.sin(this.angle) + this.centerXPos;
        this.headYPos = this.length*Math.cos(this.angle) + this.centerYPos;
    }

    // updates the position of the pendulum's elements
    updateElementPositions(){
        // update the head's position on the page, stuff after this.headYPos is to correct it so the center is positioned properly
        this.headElement.style.top = this.headYPos - this.headElement.offsetHeight/2 + this.rodElement.offsetWidth/2;
        this.headElement.style.left = this.headXPos - this.headElement.offsetWidth/2 + this.rodElement.offsetWidth/2;

        // update the rod
        this.updateRodAngle();
    }
}

// represents a pendulum with a fixed center
class Pendulum extends AbstractPendulum {
    constructor(centerYPos, centerXPos, headYPos, headXPos, centerElement, rodElement, headElement){
        super();
        this.centerYPos = centerYPos;
        this.centerXPos = centerXPos;
        this.headYPos = headYPos;
        this.headXPos = headXPos;

        this.centerElement = centerElement;
        this.centerElement.style.top = centerYPos;
        this.centerElement.style.left = centerXPos;
        this.headElement = headElement;
        
        this.length = this.calcLength();
        this.horizontalVelocity = 0;
        this.verticalVelocity = 0;
        this.updateAngle();

        this.rodElement = rodElement;
        this.rodElement.style.height = this.length;
        this.rodElement.style.top = centerYPos + this.centerElement.offsetHeight/2;
        this.rodElement.style.left = centerXPos;
        this.updateRodAngle();
    }

    calculateValues(child){
        this.updateTension();
        this.updateForces();

        // add tension of the child pendulum to force
        this.horizontalForce += child.tensionForce*Math.sin(child.angle);
        this.verticalForce += child.tensionForce*Math.cos(child.angle);

        super.calculateValues();
    }
}

// represents a pendulum with a moving center, i.e. attached to another pendulum
class MovingPendulum extends AbstractPendulum {
    constructor(parentPendulum, headYPos, headXPos, rodElement, headElement){
        super();
        this.parent = parentPendulum;
        this.updateCenter();

        this.headYPos = headYPos;
        this.headXPos = headXPos;
        this.headElement = headElement;
        
        this.length = this.calcLength();
        this.horizontalVelocity = 0;
        this.verticalVelocity = 0;
        this.updateAngle();

        this.rodElement = rodElement;
        this.rodElement.style.height = this.length;
        this.rodElement.style.top = this.centerYPos;
        this.rodElement.style.left = this.centerXPos;
        this.updateRodAngle();

        this.updateTension();
    }   

    updateCenter(){
        this.centerXPos = this.parent.headXPos;
        this.centerYPos = this.parent.headYPos;
    }

    calculateValues(){
        this.updateCenter();
        this.updateTension();
        this.updateForces();
    
        super.calculateValues();
    }

    updateRodAngle(){
        this.rodElement.style.transform =  "rotate("+(this.angle*-180/Math.PI + 180)+"deg)";
    }

    updateElementPositions(){
        super.updateElementPositions();

        // reposition the rod
        this.rodElement.style.left = this.headXPos;
        this.rodElement.style.top = this.headYPos + parentPendulum.headElement.offsetHeight/2;
    }
}

class System {
    constructor(basePendulum, childPendulum){
        this.basePendulum = basePendulum;
        this.childPendulum = childPendulum;
    }

    // updates every pendulum's position
    updatePendulums(){
        // update each pendulum's values in tiny time increments to increase accuracy
        for (let i = 0; i < numCalculations; i++){
            this.basePendulum.calculateValues(this.childPendulum);
            this.childPendulum.calculateValues();
        }

        this.basePendulum.updateElementPositions();
        this.childPendulum.updateElementPositions();
    }
}