function showPanel(panelId) {
  console.log(`showPanel called with panelId: ${panelId}`);
  const panels = [
    'mainPanel',
    'roastPanel',
    'roastInfoPanel',
    'recipePanel',
    'puttingCountPanel',
    'easyRoastInfoPanel',
    'easyRoastPanel',
    'settingPanel',
    'signInPanel',
    'SimpleRoastInfoPanel',
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
}

function adminUser() {
  document.getElementById('adminBtn').style.display = 'block';
  document.getElementById('adminBtn').classList.add('show');
}

function headerDisplayBlock() {
  document.getElementById('topHeader').classList.remove('hidden');
  document.getElementById('sideHeader').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  showPanel('mainPanel');
  // showPanel('mainPanel');
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
    puttingInfo: '생두를 투입해주세요!',
    raostingTimeLabel: '로스팅 시간:',
    crackBtn: '크랙',
    CoolDowndBtn: '쿨링',
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
    puttingInfo: 'Let’s load the green beans!',
    raostingTimeLabel: 'Roasting Time:',
    crackBtn: 'Crack',
    CoolDowndBtn: 'Cooling',
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

  document.getElementById('manualRoastingBtn').innerText =
    translations[lang].manualRoastingBtn;
  document.getElementById('recipeBtnForMain').innerText =
    translations[lang].recipe;
  document.getElementById('withoutpreheatingStartBtn').innerText =
    translations[lang].withoutpreheatingStartBtn;
  document.getElementById('recipeInfoResetBtn').innerText =
    translations[lang].recipeInfoResetBtn;
  document.getElementById('recipeInfoApplyBtn').innerText =
    translations[lang].recipeInfoApplyBtn;
  document.getElementById('puttingInfo').innerText =
    translations[lang].puttingInfo;

  document.getElementById('raostingTimeLabel').innerText =
    translations[lang].raostingTimeLabel;
  document.getElementById('crackBtn').innerText = translations[lang].crackBtn;
  document.getElementById('CoolDowndBtn').innerText =
    translations[lang].CoolDowndBtn;
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
