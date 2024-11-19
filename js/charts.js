//window 이벤트 모음

let Recivedchartlength = 900;
let OutputChart = 900;

window.onload = function () {
  // 차트 생성
  console.log('차트실핸?');
  adjustChartSize(); // 초기 레전드 크기 조정
  createReceivedChart(); // 'chartdiv'에 차트를 생성
  createOutputChart(); // 'outputChartdiv'에 차트를 생성
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
      itemStyle: {
        color: '#222', // 범례 텍스트 색상 (기본 상태)
        fontSize: '1em',
      },
      itemHoverStyle: {
        color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      },
      itemHiddenStyle: {
        color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      },
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
      itemStyle: {
        color: '#222', // 범례 텍스트 색상 (기본 상태)
        fontSize: '1em',
      },
      itemHoverStyle: {
        color: '#FFFFff', // 범례 텍스트 색상 (마우스 오버 시)
      },
      itemHiddenStyle: {
        color: '#606060', // 숨겨진 항목의 범례 텍스트 색상
      },
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
function adjustChartSize() {
  // 현재 화면 너비 가져오기
  const width = window.innerWidth;
  console.log('adjustLegendSize작동?');

  // Highcharts 인스턴스가 존재하는지 확인
  if (Highcharts.charts.length > 0) {
    console.log('600이하');
    // 화면 크기에 따라 레전드의 스타일 변경
    let legendOptions;
    let titleOptions;
    let xAxisOptions;
    let yAxisOptions = [];

    if (width <= 600) {
      // 작은 화면 (휴대폰)
      titleOptions = {
        style: { fontSize: 1 },
      };

      xAxisOptions = {
        title: { style: { fontSize: '0.3em' } },
        labels: { style: { fontSize: '0.3em' } },
      };
      (yAxisOptions = {
        title: { style: { fontSize: '0.3em' } },
        labels: { style: { fontSize: '0.3em' } },
      }),
        {
          title: { style: { fontSize: '0.3em' } },
          labels: { style: { fontSize: '0.3em' } },
        };

      legendOptions = {
        itemStyle: {
          fontSize: '0.3em', // 작은 폰트 크기
        },
        symbolHeight: 1, // 작은 심볼 크기
        symbolWidth: 1,
        symbolRadius: 1,
      };
    } else if (width > 600 && width <= 1024) {
      // 중간 크기 화면 (태블릿)

      console.log('600이상');
      titleOptions = { style: { fontSize: 5 } };

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
