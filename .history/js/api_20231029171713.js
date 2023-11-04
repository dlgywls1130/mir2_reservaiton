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
        return response.text();  // 응답을 텍스트로 반환
    })
    .then(dataText => {
        try {
            // 응답을 JSON으로 파싱 시도
            const data = JSON.parse(dataText);

            // token이 존재한다면 성공으로 판단
            if (data.token) {
                alert('사전예약이 성공적으로 완료되었습니다.');
            } else {
                // 오류 메시지를 분석하여 적절한 메시지를 출력
                if (data.errors || data.title) {
                    throw new Error(data.title || '예약 중 오류가 발생했습니다.');
                } else {
                    throw new Error('알 수 없는 오류');
                }
            }
        } catch (error) {
            // 파싱 에러 또는 기타 오류 처리
            throw new Error('응답 데이터가 올바르지 않습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('서버와의 통신 중 오류가 발생했습니다: ' + error.message);
    });
});
