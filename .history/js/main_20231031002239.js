

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
let isLogin = false; // 로그인 상태를 나타내는 변수. 이것은 실제 로그인 상태와 연동해야 합니다.
let step1Selected = false; // STEP1이 선택되었는지 확인하는 변수

// step_btn_wrap의 버튼들에 클릭 이벤트 추가
document.querySelectorAll('.step_btn_wrap .rollet_start-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        step1Selected = true; // STEP1 선택됨
    });
});

// 룰렛 시작 버튼 클릭 이벤트
document.querySelector('.rollet_setting').addEventListener('click', function() {
    if (!isLogin) {
        if (confirm("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?")) {
            // 로그인 팝업 노출 로직을 여기에 추가하세요.
        }
        return;
    }

    if (!step1Selected) {
        alert("STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요");
        return;
    }

    // 룰렛 작동 로직을 여기에 추가하세요.
});

// URL 입력 완료 버튼 클릭 이벤트 (버튼이 HTML에 없으므로 가정하고 작성)
document.querySelector('.url_submit_btn').addEventListener('click', function() { // 클래스 이름은 실제 버튼의 클래스 이름으로 바꿔주세요.
    const urlValue = document.querySelector('.url_input').value; // url_input은 실제 URL 입력 필드의 클래스 이름으로 바꿔주세요.

    if (!urlValue) {
        alert("공유 URL을 입력해주세요.");
        return;
    }

    alert("룰렛 이벤트에 추가 기회를 획득했습니다.");
    // 필요한 로직 추가
});