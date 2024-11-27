//window 이벤트 모음

let Recivedchartlength = 900;
let OutputChart = 900;

window.onload = function () {
  // 차트 생성
  console.log('wellcome reonai studio :)');
  adjustChartSize(); // 초기 레전드 크기 조정
  createReceivedChart(); // 'chartdiv'에 차트를 생성
  createOutputChart(); // 'outputChartdiv'에 차트를 생성
  createReceivedChartRecipe(); // 'chartdiv'에 차트를 생성
  createOutputChartRecipe(); // 'outputChartdiv'에 차트를 생성
};

// 창 크기 변경 시 레전드 크기 조정
window.addEventListener('resize', adjustChartSize);

// receivedChart 준비!
function createReceivedChart() {
  return Highcharts.chart('chartdiv', {
    chart: {
      type: 'line', // 'spline',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      // text: 'Temperature & RoR',
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
          enabled: false, //라벨 숨김
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
  return Highcharts.chart('outputChartdiv', {
    chart: {
      type: 'line',
      backgroundColor: '#F3EDDF',
      zooming: {
        type: 'x',
      },
    },
    title: {
      text: '',
      // text: 'Output',
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
          enabled: false, //라벨 숨김
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
  return Highcharts.chart('chartdivRecipe', {
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
  return Highcharts.chart('outputChartdivRecipe', {
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
  console.log('adjustChartSize작동함');

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
