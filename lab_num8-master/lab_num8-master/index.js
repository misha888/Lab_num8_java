let $btn = document.querySelector('#add-btn');
let $area = document.querySelector('.area');

let boxes = [];
let boxesText = [];

let boxWidth = 200;
let boxHeight = 200;
let areaWidth = $area.offsetWidth;
let areaHeight = $area.offsetHeight;
let action = false;
let $selectedBox = null;
let selectedBoxIndex = null;

let startCoords ={
    x: 0,
    y: 0
}
let currentCoords ={
    x: 0,
    y: 0
}
let distance ={
    x: 0,
    y: 0
}

if (!!localStorage.getItem('coords')) {
    boxes = JSON.parse(localStorage.getItem("coords"));
    boxesText = JSON.parse(localStorage.getItem('text'));
    boxGenerator(boxes);
}

function boxGenerator(list){
    let template = '';
    for(let i = 0; i < list.length; i++){
        template += '<div class="box" id=' + String(i) + "div" + ' style="transform: translate(' + list[i].x + 'px, ' + list[i].y + 'px)">';
        template += '<textarea placeholder="Заметка" class="textArea" id=' + String(i) + "box" + '>' + boxesText[i] + '</textarea></div>';
    }
    $area.innerHTML = template;
    console.log($area);
}
function boxController(coords){
    $selectedBox.style.cssText = 'transform: translate(' + coords.x + 'px, ' + coords.y + 'px)';
}

$area.addEventListener('click', function(e){
    if(!!e.target.classList.contains('textArea')){
        e.target.oninput = function() {
            boxesText[e.target.id.slice(0, 1)] = document.getElementById(`${String(e.target.id.slice(0, 1)) + "box"}`).value;
            localStorage.setItem('text', JSON.stringify(boxesText));
        }
    }
});
$area.addEventListener('mousedown', function(e){
    if(!!e.target.classList.contains('box')){
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = e.target.id;
        //console.log(selectedBoxIndex);
        startCoords.x = e.clientX;
        startCoords.y = e.clientY;
    }
});
$area.addEventListener('mouseup', function(e){
    if(!!e.target.classList.contains('box')){
        action = false;
        boxes[selectedBoxIndex.slice(0, 1)].x = distance.x;
        boxes[selectedBoxIndex.slice(0, 1)].y = distance.y;
        localStorage.setItem('coords', JSON.stringify(boxes));
    }
});

$area.addEventListener('mousemove', function(e){
    if(action){
        currentCoords.x = e.clientX;
        currentCoords.y = e.clientY;

        distance.x = boxes[selectedBoxIndex.slice(0, 1)].x + (currentCoords.x - startCoords.x);
        distance.y = boxes[selectedBoxIndex.slice(0, 1)].y + (currentCoords.y - startCoords.y);
        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;
        if (distance.x <= 0) distance.x = 0;

        if (distance.y >= (areaHeight- boxHeight)) distance.y = areaHeight - boxHeight;
        if (distance.y <= 0) distance.y = 0;

        boxController(distance);
    }
});
$btn.addEventListener('click', function(){
    if(!!boxes.length){
        boxes.push({
            x: 0,
            y: 0,
        })
        boxesText.push("");
    }
    else{
        boxes =[{
            x: 0,
            y: 0,
        }];
        boxesText = [""];
    }
    boxGenerator(boxes);

    localStorage.setItem('coords', JSON.stringify(boxes));
    localStorage.setItem('text', JSON.stringify(boxesText));
});