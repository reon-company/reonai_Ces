// 차트와 초기 시리즈 데이터를 관리하는 Registry
const chartRegistry = new Map(); // 컨테이너 ID → 차트 객체
const initialSeriesRegistry = new Map(); // 컨테이너 ID → 초기 시리즈 데이터

//window 이벤트 모음

let Recivedchartlength = 900;
let OutputChart = 900;
// 창 크기 변경 시 레전드 크기 조정
window.addEventListener('resize', adjustChartSize);

//페이지가 로드될경우!
window.onload = function () {
  // 차트 생성
  console.log('wellcome reonai studio :)');
  adjustChartSize(); // 초기 레전드 크기 조정

  createReceivedChart(); // 'chartdiv'에 차트를 생성
  createOutputChart(); // 'outputChartdiv'에 차트를 생성
  createReceivedChartRecipe(); // 'chartdiv'에 차트를 생성
  createOutputChartRecipe(); // 'outputChartdiv'에 차트를 생성
  logInitialSeries();
  // logHighchartsSeries();
  console.log('chartRegistry', chartRegistry);
};

function logInitialSeries() {
  console.log('초기 생성된 각 차트의 시리즈 번호 확인:');
  chartRegistry.forEach((chart, containerId) => {
    console.log(`컨테이너 ID: ${containerId}`);
    chart.series.forEach((series, index) => {
      console.log(`  시리즈 번호: ${index}, 시리즈 이름: ${series.name}`);
    });
  });
}

function logHighchartsSeries() {
  console.log('Highcharts 배열을 통한 차트 및 시리즈 정보 확인:');
  Highcharts.charts.forEach((chart, chartIndex) => {
    if (chart) {
      // null 체크
      console.log(`차트 번호: ${chartIndex}`);
      chart.series.forEach((series, seriesIndex) => {
        console.log(
          `  시리즈 번호: ${seriesIndex}, 시리즈 이름: ${series.name}`
        );
      });
    } else {
      console.log(`차트 번호: ${chartIndex}는 비어 있습니다.`);
    }
  });
}

function createChart(containerId, options) {
  // 기존 차트가 있다면 제거

  if (chartRegistry.has(containerId)) {
    // console.log(`기존 차트 제거: ${containerId}`);
    chartRegistry.get(containerId).destroy();
    chartRegistry.delete(containerId);
  }

  // 새 차트 생성 및 등록
  const newChart = Highcharts.chart(containerId, options);
  chartRegistry.set(containerId, newChart);

  // console.log(`새 차트 생성: ${containerId}`);
  return newChart;
}

function clearAllCharts() {
  chartRegistry.forEach((chart, containerId) => {
    // console.log(`차트 제거: ${containerId}`);
    chart.destroy();
  });
  chartRegistry.clear();

  // chartRegistry와 Highcharts.charts 초기화
  chartRegistry.clear();
  Highcharts.charts.length = 0; // 배열을 비우기
  // console.log('모든 차트가 제거되었습니다.');
  // console.log(chartRegistry);
  createReceivedChart(); // 'chartdiv'에 차트를 생성
  createOutputChart(); // 'outputChartdiv'에 차트를 생성
  createReceivedChartRecipe(); // 'chartdiv'에 차트를 생성
  createOutputChartRecipe(); // 'outputChartdiv'에 차트를 생성
}

function removeChartRecipe() {
  removeChart('chartdivRecipe');
  removeChart('outputChartdivRecipe');
  Highcharts.charts.length = 2; // 배열을 비우기
  Highcharts.charts[2] = null; // 배열의 해당 인덱스를 null로 설정
  Highcharts.charts[3] = null; // 배열의 해당 인덱스를 null로 설정
  createReceivedChartRecipe(); // 'chartdiv'에 차트를 생성
  createOutputChartRecipe(); // 'outputChartdiv'에 차트를 생성

  logInitialSeries();
  logHighchartsSeries();
}

function removeChart(containerId) {
  if (chartRegistry.has(containerId)) {
    console.log(`차트 제거: ${containerId}`);
    chartRegistry.get(containerId).destroy();
    chartRegistry.delete(containerId);
    initialSeriesRegistry.delete(containerId); // 초기 데이터도 제거
  } else {
    console.error(`차트를 찾을 수 없습니다: ${containerId}`);
  }
}

// receivedChart 준비!
function createReceivedChart() {
  return createChart('chartdiv', {
    chart: {
      type: 'line', // 'spline',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      // text: '1Temperature & RoR',
      text: '',
      style: {
        color: '#201A1A',
        fonSize: '24px',
      },
    },
    xAxis: {
      title: {
        // text: 'Time',
        text: '',
        style: {
          fonSize: '1em',
          color: '#222',
        },
      },
      labels: {
        enabled: false, //라벨 숨김
        style: {
          color: '#222',
          fonSize: '1em',
        },
        formatter: function () {
          // 초를 분:초 형식으로 변환
          // let totalSeconds = this.value * 0.5; 0.5초 단위일경우 킴
          let totalSeconds = this.value;
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = totalSeconds % 60;
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
      },
      min: 0,
      max: 600,
    },
    yAxis: [
      {
        title: {
          // text: 'Temperature (°C)',
          text: '',
          style: {
            color: '#941F25',
          },
        },
        labels: {
          // enabled: false,
          //라벨 숨김
          style: {
            color: '#941F25',
          },
        },
        min: 0,
        max: 300,
        gridLineColor: '#941F25',
      },
      {
        title: {
          // text: 'RoR (°C/min)',
          text: '',
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        labels: {
          enabled: false, //라벨 숨김
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        opposite: true, // 오른쪽 축
        min: -150,
        max: 150,
        gridLineColor: '#2d2d2d',
      },
    ],
    legend: {
      enabled: false,
      // itemStyle: {
      //   color: '#222', // 범례 텍스트 색상 (기본 상태)
      //   fontSize: '1em',
      // },
      // itemHoverStyle: {
      //   color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      // },
      // itemHiddenStyle: {
      //   color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      // },
    },
    series: [
      {
        name: 'Drum',
        data: [],
        color: '#D3194B',
        lineWidth: 3,
      },
      {
        name: 'Heater',
        data: [],
        color: '#F97E2E',
        lineWidth: 3,
      },
      { name: 'Inner', data: [], color: '#7A1B99' },
      {
        name: 'RoR (Drum)',
        data: [],
        color: '#D3194B',
        yAxis: 1, // RoR 값을 두 번째 Y축에 표시
        lineWidth: 1,
        opacity: 1, //투명도
        dashStyle: 'Dash',
      },
      {
        name: 'RoR (Heater)',
        data: [],
        color: '#F97E2E',
        yAxis: 1,
        lineWidth: 1,
        opacity: 1, //투명도
        dashStyle: 'Dash',
      },

      {
        name: 'Drum_under',
        data: [],
        color: '#D3194B',
        lineWidth: 1,
        opacity: 0.5, //투명도
      },
      {
        name: 'Heater_under',
        data: [],
        color: '#F97E2E',
        lineWidth: 1,
        opacity: 0.5, //투명도
      },
      {
        name: 'Inner_under',
        data: [],
        color: '#7A1B99',
        lineWidth: 1,
        opacity: 0.5,
      },
      {
        name: 'TP',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#ff6347',
        lineWidth: 0,
      },
      {
        name: 'TP_under',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#ff6347',
        lineWidth: 0,
        opacity: 0.5, //투명도
      },
      {
        name: 'CP',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#87ceeb',
        lineWidth: 0,
      },
      {
        name: 'CP_under',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#87ceeb',
        lineWidth: 0,
        opacity: 0.5, //투명도
      },

      //ouput 값 테스트!!!!!
      // { name: 'FAN1', data: [], color: '#800080', lineWidth: 2, opacity: 0.8 },
      // {
      //   name: 'HEATER',
      //   data: [],
      //   color: '#FFA500',
      //   lineWidth: 2,
      //   opacity: 0.8,
      // },
      // { name: 'FAN2', data: [], color: '#87CEEB', lineWidth: 2, opacity: 0.8 },
    ],
  });
}
// outputChart 차 준비!
function createOutputChart() {
  return createChart('outputChartdiv', {
    chart: {
      type: 'line',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      // text: 'Output',
      text: '',
      style: {
        color: '#201A1A',
      },
    },
    xAxis: {
      title: {
        text: '',
        style: {
          color: '#222',
        },
      },
      labels: {
        style: {
          color: '#222',
        },
        formatter: function () {
          // 초를 분:초 형식으로 변환
          // let totalSeconds = this.value * 0.5; 0.5초 단위일경우 킴
          let totalSeconds = this.value;
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = totalSeconds % 60;
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
      },
      min: 0,
      max: 600,
    },
    yAxis: [
      {
        title: {
          text: '',
          style: {
            color: '#941F25',
          },
        },
        labels: {
          // enabled: false,
          //라벨 숨김
          style: {
            color: '#941F25',
          },
        },
        min: 0,
        max: 100,
        gridLineColor: '#2d2d2d',
      },
      {
        title: {
          // text: 'FAN2',
          text: '',
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        labels: {
          enabled: false, //라벨 숨김
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        opposite: true, // 오른쪽 축
        min: 0,
        max: 15,
        gridLineColor: '#2d2d2d',
      },
    ],
    legend: {
      enabled: false,
      // itemStyle: {
      //   color: '#222', // 범례 텍스트 색상 (기본 상태)
      //   fontSize: '1em',
      // },
      // itemHoverStyle: {
      //   color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      // },
      // itemHiddenStyle: {
      //   color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      // },
    },

    series: [
      { name: 'FAN1', data: [], color: '#800080', lineWidth: 3 },
      { name: 'HEATER', data: [], color: '#FFA500', lineWidth: 3 },
      { name: 'FAN2', data: [], color: '#87CEEB', yAxis: 1, lineWidth: 3 },
      {
        name: 'FAN1_UNDER',
        data: [],
        color: '#800080',
        lineWidth: 1,
        opacity: 0.5,
      },
      {
        name: 'HEATER_UNDER',
        data: [],
        color: '#FFA500',
        lineWidth: 1,
        opacity: 0.5,
      },
      {
        name: 'FAN2_UNDER',
        data: [],
        color: '#87CEEB',
        yAxis: 1,
        lineWidth: 1,
        opacity: 0.5,
      },
    ],
  });
}

// receivedChart 준비!
function createReceivedChartRecipe() {
  return createChart('chartdivRecipe', {
    chart: {
      type: 'line', // 'spline',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      text: 'Temperature & RoR',
      style: {
        color: '#201A1A',
        fonSize: '24px',
      },
    },
    xAxis: {
      title: {
        text: 'Time',
        style: {
          fonSize: '1em',
          color: '#222',
        },
      },
      labels: {
        style: {
          color: '#222',
          fonSize: '1em',
        },
        formatter: function () {
          // 초를 분:초 형식으로 변환
          // let totalSeconds = this.value * 0.5; 0.5초 단위일경우 킴
          let totalSeconds = this.value;
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = totalSeconds % 60;
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
      },
      min: 0,
      max: 600,
    },
    yAxis: [
      {
        title: {
          text: 'Temperature (°C)',
          style: {
            color: '#941F25',
          },
        },
        labels: {
          style: {
            color: '#941F25',
          },
        },
        min: 0,
        max: 350,
        gridLineColor: '#941F25',
      },
      {
        title: {
          text: 'RoR (°C/min)',
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        labels: {
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        opposite: true, // 오른쪽 축
        min: -150,
        max: 150,
        gridLineColor: '#2d2d2d',
      },
    ],
    legend: {
      enabled: false,
      // itemStyle: {
      //   color: '#222', // 범례 텍스트 색상 (기본 상태)
      //   fontSize: '1em',
      // },
      // itemHoverStyle: {
      //   color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      // },
      // itemHiddenStyle: {
      //   color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      // },
    },
    series: [
      {
        name: 'Drum',
        data: [],
        color: '#D3194B',
        lineWidth: 3,
      },
      {
        name: 'Heater',
        data: [],
        color: '#F97E2E',
        lineWidth: 3,
      },
      { name: 'Inner', data: [], color: '#7A1B99' },
      {
        name: 'RoR (Drum)',
        data: [],
        color: '#D3194B',
        yAxis: 1, // RoR 값을 두 번째 Y축에 표시
        lineWidth: 1,
        opacity: 1, //투명도
        dashStyle: 'Dash',
      },
      {
        name: 'RoR (Heater)',
        data: [],
        color: '#F97E2E',
        yAxis: 1,
        lineWidth: 1,
        opacity: 1, //투명도
        dashStyle: 'Dash',
      },

      {
        name: 'Drum_under',
        data: [],
        color: '#D3194B',
        lineWidth: 1,
      },
      {
        name: 'Heater_under',
        data: [],
        color: '#F97E2E',
        lineWidth: 1,
      },
      {
        name: 'Inner_under',
        data: [],
        color: '#7A1B99',
        lineWidth: 1,
      },
      {
        name: 'TP',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#ff6347',
        lineWidth: 0,
      },
      {
        name: 'TP_under',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#ff6347',
        lineWidth: 0,
      },
      {
        name: 'CP',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#87ceeb',
        lineWidth: 0,
      },
      {
        name: 'CP_under',
        data: [],
        marker: {
          enabled: true, // 포인트 표시
          radius: 4, // 포인트의 크기
          symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
        },
        color: '#87ceeb',
        lineWidth: 0,
      },
    ],
  });
}
// outputChart 차 준비!
function createOutputChartRecipe() {
  return createChart('outputChartdivRecipe', {
    chart: {
      type: 'line',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      text: 'Output',
      style: {
        color: '#201A1A',
      },
    },
    xAxis: {
      title: {
        text: 'Time (s)',
        style: {
          color: '#222',
        },
      },
      labels: {
        style: {
          color: '#222',
        },
        formatter: function () {
          // 초를 분:초 형식으로 변환
          // let totalSeconds = this.value * 0.5; 0.5초 단위일경우 킴
          let totalSeconds = this.value;
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = totalSeconds % 60;
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
      },
      min: 0,
      max: 600,
    },
    yAxis: [
      {
        title: {
          text: 'Output Value',
          style: {
            color: '#941F25',
          },
        },
        labels: {
          style: {
            color: '#941F25',
          },
        },
        min: 0,
        max: 100,
        gridLineColor: '#2d2d2d',
      },
      {
        title: {
          text: 'FAN2',
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        labels: {
          style: {
            color: '#941F25',
            opacity: 0.8, //투명도
          },
        },
        opposite: true, // 오른쪽 축
        min: 0,
        max: 15,
        gridLineColor: '#2d2d2d',
      },
    ],
    legend: {
      enabled: false,
      // itemStyle: {
      //   color: '#222', // 범례 텍스트 색상 (기본 상태)
      //   fontSize: '1em',
      // },
      // itemHoverStyle: {
      //   color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      // },
      // itemHiddenStyle: {
      //   color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      // },
    },

    series: [
      { name: 'FAN1', data: [], color: '#800080', lineWidth: 3 },
      { name: 'HEATER', data: [], color: '#FFA500', lineWidth: 3 },
      { name: 'FAN2', data: [], color: '#87CEEB', yAxis: 1, lineWidth: 3 },
      {
        name: 'FAN1_UNDER',
        data: [],
        color: '#800080',
        lineWidth: 1,
      },
      {
        name: 'HEATER_UNDER',
        data: [],
        color: '#FFA500',
        lineWidth: 1,
      },
      {
        name: 'FAN2_UNDER',
        data: [],
        color: '#87CEEB',
        yAxis: 1,
        lineWidth: 1,
      },
    ],
  });
}

function adjustChartSize() {
  // 현재 화면 너비 가져오기
  const width = window.innerWidth;
  // console.log('adjustChartSize작동함');

  //각 판넬 아이디 선언
  const topHeader = document.getElementById('topHeader');
  const sideHeader = document.getElementById('sideHeader');
  const mainPanel = document.getElementById('mainPanel');
  const roastInfoPanel = document.getElementById('roastInfoPanel');
  const recipePanel = document.getElementById('recipePanel');
  const puttingCountPanel = document.getElementById('puttingCountPanel');
  const roastPanel = document.getElementById('roastPanel');
  const roastPanelDiv = document.getElementById('roastPanelDiv');
  const chartContainer = document.getElementById('chartContainer');
  const mobileReceiveIndicator = document.getElementById(
    'mobileReceiveIndicator'
  );
  const laptopReceiveIndicator = document.getElementById(
    'laptopReceiveIndicator'
  );
  const receiveIndicator = document.getElementById('receiveIndicator');
  const receiveIndicatorBox = document.getElementById('receiveIndicatorBox');
  const timeIndicator = document.getElementById('timeIndicator');
  const raostingTimeLabel = document.getElementById('raostingTimeLabel');
  const elapsedValueSpan = document.getElementById('elapsedValue');
  const tempIndicator = document.getElementById('tempIndicator');
  const temp1Div = document.getElementById('temp1Div');
  const dtLabel = document.getElementById('dtLabel');
  const temp1ValueSpan = document.getElementById('temp1Value');
  const cel1Label = document.getElementById('cel1Label');
  const temp2Div = document.getElementById('temp2div');
  const htLabel = document.getElementById('htLabel');
  const temp2ValueSpan = document.getElementById('temp2Value');
  const cel2Label = document.getElementById('cel2Label');
  const ror1Div = document.getElementById('ror1Div');
  const ror1Label = document.getElementById('ror1Label');
  const RoR1ValueSpan = document.getElementById('RoR1Value');
  const ror2Div = document.getElementById('ror2Div');
  const ror2Label = document.getElementById('ror2Label');
  const RoR2ValueSpan = document.getElementById('RoR2Value');

  const easyRoastInfoPanel = document.getElementById('easyRoastInfoPanel');
  const easyRoastPanel = document.getElementById('easyRoastPanel');
  const settingPanel = document.getElementById('settingPanel');
  const signInPanel = document.getElementById('signInPanel');

  //roastPanel 반응형
  if (width <= 600) {
    // 중간 크기 화면 (태블릿)
    console.log(width, 'px');
    console.log('모바일 환경입니다.');

    //roastPanel 페이지
    //receiveIndicator 의 위치 수정
    // div를 부모의 마지막으로 이동
    mobileReceiveIndicator.appendChild(receiveIndicator);
    //roastPanelDiv에 class 추가
    roastPanelDiv.classList.remove(
      'flex',
      'gap-4',
      'w-full',
      'bg-reonaiBlack1',
      'h-fit'
    );

    receiveIndicator.classList.remove(
      'p-2',
      'rounded-lg',
      'gap-1',
      'w-max',
      'h-auto',
      'flex-auto'
    );
    receiveIndicator.classList.add(
      'p-4',
      'rounded-lg',
      'w-full',
      'flex',
      'flex-col',
      'gap-2'
    );
    receiveIndicator.style = '';

    //시간 인디게이터
    timeIndicator.className = 'flex justify-end items-center gap-2';
    raostingTimeLabel.className = 'text-xs font-bold';
    elapsedValueSpan.className = 'text-sm font-extra boldtext-gray-700';

    //온도 인디게이터
    tempIndicator.className =
      'flex flex-wrap items-center justify-between gap-2';

    //온도1 인디게이터
    temp1Div.className = 'flex items-center gap-2';
    dtLabel.className = 'text-xs text-gray-500';
    temp1ValueSpan.className = 'text-sm font-bold text-reonaiTemp1';
    cel1Label.className = 'text-xs';

    //온도2 인디게이터
    temp2Div.className = 'flex items-center gap-2';
    htLabel.className = 'text-sm text-gray-500';
    temp2ValueSpan.className = 'text-sm font-bold text-reonaiTemp2';
    cel2Label.className = 'text-xs';

    //ror1 인디게이터
    ror1Div.className = 'flex items-center gap-1';
    ror1Label.className = 'text-xs text-gray-500';
    RoR1ValueSpan.className = 'text-xs font-bold text-reonaiRor1';

    //ror2 인디게이터
    ror2Div.className = 'flex items-center gap-1';
    ror2Label.className = 'text-xs text-gray-500';
    RoR2ValueSpan.className = 'text-xs font-bold text-reonaiRor2';

    //
    //
    //차트 화면 크기 수정
    // id="chartContainer" style="height: 50vh; margin: 5px "

    chartContainer.style.height = '50vh';
    chartContainer.style.width = '100%';
    roastPanelDiv.style.width = '100%';
    mobileReceiveIndicator.style.width = '100%';
    receiveIndicatorBox.style.width = '';
  } else if (width > 600 && width <= 1024) {
    // 중간 크기 화면 (태블릿)c
    console.log(width, 'px');
    console.log('태블릿 환경입니다.');
  } else {
    // 큰 화면 (데스크탑, 아이패드 가로 모드 등)

    console.log(width, 'px');
    console.log('데스크톱 환경입니다.');

    //receiveIndicator 의 위치 수정

    // div를 부모의 마지막으로 이동
    laptopReceiveIndicator.appendChild(receiveIndicator);
    //roastPanelDiv에 class 추가
    roastPanelDiv.classList.add(
      'flex',
      'gap-4',
      'w-full',
      'bg-reonaiBlack1',
      'h-fit'
    );
    receiveIndicator.classList.remove(
      'p-4',
      'rounded-lg',
      'w-full',
      'flex',
      'flex-col',
      'gap-2'
    );
    receiveIndicator.classList.add(
      'p-2',
      'rounded-lg',
      'gap-1',
      'w-max',
      'h-auto',
      'flex-auto'
    );
    receiveIndicator.style.margin = '5px';

    //시간 인디게이터
    timeIndicator.className = 'grid grid-cols-2 gap-4 items-center';
    raostingTimeLabel.className = 'text-center text-xl font-bold mb-4';
    elapsedValueSpan.className =
      'text-center text-3xl font-extrabold text-gray-700 mb-6';
    //온도 인디게이터
    tempIndicator.className = 'grid grid-cols-2 gap-4';
    //온도1 인디게이터
    temp1Div.className = 'flex flex-col items-center gap-1';
    dtLabel.className = 'block text-xl text-gray-500';
    temp1ValueSpan.className = 'text-2xl font-bold text-reonaiTemp1';
    cel1Label.className = 'text-xl';
    //온도2 인디게이터
    temp2Div.className = 'flex flex-col items-center gap-1';
    htLabel.className = 'text-xl text-gray-500';
    temp2ValueSpan.className = 'text-2xl font-bold text-reonaiTemp2';
    cel2Label.className = 'text-xl';

    //ror1 인디게이터
    ror1Div.className = 'flex flex-col items-center';
    ror1Label.className = 'text-sm text-gray-500';
    RoR1ValueSpan.className = 'text-xl font-bold text-reonaiRor1';

    //ror2 인디게이터
    ror2Div.className = 'flex flex-col items-center';
    ror2Label.className = 'text-xs text-gray-500';
    RoR2ValueSpan.className = 'text-xl font-bold text-reonaiRor2';
    //
    //
    //차트 화면 크기 수정
    // id="chartContainer" style="height: 50vh; margin: 5px "

    chartContainer.style.height = '90vh';
    chartContainer.style.width = '75%';
    roastPanelDiv.style.width = 'auto';
    mobileReceiveIndicator.style.width = '';
    receiveIndicatorBox.style.width = '20%';
  }

  //Highcharts 반응형
  // Highcharts 인스턴스가 존재하는지 확인
  if (Highcharts.charts.length > 0) {
    // 화면 크기에 따라 레전드의 스타일 변경
    let legendOptions;
    let titleOptions;
    let xAxisOptions;
    let yAxisOptions = [];
    let receivedSeriesOptions = [];
    let outputSeriesOptions = [];

    if (width <= 600) {
      // 작은 화면 (휴대폰)
      console.log('600이하');

      xAxisOptions = {
        title: { style: { fontSize: '0.3em' } },
        labels: { style: { fontSize: '0.3em' } },
      };

      receivedSeriesOptions = [
        {
          name: 'Drum',
          data: [],
          color: '#D3194B',
          lineWidth: 2,
        },
        {
          name: 'Heater',
          data: [],
          color: '#F97E2E',
          lineWidth: 2,
        },
        { name: 'Inner', data: [], color: '#7A1B99' },
        {
          name: 'RoR (Drum)',
          data: [],
          color: '#D3194B',
          yAxis: 1, // RoR 값을 두 번째 Y축에 표시
          lineWidth: 0.5,
          opacity: 1, //투명도
          dashStyle: 'Dash',
        },
        {
          name: 'RoR (Heater)',
          data: [],
          color: '#F97E2E',
          yAxis: 1,
          lineWidth: 0.5,
          opacity: 1, //투명도
          dashStyle: 'Dash',
        },

        {
          name: 'Drum_under',
          data: [],
          color: '#D3194B',
          lineWidth: 0.5,
          opacity: 0.5, //투명도
        },
        {
          name: 'Heater_under',
          data: [],
          color: '#F97E2E',
          lineWidth: 0.5,
          opacity: 0.5, //투명도
        },
        {
          name: 'Inner_under',
          data: [],
          color: '#7A1B99',
          lineWidth: 0.5,
          opacity: 0.5,
        },
        {
          name: 'TP',
          data: [],
          marker: {
            enabled: true, // 포인트 표시
            radius: 2, // 포인트의 크기
            symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
          },
          color: '#ff6347',
          lineWidth: 0,
        },
        {
          name: 'TP_under',
          data: [],
          marker: {
            enabled: true, // 포인트 표시
            radius: 4, // 포인트의 크기
            symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
          },
          color: '#ff6347',
          lineWidth: 0,
          opacity: 0.5, //투명도
        },
        {
          name: 'CP',
          data: [],
          marker: {
            enabled: true, // 포인트 표시
            radius: 4, // 포인트의 크기
            symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
          },
          color: '#87ceeb',
          lineWidth: 0,
        },
        {
          name: 'CP_under',
          data: [],
          marker: {
            enabled: true, // 포인트 표시
            radius: 4, // 포인트의 크기
            symbol: 'circle', // 원형 모양으로 표시 (다른 모양 선택 가능)
          },
          color: '#87ceeb',
          lineWidth: 0,
          opacity: 0.5, //투명도
        },
      ];
      outputSeriesOptions = [
        { name: 'FAN1', data: [], color: '#800080', lineWidth: 2 },
        { name: 'HEATER', data: [], color: '#FFA500', lineWidth: 2 },
        { name: 'FAN2', data: [], color: '#87CEEB', yAxis: 1, lineWidth: 2 },
        {
          name: 'FAN1_UNDER',
          data: [],
          color: '#800080',
          lineWidth: 0.5,
          opacity: 0.5,
        },
        {
          name: 'HEATER_UNDER',
          data: [],
          color: '#FFA500',
          lineWidth: 0.5,
          opacity: 0.5,
        },
        {
          name: 'FAN2_UNDER',
          data: [],
          color: '#87CEEB',
          yAxis: 1,
          lineWidth: 0.5,
          opacity: 0.5,
        },
      ];
    } else if (width > 600 && width <= 1024) {
      // 중간 크기 화면 (태블릿)

      console.log('600이상');
      titleOptions = {
        text: '',
        style: { fontSize: 5 },
      };

      xAxisOptions = {
        title: { style: { fontSize: '0.6em' } },
        labels: { style: { fontSize: '0.6em' } },
      };

      yAxisOptions = [
        {
          title: { style: { fontSize: '0.6em' } },
          labels: { style: { fontSize: '0.6em' } },
        },
        {
          title: { style: { fontSize: '0.6em' } },
          labels: { style: { fontSize: '0.6em' } },
        },
      ];

      legendOptions = {
        itemStyle: {
          fontSize: '0.6em', // 중간 폰트 크기
        },
        symbolHeight: 3, // 중간 심볼 크기
        symbolWidth: 3,
        symbolRadius: 3,
      };
    } else {
      // 큰 화면 (데스크탑, 아이패드 가로 모드 등)

      console.log('1024이상');
      titleOptions = {
        style: { fontSize: 10 },
      };

      xAxisOptions = {
        title: { style: { fontSize: '0.8em' } },
        labels: { style: { fontSize: '0.8em' } },
      };
      (yAxisOptions = {
        title: { style: { fontSize: '0.8em' } },
        labels: { style: { fontSize: '0.8em' } },
      }),
        {
          title: { style: { fontSize: '0.8em' } },
          labels: { style: { fontSize: '0.8em' } },
        };

      legendOptions = {
        itemStyle: {
          fontSize: '0.8em', // 큰 폰트 크기
        },
        symbolHeight: 10, // 큰 심볼 크기
        symbolWidth: 10,
        symbolRadius: 8,
      };
    }

    // 모든 차트에 적용
    Highcharts.charts.forEach((chart) => {
      chart.update({
        legend: legendOptions,
        title: titleOptions,
        xAxis: xAxisOptions,
        yAxis: yAxisOptions,
      });
    });
  }
}
