

// 1. main click prebook 
document.querySelector('.reservation_btn').addEventListener('click', function() {
    // 해당 섹션으로 이동
    const targetSection = document.getElementById('prebook');
    targetSection.scrollIntoView({ behavior: 'smooth' });
});


//2. 휴대폰 입력창

const phoneInput = document.querySelector('#phoneInput');

phoneInput.addEventListener('input', function() {
    // 숫자만 입력 가능하도록
    this.value = this.value.replace(/[^0-9]/g, '');

    // 최대 8자리로 제한
    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});
