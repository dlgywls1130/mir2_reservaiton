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
    // 응답이 ok가 아니라면 에러를 throw
    if (!response.ok) {
        return response.text().then(yamlText => {
            const err = jsyaml.load(yamlText);
            throw err;
        });
    }
    return response.text();
})
.then(yamlText => {
    const data = jsyaml.load(yamlText);

    // data 객체가 유효한지 확인
    if (!data) {
        throw new Error("응답 데이터가 올바르지 않습니다.");
    }

    // token이 존재한다면 성공으로 판단
    if (data.token) {
        alert('사전예약이 성공적으로 완료되었습니다.');
    } else {
        // 오류 메시지를 분석하여 적절한 메시지를 출력
        let errorMessage = '예약 중 오류가 발생했습니다.';
        
        if (data.problemDetails && data.problemDetails.detail) {
            errorMessage = data.problemDetails.detail;
        } else if (data.detail) {
            errorMessage = data.detail;
        }
        
        throw new Error(errorMessage);
    }
})
.catch(error => {
    console.error('Error:', error);
    // 오류 응답이 JSON 형식이 아닌 경우를 대비
    const errorMessage = error.message || JSON.stringify(error) || '알 수 없는 오류';
    alert('서버와의 통신 중 오류가 발생했습니다: ' + errorMessage);
});

});
