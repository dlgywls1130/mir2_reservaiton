//1. 사전예약 api

document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        // 1. 유효성 검사
        const phoneRegex = /^[0-9]{8}$/;  // 8자리 숫자만 허용
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 정확히 8자리로 입력해주세요');
            return;
        }
        if (!agreeCheckbox.checked) {
            alert('개인정보 수집 이용 및 SMS 수신 동의가 필요합니다.');
            return;
        }

        // 2. 유효성 검사가 통과되면 API 호출
        const requestBody = {
            tel: "010" + phoneInput.value.trim(),
            password: "string"
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
                alert(data.problemDetails?.detail || '이미 예약된 번호입니다.');
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });
});



let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;

// 2. 로그인 api
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.close');
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const headerLoginButton = document.querySelector('.header_wrapp .login_btn .view_more');
    const loginInfoSpan = document.querySelector('.header_wrapp .login_btn span');
    const loginStateCheckbox = document.querySelector('.login_chk input[type="checkbox"]');
    
    let rawInput = "";

    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        headerLoginButton.innerText = '로그아웃';
        loginInfoSpan.style.display = 'none';
    }


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
        phoneInputLogin.value = '';  // 입력 값을 초기화
        rawInput = '';  // rawInput 값도 초기화
    });

    headerLoginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            // 로그아웃 처리
            isLoggedIn = false;
            localStorage.removeItem('token');
            headerLoginButton.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modal.style.display = 'none';
            phoneInputLogin.value = '';  // 입력 값을 초기화
            rawInput = '';  // rawInput 값도 초기화
            return;
        } else {
            modal.style.display = 'block'; // 로그아웃 상태에서는 모달을 보이게 함
        }
    });


    loginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            // 로그아웃 처리
            isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
            headerLoginButton.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modal.style.display = 'none';
            return;
        }

        const phoneRegex = /^010-\*\*\*\*-\d{4}$/;

        if (!phoneRegex.test(phoneInputLogin.value)) {
            alert('휴대폰 번호를 정확히 입력해주세요');
            return;
        }

        const requestBody = {
            tel: rawInput,
            password: "string"        
        };

        fetch('https://mir2red.com/api/account/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })

        .then(body => {
            // 로그인 성공 시 처리
            isLoggedIn = true;
            modal.style.display = 'none';
            headerLoginButton.innerText = '로그아웃';
            loginInfoSpan.style.display = 'none';
            alert("다양한 이벤트에 참여해보세요.");
        
            // 로컬 스토리지에 토큰과 accountId 저장
            localStorage.setItem('token', body.token);
            localStorage.setItem('accountId', body.accountId);
        
            // 로그인 상태 저장
            if (loginStateCheckbox.checked) {
                localStorage.setItem('isLoggedIn', 'true');
            }
        })

        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            // 모달 닫기
            modal.style.display = 'none'; // 모달 창을 닫음
        
            let errorMessage = '서버 에러가 발생했습니다.';
            if (error.message.includes('401')) {
                // 401 Unauthorized 에러 메시지 처리
                errorMessage = "사전예약되지 않은 휴대폰 번호입니다. 지금 사전예약 하시겠습니까?";
                if (confirm(errorMessage)) {
                    document.querySelector('#prebook').scrollIntoView({ behavior: 'smooth' });
                }
            } else if (error.message.includes('400')) {
                // 400 Bad Request 에러 메시지 처리
                errorMessage = "휴대폰 번호를 정확히 입력해주세요.";
                alert(errorMessage);
            } else {
                // 기타 서버 에러 메시지 처리
                alert(errorMessage);
            }
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
    const urlTextarea = document.querySelector('.sare_link_input input');
    const modals = document.querySelectorAll('.modal');
    const accountId = localStorage.getItem('accountId');

    shareButton.addEventListener('click', function() {
        let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        // 로그인 확인
        if (!isLoggedIn) {
            alert("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?");
            
            // 첫 번째 모달(로그인 팝업)을 표시합니다.
            modals[0].style.display = 'block'; 
            return;
        }
        
        const url = urlTextarea.value.trim();

        // URL 검증
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
            alert("공유 URL을 입력해주세요");
            return;
        }
        
        // API 호출
        const requestBody = {
            accountId: accountId, 
            sharedUrl: url
        };

        fetch('https://mir2red.com/api/event-first/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            // 응답의 Content-Type 헤더가 존재하는지 확인합니다.
            let contentType = response.headers.get('Content-Type');
          
            // 응답이 성공적이고, Content-Type 헤더가 JSON을 포함하는지 검사합니다.
            if (response.ok && contentType && contentType.includes('application/json')) {
              // JSON 형식의 응답 본문을 가져옵니다.
              return response.json().then(body => ({ status: response.status, body: body }));
            } else if (response.ok) {
              // 응답이 성공적이지만, JSON 본문이 없는 경우입니다.
              return { status: response.status, body: {} };
            } else {
              // 응답이 성공적이지 않은 경우, 에러를 발생시킵니다.
              throw new Error(`Server responded with status: ${response.status}`);
            }
          })
        .then(data => {
            // 여기서 data.body를 사용하기 전에 검사합니다.
            if (data.body && data.status === 200) {
                alert('이벤트에 응모 완료했습니다.');
                urlTextarea.value = '';
            } else {
                // 여기에서 다른 HTTP 상태 코드를 처리합니다.
                switch(data.status) {
                    case 400:
                        alert('요청이 잘못되었습니다. (에러 400)');
                        
                        break;
                    case 401:
                        alert('권한이 없습니다. (에러 401)');
                        break;
                    case 500:
                        alert('서버 에러가 발생했습니다. (에러 500)');
                        break;
                    default:
                        alert('알 수 없는 에러가 발생했습니다.');
                        console.error('API 호출 결과 에러 발생:', data.body);
                }
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    }); // <-- shareButton의 addEventListener 종료 괄호
});
