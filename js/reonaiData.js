// 레시피 저장 및 로드 데이터
const clientIdData = '4d042c50-bd70-11ee-aa8b-e30685fde2fa';
const clientNameData = 'reon';
let memberIdData = 67;
let roasterSnData = 'R2N0BK-0001-20240418';
let titleData = 0;
let rorData = [];
let crackPointsData = [];
let crackPointTimeData = [];
let turningPointTempData = [];
let turningPointTimeData = [];
let coolingPointTempData = [];
let coolingPointTimeData = [];
let preheatTempData = [];
let disposeTempData = [];
let disposeTimeData = [];
let inputCapacityData = [];
let dtrData = [];

// 전역 변수로 불러온 데이터를 저장할 변수 선언
let loadedRoastData = null;

// 전역 변수 선언 로그인 정보!
let isLogin = false;
let userData = {
  activated: null,
  address: null,
  authorityDtoSet: [],
  companyName: null,
  email: null,
  firstName: null,
  id: null,
  lastName: null,
  oauthClient: null,
  phone: null,
  picture: null,
  prdCode: null,
  roasterSn: null,
  type: null,
};

// 출력 값에 info에서 설정한 값을 넣어주는 변수
let roastInfoRecipeName = 0;
let roastInfoBeanName = 0;
let roastInfoInputAmount = 0;
let roastInfoStageSelect = 0;

let roastInfoPowerFan1Select = 0;
let roastInfoPowerFan2Select = 0;
let roastInfoPowerHeaterSelect = 0;
let memoTextArea = 0;

//로그아웃 스크립트
document.getElementById('logoutBtn').addEventListener('click', logout);

//로그인 스크립트
document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // 폼의 기본 동작 방지

    console.log('로그인동작하나?');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const url = 'https://www.reonaicoffee.com/api/login/email';

    const data = {
      clientName: 'reon',
      clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
      authClientName: '',
      email: email,
      password: password,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              errorData.message || 'Error decoding error message'
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        // 로그인 성공 처리

        // 사용자 정보 저장
        // const userInfo = {
        //   activated: data.data.activated,
        //   address: data.data.address,
        //   authorityDtoSet: data.data.authorityDtoSet,
        //   companyName: data.data.companyName,
        //   email: data.data.email,
        //   firstName: data.data.firstName,
        //   id: data.data.id,
        //   lastName: data.data.lastName,
        //   oauthClient: data.data.oauthClient,
        //   phone: data.data.phone,
        //   picture: data.data.picture,
        //   prdCode: data.data.prdCode,
        //   roasterSn: data.data.roasterSn,
        //   type: data.data.type,
        // };

        document.getElementById('logoutBtn').style.display = 'block'; //로그아웃 버튼 보이기

        document.getElementById('signIn').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('email').style.display = 'none';
        document.getElementById('password').style.display = 'none'; //로그인창 안보이게

        // 서버로부터 받은 데이터 출력
        console.log('서버로부터 받은 데이터:', data);
        isLogin = true;
        // 데이터 추출하여 전역 변수에 저장
        userData.activated = data.data.activated;
        userData.address = data.data.address;
        userData.authorityDtoSet = data.data.authorityDtoSet;
        userData.companyName = data.data.companyName;
        userData.email = data.data.email;
        userData.firstName = data.data.firstName;
        userData.id = data.data.id;
        userData.lastName = data.data.lastName;
        userData.oauthClient = data.data.oauthClient;
        userData.phone = data.data.phone;
        userData.picture = data.data.picture;
        userData.prdCode = data.data.prdCode;
        userData.roasterSn = data.data.roasterSn;
        userData.type = data.data.type;

        // 전역 변수에 저장된 데이터 확인
        console.log('저장된 사용자 데이터:', userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));

        document.getElementById('loginUserName').style.display = 'block';
        document.getElementById('loginUserName').textContent =
          userData.firstName;

        // 필요한 후속 작업 수행 (예: 페이지 이동, 토큰 저장 등)

        getMyRecords(userData);
        getPilot();
        return userData;
      })
      .catch((error) => {
        // 에러 처리
        document.getElementById(
          'responseMessage'
        ).textContent = `에러: ${error.message}`;
      });
    //에러 삭제
    document.getElementById('responseMessage').textContent = ``;
  });

//마이레코드 목록을 를 서버에서 가지고오는 함수
async function getMyRecords(userData) {
  const getMyId = userData.id;
  const url = 'https://www.reonaicoffee.com/api/records';

  const requestData = {
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    clientName: 'reon',
    memberId: userData.id,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error('HTTP error: ', response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
    if (data && data.status === 200) {
      let myRecords = data.data;

      // 최신순 정렬 (assumes `item.date` contains date string)
      myRecords = myRecords.sort((a, b) => b.id - a.id);

      document.getElementById('getMyRecordsResult').innerHTML = '';
      //   document.getElementById('refGetMyRecordsResult').innerHTML = '';
      myRecords.forEach((item, index) => {
        const recordButton = document.createElement('button');
        recordButton.innerText = `ID: ${item.id}, Title: ${item.title}`;
        recordButton.className = 'record-btn';

        console.log(item);
        recordButton.onclick = () => fetchRecordDetails(item.id, item.memberId);
        document.getElementById('getMyRecordsResult').appendChild(recordButton);
        // document
        //   .getElementById('refGetMyRecordsResult')
        //   .appendChild(recordButton);
      });
    } else {
      console.error('Server error:', data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('getMyRecordsResult').innerText =
      'Error fetching data.';
    // document.getElementById('refGetMyRecordsResult').innerText =
    //   'Error fetching data.';
  }
}

//파일럿 레시피 목록을 서버에서 가지고오는 함수
async function getPilot() {
  const url = 'https://www.reonaicoffee.com/api/records/contain/pilot';
  const requestData = {
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    clientName: 'reon',
    memberId: userData.id,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error('HTTP error: ', response.status);
      return;
    }

    const data = await response.json();

    if (data && data.status === 200) {
      let pilotRecords = data.data.pilotRecords;

      // 최신순 정렬 (assumes `item.date` contains date string)
      pilotRecords = pilotRecords.sort((a, b) => b.id - a.id);

      document.getElementById('getPilotresult').innerHTML = '';
      //   document.getElementById('refGetPilotresult').innerHTML = '';
      pilotRecords.forEach((item, index) => {
        const recordButton = document.createElement('button');
        recordButton.innerText = `ID: ${item.id}, Title: ${item.title}`;
        recordButton.className = 'record-btn';
        console.log(item);
        recordButton.onclick = () => fetchRecordDetails(item.id, item.memberId);
        document.getElementById('getPilotresult').appendChild(recordButton);
        // document.getElementById('refGetPilotresult').appendChild(recordButton);
      });
    } else {
      console.error('Server error:', data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('getPilotresult').innerText =
      'Error fetching data.';
    // document.getElementById('refGetPilotresult').innerText =
    //   'Error fetching data.';
  }
}

// 선택한 레시피를 서버에서 가지고오는 함수
async function fetchRecordDetails(recordId, recordMemberId) {
  // 요청하려는 URL을 콘솔에 출력하여 확인
  const url = `https://www.reonaicoffee.com/api/records/${recordId}`;
  console.log('Fetching details for:', url);

  console.log(recordMemberId);
  console.log('userData.id', userData.id);
  // 요청에 필요한 데이터
  const requestData = {
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    clientName: 'reon',
    memberId: userData.id, //  사용자 ID
    pilot: true, // 파일럿 로그: true,
  };

  try {
    const response = await fetch(url, {
      method: 'POST', // 서버에서 허용하는 메서드로 변경 (예: 'POST')
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData), // POST 요청에 필요한 데이터
    });

    if (!response.ok) {
      // 응답 상태 코드가 200이 아닌 경우 에러 출력
      console.error('HTTP error:', response.status, response.statusText);
      const errorText = await response.text(); // 에러 상세 내용 확인
      console.error('Error details:', errorText);
      return;
    }

    const jsonData = await response.json();
    displayData(jsonData); // JSON 데이터를 UI에 반영

    console.log('JSON 데이터를 UI에 반영');
  } catch (error) {
    console.error('Error fetching record details:', error);
  }
}

// JSON 데이터를 UI에 반영하는 함수
function displayData(data) {
  resetChartsAll();
  // 응답 내의 data 객체 추출
  const details = data.data;
  loadedRoastData = data.data;
  // 추출한 데이터를 사용하여 UI 요소 업데이트

  console.log(
    'displayData2 불러온 json의 coolingPointTime',
    details.coolingPointTime
  );
  extractSecondsFromTime(details.coolingPointTime);
  extractSecondsFromTimeForTp(details.turningPointTime);

  // 데이터를 추출하고 파싱

  document.getElementById('recordId').innerText = details.id ? details.id : '-';
  document.getElementById('recordTitle').innerText = details.title
    ? details.title
    : '-';
  document.getElementById('recordDate').innerText = details.createdDate
    ? details.createdDate
    : '-';
  document.getElementById('recordTime').innerText = details.createdTime
    ? details.createdTime
    : '-';

  // 콘솔에 불러온 내용 출력
  console.log('Data loaded:', data);
  console.log('Data.data loaded:', details);

  const tpUnderTemp = parseFloat(JSON.parse(details.turningPointTemp || '[]'));
  // 콘솔에 불러온 내용을 출력
  console.log('데이터가 불러와졌습니다: ' + JSON.stringify(details, null, 2));

  const cpUnderTemp = parseFloat(JSON.parse(details.coolingPointTemp || '[]'));

  // 차트에 불러온 데이터를 추가
  if (Highcharts.charts.length > 0) {
    let chartLengthData = JSON.parse(details.temp1 || '[]').length;

    chartLengthNumber = chartLengthData;
    Highcharts.charts[0].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });
    Highcharts.charts[1].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });

    Highcharts.charts[0].series[5].setData(JSON.parse(details.temp1 || '[]'));
    Highcharts.charts[0].series[6].setData(JSON.parse(details.temp2 || '[]'));
    Highcharts.charts[0].series[7].setData(JSON.parse(details.temp3 || '[]'));

    Highcharts.charts[0].series[9].addPoint(
      [tpUnderTime, tpUnderTemp],
      true,
      false
    );

    Highcharts.charts[0].series[11].addPoint(
      [CpUnderTime, cpUnderTemp],
      true,
      false
    );

    Highcharts.charts[1].series[3].setData(JSON.parse(details.fan || '[]'));
    Highcharts.charts[1].series[4].setData(JSON.parse(details.heater || '[]'));
    Highcharts.charts[1].series[5].setData(JSON.parse(details.fan2 || '[]'));

    //recipe chart 에 넣기
    Highcharts.charts[2].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });
    Highcharts.charts[3].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });

    Highcharts.charts[2].series[5].setData(JSON.parse(details.temp1 || '[]'));
    Highcharts.charts[2].series[6].setData(JSON.parse(details.temp2 || '[]'));
    Highcharts.charts[2].series[7].setData(JSON.parse(details.temp3 || '[]'));

    Highcharts.charts[2].series[9].addPoint(
      [tpUnderTime, tpUnderTemp],
      true,
      false
    );

    Highcharts.charts[2].series[11].addPoint(
      [CpUnderTime, cpUnderTemp],
      true,
      false
    );

    Highcharts.charts[3].series[3].setData(JSON.parse(details.fan || '[]'));
    Highcharts.charts[3].series[4].setData(JSON.parse(details.heater || '[]'));
    Highcharts.charts[3].series[5].setData(JSON.parse(details.fan2 || '[]'));

    autofan1Values = JSON.parse(details.fan || '[]'); // 불러온 fan 데이터
    autoheaterValues = JSON.parse(details.heater || '[]'); // 불러온 heater 데이터
    autofan2Values = JSON.parse(details.fan2 || '[]'); // 불러온 fan2 데이터
    autotemp1Values = JSON.parse(details.temp1 || '[]'); // 불러온 temp 데이터
    autotemp2Values = JSON.parse(details.temp2 || '[]'); // 불러온 temp 데이터

    document.getElementById('roastInfoPowerFan1Select').value =
      JSON.parse(details.fan || '[]')[0] || null;
    document.getElementById('roastInfoPowerFan2Select').value =
      JSON.parse(details.fan2 || '[]')[0] || null;
    document.getElementById('roastInfoPowerHeaterSelect').value =
      JSON.parse(details.heater || '[]')[0] || null;
  }

  console.log('cpUnderTemp', cpUnderTemp);
  console.log('tpUnderTemp', tpUnderTemp);
}

// autoRoastingButton 버튼 클릭 시 getPilot 함수 호출
// document
//   .getElementById('autoRoastingButton')
//   .addEventListener('click', getPilot);
// referenceFinderBtn 버튼 클릭 시 getPilot 함수 호출
// document
//   .getElementById('referenceFinderBtn')
//   .addEventListener('click', getPilot);

// autoRoastingButton 버튼 클릭 시 getPilot 함수 호출
// document
//   .getElementById('autoRoastingButton')
//   .addEventListener('click', () => getMyRecords(userData));

// referenceFinderBtnn 버튼 클릭 시 getPilot 함수 호출
// document
//   .getElementById('referenceFinderBtn')
//   .addEventListener('click', () => getMyRecords(userData));

function resetChartsAll() {
  console.log('resetChartsAll() 초기화 함수 실행');

  let latestPlotBandId = crackPlotBandIds[crackPlotBandIds.length - 1]; //crackPlotBandIds 의 마지막 id
  isFirstCp = null; // 쿨링 포인트 플래그 리셋
  isFirstTp = null; // 터닝 포인트가 플래그 리셋
  receivedData = [];
  outputData = [];
  crackPoints = [];
  crackPointTimes = [];

  startTime = new Date().getTime();
  if (plotBandPercentageText) {
    plotBandPercentageText = null;
    Highcharts.charts[0].xAxis[0].removePlotBand(latestPlotBandId);
    Highcharts.charts[2].xAxis[0].removePlotBand(latestPlotBandId);
  } //plotBandPercentageText 있어야 삭제함

  Highcharts.charts[0].series[0].setData([0]);
  Highcharts.charts[0].series[1].setData([0]);
  Highcharts.charts[0].series[2].setData([0]);
  Highcharts.charts[0].series[3].setData([0]);
  Highcharts.charts[0].series[4].setData([0]);
  Highcharts.charts[0].series[5].setData([0]);
  Highcharts.charts[0].series[6].setData([0]);
  Highcharts.charts[0].series[7].setData([0]);
  Highcharts.charts[0].series[8].setData([0]);
  Highcharts.charts[0].series[9].setData([0]);
  Highcharts.charts[0].series[10].setData([0]);
  Highcharts.charts[0].series[11].setData([0]);

  Highcharts.charts[1].series[0].setData([0]);
  Highcharts.charts[1].series[1].setData([0]);
  Highcharts.charts[1].series[2].setData([0]);
  Highcharts.charts[1].series[3].setData([0]);
  Highcharts.charts[1].series[4].setData([0]);
  Highcharts.charts[1].series[5].setData([0]);

  //recipe chart

  Highcharts.charts[2].series[0].setData([0]);
  Highcharts.charts[2].series[1].setData([0]);
  Highcharts.charts[2].series[2].setData([0]);
  Highcharts.charts[2].series[3].setData([0]);
  Highcharts.charts[2].series[4].setData([0]);
  Highcharts.charts[2].series[5].setData([0]);
  Highcharts.charts[2].series[6].setData([0]);
  Highcharts.charts[2].series[7].setData([0]);
  Highcharts.charts[2].series[8].setData([0]);
  Highcharts.charts[2].series[9].setData([0]);
  Highcharts.charts[2].series[10].setData([0]);
  Highcharts.charts[2].series[11].setData([0]);
  Highcharts.charts[3].series[0].setData([0]);
  Highcharts.charts[3].series[1].setData([0]);
  Highcharts.charts[3].series[2].setData([0]);
  Highcharts.charts[3].series[3].setData([0]);
  Highcharts.charts[3].series[4].setData([0]);
  Highcharts.charts[3].series[5].setData([0]);

  console.log('데이터가 초기화되었습니다.');
}

function resetRecipeChart() {
  //chart 0 의 레시피값
  Highcharts.charts[0].series[5].setData([0]);
  Highcharts.charts[0].series[6].setData([0]);
  Highcharts.charts[0].series[7].setData([0]);
  Highcharts.charts[0].series[8].setData([0]);
  Highcharts.charts[0].series[9].setData([0]);
  Highcharts.charts[0].series[10].setData([0]);
  Highcharts.charts[0].series[11].setData([0]);
  //chart 1 의 레시피값
  Highcharts.charts[1].series[3].setData([0]);
  Highcharts.charts[1].series[4].setData([0]);
  Highcharts.charts[1].series[5].setData([0]);
  //chart 23 의 레시피값
  Highcharts.charts[2].series[0].setData([0]);
  Highcharts.charts[2].series[1].setData([0]);
  Highcharts.charts[2].series[2].setData([0]);
  Highcharts.charts[2].series[3].setData([0]);
  Highcharts.charts[2].series[4].setData([0]);
  Highcharts.charts[2].series[5].setData([0]);
  Highcharts.charts[2].series[6].setData([0]);
  Highcharts.charts[2].series[7].setData([0]);
  Highcharts.charts[2].series[8].setData([0]);
  Highcharts.charts[2].series[9].setData([0]);
  Highcharts.charts[2].series[10].setData([0]);
  Highcharts.charts[2].series[11].setData([0]);
  Highcharts.charts[3].series[0].setData([0]);
  Highcharts.charts[3].series[1].setData([0]);
  Highcharts.charts[3].series[2].setData([0]);
  Highcharts.charts[3].series[3].setData([0]);
  Highcharts.charts[3].series[4].setData([0]);
  Highcharts.charts[3].series[5].setData([0]);

  toggleAutoRoasting();
  console.log('레시피 데이터가 초기화되었습니다.');
}

//각종 데이터 ,시간을 변환하는 함수들
// CpUnderTime 데이터를 분, 초로 변환하고 초 단위로 변환하고 CpUnderTime 전역변수에 저장
function extractSecondsFromTime(LoadcoolingPointTime) {
  const timeParts = LoadcoolingPointTime.split(' ')[1].split(':'); // '15:04:22' 추출
  const minutes = parseInt(timeParts[1], 10); // 분 추출
  const seconds = parseInt(timeParts[2], 10); // 초 추출

  CpUnderTime = minutes * 60 + seconds;
  console.log('CpUnderTime', CpUnderTime);
  // 분과 초를 초 단위로 변환
  return;
}
function extractSecondsFromTimeForTp(LoadTpTime) {
  const timeParts = LoadTpTime.split(' ')[1].split(':'); // '15:04:22' 추출
  const minutes = parseInt(timeParts[1], 10); // 분 추출
  const seconds = parseInt(timeParts[2], 10); // 초 추출

  tpUnderTime = minutes * 60 + seconds;

  console.log('tpUnderTime', tpUnderTime);
  // 분과 초를 초 단위로 변환
  return;
}
function timeFormetChange() {
  const seconds = document.getElementById('elapsedValue').innerText; // 예시 초 값
  console.log('timeFormetChange()', convertSecondsToTimeFormat(seconds));
  const savecoolingPointTime = convertSecondsToTimeFormat(seconds);
  return savecoolingPointTime;
}
function convertSecondsToTimeFormat(seconds) {
  // 현재 시간을 기준으로 Date 객체 생성
  const date = new Date(seconds * 1000);

  // YYYY-MM-DD 형식으로 변환
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
  const day = String(date.getUTCDate()).padStart(2, '0');

  // HH:MM:SS 형식으로 변환
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const secondsStr = String(date.getUTCSeconds()).padStart(2, '0');

  // 최종적으로 [YYYY-MM-DD HH:MM:SS +0000] 형식으로 반환
  const formattedTime = `[${year}-${month}-${day} ${hours}:${minutes}:${secondsStr} +0000]`;

  return formattedTime;
}

//easyRoastInfPanel에 repcipe 선택 내용 넣어주는 함수
function easyRoastRecipeData() {
  document.getElementById('easyRoasatRecordId').innerText =
    document.getElementById('recordId').innerText;

  document.getElementById('easyRoasatRecordTitle').innerText =
    document.getElementById('recordTitle').innerText;
  document.getElementById('easyRoasatRecordDate').innerText =
    document.getElementById('recordDate').innerText;
  document.getElementById('easyRoasatRecordTime').innerText =
    document.getElementById('recordTime').innerText;
}

// 연, , ���, 시간, 분, 초를 져오기 (UTC 기준)
function getFormattedUTCDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // "+0000" UTC 오프셋 추가
  const utcOffset = '+0000';

  // 원하는 포맷으로 변환
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${utcOffset}`;
}

//DTR을 계산하는 함수
function calculateDTR() {
  if (crackPointTimes.length > 0 && currentRoastingState === 3) {
    const crackTime = new Date(crackPointTimes[crackPointTimes.length - 1]);
    const currentTime = new Date();
    const totalRoastingTime = (currentTime - startTime) / 1000; // in secondsF
    const dtrTime = (currentTime - crackTime) / 1000; // in seconds
    return (dtrTime / totalRoastingTime) * 100;
  }
  return 100.0;
}

function RecipeWrite() {
  const jsonData = {
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    clientName: 'reon',
    memberId: userData.id,
    //  67,
    roasterSn: userData.roasterSn,

    // 'R2N0BK-0001-20240418',
    title: roastInfoRecipeName || 'No Title',
    fan: JSON.stringify(outputData.map((data) => data.fan1)),
    fan2: JSON.stringify(outputData.map((data) => data.fan2)),
    heater: JSON.stringify(outputData.map((data) => data.heater)),
    temp1: JSON.stringify(receivedData.map((data) => data.temp1)),
    temp2: JSON.stringify(receivedData.map((data) => data.temp2)),
    temp3: '[]',
    temp4: '[]',
    ror: '[]',
    memo: memoTextArea || 'No Memo',

    crackPoint: '[' + firstCrackPointTemp + ']',
    crackPointTime: convertSecondsToTimeFormat(firstCrackPointTime), // crackPointTime [0] 는 실제 시간 저장
    turningPointTemp: '[' + turningPointTemps + ']',
    turningPointTime: convertSecondsToTimeFormat(turningPointTimes),
    coolingPointTemp: '[' + coolingPointTemps + ']',
    coolingPointTime: convertSecondsToTimeFormat(coolingPointTimes),
    preheatTemp: 200.0,
    disposeTemp: '[' + disposalPointTemps + ']',
    disposeTime: convertSecondsToTimeFormat(disposalPointTimes),
    inputCapacity: roastInfoInputAmount,
    dtr: percentageOfDtr,
  };

  console.log(jsonData);

  $.ajax({
    type: 'post',
    url: 'https://www.reonaicoffee.com/api/records/upload',
    data: JSON.stringify(jsonData), // js오브젝트를 json으로 파싱
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    dataType: 'json',
  })
    .done((res) => {
      console.log('저장되었습니다.');
    })
    .fail((err) => {
      console.log(err);
    });
}

// CpUnderTime 데이터를 분, 초로 변환하고 초 단위로 변환하고 CpUnderTime 전역변수에 저장
function extractSecondsFromTime(LoadcoolingPointTime) {
  const timeParts = LoadcoolingPointTime.split(' ')[1].split(':'); // '15:04:22' 추출
  const minutes = parseInt(timeParts[1], 10); // 분 추출
  const seconds = parseInt(timeParts[2], 10); // 초 추출

  CpUnderTime = minutes * 60 + seconds;
  console.log('CpUnderTime', CpUnderTime);
  // 분과 초를 초 단위로 변환
  return;
}

function extractSecondsFromTimeForTp(LoadTpTime) {
  const timeParts = LoadTpTime.split(' ')[1].split(':'); // '15:04:22' 추출
  const minutes = parseInt(timeParts[1], 10); // 분 추출
  const seconds = parseInt(timeParts[2], 10); // 초 추출

  tpUnderTime = minutes * 60 + seconds;

  console.log('tpUnderTime', tpUnderTime);
  // 분과 초를 초 단위로 변환
  return;
}
function timeFormetChange() {
  const seconds = document.getElementById('elapsedValue').innerText; // 예시 초 값
  console.log('timeFormetChange()', convertSecondsToTimeFormat(seconds));
  const savecoolingPointTime = convertSecondsToTimeFormat(seconds);
  return savecoolingPointTime;
}
function convertSecondsToTimeFormat(seconds) {
  // 현재 시간을 기준으로 Date 객체 생성
  const date = new Date(seconds * 1000);

  // YYYY-MM-DD 형식으로 변환
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
  const day = String(date.getUTCDate()).padStart(2, '0');

  // HH:MM:SS 형식으로 변환
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const secondsStr = String(date.getUTCSeconds()).padStart(2, '0');

  // 최종적으로 [YYYY-MM-DD HH:MM:SS +0000] 형식으로 반환
  const formattedTime = `[${year}-${month}-${day} ${hours}:${minutes}:${secondsStr} +0000]`;

  return formattedTime;
}

// 로그아웃을 수행하는 함수

//로그아웃 스크립트
document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('signIn').style.display = 'block';
  document.getElementById('loginUserName').style.display = 'none';
  document.getElementById('loginUserName').textContent = '';
  console.log('로그아웃 완료');
});

function logout() {
  console.log('로그아웃 수행 중...');
  console.log('localStorage', localStorage);
  localStorage.removeItem('userInfo');

  // 로그인 상태 초기화
  isLogin = false;

  // 사용자 데이터 초기화
  userData = {
    activated: null,
    address: null,
    authorityDtoSet: [],
    companyName: null,
    email: null,
    firstName: null,
    id: null,
    lastName: null,
    oauthClient: null,
    phone: null,
    picture: null,
    prdCode: null,
    roasterSn: null,
    type: null,
  };

  loadedRoastData = null;

  // UI 요소 초기화
  document.getElementById('logoutBtn').style.display = 'none'; // 로그아웃 버튼 숨기기
  document.getElementById('loginBtn').style.display = 'block'; // 로그인 버튼 보이기
  document.getElementById('email').style.display = 'block'; // 이메일 입력창 보이기
  document.getElementById('password').style.display = 'block'; // 비밀번호 입력창 보이기
  document.getElementById('email').value = ''; // 이메일 입력창 초기화
  document.getElementById('password').value = ''; // 비밀번호 입력창 초기화

  console.log('localStorage', localStorage);
  console.log('로그아웃 및 데이터 초기화 완료');
}

//회원 가입 signIN

function signUp() {
  const requestData = {
    clientName: 'reon',
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    email: $('#sign-up-email').val(),
    firstName: $('#sign-up-first-name').val(),
    lastName: $('#sign-up-last-name').val(),
    password: $('#sign-up-password').val(),
    roasterSn: $('#sign-up-roasterSn').val(),
  };

  if (requestData.email.length == 0) {
    alert('email is required.');
    return;
  }

  if (requestData.firstName.length == 0) {
    alert('firstName is required.');
    return;
  }
  if (requestData.lastName.length == 0) {
    alert('lastName is required.');
    return;
  }

  const password = requestData.password;
  if (password.length == 0) {
    alert('password is required.');
    return;
  }

  const confirmPassword = $('#sign-up-confirm-password').val();
  if (confirmPassword.length == 0) {
    alert('confirm password is required.');
    return;
  }

  if (password !== confirmPassword) {
    alert('password and confirm-password are different.');
    return;
  }

  $.ajax({
    type: 'POST',
    url: 'https://www.reonaicoffee.com/api/login/email/sign-up',
    dataType: 'json',
    data: JSON.stringify(requestData),
    contentType: 'application/json; charset=utf-8',
  })
    .done(function (response) {
      alert('Your registration has been completed. Please login again.');
      showPanel('mainPanel');
    })
    .fail(function (error) {
      let responseJson = error.responseJSON;
      alert(
        'Failed to sign up. Please contact the administrator.\n(' +
          responseJson.message +
          ')'
      );
    });
}

function sendAuthCode() {
  const requestData = {
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    clientName: 'reon',
    purpose: '회원가입',
    email: $('#sign-up-email').val(),
  };

  alert('The authentication code has been sent.');

  $.ajax({
    type: 'POST',
    url: 'https://www.reonaicoffee.com/api/login/email/auth-code',
    dataType: 'json',
    data: JSON.stringify(requestData),
    contentType: 'application/json; charset=utf-8',
  })
    .done(function (response) {
      if (response.success) {
        return;
      }
      alert('The authentication code sending failed. Please try again.');
    })
    .fail(function (error) {
      let responseJson = error.responseJSON;
      alert(
        'Failed to send authentication code. Please contact the administrator.\n(' +
          responseJson.message +
          ')'
      );
    });
}

function verifyAuthCode() {
  const requestData = {
    clientName: 'reon',
    clientId: '4d042c50-bd70-11ee-aa8b-e30685fde2fa',
    email: $('#sign-up-email').val(),
    authCode: $('#email-auth-code').val(),
  };

  $.ajax({
    type: 'POST',
    url: 'https://www.reonaicoffee.com/api/login/email/auth-code/verify',
    dataType: 'json',
    data: JSON.stringify(requestData),
    contentType: 'application/json; charset=utf-8',
  })
    .done(function (response) {
      if (response.success) {
        alert('Your email has been verified.');
        return;
      }
      alert('Your email verification has failed. Please try again.');
    })
    .fail(function (error) {
      let responseJson = error.responseJSON;
      alert(
        'Failed to verify authentication code. Please contact the administrator.\n(' +
          responseJson.message +
          ')'
      );
    });
}
