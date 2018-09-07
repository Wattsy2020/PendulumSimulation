function pause(){
    if (!paused){
        clearInterval(interval);
    }
    else {
        interval = setInterval(function(){p1.updatePendulum();}, timeInterval*1000);
    }
    paused = !paused;
}

let paused = false;