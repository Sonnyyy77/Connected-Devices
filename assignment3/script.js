const socket = new WebSocket("ws://localhost:1880/testpage");

let slider = document.getElementById("mySlider");
let text = document.getElementById("text");
let roundswitch = document.getElementById("roundswitch");
let hidtext = document.getElementById("hidtext");

socket.addEventListener("message", handleSocketMessage);

function handleSocketMessage(event) {
    // console.log("connected");
    var colorval = event.data.match(/(\d+)/);
    if (event.data[0] == "A"){
        text.style.letterSpacing = colorval[0] + "px";
        slider.value = colorval[0];
    }
    if (event.data[0] == "B"){
        text.style.letterSpacing = "-" + colorval[0] + "px";
        slider.value = colorval[0]*-1;
    }
    if (event.data[0] == "D"){
            roundswitch.checked = true;
            document.body.style.background = "black";
            text.style.color = "white";
            hidtext.style.opacity = "1";
    }
    if (event.data[0] == "C"){
        roundswitch.checked = false;
        document.body.style.background = "white";
        text.style.color = "black";
        hidtext.style.opacity = "0";
    }
    // console.log(colorval[0]);
}

handleSocketMessage();
slider.addEventListener("input", handleSocketMessage);
roundswitch.addEventListener("input", handleSocketMessage);