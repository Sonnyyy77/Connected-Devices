let slider = document.getElementById("mySlider");
let text = document.getElementById("text");
let roundswitch = document.getElementById("roundswitch");

function sliderUpdated() {
  text.style.letterSpacing = slider.value + "px";
}

function changecolor() {
    if (roundswitch.checked){
        document.body.style.backgroundColor = "black";
        text.style.color = "white";
    }
    else {
        document.body.style.backgroundColor = "white";
        text.style.color = "black";
    }
}

sliderUpdated();
slider.addEventListener("input", sliderUpdated);
roundswitch.addEventListener("input", changecolor)
