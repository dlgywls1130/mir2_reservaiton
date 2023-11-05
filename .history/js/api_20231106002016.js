//1. 사전예약 api

document.addEventListener("DOMContentLoaded", function() {
    const phoneInput = document.getElementById('phoneInput');
    const agreeCheckbox = document.getElementById('agree');
    const reservationButton = document.querySelector('.reservation-btn button');

    reservationButton.addEventListener('click', function() {
        // 1. 유효성 검사
        const phoneRegex = /^[0-9]{8}$/;  // 8자리 숫자만 허용
        if (!phoneRegex.test(phoneInput.value)) {
            alert('휴대폰 번호를 정확히 8자리로 입력해주세요');
            return;
        }
        if (!agreeCheckbox.checked) {
            alert('개인정보 수집 이용 및 SMS 수신 동의가 필요합니다.');
            return;
        }

        // 2. 유효성 검사가 통과되면 API 호출
        const requestBody = {
            tel: "010" + phoneInput.value.trim(),
            password: "string"
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
                alert(data.problemDetails?.detail || '이미 예약된 번호입니다.');
            }
        })
        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            alert('서버 에러가 발생했습니다.');
        });
    });
});



let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;

// 2. 로그인 api
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.close');
    const phoneInputLogin = document.querySelector('.modal_login');
    const loginButton = document.querySelector('.login_submit button');
    const headerLoginButton = document.querySelector('.header_wrapp .login_btn .view_more');
    const loginInfoSpan = document.querySelector('.header_wrapp .login_btn span');
    const loginStateCheckbox = document.querySelector('.login_chk input[type="checkbox"]');
    
    let rawInput = "";

    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        headerLoginButton.innerText = '로그아웃';
        loginInfoSpan.style.display = 'none';
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
        modal.style.display = 'none';
        phoneInputLogin.value = '';  // 입력 값을 초기화
        rawInput = '';  // rawInput 값도 초기화
    });

    headerLoginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            isLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('accountId');
            localStorage.setItem('chances', 0); // 'gameCount' 대신 'chances'를 0으로 설정
            headerLoginButton.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modal.style.display = 'none';
            phoneInputLogin.value = '';  // 입력 값을 초기화
            rawInput = '';  // rawInput 값도 초기화
            setChances(0); // 로그아웃 시 남은 기회를 0으로 설정하는 함수 호출
            checkLogin(); // 로그인 상태 재검사
            return;
        } else {
            modal.style.display = 'block'; // 로그아웃 상태에서는 모달을 보이게 함
        }
    });


    loginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            // 로그아웃 처리
            isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
            headerLoginButton.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
            modal.style.display = 'none';
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
            modal.style.display = 'none';
            headerLoginButton.innerText = '로그아웃';
            loginInfoSpan.style.display = 'none';
            alert("다양한 이벤트에 참여해보세요.");
        
            // 로컬 스토리지에 토큰과 accountId 저장
            localStorage.setItem('token', body.token);
            localStorage.setItem('accountId', body.accountId);
        
            // 로그인 상태 저장
            if (loginStateCheckbox.checked) {
                localStorage.setItem('isLoggedIn', 'true');
            }

            fetchGameHistory(body.accountId); 
        })

        .catch(error => {
            console.error('API 호출 중 에러 발생:', error);
            // 모달 닫기
            modal.style.display = 'none'; // 모달 창을 닫음
        
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



// 3. 룰렛이벤트

// 4.룰렛
let userChoice = '';
let computerChoice = '';
let chances = 0;


function checkLogin() {
    const token = localStorage.getItem('token');
    const accountId = localStorage.getItem('accountId');
    if (token && accountId) {
        isLoggedIn = true;
        fetchGameHistory(accountId); // 로그인 시 게임 이력 가져오기
    } else {
        isLoggedIn = false;
        // 로그아웃 상태라면 기회를 저장된 값으로 설정 또는 0으로 설정
        chances = localStorage.getItem('chances') ? parseInt(localStorage.getItem('chances'), 10) : 0;
        if (isNaN(chances)) {
            chances = 0; // 로컬 스토리지에서 가져온 값이 NaN이면 0으로 설정
        }
        setChances(chances);
    }
}


// 사용자의 게임 이력을 가져오는 함수
function fetchGameHistory(accountId) {
    const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
    const date = new Date().toISOString().split('T')[0];

    fetch(`https://mir2red.com/api/rulet/${accountId}/${date}`, {
        headers: {
            'Authorization': 'Bearer ' + token // 인증 토큰을 헤더에 추가
        }
    })
    .then(response => {
        // 성공적인 응답이 아닐 경우 에러 처리
        if (!response.ok) {
            // 여기서 상태 코드별 다른 처리를 할 수 있습니다.
            switch (response.status) {
                case 400:
                    throw new Error('Bad Request: 요청이 잘못되었습니다.');
                case 401:
                    throw new Error('Unauthorized: 인증 정보가 없습니다.');
                case 500:
                    throw new Error('Server Error: 서버 오류가 발생했습니다.');
                // 다른 상태 코드에 대한 처리를 추가할 수 있습니다.
                default:
                    throw new Error(`An error occurred: ${response.statusText}`);
            }
        }
        return response.json();
    })
    .then(data => {
        // 남은 기회가 유효한 숫자인지 확인
        if (data.hasOwnProperty('remainingChances') && !isNaN(Number(data.remainingChances))) {
            const remainingChances = Number(data.remainingChances);
            setChances(remainingChances);
            localStorage.setItem('chances', remainingChances); // 로컬 스토리지에 남은 횟수 저장
        } else {
            // 새로운 사용자 또는 이력 없는 경우, 기본 기회를 4회로 설정
            setChances(4);
            localStorage.setItem('chances', 4); // 로컬 스토리지에 기본 횟수 저장
        }
    })
    
    .catch(error => {
        console.error('Error fetching game history:', error);
        alert(error.message); // 사용자에게 에러 메시지를 보여줍니다.
    });
}

// 남은 기회를 설정하는 함수
function setChances(num) {
    chances = num;
    localStorage.setItem('chances', num); // 남은 기회를 로컬 스토리지에 저장
    document.getElementById('remainingChances').textContent = num;
}

function selectChoice(choice) {
    userChoice = choice;
    const buttons = document.querySelectorAll('.rollet_start-btn img');
    buttons.forEach(button => {
        button.style.border = 'none'; // 모든 버튼 border 제거
    });
    event.target.style.border = '3px solid red'; // 선택한 버튼에 border 적용
}



function startRoulette() {
    
    if (!isLoggedIn) {
        alert("로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?");
        
        // 첫 번째 모달(로그인 팝업)을 표시합니다.
        modals[0].style.display = 'block'; 
        chances = 0;
        setChances(chances);
        return;
    }

    if (userChoice === '') {
        alert("STEP1의 묵찌빠 중 하나를 먼저 선택해 주세요");
        return;
    }

    if (chances <= 0) {
        alert("남은 기회가 없습니다. 미션을 통해 추가 기회를 획득해 보세요.");
        return;
    }

    setChances(chances - 1);

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

    setTimeout(() => {
        showResult();
    }, 3000);
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
} else if (userChoice === computerChoice) {
    resultText = '무';
    resultColor = '#caa57b';
} else {
    resultText = '패';
    resultColor = '#0084ff';
}

sendGameResult(isSuccess);

// p 태그에 결과 텍스트를 적용하고, 색상 설정
resultScore.innerHTML = `<p style="color: ${resultColor}">${resultText}</p>`;
modal.style.display = 'block';
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
                    throw new Error('Too Many Requests: 요청이 너무 많습니다.');
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
}

document.addEventListener('DOMContentLoaded', checkLogin);