

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
var itemClose = document.getElementsByClassName("modal-ok-item")
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

    itemClose.onclick = function(){
        modals.style.display = "none";
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

// function shareNaverBlog() {
    
//     var sendUrl = "http://www.mir2red.com/"; // 전달할 URL
//     window.open("http://share.naver.com/web/shareView.nhn?url="+encodeURIComponent(encodeURIComponent(sendUrl)));
// }




function toSNS(sns, strTitle, strURL) {
    var snsArray = new Array();
    var strMsg = strTitle + " " + strURL;
    var image = "이미지경로";
   
    snsArray['blog'] = "http://blog.naver.com/openapi/share?url=" + encodeURIComponent(strURL) + "&title=" + encodeURIComponent(strTitle);
    //window.open(snsArray[sns]);
            window.open(snsArray[sns],'sns','resizable=no width=200 height=200');
}