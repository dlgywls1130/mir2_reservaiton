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
            password: "YOUR_PASSWORD_HERE" // 실제 사용시에는 암호화된 비밀번호나 OAuth 등의 방식을 사용
        })
    })
    .then(response => {
        // 3. 응답 상태 코드 확인
        if (!response.ok) {
            // JSON 형식인 경우 처리
            if (response.headers.get('content-type').includes('application/json')) {
                return response.json().then(data => {
                    throw new Error(data.problemDetails.detail || '예약 중 오류가 발생했습니다.');
                });
            }
            // 그렇지 않은 경우 일반 텍스트로 에러 메시지 처리
            throw new Error('서버와의 통신 중 오류가 발생했습니다.');
        }
        return response.json();
    })
    .then(data => {
        alert('사전예약이 성공적으로 완료되었습니다.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});