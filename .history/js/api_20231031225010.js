document.addEventListener("DOMContentLoaded", function() {
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const closeButton = document.querySelector('.close');
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

        const requestBody = {
            tel: rawInput,
            password: "YOUR_PASSWORD_HERE"  // 여기에 암호를 지정하십시오.
        };

        fetch('https://mir2red.com/api/account/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.accountId) {
                alert('로그인이 성공적으로 완료되었습니다.');
            } else if (data === "Unauthorized") {
                const confirmation = confirm("사전예약되지 않은 휴대폰 번호입니다. 지금 사전예약 하시겠습니까?");
                if (confirmation) {
                    closeButton.click();
                    window.location.href = "#prebook";
                }
            } else {
                alert(data.problemDetails.detail || '에러가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });

    const phoneInputReserve = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        const phoneRegex = /^[0-9]{7,8}$/;

        if (!phoneRegex.test(phoneInputReserve.value)) {
            alert('휴대폰 번호를 정확히 입력해주세요');
            return;
        }

        if (!agreeCheckbox.checked) {
            alert('개인정보 수집 이용 및 SMS 수신 동의가 필요합니다.');
            return;
        }

        const requestBody = {
            tel: phoneInputReserve.value.trim(),
            password: "YOUR_PASSWORD_HERE"
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
