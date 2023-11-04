document.querySelector('.reservation-btn button').addEventListener('click', function() {
    const phoneNumber = document.querySelector('#phoneInput').value;
    const agree = document.querySelector('#agree').checked;

    if (!phoneNumber) {
        alert('휴대폰 번호를 입력해주세요.');
        return;
    }

    const phoneRegex = /^[0-9]{7,8}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('유효한 휴대폰 번호를 입력해주세요. (7~8자리 숫자만 허용)');
        return;
    }

    if (!agree) {
        alert('개인정보 수집·이용 및 LMS 수신에 동의해주세요.');
        return;
    }

    const password = "defaultPassword";
    if (password.length < 1) {
        alert('비밀번호가 너무 짧습니다.');
        return;
    }

    fetch('https://mir2red.com/api/account/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tel: phoneNumber,
            password: password
        })
    })
    .then(response => {
        return response.text();
    })
    .then(dataText => {
        console.log('Returned Data:', dataText);

        try {
            const data = JSON.parse(dataText);

            if (data && data.token) {
                alert('사전예약이 성공적으로 완료되었습니다.');
            } else {
                let errorMessage = '예약 중 오류가 발생했습니다.';
                if (data.errors && Object.values(data.errors).length > 0) {
                    errorMessage = Object.values(data.errors)[0];
                } else if (data.title) {
                    errorMessage = data.title;
                }
                alert(errorMessage);
            }
        } catch (error) {
            throw new Error('응답 데이터가 올바르지 않습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = error.message || '알 수 없는 오류';
        alert('서버와의 통신 중 오류가 발생했습니다: ' + errorMessage);
    });
});
