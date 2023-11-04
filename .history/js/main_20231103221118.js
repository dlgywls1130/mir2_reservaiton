

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

function selectChoice(choice) {
    userChoice = choice;
    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none'; // 모든 버튼 border 제거
    });
    event.target.style.border = '3px solid red'; // 선택한 버튼에 border 적용
}

function startRoulette() {
    if (userChoice === '') {
        alert("STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요");
        return;
    }

    let roulette = document.getElementById('rouletteImg');
    let deg = 1800 + Math.floor(Math.random() * 360);

    roulette.style.transition = 'transform 3s ease-out';
    roulette.style.transform = `rotate(${deg}deg)`;

    let normalizedDeg = deg % 360;  
    if ((normalizedDeg >= 0 && normalizedDeg < 60) || (normalizedDeg >= 180 && normalizedDeg < 240)) {
        computerChoice = '찌';
    } else if ((normalizedDeg >= 60 && normalizedDeg < 120) || (normalizedDeg >= 240 && normalizedDeg < 300)) {
        computerChoice = '묵';
    } else {
        computerChoice = '빠';
    }

    setTimeout(() => {
        showResult();
    }, 3000);
}

function showResult() {
    let modal = document.querySelector('.rollet_gmae_modal');
    let mySelectImg = document.querySelector('.my_select_img');
    let computerSelectImg = document.querySelector('.computer_select_img');
    let resultScore = document.querySelector('.result_score');

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

    switch (computerChoice) {
        case '묵':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my.png">';
            break;
        case '찌':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my2.png">';
            break;
        case '빠':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my1.png">';
            break;
    }

// 결과 표시 및 색상 설정
let resultText;
let resultColor;
if (userChoice === '묵' && computerChoice === '찌' || userChoice === '찌' && computerChoice === '빠' || userChoice === '빠' && computerChoice === '묵') {
    resultText = '승';
    resultColor = '#ff2400';
} else if (userChoice === computerChoice) {
    resultText = '무';
    resultColor = '#caa57b';
} else {
    resultText = '패';
    resultColor = '#0084ff';
}

// p 태그에 결과 텍스트를 적용하고, 색상 설정
resultScore.innerHTML = `<p style="color: ${resultColor}">${resultText}</p>`;
modal.style.display = 'block';
}


function closeModal() {
    let modal = document.querySelector('.rollet_gmae_modal');
    modal.style.display = 'none';

    // 게임 리셋 로직
    userChoice = '';
    computerChoice = '';
    let roulette = document.getElementById('rouletteImg');

    // 트랜지션을 잠시 끔
    roulette.style.transition = 'none';
    roulette.style.transform = `rotate(0deg)`;
    // 트랜지션 다시 켜기
    setTimeout(() => {
        roulette.style.transition = 'transform 3s ease-out';
    }, 50);

    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none';
    });
}


document.querySelector('.close_game').addEventListener('click', closeModal);
document.querySelector('.rollet-ok_btn button').addEventListener('click', closeModal);



//7. menu responsive

document.addEventListener('DOMContentLoaded', function () {
    var menuBtn = document.querySelector('.menu-btn');
    var closeBtn = document.querySelector('.close-btn');
    var navLinks = document.querySelector('.nav-links');

    // 메뉴 버튼 클릭 이벤트
    menuBtn.addEventListener('click', function () {
        navLinks.classList.add('open'); // nav-links에 'open' 클래스를 추가하여 메뉴를 열음
    });

    // 닫기 버튼 클릭 이벤트
    closeBtn.addEventListener('click', function () {
        navLinks.classList.remove('open'); // nav-links에서 'open' 클래스를 제거하여 메뉴를 닫음
    });
});


// sns공유

// 페이스북 공유

function shareFacebook() {
    var sendUrl = "http://www.mir2red.com"; // 전달할 URL
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
}

// 트위터 공유

function shareTwitter() {
    var sendText = ""; // 전달할 텍스트
    var sendUrl = "http://www.mir2red.com/"; // 전달할 URL
    window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
}

Kakao.Story.share({
    url: 'http://www.mir2red.com/',
    text: '#미르2레드, #미르2:레드',
  });