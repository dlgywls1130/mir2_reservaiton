//1. 사전예약 api

document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    }

    agreeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            alert(`${getCurrentDate()}에 광고성 정보 수신을 동의하였습니다.`);
        } else {
            alert(`${getCurrentDate()}에 광고성 정보 수신을 철회하였습니다.`);
        }
    });

    
    reservationButton.addEventListener('click', function() {
        // 유효성 검사
        const phoneRegex = /^[0-9]{8}$/;  // 8자리 숫자만 허용
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 정확히 8자리로 입력해주세요');
            return;
        }
        if (!agreeCheckbox.checked) {
            alert('개인정보 수집 이용 및 SMS 수신 동의가 필요합니다.');
            return;
        }

        // 사전예약 API 호출
        fetch('https://mir2red.com/api/account/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tel: "010" + phoneInput.value.trim(),
                password: "string",
                routeUrl: window.location.pathname + window.location.search
            })
        })

        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    // 오류 메시지가 응답 본문에 포함되어 있는 경우
                    throw new Error(data.problemDetails?.detail || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.accountId) {
                alert('사전예약을 완료했습니다. 로그인 후 다양한 이벤트에 참여해보세요.');
                phoneInput.value = ''; // 입력 창 리셋
                agreeCheckbox.checked = false; // 체크박스를 비활성화 상태로 설정
            } else {
                alert(data.problemDetails?.detail || '이미 예약된 번호입니다.');
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert("이미 예약된 번호입니다.");
        });
    });
});



let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;
let remainingChances = 0;
let modalsLogin;

// 로그인 상태가 변경될 때 실행할 함수
function onLoginStatusChanged() {
    if (isLoggedIn) {
        fetchGameResults();
        fetchRemainingChances(); // 로그인 시 기회 확인 API 호출
    } else {
        remainingChances = 0; // 로그아웃 시 기회를 0으로 설정
        updateRemainingChancesDisplay();
    }
}

let fetchInterval;
    function fetchRemainingChancesInterval() {
        fetchRemainingChances();
        fetchInterval = setInterval(fetchRemainingChances, 1000); // 5분마다 호출
    }

function updateRemainingChancesDisplay() {
    document.getElementById('remainingChances').innerText = remainingChances.toString();
}

// 2. 로그인 api
document.addEventListener("DOMContentLoaded", function() {
    modalsLogin = document.querySelector('.modalLogin');
    const closeModalButton = document.querySelector('.close');
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const allLoginButtons = document.querySelectorAll('.view_login');
    const loginInfoSpan = document.querySelector('.header_wrapp .login_btn span');
    const loginStateCheckbox = document.querySelector('.login_chk input[type="checkbox"]');
    
    let rawInput = "";

    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        allLoginButtons.innerText = '로그아웃';
        loginInfoSpan.style.display = 'none';
        fetchRemainingChances();
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
        modalsLogin.style.display = 'none';
        phoneInputLogin.value = '';  // 입력 값을 초기화
        rawInput = '';  // rawInput 값도 초기화
    });

    function updateLoginButtonsText() {
        allLoginButtons.forEach(button => {
            button.innerText = isLoggedIn ? '로그아웃' : '로그인';
        });
    }

    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        updateLoginButtonsText();  // 모든 로그인 버튼의 텍스트 업데이트
        loginInfoSpan.style.display = 'none';
    }


    allLoginButtons.forEach(button => {
        button.addEventListener('click', function() {
        if (isLoggedIn) {
            // 로그인 상태일 때 로그아웃 처리
            isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token');
            localStorage.removeItem('accountId');
            allLoginButtons.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modalsLogin.style.display = 'none';
            onLoginStatusChanged();
            updateLoginButtonsText();
            fetchRemainingChances();
        } else {
            // 비로그인 상태일 때 로그인 모달 표시
            modalsLogin.style.display = 'block';
        }
    });
    
}); 


    loginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            // 로그아웃 처리
            isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
            allLoginButtons.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modalsLogin.style.display = 'none';
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
            modalsLogin.style.display = 'none';
            allLoginButtons.innerText = '로그아웃';
            loginInfoSpan.style.display = 'none';
            updateLoginButtonsText(); 
            alert("다양한 이벤트에 참여해보세요.");
        
            // 로컬 스토리지에 토큰과 accountId 저장
            localStorage.setItem('token', body.token);
            localStorage.setItem('accountId', body.accountId);
        
            // 로그인 상태 저장
            if (loginStateCheckbox.checked) {
                localStorage.setItem('isLoggedIn', 'true');
            }
            fetchRemainingChances();
            onLoginStatusChanged(); 
        })

        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            // 모달 닫기
            modalsLogin.style.display = 'none'; // 모달 창을 닫음
        
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





// 3.룰렛


let userChoice = '';
let computerChoice = '';


// 게임 결과를 저장하는 변수
let gameResults = [];


function selectChoice(choice) {
    userChoice = choice;
    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none'; // 모든 버튼 border 제거
    });
    event.target.style.border = '3px solid #5d2f21'; // 선택한 버튼에 border 적용
}


function startRoulette() {
    
    if (!isLoggedIn) {
        alert("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?");
        modalsLogin.style.display = 'block'; 
        return;
    }


    fetchRemainingChances().then(fetchedChances => {
        if (isNaN(fetchedChances) || fetchedChances <= 0) {
            alert("남은 기회가 없습니다. 미션을 통해 추가 기회를 획득해 보세요");
            return;
        }


        if (userChoice === '') {
            alert("STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요");
            return;
        }


    let roulette = document.getElementById('rouletteImg');
    let deg = 1800 + Math.floor(Math.random() * 360);

    roulette.style.transition = 'transform 3s ease-out';
    roulette.style.transform = `rotate(${deg}deg)`;

    let normalizedDeg = deg % 360;  
    if ((normalizedDeg >= 0 && normalizedDeg < 60) || (normalizedDeg >= 180 && normalizedDeg < 240)) {
        computerChoice = '찌';
    } else if ((normalizedDeg >= 60 && normalizedDeg < 120) || (normalizedDeg >= 240 && normalizedDeg < 300)) {
        computerChoice = '묵';
    } else {
        computerChoice = '빠';
    }

    fetchRemainingChances();
    setTimeout(() => {
        let result = showResult();  // 게임의 결과를 반환받음
        fetchRemainingChances()
        addGameResult(result.isSuccess);  // 결과를 배열에 추가
        updateGameResultsUI();  // UI 업데이트
    }, 3000);
});
}


function updateRemainingChances(chances) {
    document.getElementById('remainingChances').innerText = chances.toString();
    // Any other logic to update chances in your system...
}

function fetchRemainingChances() {
    if (!isLoggedIn) {
        return Promise.resolve(0); // 로그인되지 않은 경우 즉시 0을 반환하는 Promise
    }

    const accountId = localStorage.getItem('accountId');
    const date = new Date().toISOString().split('T')[0];

    // fetch 호출과 그 결과 처리를 명시적인 Promise로 감쌈
    return new Promise((resolve, reject) => {
        fetch(`https://mir2red.com/api/rulet/${accountId}/${date}/chance-left-count`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch remaining chances: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            updateRemainingChances(data);
            resolve(data); // 데이터를 resolve 함
        })
        .catch(error => {
            console.error('Error fetching remaining chances:', error);
            reject(error); // 오류를 reject 함
        });
    });
}



function addGameResult(isSuccess) {
    fetchRemainingChances();
    gameResults.push({ isSuccess: isSuccess });
}

function showResult() {
    let modal = document.querySelector('.rollet_gmae_modal');
    let mySelectImg = document.querySelector('.my_select_img');
    let computerSelectImg = document.querySelector('.computer_select_img');
    let resultScore = document.querySelector('.result_score');

    switch (userChoice) {
        case '묵':
            mySelectImg.innerHTML = '<img src="./image/rollet_my.png">';
            break;
        case '찌':
            mySelectImg.innerHTML = '<img src="./image/rollet_my2.png">';
            break;
        case '빠':
            mySelectImg.innerHTML = '<img src="./image/rollet_my1.png">';
            break;
    }

    switch (computerChoice) {
        case '묵':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my.png">';
            break;
        case '찌':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my2.png">';
            break;
        case '빠':
            computerSelectImg.innerHTML = '<img src="./image/rollet_my1.png">';
            break;
    }

    // 결과 표시 및 색상 설정
    let isSuccess = false;
    let resultText;
    let resultColor;
    if (userChoice === '묵' && computerChoice === '찌' || userChoice === '찌' && computerChoice === '빠' || userChoice === '빠' && computerChoice === '묵') {
        resultText = '승';
        resultColor = '#ff2400';
        isSuccess = true;
    } else if (userChoice === computerChoice) {
        resultText = '무';
        resultColor = '#caa57b';
        isSuccess = false; 
    } else {
        resultText = '패';
        resultColor = '#0084ff';
        isSuccess = false; 
    }

    sendGameResult(isSuccess);
    fetchGameResults();

// p 태그에 결과 텍스트를 적용하고, 색상 설정
resultScore.innerHTML = `<p style="color: ${resultColor}">${resultText}</p>`;
modal.style.display = 'block';

return { isSuccess: isSuccess }; 
}


function closeModal() {
    let modal = document.querySelector('.rollet_gmae_modal');
    modal.style.display = 'none';

    // 게임 리셋 로직
    userChoice = '';
    computerChoice = '';
    let roulette = document.getElementById('rouletteImg');

    // 트랜지션을 잠시 끔
    roulette.style.transition = 'none';
    roulette.style.transform = `rotate(0deg)`;
    // 트랜지션 다시 켜기
    setTimeout(() => {
        roulette.style.transition = 'transform 3s ease-out';
    }, 50);

    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none';
    });
}




document.querySelector('.close_game').addEventListener('click', closeModal);
document.querySelector('.rollet-ok_btn button').addEventListener('click', closeModal);


// api



function fetchGameResults() {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
        console.log('계정 ID가 없습니다. 로그인이 필요합니다.');
        return;
    }

    fetch(`https://mir2red.com/api/rulet/${accountId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('전적 조회 실패: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        gameResults = data; // API로부터 받은 게임 결과를 전역 배열에 할당
        updateGameResultsUI(); // UI 업데이트
    })
    .catch(error => {
        console.error('전적 조회 중 에러 발생:', error);
    });
}

function updateGameResultsUI() {
    const winCount = gameResults.filter(result => result.isSuccess).length;
    const lossCount = gameResults.length - winCount;
    const resultsSpan = document.querySelector('.rollet-score span');
    resultsSpan.textContent = `${winCount}승 ${lossCount}패`;
}

function sendGameResult(isSuccess) {
    const token = localStorage.getItem('token');
    const accountId = localStorage.getItem('accountId');


    if (!token || !accountId) {
        alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
        return;
    }

    const requestBody = {
        accountId: accountId,
        isSuccess: isSuccess
    };

    fetch('https://mir2red.com/api/rulet/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (response.ok) {
            return response.text().then(text => {
                return text ? JSON.parse(text) : {};
            });
        } else {
            // HTTP 에러 처리
            switch (response.status) {
                case 401:
                    throw new Error('Unauthorized: 로그인이 필요합니다.');
                case 400:
                    throw new Error('Bad Request: 요청이 잘못되었습니다.');
                case 429:
                    throw new Error('남은 기회가 없습니다. 미션을 통해 추가 기회를 획득해 보세요.”');
                case 500:
                    throw new Error('Server Error: 서버 에러가 발생했습니다.');
                default:
                    throw new Error('An error occurred: ' + response.statusText);
            }
        }
    })
    .then(data => {
        console.log('게임 결과가 성공적으로 전송되었습니다.', data);
        // 여기서 게임 결과에 따른 추가 처리를 할 수 있습니다.
    })
    .catch(error => {
        console.error('API 호출 중 에러 발생:', error);
        alert(error.message); // 사용자에게 에러 알림
    });

    fetchGameResults();
}


// 4. 공유 url
document.addEventListener("DOMContentLoaded", function() {

    // 첫 번째 공유 URL 세트
    const shareUrlInputFirst = document.querySelector('.url-share-btn_input input'); // 첫 번째 공유 URL 입력 필드
    const shareUrlButtonFirst = document.querySelector('.sare_link_input .url-share-btn'); // 첫 번째 공유 URL 제출 버튼

    // 두 번째 공유 URL 세트
    const shareUrlInputSecond = document.querySelector('.rollet_share_link input'); // 두 번째 공유 URL 입력 필드
    const shareUrlButtonSecond = document.querySelector('.rollet_share_link_btn'); // 두 번째 공유 URL 제출 버튼

    // 첫 번째 버튼에 이벤트 리스너 추가
    shareUrlButtonFirst.addEventListener('click', function() {
        handleShareButtonClick(shareUrlInputFirst, 'https://mir2red.com/api/event-first/create', 'https://mir2red.com/api/event-first');
    });
    // 두 번째 버튼에 이벤트 리스너 추가
    shareUrlButtonSecond.addEventListener('click', function() {
        handleShareButtonClick(shareUrlInputSecond, 'https://mir2red.com/api/event-second/create', 'https://mir2red.com/api/event-second');
    });
});

async function handleShareButtonClick(shareUrlInput, createApiUrl, historyApiUrl) {
    console.log("함수 실행됨");

    const token = localStorage.getItem('token');
    const accountId = localStorage.getItem('accountId');

    console.log("로그인 상태:", token, accountId);

    if (!isLoggedIn) {
        alert("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?");
        modalsLogin.style.display = 'block'; 
        return;
    }

    const sharedUrl = shareUrlInput.value.trim();
    console.log("입력된 URL:", sharedUrl);

    if (!sharedUrl) {
        alert("공유 URL을 입력해주세요.");
        return;
    }

    // 게임 이력 조회
    try {
        const history = await checkEventHistory(accountId, token, historyApiUrl);
        fetchRemainingChances();

        if (history.length >= 1) {
            alert("응모 횟수를 초과하였습니다. 내일 다시 참여해보세요");
            fetchRemainingChances();
            return;

        }
    } catch (error) {
        console.error('이력 조회 중 에러 발생:', error);
        handleApiError(error);
        return;
    }



    // URL 공유
    try {
        await submitShareUrl(accountId, sharedUrl, token, createApiUrl);
        if (createApiUrl.includes('event-first')) {
            alert("이벤트 응모에 완료했습니다");
        } else if (createApiUrl.includes('event-second')) {
            alert("룰렛 이벤트에 추가 기회를 획득하였습니다");
            fetchRemainingChances();
        }
    } catch (error) {
        console.error('API 호출 중 에러 발생:', error);
        handleApiError(error);
    }
}


async function checkEventHistory(accountId, token, apiUrl) {
    const response = await fetch(`${apiUrl}/${accountId}/${new Date().toISOString().split('T')[0]}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}


async function submitShareUrl(accountId, sharedUrl, token, apiUrl) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountId: accountId, sharedUrl: sharedUrl })
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
        // 서버가 에러 상태 코드를 반환한 경우
        const responseText = await response.text();
        console.error("Error response:", response.status, "Type:", contentType, "Body:", responseText);
        throw new Error(`서버로부터 에러 응답을 받았습니다. 상태: ${response.status}, 내용: ${responseText}`);
    }

    if (contentType && contentType.includes("application/json")) {
        // 응답이 JSON 형식인 경우
        return await response.json();
    } else {
        // JSON이 아닌 경우 또는 본문이 없는 경우
        console.log("성공적인 응답:", response.status);
        return null;  // 여기서는 빈 응답을 null로 처리
    }
}





function handleApiError(error) {
    // 에러에 따른 적절한 사용자 피드백
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('400')) {
        alert("잘못된 요청입니다. URL을 확인해주세요.");
    } else if (errorMessage.includes('401')) {
        alert("인증에 실패했습니다. 다시 로그인해주세요.");
    } else if (errorMessage.includes('500')) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
}