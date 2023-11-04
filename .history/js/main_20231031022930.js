

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
let userChoice = '';
let computerResult = '';
let rotation = 0;

function selectChoice(choice) {
    userChoice = choice;
}

function getRandomChoice() {
    const choices = ['묵', '묵', '찌', '찌', '빠', '빠'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function startRoulette() {
    if (!userChoice) {
        alert('먼저 묵, 찌, 빠 중 하나를 선택해 주세요.');
        return;
    }

    const spins = 5; // 5회전
    const singleSpin = 360; // 1회전
    rotation += (spins * singleSpin);

    const computedRotation = rotation + getOffsetForChoice();
    document.querySelector('.rollet_game_pan img').style.transform = `rotate(${computedRotation}deg)`;
}

function getOffsetForChoice() {
    computerResult = getRandomChoice();
    switch (computerResult) {
        case '묵': return 60;  // 60도로 예제를 설정. 실제 게임에 맞게 조정 필요.
        case '찌': return 120; // 120도로 예제를 설정. 실제 게임에 맞게 조정 필요.
        case '빠': return 240; // 240도로 예제를 설정. 실제 게임에 맞게 조정 필요.
        default: return 0;
    }
}

function determineWinner() {
    if (userChoice === computerResult) {
        return '무';
    } else if ((userChoice === '찌' && computerResult === '빠') || 
               (userChoice === '묵' && computerResult === '찌') ||
               (userChoice === '빠' && computerResult === '묵')) {
        return '승';
    } else {
        return '패';
    }
}

// 룰렛 회전이 끝난 후 결과를 팝업으로 표시
document.querySelector('.rollet_game_pan img').addEventListener('transitionend', function() {
    const result = determineWinner();

    // 이미지 업데이트 부분
    document.querySelector('.my_select_img').innerHTML = `<img src="./image/rollet_${userChoice}.png">`;
    document.querySelector('.computer_select_img').innerHTML = `<img src="./image/rollet_${computerResult}.png">`;
    document.querySelector('.result_score').textContent = result;

    // 팝업 보이기
    document.querySelector('.rollet_gmae_modal').style.display = 'block';
});

// 게임 시작 시 롤렛 시작 함수 호출
document.querySelector('.start_rollet').addEventListener('click', startRoulette);

