let slider = document.getElementById("mySlider");
let text = document.getElementById("text");
let roundswitch = document.getElementById("roundswitch");
let hidtext = document.getElementById("hidtext");
let roundbutton = document.getElementById("roundbutton");

function sliderUpdated() {
    text.style.letterSpacing = slider.value + "px";
}

function changecolor() {
    if (roundswitch.checked){
        document.body.style.background = "black";
        text.style.color = "white";
        hidtext.style.opacity = "1";
    }
    else {
        document.body.style.background = "white";
        text.style.color = "black";
        hidtext.style.opacity = "0";
    }
}

function createHex() {
    var hexCode1 = "";
    var hexValues1 = "0123456789abcdef";
    
    for ( var i = 0; i < 6; i++ ) {
      hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
    }
    return hexCode1;
  }

function surprise() {
  
    var deg = Math.floor(Math.random() *360);
        
    var gradient = "linear-gradient(" + deg + "deg, " + "#" + createHex() + ", " + "#" + createHex() +")";

    document.body.style.background = gradient;
        
    console.log(hexCode1, hexCode2); 
}

sliderUpdated();
slider.addEventListener("input", sliderUpdated);
roundswitch.addEventListener("input", changecolor);
roundbutton.addEventListener("click", surprise);