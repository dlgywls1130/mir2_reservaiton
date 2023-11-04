

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
document.addEventListener('DOMContentLoaded', function() {
  let selectedOption = null;

  // 사용자의 선택을 처리하는 함수
  window.selectChoice = function(choice) {
      selectedOption = choice;
  }

  document.querySelector('.start_rollet').addEventListener('click', function() {
      if (!selectedOption) {
          alert("묵, 찌, 빠 중 하나를 선택해주세요");
          return;
      }

      const rolletGamePan = document.querySelector('.rollet_game_pan');
      rolletGamePan.style.transition = 'transform 2s ease-out';
      rolletGamePan.style.transform = 'translate(-50%,-50%) rotate(360deg)';

      setTimeout(() => {
          rolletGamePan.style.transition = 'none';
          rolletGamePan.style.transform = 'translate(-50%,-50%) rotate(0deg)';
          
          document.querySelector('.rollet_gmae_modal').style.display = 'block';

          const computerResult = getRandomResult();
          const myResultImage = document.querySelector('.my_select_img');
          const computerResultImage = document.querySelector('.computer_select_img');
          const resultScore = document.querySelector('.result_score');
          
          myResultImage.innerHTML = `<img src="./image/rollet_my${selectedOption}.png">`;
          computerResultImage.innerHTML = `<img src="./image/rollet_my${computerResult}.png">`;

          if (selectedOption === computerResult) {
              resultScore.innerText = '무';
          } else if ((selectedOption === '묵' && computerResult === '찌') ||
                     (selectedOption === '찌' && computerResult === '빠') ||
                     (selectedOption === '빠' && computerResult === '묵')) {
              resultScore.innerText = '승';
          } else {
              resultScore.innerText = '패';
          }
      }, 2000);
  });

  function getRandomResult() {
      const results = ['묵', '찌', '빠'];
      return results[Math.floor(Math.random() * results.length)];
  }
});
