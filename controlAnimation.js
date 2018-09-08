function pause(){
    if (!paused){
        clearInterval(interval);
    }
    else {
        startAnimation();
    }
    paused = !paused;
}

function changeSpeed(multiplier){
    timeInterval *= multiplier;

    let speedDisplay = document.getElementById("speedDisplay");
    currentMultiplier = parseFloat(speedDisplay.textContent);
    speedDisplay.textContent = currentMultiplier*multiplier;
}

let paused = false;