class Pendulum {
    constructor (centerYPos, centerXPos, headYPos, headXPos, headElement){
        this.centerYPos = centerYPos;
        this.centerXPos = centerXPos;
        this.headYPos = headYPos;
        this.headXPos = headXPos;
        this.headElement = headElement;
        
        this.length = this.calcLength();
        this.horizontalVelocity = 0;
        this.verticalVelocity = 0;
        this.updateAngle();
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
    calcTension(){
        let totalVelocity = Math.sqrt(Math.pow(this.horizontalVelocity, 2) + Math.pow(this.verticalVelocity, 2)); // pythagoras
        return (gravity*Math.cos(this.angle) + Math.pow(totalVelocity, 2)/this.length);
    }

    // updates the horizontal and vertical forces
    updateForces(){
        // split force due to tension into horizontal and vertical components, then add gravity to the verticalForce
        let tensionForce = this.calcTension();
        this.horizontalForce = -tensionForce*Math.sin(this.angle);
        this.verticalForce = gravity - tensionForce*Math.cos(this.angle);
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

    // updates all the pendulums values
    updatePendulum(){
        this.updateForces();
        this.updateVelocity();
        this.updatePosition();

        // correct small inacurracies by keeping the pendulum's length constant
        this.updateAngle();
        this.headXPos = this.length*Math.sin(this.angle) + this.centerXPos;
        this.headYPos = this.length*Math.cos(this.angle) + this.centerYPos;

        // update the head's position on the page
        this.headElement.style.top = this.headYPos;
        this.headElement.style.left = this.headXPos;

        // log values
        document.getElementById("angle").textContent = "Angle: " + this.angle*180/Math.PI;
        document.getElementById("vForce").textContent = "Vertical Force: " + this.verticalForce;
    }
}
