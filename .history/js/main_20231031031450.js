

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
let computerChoice = '';

function startRoulette() {
    if (userChoice === '') {
        alert("STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요");
        return;
    }
    
    let roulette = document.getElementById('rouletteImg');

    // 5바퀴 회전 후 랜덤한 위치에서 멈추기 위한 계산
    let deg = 1800 + Math.floor(Math.random() * 360);

    roulette.style.transition = 'transform 3s ease-out';
    roulette.style.transform = `rotate(${deg}deg)`;

    // 룰렛이 멈춘 위치를 기반으로 컴퓨터의 선택 설정
    let normalizedDeg = deg % 360;  // 0~359 사이의 값으로 변환
    if (normalizedDeg >= 0 && normalizedDeg < 120) {
        computerChoice = '묵';
    } else if (normalizedDeg >= 120 && normalizedDeg < 240) {
        computerChoice = '찌';
    } else {
        computerChoice = '빠';
    }

    setTimeout(() => {
        showResult();
    }, 3000);
}


function showResult(computerChoice) {
  let modal = document.querySelector('.rollet_gmae_modal');
  let mySelectImg = document.querySelector('.my_select_img');
  let computerSelectImg = document.querySelector('.computer_select_img');
  let resultScore = document.querySelector('.result_score');

  // 사용자 선택 이미지 설정
  switch (userChoice) {
      case '묵':
          mySelectImg.innerHTML = '<img src="./image/rollet_my.png">';
          break;
      case '찌':
          mySelectImg.innerHTML = '<img src="./image/rollet_my2.png">';
          break;
      case '빠':
          mySelectImg.innerHTML = '<img src="./image/rollet_my1.png">';
          break;
  }

  // 컴퓨터 선택 이미지 설정
  switch (computerChoice) {
      case 0:  // 묵
          computerSelectImg.innerHTML = '<img src="./image/rollet_my.png">';
          break;
      case 1:  // 찌
          computerSelectImg.innerHTML = '<img src="./image/rollet_my2.png">';
          break;
      case 2:  // 빠
          computerSelectImg.innerHTML = '<img src="./image/rollet_my1.png">';
          break;
  }

  // 승리, 패배, 무승부 판정
  if (userChoice === '묵' && computerChoice === 1 || userChoice === '찌' && computerChoice === 2 || userChoice === '빠' && computerChoice === 0) {
      resultScore.textContent = '패';
  } else if (userChoice === '묵' && computerChoice === 2 || userChoice === '찌' && computerChoice === 0 || userChoice === '빠' && computerChoice === 1) {
      resultScore.textContent = '승';
  } else {
      resultScore.textContent = '무';
  }

  // 팝업 표시
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
