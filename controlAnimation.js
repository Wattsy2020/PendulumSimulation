function pause(){
    if (!paused){
        clearInterval(interval);
    }
    else {
        startAnimation();
    }
    paused = !paused;
}

let paused = false;