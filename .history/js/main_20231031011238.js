

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
let userChoice = "";
let rouletteResult = "";
const choices = ['묵', '찌', '빠'];

// 사용자의 선택을 저장하는 함수
function selectChoice(choice) {
    userChoice = choice;
}

// 룰렛 게임 시작 함수
function startRouletteGame() {
    // 랜덤하게 묵, 찌, 빠 중 하나를 선택
    const randomIndex = Math.floor(Math.random() * 3);
    rouletteResult = choices[randomIndex];

    // 결과 팝업을 표시
    showResultPopup();
}

// 결과 팝업 표시 함수
function showResultPopup() {
    // 사용자 선택 이미지 설정
    document.querySelector('.my_select_img').innerHTML = `<img src="../image/rollet${choices.indexOf(userChoice) + 1}.png" alt="${userChoice}">`;

    // 룰렛 결과 이미지 설정
    document.querySelector('.computer_select_img').innerHTML = `<img src="../image/rollet${choices.indexOf(rouletteResult) + 1}.png" alt="${rouletteResult}">`;

    // 결과 (무/승/패) 판정
    if (userChoice === rouletteResult) {
        document.querySelector('.result_score').innerText = '무';
    } else if (
        (userChoice === '묵' && rouletteResult === '찌') ||
        (userChoice === '찌' && rouletteResult === '빠') ||
        (userChoice === '빠' && rouletteResult === '묵')
    ) {
        document.querySelector('.result_score').innerText = '승';
    } else {
        document.querySelector('.result_score').innerText = '패';
    }

    // 팝업 표시 (여기서는 간단하게 alert로 표현)
    // 실제 프로젝트에서는 모달 팝업 표시 코드를 사용해야 합니다.
    alert(document.querySelector('.result_score').innerText);
}

// 묵, 찌, 빠 버튼에 클릭 이벤트 추가
document.querySelectorAll('.rollet_start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectChoice(btn.querySelector('img').alt);
        startRouletteGame();
    });
});
