

// 1. main click prebook 
document.querySelector('.reservation_btn').addEventListener('click', function() {
    // 해당 섹션으로 이동
    const targetSection = document.getElementById('prebook');
    targetSection.scrollIntoView({ behavior: 'smooth' });
});


//2. 휴대폰 입력창

const phoneInput = document.querySelector('#phoneInput');

phoneInput.addEventListener('input', function() {
    // 숫자만 입력 가능하도록
    this.value = this.value.replace(/[^0-9]/g, '');

    // 최대 8자리로 제한
    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});


// 3. modal

// Modal을 가져옵니다.
var modals = document.getElementsByClassName("modal");
// Modal을 띄우는 클래스 이름을 가져옵니다.
var btns = document.getElementsByClassName("view_more");
// Modal을 닫는 close 클래스를 가져옵니다.
var spanes = document.getElementsByClassName("close");
var funcs = [];
 
// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function Modal(num) {
  return function() {
    // 해당 클래스의 내용을 클릭하면 Modal을 띄웁니다.
    btns[num].onclick =  function() {
        modals[num].style.display = "block";
        console.log(num);
    };
 
    // <span> 태그(X 버튼)를 클릭하면 Modal이 닫습니다.
    spanes[num].onclick = function() {
        modals[num].style.display = "none";
    };
  };
} 

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for(var i = 0; i < btns.length; i++) {
  funcs[i] = Modal(i);
}
 
// 원하는 Modal 수만큼 funcs 함수를 호출합니다.
for(var j = 0; j < btns.length; j++) {
  funcs[j]();
}
 
 
// Modal 영역 밖을 클릭하면 Modal을 닫습니다.
window.onclick = function(event) {
  if (event.target.className == "modal") {
      event.target.style.display = "none";
  }
};


//4. menu scroll
$(document).ready(function(){
    // 스크롤 애니메이션
    $('a[href^="#"]').on('click', function(e){
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function(){
            window.location.hash = target;
        });
    });
});


//5. float banner close
document.querySelector('.close_float').addEventListener('click', function() {
  document.querySelector('.floating_banner').style.display = 'none';
});


// 6. rollet
let userChoice = null; // 유저가 선택한 묵, 찌, 빠

function selectChoice(choice) {
    userChoice = choice;
    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none'; // 모든 버튼 border 제거
    });
    event.target.style.border = '3px solid red'; // 선택한 버튼에 border 적용
}

function startRoulette() {
    // STEP1 선택 검사
    if (!userChoice) {
        alert('STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요');
        return;
    }
    
    const rouletteImg = document.getElementById('rouletteImg');
    let rotation = 0;
    let speed = 5;
    const interval = setInterval(() => {
        rotation += speed;
        rouletteImg.style.transform = `rotate(${rotation}deg)`;
        speed -= 0.05; // 점점 천천히
        if (speed <= 0) {
            clearInterval(interval);
            showResult();
        }
    }, 20);
}

function showResult() {
    const degree = (360 + (-document.getElementById('rouletteImg').style.transform.replace(/[^0-9.]/g, ''))) % 360;
    let result; 
    if ((degree >= 0 && degree < 60) || (degree >= 180 && degree < 240)) {
        result = '묵';
    } else if ((degree >= 60 && degree < 120) || (degree >= 240 && degree < 300)) {
        result = '찌';
    } else {
        result = '빠';
    }

    const modal = document.querySelector('.rollet_gmae_modal');
    const myImg = document.querySelector('.my_select_img');
    const computerImg = document.querySelector('.computer_select_img');
    const resultScore = document.querySelector('.result_score');

    myImg.innerHTML = `<img src="./image/rollet_my${translateChoice(userChoice)}.png">`;
    computerImg.innerHTML = `<img src="./image/rollet_my${translateChoice(result)}.png">`;
    
    if (userChoice === result) {
        resultScore.innerText = '무';
    } else if ((userChoice === '묵' && result === '찌') || (userChoice === '찌' && result === '빠') || (userChoice === '빠' && result === '묵')) {
        resultScore.innerText = '승';
    } else {
        resultScore.innerText = '패';
    }
    modal.style.display = 'block';
}

function translateChoice(choice) {
    switch(choice) {
        case '묵':
            return '';
        case '빠':
            return '1';
        case '찌':
            return '2';
    }
}
