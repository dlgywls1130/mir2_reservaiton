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

let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';



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


    function updateLoginStatus() {
        isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            headerLoginButton.innerText = '로그아웃';
            loginInfoSpan.style.display = 'none';
        } else {
            headerLoginButton.innerText = '로그인';
            loginInfoSpan.style.display = 'block';
        }
    }

    // 페이지 로드 시 로그인 상태를 확인하고 업데이트합니다.
    updateLoginStatus();


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
            // 로그아웃 처리
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('accountId');
            updateLoginStatus();
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block'; // 로그아웃 상태에서는 모달을 보이게 함
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
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json().then(data => {
                    return {status: response.status, body: data};
                });
            } else {
                // 응답이 JSON이 아닌 경우, 텍스트로 처리합니다.
                return response.text().then(text => {
                    return {status: response.status, body: text};
                });
            }
        })
        .then(({ status, body }) => {
            switch (status) {
                case 200:
                    // 로그인 성공 처리
                    localStorage.setItem('token', body.token);
                    localStorage.setItem('accountId', body.accountId);
                    if (loginStateCheckbox.checked) {
                        localStorage.setItem('isLoggedIn', 'true');
                    }
                    updateLoginStatus();
                    modal.style.display = 'none';
                    break;
                case 401:
                    // 인증 실패 처리
                    alert('사전예약되지 않은 휴대폰 번호입니다. 지금 사전예약 하시겠습니까?');
                    modal.style.display = 'none';
                    document.querySelector('#prebook').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 500:
                    // 서버 오류 처리
                    console.error('서버 오류 발생:', body);
                    alert('서버에서 오류가 발생했습니다. 다시 시도해 주세요.');
                    break;
                default:
                    // 기타 오류 처리
                    console.error('API 호출 결과 에러 발생:', body);
                    alert('알 수 없는 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            // 네트워크 오류 또는 response.json()/response.text()에서 발생한 오류를 처리합니다.
            console.error('API 호출 중 에러 발생:', error);
            alert('서버에 접근할 수 없습니다. 네트워크 연결을 확인하거나 나중에 다시 시도해 주세요.');
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



// 3. 이벤트공유 API

document.addEventListener("DOMContentLoaded", function() {
    const shareLinkInput = document.querySelector('.sare_link_input input');
    const shareButton = document.querySelector('.sare_link_input .url_input_share');

    shareButton.addEventListener('click', function() {
        // 로그인이 되어있지 않다면, 로그인 모달을 표시합니다.
        if (!isLoggedIn) {
            alert('로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?');
            // 로그인 모달을 여는 코드가 여기에 들어가야 합니다. 예를 들면:
            // modal.style.display = 'block';
            return;
        }

        // 공유 URL 입력이 비어있다면 경고합니다.
        if (!shareLinkInput.value.trim()) {
            alert('공유 URL을 입력해주세요.');
            return;
        }

        // API 호출
        postSharedUrl(shareLinkInput.value);
    });

    function postSharedUrl(sharedUrl) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 저장되지 않았습니다. 로그인이 필요합니다.');
            return;
        }

        const accountId = localStorage.getItem('accountId');
        if (!accountId) {
            console.error('계정 ID가 저장되지 않았습니다. 로그인이 필요합니다.');
            return;
        }

        const requestBody = {
            accountId: accountId,
            sharedUrl: sharedUrl
        };

        fetch('https://mir2red.com/api/event-first/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token // 토큰을 Authorization 헤더에 추가합니다.
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                // 서버에서 비정상 응답이 왔을 경우
                return response.json().then(data => {
                    throw {status: response.status, body: data};
                });
            }
            return response.json();
        })
        .then(data => {
            // 응모 완료했다는 알림을 사용자에게 보여줍니다.
            alert('이벤트에 응모 완료했습니다.');
            // 여기에 성공적인 응모 후의 로직을 추가할 수 있습니다.
        })
        .catch(error => {
            if (error.status) {
                // 서버에서 받은 에러 상태 코드에 따른 처리
                switch (error.status) {
                    case 400:
                        alert('잘못된 요청입니다. URL을 확인해주세요.');
                        break;
                    case 401:
                        alert('인증되지 않았습니다. 다시 로그인해주세요.');
                        break;
                    case 500:
                        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        break;
                    default:
                        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
                }
            } else {
                // 네트워크 오류 또는 예상치 못한 오류가 발생했을 경우
                console.error('API 호출 중 예상치 못한 에러 발생:', error);
                alert('문제가 발생했습니다. 나중에 다시 시도해주세요.');
            }
        });
    }
});


// 3. 공유 api
// 공유 URL 입력 관련 코드
document.addEventListener("DOMContentLoaded", function() {
    const shareInput = document.querySelector('.sare_link_input input');
    const shareButton = document.querySelector('.url_input_share');
    const modal = document.querySelector('.modal');

    // 공유 URL 입력 완료 버튼 클릭 이벤트 리스너
    shareButton.addEventListener('click', function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (!isLoggedIn) {
            if (confirm('로그인 후 진행할 수 있습니다. 지금 로그인 하시겠습니까?')) {
                modal[0].style.display = 'block'; // 로그인 모달 표시
            }
        } else {
            const sharedUrl = shareInput.value.trim();
            if (!sharedUrl) {
                alert('공유 URL을 입력해주세요');
                return;
            }

            const token = localStorage.getItem('token');
            const accountId = localStorage.getItem('accountId');
            
            if (!token) {
                alert('인증 토큰이 존재하지 않습니다. 다시 로그인해주세요.');
                return;
            }

            // API 호출 구현 부분
            const requestBody = {
                accountId: accountId,
                sharedUrl: sharedUrl
            };

            fetch('https://mir2red.com/api/event-first/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Bearer 토큰 사용
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(data => {
                alert('이벤트에 응모 완료했습니다');
                // 응모 완료 후의 추가적인 동작
            })
            .catch(error => {
                console.error('API 호출 중 에러 발생:', error);
                switch (error.message) {
                    case '400':
                        alert('잘못된 요청입니다. 입력한 정보를 확인해주세요.');
                        break;
                    case '401':
                        alert('로그인이 필요합니다.');
                        // 로그인 관련 처리
                        break;
                    default:
                        alert('서버 에러가 발생했습니다.');
                }
            });
        }
    });
});


// 4.룰렛

let userChoice = '';
let computerChoice = '';
let chances = 0; // 사용자의 남은 기회



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