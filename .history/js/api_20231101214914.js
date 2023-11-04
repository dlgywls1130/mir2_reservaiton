//1. 사전예약 api

document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        // 1. 유효성 검사
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 정확히 입력해주세요');
            return;
        }
        if (!agreeCheckbox.checked) {
            alert('개인정보 수집 이용 및 SMS 수신 동의가 필요합니다.');
            return;
        }

        // 2. 유효성 검사가 통과되면 API 호출
        const requestBody = {
            tel: "010" + phoneInput.value.trim(),
            password: "" // password 값을 적절하게 지정해주세요.
        };

        fetch('https://mir2red.com/api/account/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.accountId) {
                alert('사전예약을 완료했습니다. 로그인 후 다양한 이벤트에 참여해보세요.');
            } else {
                alert(data.problemDetails.detail || '에러가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });
});



// 2. 로그인 api
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.close');
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const headerLoginButton = document.querySelector('.header_wrapp .login_btn .view_more');
    const loginInfoSpan = document.querySelector('.header_wrapp .login_btn span');
    let rawInput = "";

    phoneInputLogin.addEventListener('input', function(e) {
        if (e.inputType === "insertText") {
            rawInput += e.data;
        } else if (e.inputType === "deleteContentBackward") {
            rawInput = rawInput.slice(0, -1);
        }
        
        this.value = formatPhoneNumber(rawInput);
    });

    phoneInputLogin.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            rawInput = rawInput.slice(0, -1);
            this.value = formatPhoneNumber(rawInput);
            e.preventDefault();
        }
    });

    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    loginButton.addEventListener('click', function() {
        const phoneRegex = /^010-\*\*\*\*-\d{4}$/;

        if (!phoneRegex.test(phoneInputLogin.value)) {
            alert('휴대폰 번호를 정확히 입력해주세요');
            return;
        }

        // 사전 예약된 번호인지 확인하는 API 호출
        fetch('https://mir2red.com/api/account/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tel: rawInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.isPrebooked) {
                modal.style.display = 'none';  // 로그인 모달 닫기
                headerLoginButton.innerText = '로그아웃';  // 헤더의 로그인 버튼 텍스트 변경
                loginInfoSpan.style.display = 'none';  // 로그인 설명 span 숨기기
            } else {
                alert('사전예약되지 않은 휴대폰 번호입니다.');
                modal.style.display = 'none';  // 모달을 닫습니다.
                document.querySelector('#prebook').scrollIntoView({ behavior: 'smooth' });  // smooth scroll to #prebook section
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });

    function formatPhoneNumber(value) {
        if (value.length <= 3) {
            return value;
        } else if (value.length <= 7) {
            return value.slice(0, 3) + "-" + "*".repeat(value.length - 3);
        } else {
            return value.slice(0, 3) + "-****-" + value.slice(7, 11);
        }
    }
});



// 3. 이벤트공유 API
document.addEventListener("DOMContentLoaded", function() {
    const shareButton = document.querySelector('.url_input_share');
    const urlTextarea = document.querySelector('.sare_link_input textarea');
    const modals = document.querySelectorAll('.modal');
    const accountId = localStorage.getItem('accountId');
    let isLoggedIn = false; // 기본적으로 로그인되지 않은 상태라고 가정합니다.

    shareButton.addEventListener('click', function() {
        // 로그인 확인
        if (!isLoggedIn) {
            alert("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?");
            
            // 첫 번째 모달(로그인 팝업)을 표시합니다.
            modals[0].style.display = 'block'; 
            return;
        }
        
        const url = urlTextarea.value.trim();

        // URL 검증
        if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
            alert("공유 URL을 입력해주세요");
            return;
        }
        
        // API 호출
        const requestBody = {
            accountId: accountId, 
            sharedUrl: url
        };

        fetch('https://mir2red.com/api/share/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('이벤트에 응모 완료했습니다.');
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });
});
