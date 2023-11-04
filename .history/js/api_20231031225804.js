//1. 사전예약 api

document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        // 1. 유효성 검사
        const phoneRegex = /^[0-9]{7,8}$/;
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
            tel: phoneInput.value.trim(),
            password: "YOUR_PASSWORD_HERE" // password 값을 적절하게 지정해주세요.
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
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    let rawInput = "";

    phoneInputLogin.addEventListener('input', function(e) {
        rawInput = (rawInput + e.data).replace(/\D/g, '');

        if (rawInput.length <= 3) {
            this.value = rawInput;
        } else if (rawInput.length <= 7) {
            this.value = rawInput.slice(0, 3) + "-" + "*".repeat(rawInput.length - 3);
        } else {
            this.value = rawInput.slice(0, 3) + "-****-" + rawInput.slice(7, 11);
        }

        if (rawInput.length > 11) {
            rawInput = rawInput.slice(0, 11);
        }
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
                // 로그인 API 호출
                fetch('https://your-domain.com/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tel: rawInput })
                })
                .then(loginResponse => loginResponse.json())
                .then(loginData => {
                    if (loginData.success) {
                        alert('로그인 성공!');
                        // 추가적인 로그인 후 처리 로직
                    } else {
                        alert('로그인 실패. 다시 시도해주세요.');
                    }
                })
                .catch(loginError => {
                    console.error('로그인 API 호출 중 에러 발생:', loginError);
                    alert('로그인 중 에러 발생. 다시 시도해주세요.');
                });
            } else {
                alert('사전예약되지 않은 휴대폰 번호입니다. 지금 사전예약 하시겠습니까?');
                // #prebook 섹션으로 이동
                location.hash = "prebook";
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });
});
