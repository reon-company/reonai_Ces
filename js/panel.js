let adminPanelId = '';

function showPanel(panelId) {
  console.log(`showPanel called with panelId: ${panelId}`);
  const panels = [
    'mainPanel',
    'roastPanel',
    'roastInfoPanel',
    'recipePanel',
    'puttingCountPanel',
    'easyRoastInfoPanel',
    'simpleRoastPanel',
    'SimpleRoastInfoPanel',
    'myRecipePanel',
    'recipeDataPanel',
    'recipeDataDisplayPanel',
  ];

  panels.forEach((id) => {
    const panel = document.getElementById(id);
    if (panel) {
      if (id === panelId) {
        panel.style.display = 'block';
        panel.classList.add('show');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('show');
      }
    } else {
      console.log(`Panel not found: ${id}`);
    }
  });

  adminPanelId = panelId;
}

function adminUser() {
  document.getElementById('adminBtn').style.display = 'block';
  document.getElementById('adminBtn').classList.add('show');
  // document.getElementById('aiBtn ').style.display = 'block';
  // document.getElementById('aiBtn ').classList.add('show');
}

function headerDisplayBlock() {
  //aslide 보이게
  document.getElementById('mainDiv').classList.add('sm:ml-40');
  document.getElementById('logo-sidebar').classList.remove('hidden');
  document.getElementById('logo-sidebar_sm').classList.remove('hidden');
}

function headerDisplayNone() {
  //aslide 안보이게
  document.getElementById('mainDiv').classList.remove('sm:ml-40');
  document.getElementById('logo-sidebar').classList.add('hidden');
  document.getElementById('logo-sidebar_sm').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  // headerDisplayNone();

  if (!window.location.href.includes('reon_AI.html')) {
    showPanel('mainPanel');
  } else {
    showPanel('SimpleRoastInfoPanel');
  }

  // showPanel('myRecipePanel');

  // showPanel('roastPanel');
  // showPanel('roastPanel');

  // 접속하는 국가 확인  setLanguageBasedOnLocation();
  // setLanguageBasedOnLocation();

  //로그인!
  const storedUserInfo = localStorage.getItem('userInfo');

  if (storedUserInfo) {
    // 사용자 정보 복원

    console.log('자동로그인?');
    const userInfo = JSON.parse(storedUserInfo);
    document.getElementById('loginModalBtn').style.display = 'none';
    document.getElementById('logoutModalBtn').style.display = 'block'; // 로그아웃 버튼 보이기

    document.getElementById('loginUserName').style.display = 'block';
    document.getElementById('loginUserName').textContent = userInfo.firstName;

    document.getElementById('userName').style.display = 'block';
    // console.log('로그인 상태 유지:', userInfo);
    //로그인 플래그 참
    isLogin = true;

    userData = userInfo;

    // 데이터 추출하여 전역 변수에 저장

    // 필요한 작업 수행
    getMyRecords(userInfo);
    loadRecipeOptions(userInfo);
    getPilot();
  }
});

const translations = {
  ko: {
    login: '로그인',
    signUp: '회원가입',
    logout: '로그아웃',
    placeholderEmail: '아이디 입력',
    placeholderPassword: '비밀번호 8자~20자',
    confirmYes: '예',
    confirmNo: '아니오',
    recipe: '레시피',
    preheat: '예열',
    temperatureHigh: '온도가 높습니다.',
    preheatNotComplete: '예열이 완료되지 않았습니다',
    manualRoastingBtn: '정밀 로스팅',
    roastInfoStartBtn: '로스팅 시작',
    withoutpreheatingStartBtn: '예열 생략',
    recipeInfoResetBtn: '취소',
    recipeInfoApplyBtn: '적용',
    raostingTimeLabel: '로스팅 시간:',
    crackBtn: '크랙',
    CoolDowndBtn: '쿨링',
    CoolDowndStopBtn: '쿨링정지',
    disposeBtn: '배출',
    recipeResetBtn: '레시피삭제',
    keypadSubmit: '입력',
  },
  en: {
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    placeholderEmail: 'Enter your email',
    placeholderPassword: 'Password (8-20 characters)',
    confirmYes: 'Yes',
    confirmNo: 'No',
    recipe: 'Recipe',
    preheat: 'Preheat',
    temperatureHigh: 'Temperature is high.',
    preheatNotComplete: 'Preheat not completed',
    manualRoastingBtn: 'Dynamic Roast',
    roastInfoStartBtn: 'Start',

    withoutpreheatingStartBtn: 'Skip Preheat',
    recipeInfoResetBtn: 'Cancel',
    recipeInfoApplyBtn: 'Apply',

    raostingTimeLabel: 'Roasting Time:',
    crackBtn: 'Crack',
    CoolDowndBtn: 'Cooling',
    CoolDowndStopBtn: 'STOP',
    disposeBtn: 'Dispose',
    recipeResetBtn: 'Recipe del',
    keypadSubmit: 'Apply',
  },
};

function setLanguage(lang) {
  const koButton = document.getElementById('languageKo');
  const enButton = document.getElementById('languageEn');

  ('bg-reonaiBlue text-reonaiWhite');
  ('bg-reonaiRed text-reonaiWhite');

  if (lang === 'ko') {
    lengFlag = 0;
    localStorage.setItem('lengFlag', 0); // localStorage에 저장
    koButton.style.display = 'none';
    enButton.style.display = 'inline-block';
  } else if (lang === 'en') {
    lengFlag = 1;
    localStorage.setItem('lengFlag', 1); // localStorage에 저장
    enButton.style.display = 'none';
    koButton.style.display = 'inline-block';
  }
  document.documentElement.lang = lang;
  document.getElementById('loginBtn').innerText = translations[lang].login;
  document.getElementById('logoutBtn').innerText = translations[lang].logout;
  document.getElementById('email').placeholder =
    translations[lang].placeholderEmail;
  document.getElementById('password').placeholder =
    translations[lang].placeholderPassword;

  document.getElementById('roastInfoPanelPreheat').innerText =
    translations[lang].preheat;
  document.getElementById('roastInfoStartBtn').innerText =
    translations[lang].roastInfoStartBtn;

  // document.getElementById('manualRoastingBtn').innerText =
  //   translations[lang].manualRoastingBtn;
  // document.getElementById('recipeBtnForMain').innerText =
  //   translations[lang].recipe;
  document.getElementById('withoutpreheatingStartBtn').innerText =
    translations[lang].withoutpreheatingStartBtn;
  document.getElementById('recipeInfoResetBtn').innerText =
    translations[lang].recipeInfoResetBtn;
  document.getElementById('recipeInfoApplyBtn').innerText =
    translations[lang].recipeInfoApplyBtn;

  document.getElementById('raostingTimeLabel').innerText =
    translations[lang].raostingTimeLabel;
  document.getElementById('crackBtn').innerText = translations[lang].crackBtn;
  document.getElementById('CoolDowndBtn').innerText =
    translations[lang].CoolDowndBtn;
  document.getElementById('CoolDowndStopBtn').innerText =
    translations[lang].CoolDowndStopBtn;
  document.getElementById('disposeBtn').innerText =
    translations[lang].disposeBtn;
  // document.getElementById('recipeResetBtn').innerText =
  // //   translations[lang].recipeResetBtn;

  // document.getElementById('confirm-yes').innerText =
  //   translations[lang].confirmYes;
  // document.getElementById('confirm-no').innerText =
  //   translations[lang].confirmNo;
  // document.getElementById('keypadSubmit').innerText =
  //   translations[lang].keypadSubmit;
}

// async function setLanguageBasedOnLocation() {
//   try {
//     // IP-API를 사용하여 국가 코드 가져오기
//     const response = await fetch('https://ipapi.co/json/');
//     const data = await response.json();

//     if (data.country_code === 'KR') {
//       console.log('접속위치 한국');
//       setLanguage('ko'); // 한국어 설정
//     } else {
//       console.log('접속위치 외국');
//       setLanguage('en'); // 영어 설정
//     }
//   } catch (error) {
//     console.error('Failed to detect location:', error);
//     setLanguage('en'); // 기본값 영어로 설정
//   }
// }

function initializeLanguage() {
  // localStorage에서 언어 플래그 가져오기
  const savedFlag = localStorage.getItem('lengFlag');

  if (savedFlag === '0') {
    setLanguage('ko'); // 한국어 설정
  } else if (savedFlag === '1') {
    setLanguage('en'); // 영어 설정
  } else {
    // 저장된 값이 없으면 기본 언어 설정
    setLanguage('ko'); // 한국어를 기본값으로 설정
  }
}

function handleRoastModeChange() {
  const selectedMode = document.getElementById('roastModeSet').value;

  // All mode divs
  const modes = ['roastInfoPowerDiv', 'roastInfoDiv', 'expertMode'];

  // Hide all divs
  modes.forEach((id) => {
    document.getElementById(id).classList.remove('hidden');
  });

  // Show the selected mode div
  if (selectedMode === 'Simple') {
    document.getElementById('roastInfoPowerDiv').classList.add('hidden');
    document.getElementById('roastInfoDiv').classList.add('hidden');
  } else if (selectedMode === 'Balance') {
    document.getElementById('balanceMode').classList.add('hidden');
  } else if (selectedMode === 'Expert') {
    document.getElementById('expertMode').classList.add('hidden');
  }
}

// 전체화면 요청 함수
function goFullScreen() {
  const element = document.documentElement; // 전체 화면을 요청할 HTML 요소 (문서의 루트)

  if (element.requestFullscreen) {
    // 표준 전체화면 API
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox 전체화면 API
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome 및 Safari 전체화면 API
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE11 전체화면 API
    element.msRequestFullscreen();
  } else {
    console.log('이 브라우저는 전체화면을 지원하지 않습니다.');
  }
}

// 전체화면 종료 함수
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else {
    console.log('이 브라우저는 전체화면 종료를 지원하지 않습니다.');
  }
}

// 키보드 이벤트 리스너

let lastKeyTime = 0; // 마지막으로 키가 눌린 시간
let keyPressTimeout; // 타이머를 저장할 변수

document.addEventListener('keydown', function (event) {
  //단축키 리스트
  //

  // q : fan1
  // w: heater
  // e : fan2

  // r: auto toggle

  // a 2번 누름 : 크랙 포인트
  // s 2번 누름 : 쿨링시작
  // d 2번 누름 : 배출 시작

  // y : yes
  // n : no
  // enter
  //control + v : 전체화면

  // console.log('keydown');
  // console.log(event);
  const modal = document.getElementById('keypadModal');
  const confirmModal = document.getElementById('showCustomConfirm-modal');

  //roastPanel 일경우에만 단축키 작동
  if (adminPanelId == 'roastPanel') {
    console.log(adminPanelId);
    if (event.key == 'q' || event.key == 'ㅂ') {
      //fan1선택
      if (modal.classList.contains('hidden')) {
        //modal 창이 켜져있으면 현재 값을 넣고 아니면 모달창값을 변경하지 않는다
        currentValueModalKeypadFan1 = '';
        currentFan1Numver = document.getElementById('fan1Number').value;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
        currentValueModalKeypadHeater = '';
        currentHeaterNumver = document.getElementById('heaterNumber').value;
        keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
        currentValueModalKeypadFan2 = '';
        currentFan2Numver = document.getElementById('fan2Number').value;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
        //key 색상변경
        keyFan1.className = 'bg-red-500 text-white py-2rounded';
        keyHeater.className = 'bg-gray-200 text-black py-2 rounded';
        keyFan2.className = 'bg-gray-200 text-black py-2 rounded';

        //출력 선택
        choiceOutModal = 1; // 1 : fan1 ,2 : heater ,3 : fan2
        keypadModal.classList.remove('hidden');
      } else {
        console.log('check');
        currentValueModalKeypadFan1 = '';
        currentFan1Numver = document.getElementById('fan1Slider').value;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;

        //key 색상변경
        keyFan1.className = 'bg-red-500 text-white py-2rounded';
        keyHeater.className = 'bg-gray-200 text-black py-2 rounded';
        keyFan2.className = 'bg-gray-200 text-black py-2 rounded';
        //출력 선택
        choiceOutModal = 1;
      }
    }

    if (event.key == 'w' || event.key == 'ㅈ') {
      //heater 선택
      const modal = document.getElementById('keypadModal');

      if (modal.classList.contains('hidden')) {
        currentValueModalKeypadFan1 = '';
        currentFan1Numver = document.getElementById('fan1Number').value;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
        currentValueModalKeypadHeater = '';
        currentHeaterNumver = document.getElementById('heaterNumber').value;
        keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
        currentValueModalKeypadFan2 = '';
        currentFan2Numver = document.getElementById('fan2Number').value;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;

        //key 색상변경
        keyHeater.className = 'bg-red-500 text-white py-2rounded';
        keyFan1.className = 'bg-gray-200 text-black py-2 rounded';
        keyFan2.className = 'bg-gray-200 text-black py-2 rounded';
        choiceOutModal = 2; // 1 : fan1 ,2 : heater ,3 : fan2
        keypadModal.classList.remove('hidden');
      } else {
        currentValueModalKeypadHeater = '';
        currentHeaterNumver = document.getElementById('heaterSlider').value;
        keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;

        //key 색상변경
        keyHeater.className = 'bg-red-500 text-white py-2rounded';
        keyFan1.className = 'bg-gray-200 text-black py-2 rounded';
        keyFan2.className = 'bg-gray-200 text-black py-2 rounded';
        //출력 선택
        choiceOutModal = 2;
      }
    }

    if (event.key == 'e' || event.key == 'ㄷ') {
      //fan2 선택

      const modal = document.getElementById('keypadModal');
      if (modal.classList.contains('hidden')) {
        currentValueModalKeypadFan1 = '';
        currentFan1Numver = document.getElementById('fan1Number').value;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
        currentValueModalKeypadHeater = '';
        currentHeaterNumver = document.getElementById('heaterNumber').value;
        keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
        currentValueModalKeypadFan2 = '';
        currentFan2Numver = document.getElementById('fan2Number').value;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
        //key 색상변경
        keyFan2.className = 'bg-red-500 text-white py-2 rounded';
        keyFan1.className = 'bg-gray-200 text-black py-2 rounded';
        keyHeater.className = 'bg-gray-200 text-black py-2 rounded';
        choiceOutModal = 3; // 1 : fan1 ,2 : heater ,3 : fan2
        keypadModal.classList.remove('hidden');
      } else {
        currentValueModalKeypadFan2 = '';
        currentFan2Numver = document.getElementById('fan2Slider').value;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;

        //key 색상변경
        keyFan2.className = 'bg-red-500 text-white py-2 rounded';
        keyFan1.className = 'bg-gray-200 text-black py-2 rounded';
        keyHeater.className = 'bg-gray-200 text-black py-2 rounded';
        //출력 선택
        choiceOutModal = 3;
      }
    }

    // 'r' 키가 눌렸을 때 오토모드를 토글하는 이벤트 추가

    if (event.key == 'r' || event.key == 'ㄱ') {
      // 'r' 키를 눌렀을 때
      toggle.checked = !toggle.checked; // 체크박스 상태를 반전
      // 'change' 이벤트 트리거
      const changeEvent = new Event('change');
      toggle.dispatchEvent(changeEvent);
    }

    if (event.key == 'c' || event.key == 'ㅊ') {
      if (!modal.classList.contains('hidden')) {
        currentFan1Numver = document.getElementById('fan1Slider').value;
        currentHeaterNumver = document.getElementById('heaterSlider').value;
        currentFan2Numver = document.getElementById('fan2Slider').value;

        keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
        keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
        currentValueModalKeypadFan1 = '';
        currentValueModalKeypadHeater = '';
        currentValueModalKeypadFan2 = '';
      }
    }

    if (event.key == 'y' || event.key == 'ㅛ') {
      //컨펌 모달창이 켜졌을경우
      if (!confirmModal.classList.contains('hidden')) {
        console.log('클릭!');
        const confirmButton = document.getElementById('confirm-yes');
        confirmButton.click(); // 버튼 클릭 이벤트 실행
        confirmModal.classList.add('hidden');
      }
    }

    if (event.key == 'ㅜ' || event.key == 'n') {
      //컨펌 모달창이 켜졌을경우
      if (!confirmModal.classList.contains('hidden')) {
        console.log('클릭!');
        const confirmButton = document.getElementById('confirm-no');
        confirmButton.click(); // 버튼 클릭 이벤트 실행
        confirmModal.classList.add('hidden');
      }
    }

    if (event.key == 'Enter') {
      //입력!
      //컨펌 모달창이 켜졌을경우
      if (!confirmModal.classList.contains('hidden')) {
        console.log('클릭!');
        const confirmButton = document.getElementById('confirm-yes');
        confirmButton.click(); // 버튼 클릭 이벤트 실행
        confirmModal.classList.add('hidden');
      }

      //키패드 모달창이 켜졌을 경우
      if (!modal.classList.contains('hidden')) {
        let returnCheck = 0;

        if (addvalueModalKeypadFan1 == '') {
          //값을 아무것도 입력안했을 경우 기존값으로 입력
          fan1NumberModal.value = document.getElementById('fan1Number').value;
          addvalueModalKeypadFan1 = document.getElementById('fan1Number').value;
        } else {
          fan1NumberModal.value = addvalueModalKeypadFan1;
          console.log('fan1 입력');
          const fan1Number = parseFloat(fan1NumberModal.value);
          if (fan1Number > 30) {
            if (fan1Number <= 100) {
              updateNumberValue('fan1Number', 'fan1Value', 'fan1Slider');
            } else {
              fan1NumberModal.value = '100';
            }
          } else {
            fan1NumberModal.value = '30';
          }
        }

        if (addValueModalKeypadHeater == '') {
          //값을 아무것도 입력안했을 경우 기존값으로 입력
          heaterNumberModal.value =
            document.getElementById('heaterNumber').value;
          addValueModalKeypadHeater =
            document.getElementById('heaterNumber').value;
        } else {
          console.log('heater 입력');
          heaterNumberModal.value = addValueModalKeypadHeater;
          const heaterNumber = parseFloat(heaterNumberModal.value);
          if (heaterNumber <= 100) {
            updateNumberValue('heaterNumber', 'heaterValue', 'heaterSlider');
          } else {
            heaterNumberModal.value = '100';
            updateNumberValue('heaterNumber', 'heaterValue', 'heaterSlider');
          }
        }

        if (addValueModalKeypadFan2 == '') {
          //값을 아무것도 입력안했을 경우 기존값으로 입력
          fan2NumberModal.value = document.getElementById('fan2Number').value;
          addValueModalKeypadFan2 = document.getElementById('fan2Number').value;
        } else {
          console.log('fan2 입력');
          fan2NumberModal.value = addValueModalKeypadFan2;

          const fan2Number = parseFloat(fan2NumberModal.value);
          if (fan2Number >= 2.5) {
            if (fan2Number <= 12.5) {
              updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
            } else {
              // fan2NumberModal.value = '12.5';
              fan2NumberModal.value = '100';
              updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
            }
          } else {
            fan2NumberModal.value = '2.5';
            updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
          }
        }

        if (addvalueModalKeypadFan1 < 30) {
          keypadCurrentValueFan1.textContent = '30';
          currentValueModalKeypadFan1 = '30';
          updateNumberValue('fan1Number', 'fan1Value', 'fan1Slider');
          // returnCheck++;
        }

        if (addvalueModalKeypadFan1 > 100) {
          keypadCurrentValueFan1.textContent = '100';
          currentValueModalKeypadFan1 = '100';
          updateNumberValue('fan1Number', 'fan1Value', 'fan1Slider');
          // keypadCurrentValueFan1.textContent = '값이 100보다 클 수 없습니다.';
          // returnCheck++;
        }
        if (addValueModalKeypadHeater > 100) {
          keypadCurrentValueHeater.textContent = '100';
          currentValueModalKeypadHeater = '100';
          updateNumberValue('heaterNumber', 'heaterValue', 'heaterSlider');
          // keypadCurrentValueHeater.textContent = '값이 100보다 클 수 없습니다.';
          // returnCheck++;
        }
        if (addValueModalKeypadFan2 < 2.5) {
          keypadCurrentValueFan2.textContent = '2.5';
          currentValueModalKeypadFan2 = '2.5';
          updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
          // keypadCurrentValueFan2.textContent = '값이 2.5보다 작을 수 없습니다.';
          // returnCheck++;
        } else if (addValueModalKeypadFan2 > 12.5) {
          keypadCurrentValueFan2.textContent = '12.5';
          currentValueModalKeypadFan2 = '12.5';
          updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
          // keypadCurrentValueFan2.textContent = '값이 12.5보다 클 수 없습니다.';
          // returnCheck++;
        }

        if (returnCheck >= 1) {
          return;
        }

        keypadModal.classList.add('hidden');
      }
    }

    if (event.key == '1') {
      const dataValue = 1;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }

    if (event.key == '2') {
      const dataValue = 2;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '3') {
      const dataValue = 3;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '4') {
      const dataValue = 4;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }

    if (event.key == '5') {
      const dataValue = 5;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '6') {
      const dataValue = 6;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '7') {
      const dataValue = 7;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '8') {
      const dataValue = 8;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '9') {
      const dataValue = 9;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }
    if (event.key == '0') {
      const dataValue = 0;
      if (choiceOutModal == 1) {
        currentValueModalKeypadFan1 += dataValue;
        keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
        addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
      } else if (choiceOutModal == 2) {
        currentValueModalKeypadHeater += dataValue;
        keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
        addValueModalKeypadHeater = currentValueModalKeypadHeater;
      } else if (choiceOutModal == 3) {
        currentValueModalKeypadFan2 += dataValue;
        keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
        addValueModalKeypadFan2 = currentValueModalKeypadFan2;
      }
    }

    //크랙포인트 단축키
    if (event.key == 'a' || event.key == 'ㅁ') {
      const currentTime = new Date().getTime(); // 현재 시간

      // 키를 빠르게 두 번 눌렀을 때
      if (currentTime - lastKeyTime < 500) {
        // 500ms 이내에 두 번째 키를 눌렀을 때

        startRecordingCrackPoint(); // 빠르게 두 번 눌렀을 때 실행
      }

      // 타이머 리셋 및 마지막 키 시간 갱신
      lastKeyTime = currentTime;

      // 타이머 초기화 (500ms 후 실행되는 동작)
      clearTimeout(keyPressTimeout);
      keyPressTimeout = setTimeout(function () {
        lastKeyTime = 0; // 타이머가 종료되면 마지막 키 시간 초기화
      }, 500); // 500ms 후에 초기화
    }

    //쿨링 단축키
    if (event.key == 's' || event.key == 'ㄴ') {
      const currentTime = new Date().getTime(); // 현재 시간

      // 키를 빠르게 두 번 눌렀을 때
      if (currentTime - lastKeyTime < 500) {
        // 500ms 이내에 두 번째 키를 눌렀을 때

        if (lengFlag == 0) {
          showCustomConfirm('쿨링을 시작 하시겠습니까?', (result) => {
            if (result) {
              coolingMode();
              console.log('사용자가 확인을 선택했습니다.');
            } else {
              console.log('사용자가 취소를 선택했습니다.');
            }
          });
        } else {
          showCustomConfirm('Do you want to start cooling?', (result) => {
            if (result) {
              coolingMode();
              console.log('사용자가 확인을 선택했습니다.');
            } else {
              console.log('사용자가 취소를 선택했습니다.');
            }
          });
        }
      }

      // 타이머 리셋 및 마지막 키 시간 갱신
      lastKeyTime = currentTime;

      // 타이머 초기화 (500ms 후 실행되는 동작)
      clearTimeout(keyPressTimeout);
      keyPressTimeout = setTimeout(function () {
        lastKeyTime = 0; // 타이머가 종료되면 마지막 키 시간 초기화
      }, 500); // 500ms 후에 초기화
    }

    //배출 단축키
    if (event.key == 'd' || event.key == 'ㅇ') {
      const currentTime = new Date().getTime(); // 현재 시간

      // 키를 빠르게 두 번 눌렀을 때
      if (currentTime - lastKeyTime < 500) {
        // 500ms 이내에 두 번째 키를 눌렀을 때

        if (lengFlag == 0) {
          showCustomConfirm('배출을 시작 하시겠습니까?', (result) => {
            if (result) {
              manualDispose();
              console.log('사용자가 확인을 선택했습니다.');
            } else {
              console.log('사용자가 취소를 선택했습니다.');
            }
          });
        } else {
          showCustomConfirm('Do you want to start dispose?', (result) => {
            if (result) {
              manualDispose();

              console.log('사용자가 확인을 선택했습니다.');
            } else {
              console.log('사용자가 취소를 선택했습니다.');
            }
          });
        }
      }

      // 타이머 리셋 및 마지막 키 시간 갱신
      lastKeyTime = currentTime;

      // 타이머 초기화 (500ms 후 실행되는 동작)
      clearTimeout(keyPressTimeout);
      keyPressTimeout = setTimeout(function () {
        lastKeyTime = 0; // 타이머가 종료되면 마지막 키 시간 초기화
      }, 500); // 500ms 후에 초기화
    }
  }

  if (event.ctrlKey || event.key === 'v') {
    // Ctrl + v 키를 눌렀을 때 전체화면 활성화
    goFullScreen();
    console.log('goFullScreen()');
  } else if (event.ctrlKey && event.key === 'e') {
    // Ctrl + E 키를 눌렀을 때 전체화면 종료
    exitFullScreen();
  } else if (event.key === 'Escape') {
    // Escape 키를 눌렀을 때 전체화면 종료

    //모달창 켜졌을경우 끄기
    if (!modal.classList.contains('hidden')) {
      currentFan1Numver = document.getElementById('fan1Slider').value;
      currentHeaterNumver = document.getElementById('heaterSlider').value;
      currentFan2Numver = document.getElementById('fan2Slider').value;
      keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
      keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
      keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
      currentValueModalKeypadFan1 = '';
      currentValueModalKeypadHeater = '';
      currentValueModalKeypadFan2 = '';
      keypadModal.classList.add('hidden');
    }
  }
});
