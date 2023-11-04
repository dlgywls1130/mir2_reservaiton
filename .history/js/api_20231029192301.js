document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        // 1. 유효성 검사
        const phoneRegex = /^[0-9]{7,8}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 올바르게 입력해주세요. (숫자 7~8자리, 하이픈 제외)');
            return;
        }
        if (!agreeCheckbox.checked) {
            alert('개인정보 수집·이용 및 LMS 수신에 동의해주세요.');
            return;
        }

        // 2. 유효성 검사가 통과되면 API 호출
        const requestBody = {
            tel: phoneInput.value.trim(),
            password: "YOUR_PASSWORD_HERE" // password 값을 적절하게 지정해주세요.
        };

        fetch('/api/account/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.accountId) {
                alert('성공적으로 사전예약되었습니다.');
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
