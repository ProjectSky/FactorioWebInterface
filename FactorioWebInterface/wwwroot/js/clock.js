function GetClock() {
    var d = new Date();
    document.getElementById('time').innerHTML = d.toLocaleString()
}

$(document).ready(function () {
    GetClock();
    setInterval(GetClock, 100);
})