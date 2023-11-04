// 1. 사전예약 api
document.querySelector('.reservation-btn button').addEventListener('click', function() {
    // 유효성 검사
    const phoneNumber = document.querySelector('#phoneInput').value;
    const agree = document.querySelector('#agree').checked;

    // 휴대폰 번호 유효성 검사
    if (!phoneNumber) {
        alert('휴대폰 번호를 입력해주세요.');
        return;
    }

    // 정규표현식을 사용해 휴대폰 번호 포맷 검사
    const phoneRegex = /^[0-9]{1,8}$/; 
    if (!phoneRegex.test(phoneNumber)) {
        alert('유효한 휴대폰 번호를 입력해주세요. (최대 8자리, 숫자만 허용)');
        return;
    }

    // 체크박스 동의 확인
    if (!agree) {
        alert('개인정보 수집·이용 및 LMS 수신에 동의해주세요.');
        return;
    }

    // API 요청
    fetch('https://mir2red.com/api/account/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        tel: phoneNumber,
        password: "defaultPassword"
    })
})
.then(response => {
    if (!response.ok) {
        return response.text().then(text => {
            try {
                // JSON으로 변환 시도
                const errorData = JSON.parse(text);
                throw new Error(JSON.stringify(errorData));
            } catch (e) {
                // JSON 변환에 실패하면 원래 텍스트로 에러를 throw
                throw new Error(text || 'Server Error');
            }
        });
    }
    return response.text().then(text => {
        // 응답 본문이 비어 있지 않은 경우에만 JSON으로 파싱
        return text ? JSON.parse(text) : {};
    });
})
.then(data => {
    if (data && data.token) {
        alert('사전예약이 성공적으로 완료되었습니다.');
    } else {
        alert(data.problemDetails.detail || '예약 중 오류가 발생했습니다.');
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('서버와의 통신 중 오류가 발생했습니다: ' + error.message);
});
});