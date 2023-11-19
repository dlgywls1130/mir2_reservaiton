

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
var modals = document.getElementsByClassName("modal");
var btns = document.getElementsByClassName("view_more");
var spanes = document.getElementsByClassName("close");
var okBtn = document.querySelector(".modal-ok-item");
var funcs = [];

function Modal(num) {
return function() {
  btns[num].onclick = function() {
    modals[num].style.display = "block";
    console.log(num);
  };

  spanes[num].onclick = function() {
    // Stop the video when the modal is closed
    var iframe = modals[num].querySelector("iframe");
    if (iframe) {
      var src = iframe.src;
      iframe.src = src; // This will reload the iframe, stopping the video
    }

    modals[num].style.display = "none";
  };

  if (modals[num].contains(okBtn)) {
    okBtn.onclick = function() {
      modals[num].style.display = "none";
    };
  }
};
}

for (var i = 0; i < btns.length; i++) {
funcs[i] = Modal(i);
}

for (var j = 0; j < btns.length; j++) {
funcs[j]();
}

window.onclick = function(event) {
if (event.target.className == "modal") {
  // Stop the video when clicking outside the modal
  var iframe = event.target.querySelector("iframe");
  if (iframe) {
    var src = iframe.src;
    iframe.src = src; // This will reload the iframe, stopping the video
  }

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
  var menuItems = navLinks.querySelectorAll('.nav_list a, .mo_nav a');

  // 메뉴 버튼 클릭 이벤트
  menuBtn.addEventListener('click', function () {
      navLinks.classList.add('open'); // nav-links에 'open' 클래스를 추가하여 메뉴를 열음
  });

  // 닫기 버튼 클릭 이벤트
  closeBtn.addEventListener('click', function () {
      navLinks.classList.remove('open'); // nav-links에서 'open' 클래스를 제거하여 메뉴를 닫음
  });

  menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
        navLinks.classList.remove('open');
    });
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


// 모든 로그인 버튼 찾기
// const loginButtons = document.querySelectorAll('.view_login');
// const loginModal = document.querySelector('.modalLogin');


// loginButtons.forEach(button => {
//     button.addEventListener('click', function() {
//         loginModal.style.display = 'block';
//     });
// });


// const closeModalButton = loginModal.querySelector('.close_modal');
// closeModalButton.addEventListener('click', function() {
//     loginModal.style.display = 'none';
// });

// document.getElementById("alert").addEventListener('click', function() {
//   alert("공개예정입니다");
// });
