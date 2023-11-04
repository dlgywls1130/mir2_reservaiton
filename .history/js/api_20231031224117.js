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
    const phoneInput = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const closeButton = document.querySelector('.close');

    // Input mask
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length <= 3) {
            this.value = value;
        } else if (value.length <= 7) {
            this.value = value.slice(0, 3) + "-****-" + value.slice(7);
        } else {
            this.value = value.slice(0, 3) + "-****-" + value.slice(3, 7);
        }
    });

    loginButton.addEventListener('click', function() {
        // Validation
        const phoneRegex = /^010-\*\*\*\*-\d{4}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 정확히 입력해주세요');
            return;
        }

        // API call
        const requestBody = {
            tel: phoneInput.value.replace(/-/g, '').slice(0, 7), 
            password: "YOUR_PASSWORD_HERE" 
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
                // You can also store the received token or do other things here.
            } else if (data === "Unauthorized") {
                const confirmation = confirm("사전예약되지 않은 휴대폰 번호입니다. 지금 사전예약 하시겠습니까?");
                if (confirmation) {
                    closeButton.click(); // Close the modal
                    window.location.href = "#prebook"; // Redirect to the prebooking section
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
});
