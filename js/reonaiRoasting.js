//pid설정 온도 초과 카운트를 위한
let exceedCount = 0; // 온도 초과 횟수 저장 변수
const maxExceedCount = 100; // 최대 초과 횟수

let autoRoastingFlag = false; // 오토로스팅 동작 플래그
let autoRoastingStartFlag = false; // 오토로스팅 동작 플래그
let isCoolDownRunning = false; // 쿨링모드  동작 플래그
let intervalId; // 전역 변수로 인터벌 ID를 저장할 변수 선언(오토로스팅 중지를 위함)
let heatPeakInterval;
let startTemp1ErrorInterval;
let autoStartHeatingModeInterval;
let monitorTemperature; // coolingmode 인터벌

//pid제어를 위한
let targetTemp2 = 200;
let pidControlInterval = null;
let integral = 0;
let previousError = 0;
let Kp = 0.1; // 비례 상수
let Ki = 0.1; // 적분 상수
let Kd = 0.01; // 미분 상수

//auto 로스팅을 위한
let autofan1Values = null;
let autoheaterValues = null;
let autofan2Values = null;
let autotemp1Values = null;
let autotemp2Values = null;
let targetTemp1Threshold = 0;
let autoIndex = 0;
let previousSecond = 0; // 이전 초를 저장할 변수

let currentDelay = 3; //데이터에서 error값에 딜레이이를 주기위한 변수

//temp2를 제어함.
let aIntegral = 0;
let aPreviousError = 0;
let aKp = 1; // 1비례 상수
let aKi = 0.5; // 적분 상수
let aKd = 0.01; // 미분 상수
// temp1이 데이터보다 높아서 fan2를 제어함
let bIntegral = 0;
let bPreviousError = 0;
let bKp = 0.3; //0.8 비례 상수
let bKi = 0.5; // 적분 상수
let bKd = 0.01; // 미분 상수
//temp1이 데이터보다 낮아서 fan1을 제어함
let cIntegral = 0;
let cPreviousError = 0;
let cKp = 0.2; // 비례 상수
let cKi = 0.5; // 적분 상수
let cKd = 0.01; // 미분 상수

// autoStartHeatingMode()의 변수
let autoStartHeatingcurrentHeater = 40;
let autoStartHeatingcrrentfan1 = 40;
let autoStartHeatingcrrentfan2 = 2.5;
// PID 제어 계산
//temp1 기준 pid
// temp1이 데이터보다 높아서 fan2를 제어함
let dIntegral = 0;
let dPreviousError = 0;
let dKp = 0.1; // 비례 상수
let dKi = 0.5; // 적분 상수
let dKd = 0.01; // 미분 상수

//temp1이 데이터보다 낮아서 fan1을 제어함
let eIntegral = 0;
let ePreviousError = 0;
let eKp = 0.1; // 비례 상수
let eKi = 0.5; // 적분 상수
let eKd = 0.01; // 미분 상수

//오토로스팅 퍼센트 계산을 위한
let recipeLength = 0;
let autoPercent = 0;
//오토로스팅 레시피 선택을 위한 flag
let ethiopiaBeanFlag = false;
let colomniaBeanFlag = false;
let easyLightRoastFlag = false;
let easyDarkRoastFlag = false;
let autoStartHeatingClearFlag = false;

let colomniaLightRoast = false; //콜롬비아 나리뇨 게이샤 워시드 라이트 로스트 플래그
let colomniaDarkRoast = false; //콜롬비아 나리뇨 게이샤 워시드 다크 로스트 플래그
let ethiopiaLightRoast = false; //에티오피아 시다모 벤사 부리소 아마제 네추럴 라이트 로스트 플1래그
let ethiopiaDarkRoast = false; //에티오피아 시다모 벤사 부리소 아마제 네추럴다크 로스트 플래그

//출력값 입력 함수
const fan1NumberModal = document.getElementById('fan1Number');
const heaterNumberModal = document.getElementById('heaterNumber');
const fan2NumberModal = document.getElementById('fan2Number');
let choiceOutModal = 0; // 1 : fan1 ,2 : heater ,3 : fan2
const keypadModal = document.getElementById('keypadModal');
const keypadButtons = document.querySelectorAll('.keypad-btn');
const keyFan1 = document.getElementById('keyFan1');
const keyHeater = document.getElementById('keyHeater');
const keyFan2 = document.getElementById('keyFan2');
const keypadClear = document.getElementById('keypadClear');
const keypadSubmit = document.getElementById('keypadSubmit');
const keypadExit = document.getElementById('keypadExit');
const keypadCurrentValueFan1 = document.getElementById(
  'keypadCurrentValueFan1'
);
const keypadCurrentValueHeater = document.getElementById(
  'keypadCurrentValueHeater'
);
const keypadCurrentValueFan2 = document.getElementById(
  'keypadCurrentValueFan2'
);

let currentValueModalKeypadFan1 = '';
let currentValueModalKeypadHeater = '';
let currentValueModalKeypadFan2 = '';
let addvalueModalKeypadFan1 = '';
let addValueModalKeypadHeater = '';
let addValueModalKeypadFan2 = '';

const currentSecondUpdatedEvent = new Event('currentSecondUpdated');
//

function adjustSlider(sliderId, valueId, step, numberId) {
  const slider = document.getElementById(sliderId);
  const number = document.getElementById(numberId);
  let newValue = parseFloat(slider.value) + step;
  // Ensure new value is within the slider's range
  if (
    newValue >= parseFloat(slider.min) &&
    newValue <= parseFloat(slider.max)
  ) {
    slider.value = newValue;
    number.value = newValue;
    document.getElementById(valueId).innerText = newValue.toFixed(1);
    updateSliderValue(sliderId, valueId, numberId);
  }
}

function updateSliderValue(sliderId, valueId, NumberId) {
  let sliderValue = parseFloat(document.getElementById(sliderId).value);
  const number = document.getElementById(NumberId);
  number.value = sliderValue;
  document.getElementById(valueId).innerText = sliderValue.toFixed(1);
  //   checkAndSendData(); // 이 함수는 원래 코드에서 데이터 전송을 처리
}
function updateNumberValue(NumberId, valueId, sliderId) {
  let numberValue = parseFloat(document.getElementById(NumberId).value);
  const slider = document.getElementById(sliderId);
  slider.value = numberValue;
  document.getElementById(valueId).innerText = numberValue.toFixed(1);

  //   checkAndSendData(); // 이 함수는 원래 코드에서 데이터 전송을 처리
}

// 슬라이더가 동작되는 것을 감지하여 값변화!
document.addEventListener('DOMContentLoaded', () => {
  const fan1Slider = document.getElementById('fan1Slider');
  const fan1Number = document.getElementById('fan1Number');
  const fan1PlusBtn = document.getElementById('fan1PlusBtn');
  const fan1MinBtn = document.getElementById('fan1MinBtn');
  const fan1NumberBtn = document.getElementById('fan1NumberBtn');

  const heaterSlider = document.getElementById('heaterSlider');
  const heaterNumber = document.getElementById('heaterNumber');
  const heaterPlusBtn = document.getElementById('heaterPlusBtn');
  const heaterMinBtn = document.getElementById('heaterMinBtn');
  const heaterNumberBtn = document.getElementById('heaterNumberBtn');

  const fan2Slider = document.getElementById('fan2Slider');
  const fan2Number = document.getElementById('fan2Number');
  const fan2PlusBtn = document.getElementById('fan2PlusBtn');
  const fan2MinBtn = document.getElementById('fan2MinBtn');
  const fan2NumberBtn = document.getElementById('fan2NumberBtn');

  fan1Slider.addEventListener('input', () => {
    updateSliderValue('fan1Slider', 'fan1Value', 'fan1Number');
  });

  fan1NumberBtn.addEventListener('click', () => {
    const fan1NumberInput = document.getElementById('fan1Number');
    const fan1Number = parseFloat(fan1NumberInput.value);

    if (fan1Number > 30) {
      if (fan1Number <= 100) {
        updateNumberValue('fan1Number', 'fan1Value', 'fan1Slider');
      } else {
        fan1NumberInput.value = '100';
      }
    } else {
      fan1NumberInput.value = '30';
    }
  });

  fan1PlusBtn.addEventListener('click', () => {
    adjustSlider('fan1Slider', 'fan1Value', 0.5, 'fan1Number');
  });
  fan1MinBtn.addEventListener('click', () => {
    adjustSlider('fan1Slider', 'fan1Value', -0.5, 'fan1Number');
  });

  heaterSlider.addEventListener('input', () => {
    updateSliderValue('heaterSlider', 'heaterValue', 'heaterNumber');
  });

  heaterNumberBtn.addEventListener('click', () => {
    const heaterNumberInput = document.getElementById('heaterNumber');
    const heaterNumber = parseFloat(heaterNumberInput.value);

    if (heaterNumber <= 100) {
      updateNumberValue('heaterNumber', 'heaterValue', 'heaterSlider');
    } else {
      heaterNumberInput.value = '100';
    }
  });

  heaterPlusBtn.addEventListener('click', () => {
    adjustSlider('heaterSlider', 'heaterValue', 0.5, 'heaterNumber');
  });
  heaterMinBtn.addEventListener('click', () => {
    adjustSlider('heaterSlider', 'heaterValue', -0.5, 'heaterNumber');
  });

  fan2Slider.addEventListener('input', () => {
    updateSliderValue('fan2Slider', 'fan2Value', 'fan2Number');
  });

  fan2NumberBtn.addEventListener('click', () => {
    const fan2NumberInput = document.getElementById('fan2Number');
    const fan2Number = parseFloat(fan2NumberInput.value);
    if (fan2Number >= 2.5) {
      if (fan2Number <= 12.5) {
        updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
      } else {
        fan2NumberInput.value = '12.5';
      }
    } else {
      fan2NumberInput.value = '2.5';
    }
  });

  fan2PlusBtn.addEventListener('click', () => {
    adjustSlider('fan2Slider', 'fan2Value', 0.5, 'fan2Number');
  });
  fan2MinBtn.addEventListener('click', () => {
    adjustSlider('fan2Slider', 'fan2Value', -0.5, 'fan2Number');
  });
});

//go to main 버튼
function goToMain() {
  const temp2 = parseFloat(document.getElementById('temp2Value').innerText);
  if (confirm('저장되지 않은 내용은 복구 할 수 없습니다.')) {
    if (temp2 >= 220) {
      //히터 온도가 너무 높으면 배출안됨
      alert('온도가 너무 높습니다.');
      return;
    } else {
      if (
        confirm(
          '메인페이지로 이동하시겠습니까?, 온도가 높을 경우 강제 쿨링모드를 진행합니다.'
        )
      ) {
        console.log('go to main!!');
        showPanel('mainPanel');
        // roastingReset();
        forceCoolingMode();
        headerDisplayBlock();
        stopCoolingMode();
        autoRoastingFlagOff();
        autoRoastingStartFlagOff();
        resetChartsAll();
        stopRecordingcharts();
      }
    }
  }
}

//예열 pid 제어
// 예열을 시작하는 함수, 예열 - 1 - heatingMode()

function heatingMode() {
  console.log('heatingMode() 예열 시작');
  return new Promise((resolve, reject) => {
    // 예열 PID 제어 시작

    heatingPidControl();

    const targetTemp2 = parseFloat(200);
    let percent = 0;
    let percent1 = 0;
    let percent2 = 0;
    let exceedCount = 0;
    const maxExceedCount = 20;
    const requiredTempMin = 199; // Temp2 최소값
    const requiredTempMax = 203; // Temp2 최대값

    // 500ms마다 온도를 체크하고 초과 횟수 확인
    heatPeakInterval = setInterval(() => {
      const currentTemp2 = parseFloat(
        document.getElementById('temp2Value').innerText
      );

      // 예열 퍼센트 계산
      const temp2Value = parseFloat(
        document.getElementById('temp2Value').innerText
      );
      if (temp2Value <= 100) {
        percent = 0;
      } else {
        console.log('temp2 100이상');
        if (temp2Value <= 180) {
          const calculatedPercent1 = Math.floor(
            ((temp2Value - 100) / 80) * 100
          );
          percent1 = calculatedPercent1 >= 0 ? calculatedPercent1 : percent1;
          percent = Math.floor(percent1 * 0.5);
        } else {
          percent2 = Math.floor((exceedCount / maxExceedCount) * 100);
          percent = Math.floor(percent1 * 0.5 + percent2 * 0.5);
          if (percent > 100) {
            percent = 100;
          }
        }
      }

      console.log('예열 퍼센트 : ', percent);
      if (!autoRoastingFlag) {
        document.getElementById(
          'preheatPercentDisplay'
        ).innerText = `${percent}%`; //예열 퍼센트 표 시
      } else {
        console.log('오토로스팅 예열 퍼센트', percent);
        document.getElementById(
          'preheatPercentDisplayForEasyRaosting'
        ).innerText = `${percent}%`; //easy roasting 예열 퍼센트 표 시

        if (percent == 100) {
          document.getElementById('heaterSlider').value = 0;
          document.getElementById('heaterValue').innerText = 0;
          document.getElementById('fan1Slider').value = 0;
          document.getElementById('fan1Value').innerText = 0;
          document.getElementById('fan2Slider').value = 0;
          document.getElementById('fan2Value').innerText = 0;
          checkAndSendData();

          easyRoastStart().then(() => {
            console.log('자동 로스팅을 시작합니다.');
            console.log(loadedRoastData);
            startAutoRoasting(loadedRoastData);
          });
        }
      }

      // 온도가 설정 온도를 넘으면 초과 횟수 증가
      if (currentTemp2 > targetTemp2) {
        exceedCount++;
        console.log(`온도가 설정 온도를 넘었습니다. 초과 횟수: ${exceedCount}`);

        // 초과 횟수가 최대치를 넘고 설정 온도 범위 안에 있을 경우
        if (
          exceedCount >= maxExceedCount &&
          currentTemp2 >= requiredTempMin &&
          currentTemp2 < requiredTempMax
        ) {
          console.log(
            '설정 온도 초과 횟수가 기준을 넘고 목표 범위 내 도달. 예열 완료.'
          );

          isPreheatCompleted = true;
        }
      }
    }, 1000); // 500ms마다 온도 체크
  });
}

function autoStartHeatingMode() {
  console.log('autoStartHeatingMode() 실행');

  document.getElementById('heaterSlider').value = autoStartHeatingcurrentHeater;
  document.getElementById('heaterValue').innerText =
    autoStartHeatingcurrentHeater;
  document.getElementById('fan1Slider').value = autoStartHeatingcrrentfan1;
  document.getElementById('fan1Value').innerText = autoStartHeatingcrrentfan1;
  document.getElementById('fan2Slider').value = autoStartHeatingcrrentfan2;
  document.getElementById('fan2Value').innerText = autoStartHeatingcrrentfan2;

  if (autoStartHeatingModeInterval) {
    clearInterval(autoStartHeatingModeInterval);
  }

  autoStartHeatingModeInterval = setInterval(() => {
    const currentTemp1 = parseFloat(
      document.getElementById('temp1Value').innerText
    );

    let dError = autotemp1Values[0] - currentTemp1;
    dIntegral += dError;
    let dDerivative = dError - dPreviousError;

    let eError = autotemp1Values[0] - currentTemp1;
    eIntegral += eError;
    let eDerivative = eError - ePreviousError;

    // PID 계산식: 출력 = P + I + D
    let dOutput = dKp * dError;
    let eOutput = eKp * eError;
    // 히터 값 업데이트 (200도 이전에는 max100 min30, 200도 이후에는 max60 min30)
    // console.log('error', error);
    // console.log('derivative', derivative);
    // console.log('output', output);

    console.log('dOutput :', dOutput);
    console.log('eOutput :', eOutput);

    //temp1이 높을때 fan2를 개입하여 온도를 낮춘다.temp1이 높으면 bError < 0
    if (dError <= 0) {
      document.getElementById('fan2Value').innerText = Math.min(
        12.5,
        Math.max(2.5, autoStartHeatingcrrentfan2 - dOutput)
      ).toFixed(1);
    } else {
      document.getElementById('fan2Value').innerText =
        autoStartHeatingcrrentfan2.toFixed(1);
    }

    //temp1이 온도가 낮으면 fan1값을 올린다 cError > 0 이면 temp1이 낮은것임
    if (eError >= 0) {
      console.log('temp1이 온도가 낮으면 fan1값을 올린다, ');

      document.getElementById('fan1Value').innerText = Math.min(
        40,
        Math.max(30, autoStartHeatingcrrentfan1 + eOutput)
      ).toFixed(1);
    } else {
      document.getElementById('fan1Value').innerText = Math.min(
        40,
        Math.max(30, autoStartHeatingcrrentfan1)
      ).toFixed(1);
    }

    document.getElementById('heaterValue').innerText = Math.min(
      30,
      Math.max(0, autoStartHeatingcurrentHeater)
    ).toFixed(1);

    checkAndSendData(); // 변경된 값을 장비로 전송
  }, 1000); // 0.1초 간격으로 온도를 제어
}

// 예열 pid 컨트롤 함수
function heatingPidControl() {
  console.log('heatingPidControl() 실행');

  if (pidControlInterval) {
    clearInterval(pidControlInterval);
  }

  pidControlInterval = setInterval(() => {
    const currentTemp2 = parseFloat(
      document.getElementById('temp2Value').innerText
    );
    let currentHeater = parseFloat(
      document.getElementById('heaterSlider').value
    );
    let crrentfan1 = parseFloat(document.getElementById('fan1Slider').value);
    let crrentfan2 = parseFloat(document.getElementById('fan2Slider').value);
    // PID 제어 계산
    let error = targetTemp2 - currentTemp2;
    integral += error;
    let derivative = error - previousError;
    // PID 계산식: 출력 = P + I + D
    let output = Kp * error;

    if (error > 0.1) {
      currentHeater = 100;
      crrentfan1 = 50;
      crrentfan2 = 2.5;
    } else {
      currentHeater = 40;
      crrentfan1 = 50;
      crrentfan2 = 2.5;
    }

    // + Ki * integral + Kd * derivative;
    // 히터 값 업데이트 (200도 이전에는 max100 min30, 200도 이후에는 max60 min30)
    // console.log('error', error);
    // console.log('derivative', derivative);
    // console.log('output', output);
    // if (error <= 20) {
    //   console.log('200도 이후');
    //   currentHeater = Math.min(100, Math.max(70, currentHeater + output));
    //   crrentfan1 = 50;
    //   crrentfan2 = 2.5;
    // } else {
    //   console.log('200도 이전');
    //   currentHeater = Math.min(100, Math.max(30, currentHeater + output));
    //   crrentfan1 = 20;
    //   crrentfan2 = 2.5;
    // }
    document.getElementById('heaterSlider').value = currentHeater.toFixed(1);
    document.getElementById('heaterValue').innerText = currentHeater.toFixed(1);
    document.getElementById('fan1Slider').value = crrentfan1.toFixed(1);
    document.getElementById('fan1Value').innerText = crrentfan1.toFixed(1);
    document.getElementById('fan2Slider').value = crrentfan2.toFixed(1);
    document.getElementById('fan2Value').innerText = crrentfan2.toFixed(1);
    checkAndSendData(); // 변경된 값을 장비로 전송
  }, 1000); // 0.1초 간격으로 온도를 제어
}

// 예열을 정지하는 함수,  heatingMode() 정지
function stopHeatingMode() {
  if (pidControlInterval) {
    clearInterval(pidControlInterval);
  } // pidControlInterval 인터벌 중지
  if (heatPeakInterval) {
    clearInterval(heatPeakInterval);
  } // 히트피크 인터벌 중지
  if (startTemp1ErrorInterval) {
    clearInterval(startTemp1ErrorInterval);
  } // 히트피크 인터벌 중지

  if (autoStartHeatingModeInterval) {
    clearInterval(autoStartHeatingModeInterval);
  } // 히트피크 인터벌 중지

  exceedCount = 0; // 초과 횟수 초기화
  integral = 0;
  previousError = 0;

  // document.getElementById('heaterSlider').value = 0;
  // document.getElementById('heaterValue').innerText = 0;
  // document.getElementById('fan1Slider').value = 0;
  // document.getElementById('fan1Value').innerText = 0;
  // document.getElementById('fan2Slider').value = 2.5;
  // document.getElementById('fan2Value').innerText = 2.5;

  console.log('PID 제어가 종료되었습니다.');
}

function stopCoolingMode() {
  if (monitorTemperature) {
    console.log('CoolingMode 종료.');
    clearInterval(monitorTemperature);
  }
}

//roastInfoPanel 에서 설정값을 받아오는 함수
function roastInfoStart() {
  //예열 퍼센트 초기화 및 예열 종료
  percent = 0;
  exceedCount = 0;

  stopHeatingMode(); //예열 종료
  coolingpointflagFalse(); // 쿨링플래그 종료

  document.getElementById('heaterSlider').value = 0;
  document.getElementById('heaterValue').innerText = 0;
  document.getElementById('fan1Slider').value = 0;
  document.getElementById('fan1Value').innerText = 0;
  document.getElementById('fan2Slider').value = 0;
  document.getElementById('fan2Value').innerText = 0;

  checkAndSendData(); // 변경된 값을 장비로 전송

  const roastInfoRecipeName =
    document.getElementById('roastInfoRecipeName').value || 'no name';

  const roastInfoBeanName =
    document.getElementById('roastInfoBeanName').value || 'no name';

  const roastInfoInputAmount = document.getElementById(
    'roastInfoInputAmount'
  ).value;
  // const roastInfoStageSelect = document.getElementById(
  //   'roastInfoStageSelect'
  // ).value;

  const roastInfoPowerFan1Select = document.getElementById(
    'roastInfoPowerFan1Select'
  ).value;
  const roastInfoPowerFan2Select = document.getElementById(
    'roastInfoPowerFan2Select'
  ).value;
  const roastInfoPowerHeaterSelect = document.getElementById(
    'roastInfoPowerHeaterSelect'
  ).value;
  // const memoTextArea = document.getElementById('memoTextArea').value;
  console.log('Recipe Name :', roastInfoRecipeName);
  console.log('Bean Name :', roastInfoBeanName);
  console.log('Input Amount :', roastInfoInputAmount);
  // console.log('Steage :', roastInfoStageSelect);

  console.log('Fan1 :', roastInfoPowerFan1Select);
  console.log('Fan2 :', roastInfoPowerFan2Select);
  console.log('Heater :', roastInfoPowerHeaterSelect);
  // console.log('memo :', memoTextArea);

  setTimeout(() => {
    console.log('1초 후 실행됩니다');

    puttingMode() // 투임함수 시작
      .then(() => {
        // 특정 함수 호출
        console.log('puttingMode() 함수 완료 후 특정 함수 실행');
        startRecordingcharts();
        infoValueAdd();
      })
      .catch((error) => {
        console.error('puttingMode() 함수 실패:', error);
      });
  }, 2000); // 1000 밀리초 = 1초
}

//출력 값에 info에서 설정한 값을 넣어주고 수동로스팅을 진행시키는 함수
function infoValueAdd() {
  roastInfoRecipeName =
    document.getElementById('roastInfoRecipeName').value || 'no name';
  roastInfoBeanName =
    document.getElementById('roastInfoBeanName').value || 'no name';

  if (document.getElementById('roastInfoInputAmount').value == 'Input Amount') {
    roastInfoInputAmount = 0;
  } else {
    roastInfoInputAmount = document.getElementById(
      'roastInfoInputAmount'
    ).value;
  }
  // roastInfoStageSelect = document.getElementById('roastInfoStageSelect').value;

  roastInfoPowerFan1Select = document.getElementById(
    'roastInfoPowerFan1Select'
  ).value;
  roastInfoPowerFan2Select = document.getElementById(
    'roastInfoPowerFan2Select'
  ).value;
  roastInfoPowerHeaterSelect = document.getElementById(
    'roastInfoPowerHeaterSelect'
  ).value;
  // memoTextArea = document.getElementById('memoTextArea').value || 'no memo';

  console.log('Recipe Name :', roastInfoRecipeName);
  console.log('Bean Name :', roastInfoBeanName);
  console.log('Input Amount :', roastInfoInputAmount);
  // console.log('Stage :', roastInfoStageSelect);
  console.log('Fan1 :', roastInfoPowerFan1Select);
  console.log('Fan2 :', roastInfoPowerFan2Select);
  console.log('Heater :', roastInfoPowerHeaterSelect);
  // console.log('Memo :', memoTextArea);

  document.getElementById('Recipe Name').innerText = roastInfoRecipeName;
  document.getElementById('Bean Name').innerText = roastInfoBeanName;
  document.getElementById('Input Amount').innerText = roastInfoInputAmount;

  // 설정된 값을 사용하여 수동 로스팅을 시작하는 로직 추가
  document.getElementById('fan1Slider').value = roastInfoPowerFan1Select;
  document.getElementById('fan2Slider').value = roastInfoPowerFan2Select;
  document.getElementById('heaterSlider').value = roastInfoPowerHeaterSelect;
  document.getElementById('fan1Number').value = roastInfoPowerFan1Select;
  document.getElementById('fan2Number').value = roastInfoPowerFan2Select;
  document.getElementById('heaterNumber').value = roastInfoPowerHeaterSelect;
  document.getElementById('fan1Value').innerText = roastInfoPowerFan1Select;
  document.getElementById('fan2Value').innerText = roastInfoPowerFan2Select;
  document.getElementById('heaterValue').innerText = roastInfoPowerHeaterSelect;

  //차트 리셋
  receivedData = [];
  outputData = [];
  crackPoints = [];
  crackPointTimes = [];
  currentSecond = 0;
  // startTime = new Date().getTime();
  Highcharts.charts[0].series[0].setData([null]); //drum
  Highcharts.charts[0].series[1].setData([null]); //heater
  Highcharts.charts[0].series[2].setData([null]); //inner
  Highcharts.charts[0].series[3].setData([null]); //ROR drum
  Highcharts.charts[0].series[4].setData([null]); //ROR heater
  Highcharts.charts[0].series[8].setData([null]); //Turning Point
  Highcharts.charts[0].series[10].setData([null]); //Cooling Point
  Highcharts.charts[1].series[0].setData([null]);
  Highcharts.charts[1].series[1].setData([null]);
  Highcharts.charts[1].series[2].setData([null]);

  console.log('수동 로스팅 시작');
}

function doorTestMode() {
  return new Promise((resolve, reject) => {
    let resetDataString = `0,0,0,0,0,0,0\n`;
    let puttingDataString = `0,0,0,0,1,0,0\n`;

    // console.log('beanPuttingforAutoRoasting() 투입 함수 실행');

    sendDataToDevice(puttingDataString);

    document.getElementById('heaterSlider').value = 0;
    document.getElementById('heaterValue').innerText = 0;
    document.getElementById('fan1Slider').value = 0;
    document.getElementById('fan1Value').innerText = 0;
    document.getElementById('fan2Slider').value = 0;
    document.getElementById('fan2Value').innerText = 0;

    // 20초 카운트다운 시작
    let countdown = 20;
    const countdownElement = document.getElementById('beanPuttingCounter');
    countdownElement.style.fontSize = '48px'; // 카운트다운을 크게 표시
    countdownElement.innerText = countdown; // 초기 카운트다운 값 설정

    const countdownInterval = setInterval(() => {
      if (document.getElementById('heaterValue').innerText == 0) {
        countdown -= 1;
        countdownElement.innerText = countdown; // 카운트다운 값 업데이트

        // 카운트다운이 0이 되면 종료
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }
    }, 1000); // 1초마다 실행
  });
}

//투입을 시작하는 함수, 투입 - 2 - puttingMode()
async function puttingMode() {
  return new Promise((resolve, reject) => {
    let resetDataString = `0,0,0,0,0,0,0\n`;
    let puttingDataString = `0,0,0,0,1,0,0\n`;

    console.log('puttingMode() 투입 함수 실행');

    sendDataToDevice(puttingDataString);

    // 20초 카운트다운 시작
    let countdown = 20;
    const countdownElement = document.getElementById('beanPuttingCounter');
    countdownElement.style.fontSize = '48px'; // 카운트다운을 크게 표시
    countdownElement.innerText = countdown; // 초기 카운트다운 값 설정

    const countdownInterval = setInterval(() => {
      if (document.getElementById('heaterValue').innerText == 0) {
        countdown -= 1;
        countdownElement.innerText = countdown; // 카운트다운 값 업데이트

        // 카운트다운이 0이 되면 종료
        if (countdown <= 0) {
          clearInterval(countdownInterval);

          console.log('beanPutting() 투입 함수 종료');
          // console.log('');
          if (!autoRoastingFlag) {
            // 데이터 전송 및 이후 동작
            sendDataToDevice(resetDataString)
              .then(() => {
                showPanel('roastPanel');
              })
              .catch((error) => {
                console.error('Data transmission failed:', error);
                console.log('Data transmission failed: ' + error);
              });
            resolve();
          } else {
            //오토로스팅에경우!
            showPanel('easyRoastPanel');

            resolve();
          }
        }
      }
    }, 1000); // 1초마다 실행
  });
}

//manual roasting 동작 로직
// mainPanel ->
// Manual Roasting 버튼 클릭 => roastInfoPanel { heatingMode() 실행 } ->
// 로스팅시작 버튼 클링 => roastInfoStart() {stopHeatingMode() 실행 , 데이터 변수 저장, puttingMode() 실행 then
// => startRecordingCharts()실행, infoValueAdd() 실행 } 함수실행 ->
//

//easy Roasting 동작 로직
//mainPanel -> easy Roasting 버튼 클릭 => recipePanel {eastRoastingFlag = True => 예열시작 } =>
// 레시피를 선택 -> 로스팅 시작 버튼 (예열 완료일 경우)-> easyRoastingPanel (자동로스팅 퍼센트 표시)=> 쿨링포인트에서 자동으로 쿨링모드 진입
// 이후 채프 청소 확인받기 -> 배출하기 -> 로스팅을 계속 하시겠씁니가? 알람 ->

//로스팅중에 쿨링 동작을 하는 함수 , 쿨링 - 4 - coolingMode()

function coolingMode() {
  console.log('coolingMode() 쿨다운 함수 실행');
  coolingpointflag(); //쿨링포인트 기록

  isCoolDownRunning = true;

  autoRoastingFlagOff();
  autoRoastingStartFlagOff();

  // 지속적으로 temp1과 temp2 값을 모니터링하여 50 이하가 되면 handleOutputZero 호출
  monitorTemperature = setInterval(() => {
    const temp1 = parseFloat(document.getElementById('temp1Value').innerText);
    const temp2 = parseFloat(document.getElementById('temp2Value').innerText);

    if (temp1 <= 50.0 && temp2 <= 50.0) {
      isRecordingcharts = false; // 차트 기록 중지 함수

      console.log(temp1, '50이하', temp2, '50이하');
      clearInterval(monitorTemperature);
      let resetDataString = `0,0,0,0,0,0,0\n`;
      // 슬라이더 값을 0으로 설정
      document.getElementById('fan1Slider').value = 0;
      document.getElementById('heaterSlider').value = 0;
      document.getElementById('fan2Slider').value = 0;
      // 슬라이더 표시값 업데이트
      document.getElementById('fan1Value').innerText = '0.0';
      document.getElementById('heaterValue').innerText = '0.0';
      document.getElementById('fan2Value').innerText = '0.0';
      sendDataToDevice(resetDataString); //출력제로

      console.log('쿨 다운 완료 ');

      isCoolDownRunning = false;
      coolingpointflagFalse();
    } else {
      console.log(temp1, '50이상', temp2, '50이상');
      // 히터 값을 0으로 설정
      // document.getElementById('fan1Slider').value = 100;
      document.getElementById('heaterSlider').value = 0;
      // document.getElementById('fan2Slider').value = 100;

      // 슬라이더 표시값 업데이트
      // document.getElementById('fan1Value').innerText = '100.0';
      document.getElementById('heaterValue').innerText = '0.0';
      // document.getElementById('fan2Value').innerText = '100.0';
    }
  }, 1000); // 3초 간격으로 temp1과 temp2를 체크
}

//강제로 쿨링을 진행하는 함수 .
function forceCoolingMode() {
  console.log('forceCoolingMode() 강제쿨다운 함수 실행');

  if (!coolingPointFlag) {
    coolingPointFlag = true;
    console.log('coolingpointflag()', coolingPointFlag);
  }
  if (intervalId) {
    clearInterval(intervalId);
  } // 인터벌을 종료하여 자동 로스팅 멈춤

  if (pidControlInterval) {
    clearInterval(pidControlInterval);
  } // pidControlInterval 인터벌 중지
  if (heatPeakInterval) {
    clearInterval(heatPeakInterval);
  } // 히트피크 인터벌 중지
  exceedCount = 0; // 초과 횟수 초기화
  integral = 0;
  previousError = 0;

  document.getElementById('heaterSlider').value = 0;
  document.getElementById('heaterValue').innerText = 0;
  document.getElementById('fan1Slider').value = 0;
  document.getElementById('fan1Value').innerText = 0;
  document.getElementById('fan2Slider').value = 0;
  document.getElementById('fan2Value').innerText = 0;
  isRecordingCrackPoint = false; // 크랙 기록 중지 함수

  isCoolDownRunning = true;

  if (!isConnected) {
    return;
  }

  // 지속적으로 temp1과 temp2 값을 모니터링하여 50 이하가 되면 handleOutputZero 호출
  const monitorTemperature = setInterval(() => {
    const temp1 = parseFloat(document.getElementById('temp1Value').innerText);
    const temp2 = parseFloat(document.getElementById('temp2Value').innerText);

    if (temp1 <= 65.0 && temp2 <= 70.0) {
      isRecordingcharts = false; // 차트 기록 중지 함수
      console.log(temp1, '65이하', temp2, '70이하');
      clearInterval(monitorTemperature);
      let resetDataString = `0,0,0,0,0,0,0\n`;
      // 슬라이더 값을 0으로 설정
      document.getElementById('fan1Slider').value = 0;
      document.getElementById('heaterSlider').value = 0;
      document.getElementById('fan2Slider').value = 0;
      // 슬라이더 표시값 업데이트
      document.getElementById('fan1Value').innerText = '0.0';
      document.getElementById('heaterValue').innerText = '0.0';
      document.getElementById('fan2Value').innerText = '0.0';
      sendDataToDevice(resetDataString); //출력제로

      console.log('쿨 다운 완료 ');

      isCoolDownRunning = false;

      coolingpointflagFalse();
    } else {
      console.log(temp1, '65이상', temp2, '70이상');
      // 히터 값을 0으로 설정
      document.getElementById('fan1Slider').value = 100;
      document.getElementById('heaterSlider').value = 0;
      document.getElementById('fan2Slider').value = 30;

      // 슬라이더 표시값 업데이트
      document.getElementById('fan1Value').innerText = '100.0';
      document.getElementById('heaterValue').innerText = '0.0';
      document.getElementById('fan2Value').innerText = '30.0';
    }
  }, 1000); // 3초 간격으로 temp1과 temp2를 체크
}

//쿨링포인트 기록 함수
function coolingpointflag() {
  if (!coolingPointFlag) {
    coolingPointFlag = true;
    console.log('coolingpointflag()', coolingPointFlag);
  }
}

function coolingpointflagFalse() {
  if (coolingPointFlag) {
    coolingPointFlag = false;

    console.log('cooling point flag False', coolingPointFlag);
  }
}

// 수동 로스팅 배출 함수, 배출 - 5 - disposalMode()
function disposalMode() {
  const temp2 = parseFloat(document.getElementById('temp2Value').innerText);
  const temp1 = parseFloat(document.getElementById('temp1Value').innerText);
  let disposalCount = 0;
  console.log('disposalMode() 배출 함수 실행');

  if (temp2 >= 60) {
    //히터 온도가 너무 높으면 배출안됨
    alert('온도가 너무 높습니다.');
    return;
  } else {
    if (confirm('채프를 청소 하셨습니까?')) {
      if (confirm('배출을 하시겠습니까?')) {
        const monitorDiopsal = setInterval(() => {
          if (disposalCount > 20) {
            clearInterval(monitorDiopsal);
            let resetDataString = `0,0,0,0,0,0,0\n`;
            // 슬라이더 값을 0으로 설정
            document.getElementById('fan1Slider').value = 0;
            document.getElementById('heaterSlider').value = 0;
            document.getElementById('fan2Slider').value = 0;
            // 슬라이더 표시값 업데이트
            document.getElementById('fan1Value').innerText = '0.0';
            document.getElementById('heaterValue').innerText = '0.0';
            document.getElementById('fan2Value').innerText = '0.0';
            sendDataToDevice(resetDataString); //출력제로
            isFirstDisposal = null;
            console.log('배출 완료 ');

            if (confirm('레시피를 저장 하시겠습니까?')) {
              RecipeWrite();
            }
          } else {
            if (!isFirstDisposal) {
              console.log(currentSecond);
              disposalPointTimes = currentSecond; // 터닝 포인트 시간 배열에 추가
              disposalPointTemps = temp1; // 터닝 포인트 온도 배열 추가
              isFirstDisposal = true;
            }

            // 히터 값을 0으로 설정
            document.getElementById('fan1Slider').value = 100;
            document.getElementById('heaterSlider').value = 0;
            document.getElementById('fan2Slider').value = 100;

            // 슬라이더 표시값 업데이트
            document.getElementById('fan1Value').innerText = '100.0';
            document.getElementById('heaterValue').innerText = '0.0';
            document.getElementById('fan2Value').innerText = '100.0';

            disposalCount++;
            console.log('배출중');
            console.log(disposalCount);
          }
        }, 1000);
      }
    }
  }
}

// 모든 출력을 0으로 하는 함수
function handleOutputZero() {
  console.log('handleOutputZero() 출력제로 함수 실행');
  let resetDataString = `0,0,0,0,0,0,0\n`;
  // 슬라이더 값을 0으로 설정
  document.getElementById('fan1Slider').value = 0;
  document.getElementById('heaterSlider').value = 0;
  document.getElementById('fan2Slider').value = 0;
  // 슬라이더 표시값 업데이트
  document.getElementById('fan1Value').innerText = '0.0';
  document.getElementById('heaterValue').innerText = '0.0';
  document.getElementById('fan2Value').innerText = '0.0';
  sendDataToDevice(resetDataString);
}

// 자동 로스팅을 시작하는 함수

function startAutoRoasting(data) {
  console.log('startAutoRoasting() 자동 로스팅 실행');

  autoRoastingStartFlag = true;

  const details = data;

  //차트 리셋
  receivedData = [];
  outputData = [];
  crackPoints = [];
  crackPointTimes = [];
  currentSecond = 0;
  // startTime = new Date().getTime();
  Highcharts.charts[0].series[0].setData([null]); //drum
  Highcharts.charts[0].series[1].setData([null]); //heater
  Highcharts.charts[0].series[2].setData([null]); //inner
  Highcharts.charts[0].series[3].setData([null]); //ROR drum
  Highcharts.charts[0].series[4].setData([null]); //ROR heater
  Highcharts.charts[0].series[8].setData([null]); //Turning Point
  Highcharts.charts[0].series[10].setData([null]); //Cooling Point
  Highcharts.charts[1].series[0].setData([null]);
  Highcharts.charts[1].series[1].setData([null]);
  Highcharts.charts[1].series[2].setData([null]);

  autofan1Values = JSON.parse(details.fan || '[]'); // 불러온 fan 데이터
  autoheaterValues = JSON.parse(details.heater || '[]'); // 불러온 heater 데이터
  autofan2Values = JSON.parse(details.fan2 || '[]'); // 불러온 fan2 데이터
  autotemp1Values = JSON.parse(details.temp1 || '[]'); // 불러온 temp 데이터
  autotemp2Values = JSON.parse(details.temp2 || '[]'); // 불러온 temp 데이터
  targetTemp1Threshold = 2; // temp1 목표 온도와의 허용 오차 범위 (2°C)

  // if (autoStartHeatingClearFlag) {
  //   // true면 꺼짐 일단 꺼보자
  //   startTemp1ErrorInterval = setInterval(() => {
  // let startTemp1Error = Math.abs(
  //   autotemp1Values[0] - document.getElementById('temp1Value').innerText
  // );
  // if (startTemp1Error >= 2) {
  //   console.log(autotemp1Values[0]);
  //   console.log(document.getElementById('temp1Value').innerText);
  //   console.log('온도가 차이나서 예열 약간 할꺼임 :', startTemp1Error);

  //   g();
  //   autoRoastingFlagOff();
  //   autoRoastingStartFlagOff();
  // } else {
  // console.log('로스팅전 예열 중지 ');
  // stopHeatingMode(); //예열중지

  autoStartHeatingClearFlag = true;

  autoRoastingFlagOn();
  autoRoastingStartFlagOn();
  startRecordingcharts();

  //     clearInterval(autoStartHeatingModeInterval);
  //     clearInterval(startTemp1ErrorInterval);
  //   }, 1000);
  // }
}

function manualAutoDataFitching(data) {
  const details = data;
}

// 오토 로스팅 동작!
document.addEventListener('currentSecondUpdated', () => {
  // if (CpUnderTime == document.getElementById('elapsedValue').innerText) {
  //   console.log('오토로스팅 종료!');
  //   clearInterval(intervalId); // 현재 함수 종료
  //   coolingMode();
  //   return; // 함수 종료
  // }

  if (autoRoastingStartFlag) {
    console.log('autoRoastingStartFlag : ', autoRoastingStartFlag);
    document.getElementById('fan1Slider').value = autofan1Values[currentSecond];
    document.getElementById('heaterSlider').value =
      autoheaterValues[currentSecond];
    document.getElementById('fan2Slider').value = autofan2Values[currentSecond];

    //자동 개입!

    const nowTemp1 = document.getElementById('temp1Value').innerText;
    const dataTemp1 = autotemp1Values[currentSecond + currentDelay];
    const deltaTemp1 = parseFloat(dataTemp1 - nowTemp1);

    // console.log('nowTemp1 : ', nowTemp1);
    // console.log('dataTemp1 :', dataTemp1);
    // console.log('dataTemp1 - nowTemp1 = ', deltaTemp1);

    const nowTemp2 = document.getElementById('temp2Value').innerText;
    const dataTemp2 = autotemp2Values[currentSecond + currentDelay];
    const deltaTemp2 = parseFloat(dataTemp2 - nowTemp2);
    console.log('currentDelay2 : ', currentDelay);
    console.log('nowTemp2 : ', nowTemp2);
    console.log('dataTemp2 :', dataTemp2);
    console.log('dataTemp2 - nowTemp2 = ', deltaTemp2);

    // 슬라이더 표시값 업데이트

    // PID 제어 계산
    //auto pid 를 위한

    //temp2 기준 pid

    let aError = dataTemp2 - nowTemp2;
    aIntegral += aError;
    let aDerivative = aError - aPreviousError;
    // PID 계산식: 출력 = P + I + D

    //temp1 기준 pid

    let bError = dataTemp1 - nowTemp1;
    bIntegral += bError;
    let bDerivative = bError - bPreviousError;

    let cError = dataTemp1 - nowTemp1;
    cIntegral += cError;
    let cDerivative = cError - cPreviousError;
    // PID 계산식: 출력 = P + I + D

    // console.log('temp2 aerror : ', aError);
    // console.log('temp1 berror : ', bError);
    // console.log('temp1 cerror : ', cError);

    // let aOutput = aKp * aError + aKi * aIntegral + aKd * aDerivative;
    let aOutput = aKp * aError;
    let bOutput = bKp * bError;
    let cOutput = cKp * cError;
    let temp2fan1Output = cKp * aError;

    //error값이 1보다 크면 제어 들어간다

    //aOutput == 히터 제어
    //bOutput == 데이터보다 temp1이 높아서 fan2의 출력을 추가한다.
    //cOutput = 데이터보다 temp1이 낮아서 fan1의 출력을 추가한다.

    // console.log('temp2 aOutput :', aOutput);
    // console.log('temp1 bOutput :', bOutput);
    // console.log('temp1 cOutput :', cOutput);

    console.log('aOutput :', aOutput);
    console.log('bOutput :', bOutput);
    console.log('cOutput :', cOutput);
    console.log('temp2fan1Output :', temp2fan1Output);

    //히터값이 이미 100이상이면 fan1을 키운인다.cOutput값은 양수일것

    document.getElementById('fan1Value').innerText =
      autofan1Values[currentSecond].toFixed(1);
    document.getElementById('fan2Value').innerText =
      autofan2Values[currentSecond].toFixed(1);

    document.getElementById('heaterValue').innerText =
      autoheaterValues[currentSecond].toFixed(1);

    // if (autoheaterValues[currentSecond].toFixed(1) >= 100 && deltaTemp2 > 0) {
    //   if (aError >= 0) {
    //     console.log(
    //       'temp2이 온도가 낮고 히터값이 이미 100이상이면 fan1값을 내린다.'
    //     );

    //     document.getElementById('fan1Value').innerText = (
    //       autofan1Values[currentSecond] - temp2fan1Output
    //     ).toFixed(1);
    //   }
    // } else {
    //   //쿨링시 히터가 0일경우 기존값으로 제어
    //   if (autoheaterValues[currentSecond].toFixed(1) == 0) {
    //     console.log('쿨링시 히터가 0일경우 기존값으로 제어,');
    //     document.getElementById('fan1Value').innerText =
    //       autofan1Values[currentSecond].toFixed(1);
    //   } else {
    //     //temp1이 온도가 낮으면 fan1값을 올린다 cError > 0 이면 temp1이 낮은것임
    //     if (cError >= 0) {
    //       console.log('temp1이 온도가 낮으면 fan1값을 올린다, ');

    //       document.getElementById('fan1Value').innerText = (
    //         autofan1Values[currentSecond] + cOutput
    //       ).toFixed(1);
    //     } else {
    //       document.getElementById('fan1Value').innerText =
    //         autofan1Values[currentSecond].toFixed(1);
    //     }
    //   }
    // }

    // //히터 값이 0일때와 100보다 클때는 는 개입하지 않음
    // if (
    //   autoheaterValues[currentSecond].toFixed(1) > 0 &&
    //   autoheaterValues[currentSecond] + aOutput <= 100
    // ) {
    //   document.getElementById('heaterValue').innerText = (
    //     autoheaterValues[currentSecond] + aOutput
    //   ).toFixed(1);
    // } else {
    //   document.getElementById('heaterValue').innerText =
    //     autoheaterValues[currentSecond].toFixed(1);
    // }

    // //temp1이 높을때 fan2를 개입하여 온도를 낮춘다.temp1이 높으면 cError < 0
    // if (bError <= 0) {
    //   console.log(
    //     'autofan2Values[currentSecond] - bOutput =',
    //     autofan2Values[currentSecond] - bOutput
    //   );

    //   if (autofan2Values[currentSecond] - bOutput >= 20) {
    //     //autofan2Values[currentSecond] - bOutput > 20이면 fan2 값은 12.5임
    //   } else {
    //     if (
    //       autofan2Values[currentSecond].toFixed(1) >= 2.5 &&
    //       autofan2Values[currentSecond] - bOutput <= 20 &&
    //       autofan2Values[currentSecond] - bOutput >= 2.5 &&
    //       autoheaterValues[currentSecond].toFixed(1) > 0
    //     ) {
    //       document.getElementById('fan2Value').innerText = (
    //         autofan2Values[currentSecond] - bOutput
    //       ).toFixed(1);
    //     } else {
    //       document.getElementById('fan2Value').innerText =
    //         autofan2Values[currentSecond].toFixed(1);
    //     }
    //   }
    // } else {
    //   document.getElementById('fan2Value').innerText =
    //     autofan2Values[currentSecond].toFixed(1);
    // }

    //오토로스팅 예열퍼센트 계싼
    console.log('currentSecond : ', currentSecond);

    recipeLength = autofan1Values.length;
    console.log('autofan1Values.length : ', autofan1Values.length);
    autoPercent = (currentSecond / autofan1Values.length) * 100;
    console.log('autoPercent : ', autoPercent);

    document.getElementById(
      'roastingDisplayForEasyRaosting'
    ).innerText = `${autoPercent.toFixed(1)}%`; //예열 퍼센트 표 시
  }

  //데이턷가 없으면 오토로스팅 플래그 종료
  if (autofan1Values[currentSecond] == 0) {
    autoRoastingFlagOff();
    autoRoastingStartFlagOff();
    stopRecordingcharts(); // 차트 레코드 종료
    coolingMode();
  }
});

// 자동 로스팅 버튼 클릭 이벤트 리스너
document.getElementById('autoRoastBtn').addEventListener('click', function () {
  if (
    document.getElementById('preheatPercentDisplayForEasyRaosting')
      .innerText !== '100%'
  ) {
    alert('예열이 완료되지 않았습니다');
  } else {
    if (!loadedRoastData) {
      console.log('Error: 로스팅 데이터를 먼저 불러오세요.');
      return;
    }
    // autoRoastingPreheat 실행 후, 예열이 완료되면 startAutoRoasting 실행
    easyRoastStart().then(() => {
      console.log('자동 로스팅을 시작합니다.');
      console.log(loadedRoastData);
      startAutoRoasting(loadedRoastData);
    });
  }
});

//easyRoastStart()시작하는 함수
async function easyRoastStart() {
  //예열 종료 후 데이터를 넣고, 투입함수를 시작하는 함수
  return new Promise((resolve, reject) => {
    //예열 퍼센트 초기화 및 예열 종료
    percent = 0;
    exceedCount = 0;
    recoedAutofetch(); // 레시피 데이터 넣기

    showPanel('puttingCountPanel');

    if (pidControlInterval) {
      clearInterval(pidControlInterval);
      console.log('pidControlInterval 인터벌 중 ');
    } // pidControlInterval 인터벌 중지
    if (heatPeakInterval) {
      clearInterval(heatPeakInterval);
      console.log('히트피크 인터벌 중지 ');
    } // 히트피크 인터벌 중지

    puttingMode() // 투임함수 시작
      .then(() => {
        // 특정 함수 호출
        console.log('puttingMode() 함수 완료 ');

        // infoValueAdd();
        resolve();
      })
      .catch((error) => {
        console.error('puttingMode() 함수 실패:', error);
      });
  });
}

// 자동 로스팅 플래그 온!
function autoRoastingFlagOn() {
  if (!autoRoastingFlag) {
    autoRoastingFlag = true;
  }
}

// 자동 로스팅 플래그 off
function autoRoastingFlagOff() {
  if (autoRoastingFlag) {
    autoRoastingFlag = false;
    console.log('오토로스팅 플래그 off');
  }
}

// 자동 로스팅 플래그 on
function autoRoastingStartFlagOn() {
  if (!autoRoastingStartFlag) {
    autoRoastingStartFlag = true;
    console.log('오토로스팅 스타트 플래그 on');
  }
}

// 자동 로스팅 플래그 off
function autoRoastingStartFlagOff() {
  if (autoRoastingStartFlag) {
    autoRoastingStartFlag = false;
    console.log('오토로스팅 스타트 플래그 off');
  }
}

function ifEasyRoastingRecipePanelBtn() {
  if (autoRoastingFlag) {
    showPanel('easyRoastInfoPanel');
  } else {
    showPanel('roastInfoPanel');
  }
}

function resetCharts() {
  //차트 리셋
  receivedData = [];
  outputData = [];
  crackPoints = [];
  crackPointTimes = [];
  currentSecond = 0;
  // startTime = new Date().getTime();
  Highcharts.charts[0].series[0].setData([null]); //drum
  Highcharts.charts[0].series[1].setData([null]); //heater
  Highcharts.charts[0].series[2].setData([null]); //inner
  Highcharts.charts[0].series[3].setData([null]); //ROR drum
  Highcharts.charts[0].series[4].setData([null]); //ROR heater
  Highcharts.charts[0].series[8].setData([null]); //Turning Point
  Highcharts.charts[0].series[10].setData([null]); //Cooling Point
  Highcharts.charts[1].series[0].setData([null]);
  Highcharts.charts[1].series[1].setData([null]);
  Highcharts.charts[1].series[2].setData([null]);
}

// 메인에서 버튼 클릭시 로그인과 블루투스 연결을 확인하는 함수
function checkBluetoothConnectionForManualRoasting() {
  if (!isLogin) {
    alert('로그인을 해주세요.');
    return;
  }
  {
    if (!isConnected) {
      alert('블루투스 연결을 해주세요.');
    } else {
      headerDisplayNone(); // 헤더 숨기기
      showPanel('roastInfoPanel');
    }
  }
}

function checkBluetoothConnectionForeasyRoasting() {
  if (!isLogin) {
    alert('로그인을 해주세요.');
    return;
  }
  {
    if (!isConnected) {
      alert('블루투스 연결을 해주세요.');
    } else {
      headerDisplayNone(); // 헤더 숨기기
      showPanel('easyRoastInfoPanel');
    }
  }
}

function checkBluetoothConnectionForRecipePanel() {
  if (!isLogin) {
    alert('로그인을 해주세요.');
    return;
  }
  {
    headerDisplayNone(); // 헤더 숨기기

    showPanel('recipePanel');
  }
}

//오토로스팅을 위한 레시피 플래그 및 버튼 색상 변경

// 버튼 클릭 시 동작
document.getElementById('ethiopiaBean').addEventListener('click', function () {
  if (!ethiopiaBeanFlag) {
    console.log('에티오피아플래그');
    ethiopiaBeanFlag = true;
  } // 플래그선언
  // 버튼의 색상 변경
  // Tailwind 클래스를 사용해 색상 변경
  if (colomniaBeanFlag) {
    colomniaBeanFlag = false;
    console.log('콜롬비아 선언되어있음');
    document.getElementById('colomniaBean').classList.add('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    document.getElementById('colomniaBean').classList.add('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
    document.getElementById('colomniaBean').classList.remove('bg-reonaiRed'); // 배경색 노란색으로 변경
    document
      .getElementById('colomniaBean')
      .classList.remove('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경

    this.classList.add('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.add('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.remove('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.remove('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
  } else {
    console.log('에티오피아 버튼 색상변경');
    this.classList.toggle('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.toggle('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.toggle('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.toggle('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거
  }

  console.log('자동로스팅 레시피 플래그 선언 결과');
  console.log('ethiopiaBeanFlag : ', ethiopiaBeanFlag);
  console.log('colomniaBeanFlag : ', colomniaBeanFlag);
  console.log('easyLightRoastFlag : ', easyLightRoastFlag);
  console.log('easyDarkRoastFlag : ', easyDarkRoastFlag);
});

document.getElementById('colomniaBean').addEventListener('click', function () {
  if (!colomniaBeanFlag) {
    console.log('콜롬비아 플래그');
    colomniaBeanFlag = true;
  } // 플래그선언
  // 버튼의 색상 변경
  // Tailwind 클래스를 사용해 색상 변경

  if (ethiopiaBeanFlag) {
    ethiopiaBeanFlag = false;
    console.log('에티오피아 선언되어있음');
    document.getElementById('ethiopiaBean').classList.add('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    document.getElementById('ethiopiaBean').classList.add('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
    document.getElementById('ethiopiaBean').classList.remove('bg-reonaiRed'); // 배경색 노란색으로 변경
    document
      .getElementById('ethiopiaBean')
      .classList.remove('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.add('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.add('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.remove('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.remove('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
  } else {
    console.log('콜롬비아  버튼 색상변경');
    this.classList.toggle('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.toggle('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.toggle('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.toggle('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거
  }

  console.log('자동로스팅 레시피 플래그 선언 결과');
  console.log('ethiopiaBeanFlag : ', ethiopiaBeanFlag);
  console.log('colomniaBeanFlag : ', colomniaBeanFlag);
  console.log('easyLightRoastFlag : ', easyLightRoastFlag);
  console.log('easyDarkRoastFlag : ', easyDarkRoastFlag);
});

document
  .getElementById('easyLightRoast')
  .addEventListener('click', function () {
    // 버튼의 색상 변경
    // Tailwind 클래스를 사용해 색상 변경

    if (!easyLightRoastFlag) {
      console.log('약배전 플래그');
      easyLightRoastFlag = true;
    } // 플래그선언
    // 버튼의 색상 변경
    // Tailwind 클래스를 사용해 색상 변경

    if (easyDarkRoastFlag) {
      easyDarkRoastFlag = false;
      console.log('강배전 선언되어있음');
      document.getElementById('easyDarkRoast').classList.add('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
      document
        .getElementById('easyDarkRoast')
        .classList.add('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
      document.getElementById('easyDarkRoast').classList.remove('bg-reonaiRed'); // 배경색 노란색으로 변경
      document
        .getElementById('easyDarkRoast')
        .classList.remove('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
      this.classList.add('bg-reonaiRed'); // 배경색 노란색으로 변경
      this.classList.add('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
      this.classList.remove('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
      this.classList.remove('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
    } else {
      console.log('약배전 색상변경');
      this.classList.toggle('bg-reonaiRed'); // 배경색 노란색으로 변경
      this.classList.toggle('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
      this.classList.toggle('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
      this.classList.toggle('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거
    }

    console.log('자동로스팅 레시피 플래그 선언 결과');
    console.log('ethiopiaBeanFlag : ', ethiopiaBeanFlag);
    console.log('colomniaBeanFlag : ', colomniaBeanFlag);
    console.log('easyLightRoastFlag : ', easyLightRoastFlag);
    console.log('easyDarkRoastFlag : ', easyDarkRoastFlag);
  });

document.getElementById('easyDarkRoast').addEventListener('click', function () {
  // 버튼의 색상 변경
  // Tailwind 클래스를 사용해 색상 변경

  if (!easyDarkRoastFlag) {
    console.log('강배전 플래그');
    easyDarkRoastFlag = true;
  } // 플래그선언
  // 버튼의 색상 변경
  // Tailwind 클래스를 사용해 색상 변경

  if (easyLightRoastFlag) {
    easyLightRoastFlag = false;
    console.log('약배전 선언되어있음');
    document.getElementById('easyLightRoast').classList.add('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    document
      .getElementById('easyLightRoast')
      .classList.add('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
    document.getElementById('easyLightRoast').classList.remove('bg-reonaiRed'); // 배경색 노란색으로 변경
    document
      .getElementById('easyLightRoast')
      .classList.remove('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.add('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.add('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.remove('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.remove('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거}
  } else {
    console.log('강배전 색상변경');
    this.classList.toggle('bg-reonaiRed'); // 배경색 노란색으로 변경
    this.classList.toggle('text-reonaiWhite'); // 텍스트 색상을 흰색으로 변경
    this.classList.toggle('bg-reonaiWhite'); // 원래 배경색(흰색)을 제거
    this.classList.toggle('text-reonaiBlack1'); // 원래 텍스트 색상(검정색)을 제거
  }

  console.log('자동로스팅 레시피 플래그 선언 결과');
  console.log('ethiopiaBeanFlag : ', ethiopiaBeanFlag);
  console.log('colomniaBeanFlag : ', colomniaBeanFlag);
  console.log('easyLightRoastFlag : ', easyLightRoastFlag);
  console.log('easyDarkRoastFlag : ', easyDarkRoastFlag);
});

function recoedAutofetch() {
  let recipecode = 859;
  resetChartsAll();
  // ethiopiaBeanFlag , easyLightRoastFlag -> 794
  // ethiopiaBeanFlag , easyDarkRoastFlag -> 795

  // colomniaBeanFlag, easyLightRoastFlag -> 765
  // colomniaBeanFlag, easyDarkRoastFlag -> 764

  if (ethiopiaBeanFlag && easyLightRoastFlag) {
    recipecode = 872;
    console.log('레시피 아이디', recipecode);
  }

  if (ethiopiaBeanFlag && easyDarkRoastFlag) {
    recipecode = 872;
    console.log('레시피 아이디', recipecode);
  }

  if (colomniaBeanFlag && easyLightRoastFlag) {
    recipecode = 859;
    console.log('레시피 아이디', recipecode);
  }

  if (colomniaBeanFlag && easyDarkRoastFlag) {
    recipecode = 859;
    console.log('레시피 아이디', recipecode);
  }

  if (!colomniaBeanFlag && !easyDarkRoastFlag) {
    recipecode = 859;
    console.log('레시피 아이디', recipecode);
  }

  fetchRecordDetails(recipecode, '');
}

function showCustomConfirm(message, callback) {
  const confirmBox = document.getElementById('custom-confirm');
  const confirmMessage = document.getElementById('confirm-message');
  const yesButton = document.getElementById('confirm-yes');
  const noButton = document.getElementById('confirm-no');

  confirmMessage.textContent = message;
  confirmBox.classList.remove('hidden');

  yesButton.onclick = () => {
    confirmBox.classList.add('hidden');
    callback(true);
  };

  noButton.onclick = () => {
    confirmBox.classList.add('hidden');
    callback(false);
  };
}

document.getElementById('windowfull').addEventListener('click', () => {
  showCustomConfirm('전체화면을 실행하시겠습니까?', (result) => {
    if (result) {
      headerDisplayNone();
      console.log('사용자가 확인을 선택했습니다.');
    } else {
      console.log('사용자가 취소를 선택했습니다.');
    }
  });
});

//모달창 펑션
function showCustomConfirm(message, callback) {
  const confirmBox = document.getElementById('custom-confirm');
  const confirmMessage = document.getElementById('confirm-message');
  const yesButton = document.getElementById('confirm-yes');
  const noButton = document.getElementById('confirm-no');

  confirmMessage.textContent = message;
  confirmBox.classList.remove('hidden');

  yesButton.onclick = () => {
    confirmBox.classList.add('hidden');
    callback(true);
  };

  noButton.onclick = () => {
    confirmBox.classList.add('hidden');
    callback(false);
  };
}

// Open modal on fan1Number click
fan1Number.addEventListener('click', () => {
  currentValueModalKeypadFan1 = '';
  currentFan1Numver = document.getElementById('fan1Slider').value;
  keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
  currentValueModalKeypadHeater = '';
  currentHeaterNumver = document.getElementById('heaterSlider').value;
  keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
  currentValueModalKeypadFan2 = '';
  currentFan2Numver = document.getElementById('fan2Slider').value;
  keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
  //key 색상변경
  keyFan1.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyHeater.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyFan2.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';

  //출력 선택
  choiceOutModal = 1; // 1 : fan1 ,2 : heater ,3 : fan2
  keypadModal.classList.remove('hidden');
});

heaterNumber.addEventListener('click', () => {
  currentValueModalKeypadFan1 = '';
  currentFan1Numver = document.getElementById('fan1Slider').value;
  keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
  currentValueModalKeypadHeater = '';
  currentHeaterNumver = document.getElementById('heaterSlider').value;
  keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
  currentValueModalKeypadFan2 = '';
  currentFan2Numver = document.getElementById('fan2Slider').value;
  keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;

  //key 색상변경
  keyHeater.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyFan1.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyFan2.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  choiceOutModal = 2; // 1 : fan1 ,2 : heater ,3 : fan2
  keypadModal.classList.remove('hidden');
});

fan2Number.addEventListener('click', () => {
  currentValueModalKeypadFan1 = '';
  currentFan1Numver = document.getElementById('fan1Slider').value;
  keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
  currentValueModalKeypadHeater = '';
  currentHeaterNumver = document.getElementById('heaterSlider').value;
  keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
  currentValueModalKeypadFan2 = '';
  currentFan2Numver = document.getElementById('fan2Slider').value;
  keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
  //key 색상변경
  keyFan2.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyFan1.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyHeater.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  choiceOutModal = 3; // 1 : fan1 ,2 : heater ,3 : fan2
  keypadModal.classList.remove('hidden');
});

// Add number to currentValue on keypad button click
keypadButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (choiceOutModal == 1) {
      currentValueModalKeypadFan1 += button.getAttribute('data-value');
      keypadCurrentValueFan1.textContent = `Fan 1 ${currentValueModalKeypadFan1}`; // Update display
      addvalueModalKeypadFan1 = currentValueModalKeypadFan1;
    } else if (choiceOutModal == 2) {
      currentValueModalKeypadHeater += button.getAttribute('data-value');
      keypadCurrentValueHeater.textContent = `Heater ${currentValueModalKeypadHeater}`; // Update display
      addValueModalKeypadHeater = currentValueModalKeypadHeater;
    } else if (choiceOutModal == 3) {
      currentValueModalKeypadFan2 += button.getAttribute('data-value');
      keypadCurrentValueFan2.textContent = `Fan 2 ${currentValueModalKeypadFan2}`; // Update display
      addValueModalKeypadFan2 = currentValueModalKeypadFan2;
    }

    // keypadCurrentValue.textContent = `${currentValueModalKeypad}`; // Update display
  });
});

keyFan1.addEventListener('click', () => {
  currentValueModalKeypadFan1 = '';
  currentFan1Numver = document.getElementById('fan1Slider').value;
  keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;

  //key 색상변경
  keyFan1.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyHeater.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyFan2.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  //출력 선택
  choiceOutModal = 1;
});
keyHeater.addEventListener('click', () => {
  currentValueModalKeypadHeater = '';
  currentHeaterNumver = document.getElementById('heaterSlider').value;
  keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;

  //key 색상변경
  keyHeater.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyFan1.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyFan2.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  //출력 선택
  choiceOutModal = 2;
});
keyFan2.addEventListener('click', () => {
  currentValueModalKeypadFan2 = '';
  currentFan2Numver = document.getElementById('fan2Slider').value;
  keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;

  //key 색상변경
  keyFan2.className = 'keypad-btn bg-reonaiRed text-reonaiWhite py-2 rounded';
  keyFan1.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  keyHeater.className = 'keypad-btn bg-reonaiWhite text-black py-2 rounded';
  //출력 선택
  choiceOutModal = 3;
});

// Clear the currentValue
keypadClear.addEventListener('click', () => {
  currentFan1Numver = document.getElementById('fan1Slider').value;
  currentHeaterNumver = document.getElementById('heaterSlider').value;
  currentFan2Numver = document.getElementById('fan2Slider').value;

  keypadCurrentValueFan1.textContent = `Fan 1 ${currentFan1Numver}`;
  keypadCurrentValueHeater.textContent = `Heater ${currentHeaterNumver}`;
  keypadCurrentValueFan2.textContent = `Fan 2 ${currentFan2Numver}`;
  currentValueModalKeypadFan1 = '';
  currentValueModalKeypadHeater = '';
  currentValueModalKeypadFan2 = '';

  // Reset display}
});

keypadExit.addEventListener('click', () => {
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
});

// Submit value and close modal
keypadSubmit.addEventListener('click', () => {
  let returnCheck = 0;

  if (addvalueModalKeypadFan1 == '') {
    //값을 아무것도 입력안했을 경우 기존값으로 입력
    fan1NumberModal.value = document.getElementById('fan1Slider').value;
    addvalueModalKeypadFan1 = document.getElementById('fan1Slider').value;
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
    heaterNumberModal.value = document.getElementById('heaterSlider').value;
    addValueModalKeypadHeater = document.getElementById('heaterSlider').value;
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
    fan2NumberModal.value = document.getElementById('fan2Slider').value;
    addValueModalKeypadFan2 = document.getElementById('fan2Slider').value;
  } else {
    console.log('fan2 입력');
    fan2NumberModal.value = addValueModalKeypadFan2;

    const fan2Number = parseFloat(fan2NumberModal.value);
    if (fan2Number >= 2.5) {
      if (fan2Number <= 12.5) {
        updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
      } else {
        fan2NumberModal.value = '12.5';
        updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
      }
    } else {
      fan2NumberModal.value = '2.5';
      updateNumberValue('fan2Number', 'fan2Value', 'fan2Slider');
    }
  }

  if (addvalueModalKeypadFan1 < 30) {
    keypadCurrentValueFan1.textContent = '값이 30보다 작으면 안됩니다.';
    currentValueModalKeypadFan1 = '';
    returnCheck++;
  }

  if (addvalueModalKeypadFan1 > 100) {
    keypadCurrentValueFan1.textContent = '값이 100보다 클 수 없습니다.';
    currentValueModalKeypadFan1 = '';
    returnCheck++;
  }
  if (addValueModalKeypadHeater > 100) {
    keypadCurrentValueHeater.textContent = '값이 100보다 클 수 없습니다.';
    currentValueModalKeypadHeater = '';
    returnCheck++;
  }
  if (addValueModalKeypadFan2 > 100) {
    keypadCurrentValueFan2.textContent = '값이 100보다 클 수 없습니다.';
    currentValueModalKeypadFan2 = '';
    returnCheck++;
  }

  if (addValueModalKeypadFan2 < 2.5) {
    keypadCurrentValueFan2.textContent = '값이 2.5보다 작을 수 없습니다.';
    currentValueModalKeypadFan2 = '';
    returnCheck++;
  } else if (addValueModalKeypadFan2 > 12.5) {
    keypadCurrentValueFan2.textContent = '값이 12.5보다 클 수 없습니다.';
    currentValueModalKeypadFan2 = '';
    returnCheck++;
  }

  if (returnCheck >= 1) {
    return;
  }

  keypadModal.classList.add('hidden');
});
