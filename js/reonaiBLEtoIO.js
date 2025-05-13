// 변수 선언
let device = null; // 블루투스 장치 객체
let server = null; // GATT 서버
let service = null; // 블루투스 서비스
let writeCharacteristic = null; // 쓰기 특성
let notifyCharacteristic = null; // 알림 특성
let isConnected = false; // 블루투스 연결 상태
let startTime = 0; // 블루투스 연결 시 시작 시간

// UUID (각 블루투스 장치와 서비스, 특성에 맞게 설정 필요)
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'; // 블루투스 서비스 UUID
const writeCharacteristicUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // 쓰기 특성 UUID
const notifyCharacteristicUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // 알림 특성 UUID

//터닝포인트와 쿨링포인트를 기록하기 위한 변수들
let temp1History2s = []; // 2초 동안의 temp1 값을 저장할 배열
const timeWindow2s = 2; // 2초
let temp1History5s = []; // 5초 동안의 temp1 값을 저장할 배열
let temp2History5s = []; // 5초 동안의 temp2 값을 저장할 배열
const timeWindow5s = 5; // 5초
let temp1History60s = []; // 60초 동안의 temp1 값을 저장할 배열
let temp2History60s = []; // 60초 동안의 temp2 값을 저장할 배열
const timeWindow60s = 60; // 60초
let crackPointCount = 0; // 크랙 포인트 기록 횟수
let crackPlotBandIds = []; // 크랙 plotBands의 id 목록
let plotBandPercentageText; // 차트에 표시할 비율 텍스트
let roastPlotBandIds = []; // 크랙 plotBands의 id 목록

//ai 적용 변수
//open ai 에게 보내기 전에 저장하는
let tempBuffer = []; // 10초 동안 저장될 배열
let tempHistory = []; // 누적 저장될 배열
let lastAnalysisSecond = -1; // 전역 또는 상단에 초기화

//simple roast 위한 변수
let simpleTemp2 = 0;
let simpleTemp1 = 0;

// actuator state 배출 도어 솔레노이드 동작 스테이트
let actuatorFlag = 0; // 0 : 기본 , 1 : 동작

//로스팅 데이터를 저장하는 배열
let receivedData = [];
let rorData = [];
let outputData = [];
let crackPoints = [];
let crackPointTimes = [];

let previousDataString = '';
let coolingPointTimes = null; // 터닝 포인트 시간을 저장하는 배열
let coolingPointTemps = 0; // 터닝 포인트 온도를 저장하는 배열
let turningPointTimes = null;
let turningPointTemps = 0;
let disposalPointTimes = null; // 배출 포인트  시간을 저장하는 배열
let disposalPointTemps = []; // 배출 포인트 온도를 저장하는 배열
let percentageOfDtr = 0.0; //DTR 퍼센트

let firstCrackPointTime = 0;
let firstCrackPointTemp = [];
let secondCrackPointTime = 0;
let secondCrackPointTemp = [];
let thirdCrackPointTime = 0;
let thirdCrackPointTemp = [];

// RoR 계산에 필요한 변수
let previousTemp1 = null;
let previousTemp2 = null;
let previousTime = null;
let RoR1Values = [];
let RoR2Values = [];

//시간을 제어하기 위한 변수들
let currentSecond = 0; // 현재 몇 번째 초인지 추적
let lastReceiveTime = 0; // 마지막 수신 시간을 기록
let bufferedData = null; // 수신된 데이터를 임시로 저장할 변수
let resetTime = null;
let bufferCounter = 0; // AI 버퍼를 카운트 하는 카운터

//차트의 기록을 제어하는 변수
let isRecordingcharts = false; // 차트 기록 상태 변수
let isRecordingCrackPoint = false; // 크랙 포인트 기록 상태 변수

let chartLengthNumber = 600; // 차트가 300 넘을때 상요하는 함수

//동작 플래그

let isTempDropping = true; // 온도가 하락 중인지를 추적하는 플래그
let isFirstCp = null; // 쿨링 포인트가 처음인지 확인하는 플래그
let isFirstTp = null; // 터닝 포인트가 처음인지 확인하는 플래그
let isFirstDisposal = null; // 배출이 처음인지 확인하는 플래그

let coolingPointFlag = null; // 쿨링포인트 플래그
let disposalFlag = null; // 배출포인트 플래그
let easyRoastingModeState = 0; // easy Roasting mode 플래그
let manualRoastingModeState = 0; // manual Roasting mode 플래그
let currentRoastingState = 0; //현재 상태 플래그 0,1,2,3

// 대기 = 0 = standby()
// 예열 = 1 = preheat()
// 투입 = 2 = beanPutting()
// 로스팅 = 3 = roasting()
// 쿨링 = 4 = cooling()
// 배출 =5  = disposing()

let isDisposalSequenceRunning = false; //배출스퀀스 플래그

//블르투스 연결 함수
async function connectBluetooth() {
  console.log('connectBluetooth() 블루투스 연결 함수 실행');
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUUID] }],
    });
    server = await device.gatt.connect();
    service = await server.getPrimaryService(serviceUUID);
    writeCharacteristic = await service.getCharacteristic(
      writeCharacteristicUUID
    );
    notifyCharacteristic = await service.getCharacteristic(
      notifyCharacteristicUUID
    );

    isConnected = true;

    // 디바이스 정보 가져오기
    const deviceInfo = {
      name: device.name || 'Unknown Device',
      id: device.id,
      connected: device.gatt.connected,
    };

    console.log('연결된 디바이스 정보:', deviceInfo);

    console.log('블루투스 연결 성공');
    updateMainConnectBluetoothBtnText();

    forceCoolingMode();
  } catch (error) {
    console.error('블루투스 연결 실패:', error);
    console.log('블루투스 연결 실패: ' + error);
  }

  if (isConnected && notifyCharacteristic) {
    startNotifications();
    startTime = new Date().getTime();

    console.log('블루투스가 연결되었습니다.');
  } else {
    console.log('블루투스가 연결되지 않았습니다.');
  }
}

async function disconnectBluetooth() {
  console.log('disconnectBluetooth() 연결 해제 함수 실행');
  if (!device) {
    console.log('연결된 장치가 없습니다.');
    return;
  }

  if (device.gatt.connected) {
    try {
      await device.gatt.disconnect();
      isConnected = false;
      console.log('블루투스 연결이 해제되었습니다.');
    } catch (error) {
      console.error('블루투스 연결 해제 실패:', error);
      console.log('블루투스 연결 해제 실패: ' + error);
    }
  } else {
    console.log('이미 연결이 해제되었습니다.');
  }
}

function startNotifications() {
  notifyCharacteristic.startNotifications().then((_) => {
    // console.log('Notifications started');
    notifyCharacteristic.addEventListener(
      'characteristicvaluechanged',
      handleData
    );
  });
}

function updateMainConnectBluetoothBtnText() {
  const mainConnectBluetoothBtn = document.getElementById(
    'mainConnectBluetoothBtn'
  );
  if (isConnected) {
    //temp1과2  의 온도에 따라 색상이변경?!
    if (simpleTemp1 >= 65 && simpleTemp2 >= 70) {
      mainConnectBluetoothBtn.classList.remove(
        'text-blue-700',
        'dark:text-blue-500'
      );
      mainConnectBluetoothBtn.classList.add(
        'text-red-700',
        'dark:text-red-500'
      );
      mainConnectBluetoothBtn.innerText = device.name;
    } else {
      mainConnectBluetoothBtn.classList.remove(
        'text-red-700',
        'dark:text-red-500'
      );
      mainConnectBluetoothBtn.classList.add(
        'text-blue-700',
        'dark:text-blue-500'
      );
      mainConnectBluetoothBtn.innerText = device.name;
    }

    // mainConnectBluetoothBtn.classList.remove('bg-reonaiBlue');
    // mainConnectBluetoothBtn.classList.add('bg-reonaiRed');
  } else {
    mainConnectBluetoothBtn.innerText = '블루투스 연결 버튼';
  }
}

//수신 발신 차트 업데이트를 헨들링하는 함수 ***제일 중요함.
function handleData(event) {
  let currentTime = new Date().getTime();
  let value = new TextDecoder().decode(event.target.value);
  let [temp1, temp2, none, temp3, fan1, heater, fan2] = value
    .split(',')
    .map(Number);
  // console.log('수신값 : ', value);
  // console.log(Math.floor(currentTime / 1000));
  console.log(currentSecond);
  // 최신 데이터를 버퍼에 저장
  bufferedData = { temp1, temp2, none, temp3, fan1, heater, fan2 };

  // 타이머로 1초마다 데이터 처리 (버퍼 앞에 숫자가 중요)
  if (currentTime - lastReceiveTime >= 100 && bufferedData) {
    // 1초가 지났을 때만 데이터를 처리
    //수신된 데이터 차트에 업데이트

    console.log(
      '수신데이터 : ',
      'temp1 : ',
      bufferedData.temp1,
      'temp2 : ',
      bufferedData.temp2,
      'none : ',
      bufferedData.none,
      'inner : ',
      bufferedData.temp3,
      'fan1: ',
      bufferedData.fan1,
      'heater : ',
      bufferedData.heater,
      'fan2 : ',
      bufferedData.fan2
    );
    updateReceivedChart(
      bufferedData.temp1,
      bufferedData.temp2,
      bufferedData.temp3
    );

    //open api에게 전송할 데이터

    if (bufferCounter < 9) {
      tempHistory.push({
        second: currentSecond,
        temp1: bufferedData.temp1,
        temp2: bufferedData.temp2,
        ror1: parseFloat(document.getElementById('RoR1Value').innerText),
        ror2: parseFloat(document.getElementById('RoR2Value').innerText),
        fan1: bufferedData.fan1,
        heater: bufferedData.heater,
        cpTime: parseFloat(document.getElementById('firstCrackTime').innerText),
        cpTemp: parseFloat(document.getElementById('firstCrackTemp').innerText),
        cpPercent: percentageOfDtr,
      });
    } else {
      tempHistory = [];
      bufferCounter = 0;
    }

    // 🔸 10초마다 GPT 분석 요청
    if (aiRoastingFlag) {
      if (currentSecond - lastAnalysisSecond >= 10) {
        triggerSlidingAnalysis([...tempHistory]); // 복사본 전달
        lastAnalysisSecond = currentSecond;
      }
    }

    //수신된 데이터를 인디게이터에 업데이트
    updateIndicators(temp1, temp2);

    // 데이터 발신!
    checkAndSendData();

    lastReceiveTime = currentTime; // 마지막 처리 시간 업데이트
    bufferedData = null; // 버퍼 초기화

    //데이터를 처리하고 나면 1초 지남 ++
    currentSecond++;

    bufferCounter++;
    console.log('bufferCouneter');
    console.log(bufferCounter);
    if (autoRoastingStartFlag) {
      console.log('autoRoastingFlag : ', autoRoastingFlag);
      document.dispatchEvent(currentSecondUpdatedEvent);
    }
  }
}
1;

//oepn api에 정보전달
async function sendSlidingWindowAnalysis(tempBuffer) {
  const summary = tempHistory
    .map(
      (entry) =>
        `${entry.second}s - temp1: ${entry.temp1}, temp2: ${entry.temp2}, RoR1: ${entry.ror1}, RoR2: ${entry.ror2}, fan: ${entry.fan1}, heater: ${entry.heater}, cpTime: ${entry.cpTime}, cpTemp: ${entry.cpTemp} cpPercent: ${entry.cpPercent}`
    )
    .join('\n');

  const userMessage = `
다음은 지금까지 누적된 로스팅 데이터입니다:

${summary}



이 데이터에는 온도(temp1, temp2), 상승률(RoR1, RoR2), 팬(fan), 히터(heater) , 크랙 포인트 시간(cpTime),크랙 포인트 온도(cpTemp),Develop time ratio percent(dtrPercent), 정보가 포함되어 있습니다.


이 데이터를 기반으로:

0.생두의 품종은 taypiplaya caturra & catuai anaerobic washe

100g투입

생두가 가진 모든 플레이버가 잘 표현이되고
밝은 산미와 달콤한 단맛이 나게 로스팅을 해줘

생두 특성상 초반 히터값을 70.0으로 시작하는것을 권장해
생두가 수분이 조금 많은듯 
초반에 열을 70.0으로 시작해서 90.0까지 올려서 생두 내부까이 열이 잘 투입되도록 하고싶어

fan1 50.0으로 시작하는 것을 권장해 로스팅이 진행됨에따라 0.5단계씩 

로스팅 타임 6분에 temp1 온도가 206도가 도달될 수 있도록해줘.
206도가 넘으면 히터를 끄고 쿨링을 시작해줘 
목표 도달 온도를 넘으면 무조건 히터를 0.0으로 변경해줘 


1. 현재까지의 로스팅 상황을 분석하고
2. fan1/heater의 추천 제어값을 숫자로 제시하며
3. fan1/heater의 범위는 
fan1 min 30.0 ~ max 100.0
heaer min 0.0 ~ max 100.0 입니다.
제어 단위는 0.5단계로 변경 가능합니다. 
4. 투입되는 생두 용량과 예상되는 최적 fan1 값은
50g : 40
100g : 50
150g : 70
200g : 80
입니다.



5. 로스팅 시작시 heater는 60이상이여야 합니다. 
6. 대부분의 로스팅 데이터에서 heater 값은 80~100사이였습니다. 

7. RoR 흐름을 고려한 조언도 1~2줄 포함해줘.
8. 크랙포인트가 생기면 cpTime, cpTemp, DTR값을 분석해서 로스팅을 후반부를 마무리해줘 
9. 전체 로스팅 흐름에 대한 간단한 요약과 제안을 2~3문장 추가해줘.
10. 로스팅이 완료되었다고 판단되면 쿨링을 하기 위해 heater값을 0으로 꼭 해줘 
결과적으로 
11. fan과 heater의 추천값을 숫자로 명확히 제시하고
**형식은 반드시 아래처럼 JSON 형태로 시작해줘:**
{
  "fan": 65.0,
  "heater": 45.5,
  "comment": "RoR 흐름이 안정적입니다. 크랙 이전 구간에서 fan을 줄여 열 보존을 유도하세요."
}

절대로 이 형식을 벗어나지 말고 JSON 객체가 첫 줄에 오도록 해줘.

`.trim();

  const response = await fetch('https://api.reonai.net/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `



너는 Reonai Cursor를 위한 누적 기반 로스팅 분석 AI야.
지금까지의 온도, 출력, 시간 흐름을 종합 분석하고,
RoR 곡선과 출력 흐름을 함께 고려해서 명확한 숫자 제어값을 추천하고, 분석적 코멘트를 제공해줘.
정확하고 실용적인 fan/heater 제어 가이드를 제공해야 해.

`.trim(),
        },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '응답 없음';
}

//open ai에게 받은 데이터 파싱
// OpenAI에게 받은 JSON 응답 파싱
async function triggerSlidingAnalysis(bufferToAnalyze) {
  const gptResponse = await sendSlidingWindowAnalysis(bufferToAnalyze);
  const output = document.getElementById('aiRaostingChatOutput');
  console.log(`📡 GPT 응답 원문:`, gptResponse);
  output.innerText = gptResponse;
  let fanValue, heaterValue;

  try {
    // 응답 내 JSON 객체 영역 추출
    const jsonStart = gptResponse.indexOf('{');
    const jsonEnd = gptResponse.lastIndexOf('}');
    const jsonString = gptResponse.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    fanValue = parseInt(parsed.fan);
    heaterValue = parseInt(parsed.heater);

    if (!isNaN(fanValue) && !isNaN(heaterValue)) {
      console.log(`✅ GPT 분석 fan: ${fanValue}, heater: ${heaterValue}`);

      // 🔹 Fan UI 업데이트
      document.getElementById('fan1Number').value = fanValue;
      document.getElementById('fan1Slider').value = fanValue;
      document.getElementById('fan1Value').innerText = fanValue;

      // 🔹 Heater UI 업데이트
      document.getElementById('heaterNumber').value = heaterValue;
      document.getElementById('heaterSlider').value = heaterValue;
      document.getElementById('heaterValue').innerText = heaterValue;

      // 📤 필요 시 실제 제어 신호 전송
      // sendCommandToCursor(fanValue, heaterValue);
    } else {
      console.warn('⚠️ GPT 응답에 fan/heater 숫자값이 없습니다.', parsed);
    }
  } catch (error) {
    console.error('❌ GPT 응답에서 JSON 파싱 실패:', error, gptResponse);
  }
}

function toNearestTen(value) {
  return Math.round(value / 10) * 10; // 10의 단위로 반올림
}

function updateIndicators(temp1, temp2) {
  const mainConnectBluetoothBtn = document.getElementById(
    'mainConnectBluetoothBtn'
  );

  const deviceTemp = `DT ${toNearestTen(temp1)}°C \n HT ${toNearestTen(
    temp2
  )}°C`;

  // if (isConnected) {
  //   if (!isRecordingcharts) {
  //     mainConnectBluetoothBtn.innerText = deviceTemp;
  //   } else {
  //     mainConnectBluetoothBtn.innerText = device.name;
  //   }
  // }

  document.getElementById('temp1Value').innerText = temp1.toFixed(2);
  document.getElementById('temp2Value').innerText = temp2.toFixed(2);
  simpleTemp2 = temp2.toFixed(2);
  simpleTemp1 = temp1.toFixed(2);
  //roastInfoPanel 전송
  document.getElementById('infoTemp1Value').innerText = temp1.toFixed(2);
  document.getElementById('infoTemp2Value').innerText = temp2.toFixed(2);

  //온도가 높으면 블루투스네임의 색상으로 상태를 보여줌
  if (simpleTemp1 >= 65 && simpleTemp2 >= 70) {
    mainConnectBluetoothBtn.classList.remove(
      'text-blue-700',
      'dark:text-blue-500'
    );
    mainConnectBluetoothBtn.classList.add('text-red-700', 'dark:text-red-500');
  } else {
    mainConnectBluetoothBtn.classList.remove(
      'text-red-700',
      'dark:text-red-500'
    );
    mainConnectBluetoothBtn.classList.add(
      'text-blue-700',
      'dark:text-blue-500'
    );
  }
}

//******  updateReceivedChart   *******
function updateReceivedChart(temp1, temp2, temp3) {
  if (currentSecond > 900) return;
  if (!isRecordingcharts) return;
  // 5초 동안의 평균 계산
  const temp1Avg5s =
    temp1History5s.reduce((a, b) => a + b, 0) / temp1History5s.length;
  // temp1 값을 기록

  const temp1Avg2s =
    temp1History2s.reduce((a, b) => a + b, 0) / temp1History2s.length;
  // temp1 값을 기록

  temp1History2s.push(temp1);
  temp1History5s.push(temp1);
  temp2History5s.push(temp2);
  temp1History60s.push(temp1);
  temp2History60s.push(temp2);
  // console.log('temp1Avg5s', temp1Avg5s);
  // console.log('temp1', temp1);

  //터닝포인트
  // 5초 이상의 값은 제거
  if (temp1History5s.length > timeWindow5s) {
    temp1History5s.shift();
  }
  if (temp1History2s.length > timeWindow2s) {
    temp1History2s.shift();
  }

  console.log('percentageOfDtr  ', percentageOfDtr);

  // 온도가 하락하다가 상승하는 지점에서 터닝 포인트 감지
  if (isTempDropping && temp1 > temp1Avg5s) {
    if (!isFirstTp) {
      //TP에 데이터 한번만 추가하는 if
      isTempDropping = false; // 더 이상 하락 중이 아님
      const elapsedValue = currentSecond;
      turningPointTimes = elapsedValue; // 터닝 포인트 시간 배열에 추가
      turningPointTemps = temp1; // 터닝 포인트 온도 배열 추가

      document.getElementById('TPtime').innerText =
        formatSecondsToMinutes(turningPointTimes); //터닝 포인트 시간
      document.getElementById('TPtemp').innerText = turningPointTemps; //터닝 포인트 온도

      console.log(
        `Turning point detected at time: ${elapsedValue}, Temp: ${temp1}`
      );
      // 차트에 새로운 터닝 포인트를 점으로 추가
      Highcharts.charts[0].series[8].addPoint(
        [currentSecond, temp1],
        true,
        false
      );
      isFirstTp = true;
    }
  }

  //   // RoR 계산
  let firstTemp1for60s = temp1History60s[temp1History60s.length - 60]; // 첫 번째 데이터

  let firstTemp2for60s = temp2History60s[temp2History60s.length - 60]; // 첫 번째 데이터

  let firstTemp1for5s = temp1History5s[temp1History5s.length - 5]; // 첫 번째 데이터
  let lastTemp1for5s = temp1History5s[temp1History5s.length - 1]; // 마지막 데이터
  let firstTemp2for5s = temp2History5s[temp2History5s.length - 5]; // 첫 번째 데이터
  let lastTemp2for5s = temp2History5s[temp2History5s.length - 1]; // 마지막 데이터

  if (temp1History5s.length >= 5) {
    console.log('temp1History5s.length : ', temp1History5s.length);

    RoR1 = ((lastTemp1for5s - firstTemp1for5s) / 5) * 60; // temp1의 RoR(60s) 계산
    RoR2 = ((lastTemp2for5s - firstTemp2for5s) / 5) * 60; // temp2의 RoR(60s) 계산
  } else {
    RoR1 = 0;
    RoR2 = 0;
  }

  // RoR1 = (temp1 - previousTemp1)
  // RoR2 = (temp2 - previousTemp2)

  // 이전 값을 저장
  previousTemp1 = temp1;
  previousTemp2 = temp2;
  previousTime = currentSecond;

  // Highcharts에 데이터 추가
  Highcharts.charts[0].series[0].addPoint([currentSecond, temp1], true, false);
  Highcharts.charts[0].series[1].addPoint([currentSecond, temp2], true, false);

  Highcharts.charts[0].series[3].addPoint([currentSecond, RoR1], true, false); // RoR1 추가
  Highcharts.charts[0].series[4].addPoint([currentSecond, RoR2], true, false); // RoR2 추가

  // // 60초 이후부터 RoR 값을 차트에 추가
  // if (previousTime >= 5 && RoR1 !== null && RoR2 !== null) {
  //   Highcharts.charts[0].series[3].addPoint([previousTime, RoR1], true, false); // RoR1 추가
  //   Highcharts.charts[0].series[4].addPoint([previousTime, RoR2], true, false); // RoR2 추가
  // }

  //HTML 요소에 ROR 값 업데이트
  document.getElementById('RoR1Value').innerText = RoR1.toFixed(2); // RoR1 표시
  document.getElementById('RoR2Value').innerText = RoR2.toFixed(2); // RoR2 표시

  document.getElementById('elapsedValue').innerText = formatSecondsToMinutes(
    previousTime.toFixed(0)
  ); // 경과 시간 표시

  // document.getElementById('temp1Value').innerText = temp1.toFixed(2); // Temp1 표시
  // document.getElementById('temp2Value').innerText = temp2.toFixed(2); // Temp2 표시
  // document.getElementById('temp3Value').innerText = temp3.toFixed(2); // Temp3 표시

  //쿨링포인트 기록
  if (coolingPointFlag) {
    if (!isFirstCp && temp1 > 100) {
      if (temp1 < temp1Avg2s) {
        const elapsedValue = currentSecond;

        coolingPointTimes = elapsedValue; // 터닝 포인트 시간 배열에 추가
        coolingPointTemps = temp1; // 터닝 포인트 온도 배열 추가

        stopRecordingCrackPoint(); //크랙 기록 중지

        document.getElementById('CPtime').innerText =
          formatSecondsToMinutes(coolingPointTimes); //쿨링 포인트 시간

        document.getElementById('CPtemp').innerText = coolingPointTemps; //쿨링 포인트 온도

        console.log(
          `cooling point detected at time: ${elapsedValue}, Temp: ${temp1}`
        );
        // 차트에 새로운 쿨링 포인트를 점으로 추가
        Highcharts.charts[0].series[10].addPoint(
          [currentSecond, temp1],
          true,
          false
        );

        isFirstCp = true;
      }
    }
  }

  if (isFirstCp) {
    Highcharts.charts[0].series[14].addPoint([currentSecond, 60], true, false); //쿨링
  }

  if (!isRecordingCrackPoint) {
    if (!coolingPointFlag) {
      //크랙 아닐경우는 초록색 12번 시리즈
      Highcharts.charts[0].series[12].addPoint(
        [currentSecond, 60],
        true,
        false
      ); // 로스팅
      firstCcrackStartSecond = currentSecond;
      // 실시간으로 crack plotBand의 to 값을 업데이트
    }
  }

  if (isRecordingCrackPoint) {
    // 실시간으로 crack plotBand의 to 값을 업데이트
    Highcharts.charts[0].series[13].addPoint([currentSecond, 60], true, false); //크랙

    const from = firstCcrackStartSecond;
    const percentage = (((currentSecond - from) / currentSecond) * 100).toFixed(
      2
    ); // 비율 계산

    const timeDtr = formatSecondsToMinutes(currentSecond - from);

    // 비율 텍스트 업데이트
    plotBandPercentageText.attr({
      text: `DTR :  ${percentage}%  ${timeDtr}`,
    });
    percentageOfDtr = percentage;

    console.log(percentageOfDtr);

    crackPlotBandIds.forEach(function (plotBandId) {
      var plotBand = Highcharts.charts[0].xAxis[0].plotLinesAndBands.find(
        function (band) {
          return band.id === plotBandId;
        }
      );
      if (plotBand) {
        plotBand.options.to = currentSecond; // 현재 시간을 to 값으로 설정
        Highcharts.charts[0].xAxis[0].update(); // 차트 갱신
      }
    });

    // plotBand 비율 계산 및 표시
    if (crackPlotBandIds.length > 0) {
      const plotBand = Highcharts.charts[0].xAxis[0].plotLinesAndBands.find(
        (band) => band.id === crackPlotBandIds[crackPlotBandIds.length - 1]
      );
      if (plotBand) {
        const from = plotBand.options.from;
        const percentage = (
          ((currentSecond - from) / currentSecond) *
          100
        ).toFixed(2); // 비율 계산

        const timeDtr = formatSecondsToMinutes(currentSecond - from);

        // 비율 텍스트 업데이트
        plotBandPercentageText.attr({
          text: `DTR : ${timeDtr},${percentage}% `,
        });
        percentageOfDtr = percentage;

        console.log(percentageOfDtr);
      }
    }
  }

  // receivedData 배열에 데이터 추가
  receivedData.push({
    time: currentSecond,
    temp1: temp1,
    temp2: temp2,
  });

  // rorData 배열에 데이터 추가
  rorData.push({
    time: currentSecond,
    ror1: RoR1,
    ror2: RoR2,
  });
}

//******  updateOutputChart *******
function updateOutputChart(fan1, heater, fan2) {
  if (currentSecond > chartLengthNumber) {
    chartLengthUpdate();
  }

  if (!isRecordingcharts) return;

  Highcharts.charts[1].series[0].addPoint([currentSecond, fan1], true, false);
  Highcharts.charts[1].series[1].addPoint([currentSecond, heater], true, false);
  Highcharts.charts[1].series[2].addPoint([currentSecond, fan2], true, false);

  //차트테스트
  // Highcharts.charts[0].series[12].addPoint([currentSecond, fan1], true, false);
  // Highcharts.charts[0].series[13].addPoint(
  //   [currentSecond, heater],
  //   true,
  //   false
  // );
  // Highcharts.charts[0].series[14].addPoint([currentSecond, fan2], true, false);
}

function chartLengthUpdate() {
  chartLengthNumber = currentSecond + 300;
  Highcharts.charts[0].update({
    xAxis: {
      max: currentSecond + 300, // 필요한 경우 여유분을 추가 (+10)
    },
  });
  Highcharts.charts[1].update({
    xAxis: {
      max: currentSecond + 300, // 필요한 경우 여유분을 추가 (+10)
    },
  });
}

function convertValue(value) {
  if (value == 0) {
    return Math.round(value);
  } else {
    return Math.round(value * 2 + 55);
  }
}

//senddatatodevice
async function sendDataToDevice(dataString) {
  console.log('sendDataToDevice');
  if (writeCharacteristic) {
    const data = new TextEncoder().encode(dataString);
    await writeCharacteristic.writeValue(data);
    console.log('now Data sent: ' + dataString.trim());
  }
}

function checkAndSendData() {
  if (isDisposalSequenceRunning) return;

  let fan1 = parseFloat(document.getElementById('fan1Value').innerText);
  let heater = parseFloat(document.getElementById('heaterValue').innerText);
  let fan2 = parseFloat(document.getElementById('fan2Value').innerText);

  let dataString = `1,${convertValue(fan1)},1,${convertValue(
    heater
  )},${actuatorFlag},${convertValue(fan2)},${currentRoastingState}\n`;

  console.log('dataString', dataString);

  // 데이터를 outputData 배열에 저장
  outputData.push({
    fan1: fan1,
    heater: heater,
    fan2: fan2,
  });
  updateOutputChart(fan1, heater, fan2); // Always update chart, even if data is not sent

  // 값을 비교하고 다르면 즉시 전송
  if (dataString !== previousDataString) {
    sendDataToDevice(dataString)
      .then(() => {
        previousDataString = dataString;
        console.log('Data sent: ' + dataString.trim());

        // 이전 값과 다르면 타이머를 초기화하여 새로운 간격으로 전송
        resetTimer(dataString);
      })
      .catch((error) => {
        console.error('Data transmission failed:', error);
        console.log('Data transmission failed: ' + error);
      });
  }
}
// 10초마다 값을 재전송하는 함수
function resetTimer(dataString) {
  if (resetTime) {
    clearInterval(resetTime); // 기존 타이머가 있으면 초기화
  }

  // 10초 간격으로 데이터를 전송
  resetTime = setInterval(() => {
    sendDataToDevice(dataString)
      .then(() => {
        // console.log('시간 지나서 보내는 값: ' + dataString.trim());
      })
      .catch((error) => {
        console.error('Data transmission failed:', error);
        console.log('Data transmission failed: ' + error);
      });
  }, 10000); // 1초(1000ms) 간격으로 전송
}

// 차트 기록 기록 중지 함수
function stopRecordingcharts() {
  isRecordingcharts = false; // 기록 중지 함수
  console.log('차트 기록이 중지되었습니다.');
}

// 차트 기록 기록 시작 함수
function startRecordingcharts() {
  currentSecond = 0;
  isRecordingcharts = true; // 기록 시작
  console.log('차트 기록이 시작되었습니다.');
}

//크랙포인트 함수 실행
function recordCrackPoint() {
  console.log('recordCrackPoint() 크랙포인트 함수 실행');

  if (crackPointCount >= 1) {
    console.log('크랙 포인트는 최대 3번까지만 기록 가능합니다.');
    return;
  }

  const lastData = receivedData[receivedData.length - 1];
  if (lastData) {
    crackPoints.push(lastData.temp1);
    crackPointTimes.push(currentSecond);

    var elapsed = lastData.time;
    console.log('크랙포인트 기록중 ');
    // plotBands 추가
    // const plotBandId = 'crackBand-' + crackPointCount;
    // Highcharts.charts[0].xAxis[0].addPlotBand({
    //   from: elapsed, // 크랙 시점
    //   to: elapsed, // 실시간 업데이트와 연동되도록 설정 (초기값은 크랙 시점)
    //   color: 'rgba(255, 192, 0, 0.3)', // #FFC000
    //   id: plotBandId,
    //   label: {
    //     text: 'CP ' + (crackPointCount + 1),
    //     style: {
    //       color: '#FFC000',
    //     },
    //   },
    // });

    // 추가한 plotBand의 id를 저장
    // crackPlotBandIds.push(plotBandId);
    crackPointCount++;
    if (crackPointCount == 1) {
      firstCrackPointTime = currentSecond;
      firstCrackPointTemp = lastData.temp1;

      document.getElementById('firstCrackTime').innerText =
        formatSecondsToMinutes(firstCrackPointTime); //크랙 포인트 시간

      document.getElementById('firstCrackTemp').innerText = firstCrackPointTemp; //크랙 포인트 온도

      console.log('firstCrackPointTime', firstCrackPointTime);
      console.log('firstCrackPointTemp', firstCrackPointTemp);
    }

    if (crackPointCount == 2) {
      secondCrackPointTime = currentSecond;
      secondCrackPointTemp = lastData.temp1;
      console.log('secondCrackPointTime', secondCrackPointTime);
      console.log('secondCrackPointTemp', secondCrackPointTemp);
    }
    if (crackPointCount == 3) {
      thirdCrackPointTime = currentSecond;
      thirdCrackPointTemp = lastData.temp1;
      console.log('thirdCrackPointTime', thirdCrackPointTime);
      console.log('thirdCrackPointTemp', thirdCrackPointTemp);
    }

    console.log(
      'latestPlotBandId',
      crackPlotBandIds[crackPlotBandIds.length - 1]
    );

    console.log(
      `크랙 포인트 기록됨 - Temp1: ${lastData.temp1}, Time: ${currentSecond}`
    );

    // 포인트 추가 후 텍스트 위치를 업데이트
    const chart = Highcharts.charts[0];
    const seriesIndex = 13; // 대상 시리즈의 인덱스
    const newPoint = [currentSecond, 60]; // 새로운 포인트 값

    // 포인트 추가
    chart.series[seriesIndex].addPoint(newPoint);

    // 추가된 포인트의 픽셀 위치 계산
    const xPixel = chart.xAxis[0].toPixels(newPoint[0]); // x 좌표를 픽셀로 변환
    const yPixel = chart.yAxis[0].toPixels(newPoint[1]); // y 좌표를 픽셀로 변환

    // 비율 텍스트 추가 (차트의 중앙에 표시)
    if (!plotBandPercentageText) {
      plotBandPercentageText = Highcharts.charts[0].renderer
        .text(
          'DTR: 0%', // 초기 텍스트
          xPixel, // 계산된 x 위치
          yPixel - 10 // 계산된 y 위치

          // Highcharts.charts[0].plotLeft + 50, // x 위치
          // Highcharts.charts[0].plotTop + 50 // y 위치
        )
        .css({
          color: '#D3194B',
          fontSize: '15px',
        })
        .attr({
          zIndex: 10, // zIndex를 높게 설정하여 최상단으로 표시
        })
        .add();
    }
  } else {
    console.log('크랙 포인트를 기록할 데이터가 없습니다.');
  }
}

// 크랙 포인트 기록 중지 함수
function stopRecordingCrackPoint() {
  isRecordingCrackPoint = false; // 기록 중지 함수
  console.log('크랙 포인트 기록이 중지되었습니다.');
}

// 크랙 포인트 기록 시작 함수
function startRecordingCrackPoint() {
  isRecordingCrackPoint = true; // 기록 시작
  recordCrackPoint();
}

//초를 분:분초 형식으로 변환하는 함수
function formatSecondsToMinutes(seconds) {
  // const totalSeconds = seconds * 0.5;  // 0.5초 단위일경우 킴!
  // const minutes = Math.floor(totalSeconds / 60); // 분 계산
  const minutes = Math.floor(seconds / 60); // 분 계산
  const remainingSeconds = seconds % 60; // 남은 초 계산
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // 두 자리로 포맷팅
}

function roastingReset() {
  console.log('로스팅 리셋');

  // RoR 계산에 필요한 변수
  previousTemp1 = null;
  previousTemp2 = null;
  previousTime = null;
  RoR1Values = [];
  RoR2Values = [];

  //동작 플래그

  isTempDropping = true; // 온도가 하락 중인지를 추적하는 플래그
  isFirstCp = null; // 쿨링 포인트가 처음인지 확인하는 플래그
  isFirstTp = null; // 터닝 포인트가 처음인지 확인하는 플래그
  isFirstDisposal = null; // 배출이 처음인지 확인하는 플래그

  //터닝포인트와 쿨링포인트를 기록하기 위한 변수들
  temp1History2s = []; // 2초 동안의 temp1 값을 저장할 배열
  temp1History5s = []; // 5초 동안의 temp1 값을 저장할 배열
  temp1History60s = []; // 60초 동안의 temp1 값을 저장할 배열
  temp2History60s = []; // 60초 동안의 temp2 값을 저장할 배열
  crackPointCount = 0; // 크랙 포인트 기록 횟수
  crackPlotBandIds = []; // 크랙 plotBands의 id 목록

  coolingPointTimes = null; // 터닝 포인트 시간을 저장하는 배열
  coolingPointTemps = 0; // 터닝 포인트 온도를 저장하는 배열
  turningPointTimes = null;
  turningPointTemps = 0;
  disposalPointTimes = null; // 배출 포인트  시간을 저장하는 배열
  disposalPointTemps = []; // 배출 포인트 온도를 저장하는 배열
  percentageOfDtr = 0.0; //DTR 퍼센트

  firstCrackPointTime = 0;
  firstCrackPointTemp = [];
  secondCrackPointTime = 0;
  secondCrackPointTemp = [];
  thirdCrackPointTime = 0;
  thirdCrackPointTemp = [];

  disposmodeFlag = false; //배출 플래그

  document.getElementById('TPtime').innerText = '-';
  document.getElementById('TPtemp').innerText = '-';
  document.getElementById('CPtime').innerText = '-';
  document.getElementById('CPtemp').innerText = '-';
  document.getElementById('RoR2Value').innerText = '-';
  document.getElementById('RoR1Value').innerText = '-';
  document.getElementById('firstCrackTime').innerText = '-';
  document.getElementById('firstCrackTemp').innerText = '-';
  document.getElementById('selectRecipeName').innerText = ''; //Recipe Finder 리셋

  simpleRoastModeReset(); //simple roast mode 를 마친후 리셋 하는 함수
}
