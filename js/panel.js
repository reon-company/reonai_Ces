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

function headerDisplayNone() {
  document.getElementById('topHeader').classList.add('hidden');
  document.getElementById('sideHeader').classList.add('hidden');
}

function headerDisplayBlock() {
  document.getElementById('topHeader').classList.remove('hidden');
  document.getElementById('sideHeader').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  // showPanel('mainPanel');
  showPanel('roastPanel');

  //로그인!
  const storedUserInfo = localStorage.getItem('userInfo');

  if (storedUserInfo) {
    // 사용자 정보 복원
    const userInfo = JSON.parse(storedUserInfo);

    document.getElementById('logoutBtn').style.display = 'block'; // 로그아웃 버튼 보이기
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('email').style.display = 'none';
    document.getElementById('password').style.display = 'none';

    document.getElementById('loginUserName').style.display = 'block';
    document.getElementById('loginUserName').textContent = userInfo.firstName;

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
