let gptRecipeAnalysisResult;

export async function getChatGPTResponse(userMessage) {
  const response = await fetch('https://api.reonai.net/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `
너는 리오나이 커서(Roenai Cursor) 로스터를 위한 로스팅 전문가이자 AI 어시스턴트야.
이 로스터는 열풍식 구조에 세라믹 히터를 사용하고, 팬과 히터를 0~100 범위로 정밀하게 제어할 수 있어. 사용자는 다양한 모드(Expert, Balance, Simple, The Roast Journey) 중 하나를 선택할 수 있고, 각 모드에서의 개입 방식이 달라.
사용자가 로스팅 레시피나 실시간 데이터를 입력하면, 너는 다음을 수행해야 해:

1. 데이터를 분석해서 로스팅 상황을 정확히 파악하고
2. 적절한 피드백 또는 Fan/Heater 조절 권고를 제시하며
3. 예상 크랙 타이밍이나 맛 프로파일을 예측하고
4. 사용자의 모드나 개입 범위에 따라 반응을 조절해야 해.

언제나 명확하고 간결하며 실용적인 방식으로 답변해줘. 사용자 입력은 다음과 같아.

중요! 답변의 길이는 10문장을 절대 넘기지말아야함. 

          `.trim(),
        },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '응답 없음';
}

function validateEvaluationForm() {
  const inputs = document.querySelectorAll(
    '#recipeDataPanel input, #recipeDataPanel textarea'
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add('border-red-500', 'ring-2', 'ring-red-400');
      isValid = false;
    } else {
      input.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
    }
  });

  if (!isValid) {
    alert('⚠️ 모든 항목을 입력해주세요.');
  }

  return isValid;
}

// document
//   .getElementById('gptEvaluationButton')
//   .addEventListener('click', function (e) {
//     if (!validateEvaluationForm()) {
//       e.preventDefault(); // 저장 로직 중단
//     } else {

//         console.log('✅ 모든 항목이 입력되었습니다. 저장을 진행합니다.');
//       };

//   });

document
  .getElementById('gptEvaluationButton')
  .addEventListener('click', async () => {
    collectEvaluationData();
    console.log('✅ collectEvaluationData 실행');

    console.log('✅ evaluationData');

    // 실제 저장 로직 실행 (예: fetch 호출)
    const evaluationData = collectEvaluationData();

    console.log(evaluationData);
    await requestChatGPTAnalysis(evaluationData);
  });

document
  .getElementById('gptAnalysisResultSave')
  .addEventListener('click', async () => {
    const recipeId = recordIdForGptAnalysisResulSave;
    const memberId = memberIdForGptAnalysisResulSave;
    const analysis = gptRecipeAnalysisResult;
    await saveAnalysisToServer(recipeId, memberId, analysis);
  });

export async function requestChatGPTAnalysis(evaluationData) {
  const formattedMessage = `
  📊 [커피 로스팅 평가 분석 요청]
  
너는 커피 로스팅 전문가이며,
로스팅 곡선 + 시각 평가 + 시음 평가 데이터를 기반으로
로스팅 프로파일의 기술적 완성도, 향미 특성, 외관적 품질, 결함 여부를 평가하는 AI입니다.

💡 분석 목표:
1. 로스팅 곡선의 기술적 특성 분석 (예열, 턴, 크랙 타이밍, DTR, 쿨링 등)
2. 시각/시음 평가를 반영한 품질 라벨링
3. 향미 특성과 강점 요약
4. 개선점 도출 및 다음 로스팅 제안
  
  🍀 평가 데이터:
  \`\`\`json
  ${JSON.stringify(evaluationData, null, 2)}
  \`\`\`


  ---

분석 결과는 다음 형식으로 정리해줘:


## 0. 시각 평가 점수 , 시음 평가 점수 데이터
→ 각 모든 항목의 점수를 데이터에 사용할 수 있도록 정리해줘 

## 1. 📉 로스팅 곡선 기술 분석  
→ 구조적 흐름과 균형, 열량 운용 적절성, 타이밍(투입/턴/크랙/쿨링)
→ temp4 값이 drum temp ror , ror 값이 heater temp ror입니다. ror을 분석해줘
→ 온도값 Drum temp , haeter Termp 과, 출력값인 fan1 , heater , fan2 데이터를 분석해줘 


## 2. 👁 시각 평가 분석 (외관 품질)  
→ 팽창, 오일, 쉘, 균일도, 색상 분리도, 조직감 등 종합 평가

## 3. 🍷 시음 평가 분석 (향미 특성)  
→ 향미/단맛/산미/바디/애프터 기반 향미 성향 정리 및 결점 여부 판단

## 4. 🧠 향미 라벨링  
- 향미 스타일: [ex. Floral, Nutty, Fruity, Chocolaty 등 중복 가능]  
- 향미 강도 레벨: Low / Medium / High  
- 향미 복합성: 단조로움 / 적절 / 풍부  
- 로스팅 스타일: Under / Balanced / Over

## 5. ⚙ 개선 제안 (개조정 중심)  
- 크랙 이후 열 유지 전략  
- 히터/팬 곡선 미세조정  
- 배출 타이밍 & 쿨링 전략  
- 추천 DTR 비율 제안

## 6. 🧾 한 문장 요약 평가  
→ “산미 중심의 밝은 로스팅으로 외관은 깨끗하나, DTR이 짧아 단맛/여운이 부족함.”

---

모든 항목은 분석 관찰 + 제안 중심으로 작성해 주세요.  
수치 기반 판단과 향미 해석은 구체적일수록 좋습니다.
  `;

  try {
    const gptResult = await getChatGPTResponse(formattedMessage);

    gptRecipeAnalysisResult = gptResult; // 전역 변수에 추가
    // 결과를 HTML 요소에 표시
    console.log('gpt-Recipe-Analysis-Result');
    console.log(gptRecipeAnalysisResult);
    const resultBox = document.getElementById('gptAnalysisResult');
    if (resultBox) {
      resultBox.innerText = gptResult;
    } else {
      console.warn(
        '⚠️ 분석 결과를 표시할 DOM 요소(gptAnalysisResult)를 찾을 수 없습니다.'
      );
      console.log('ChatGPT 분석 결과:', gptResult);
    }
  } catch (error) {
    console.error('❌ GPT 분석 요청 실패:', error);
    const resultBox = document.getElementById('gptAnalysisResult');
    if (resultBox) {
      resultBox.innerText =
        '분석 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  }
}

document.getElementById('chatBtn').addEventListener('click', async () => {
  const input = document.getElementById('userInput').value.trim();
  const output = document.getElementById('chatOutput');

  if (!input) {
    output.innerText = '❗ 질문을 입력해주세요.';
    return;
  }

  // ⏳ 로딩 표시
  output.classList.add('animate-pulse');
  output.innerText = 'Reon ai가 생각 중입니다... 🤔';

  try {
    const response = await getChatGPTResponse(input);

    output.classList.remove('animate-pulse'); // ✅ 애니메이션 제거
    output.innerText = response;
  } catch (err) {
    console.error(err);
    output.classList.remove('animate-pulse'); // ✅ 에러 시에도 제거
    output.innerText = '❌ 응답에 실패했습니다. 다시 시도해주세요.';
  }
});

export async function saveAnalysisToServer(recipeId, memberId, analysis) {
  console.log('🧪 서버 저장 요청:', { recipeId, memberId });

  if (!recipeId || !memberId || !analysis) {
    console.warn('❌ 저장 요청 누락된 필드 있음');
    return false;
  }

  try {
    const response = await fetch('https://api.reonai.net/api/save-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipeId: recipeId,
        memberId: memberId,
        analysis: analysis,
      }),
    });

    const result = await response.json();

    if (result.status === 200 && result.filename) {
      console.log(`✅ 저장 완료: ${result.filename}`);
      return result.filename; // ✅ 저장된 파일명을 리턴
    } else {
      console.warn('⚠️ 저장 실패:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ 서버 저장 중 오류:', error);
    return null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log(userData.id);
  const userId = userData.id;
  const isAdmin = userId === 67;
  loadAnalysisList(userId, isAdmin);
});

async function loadAnalysisList(userId, isAdmin = false) {
  try {
    const res = await fetch(
      `https://api.reonai.net/api/analysis-list/${userId}`
    );
    const result = await res.json();
    const list = result.data;

    const container = document.getElementById('analysisList');
    container.innerHTML = '';

    console.log('📂 분석 목록:', list);

    list.forEach((entry) => {
      let uid = userId;
      let filename = entry;

      // 관리자일 경우 entry 형식: '67/1553_20250421_103302'
      if (isAdmin && entry.includes('/')) {
        [uid, filename] = entry.split('/');
      }

      const item = document.createElement('button');
      item.className =
        'w-full text-left px-4 py-2 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition';
      item.innerText = isAdmin ? `👤${uid} / ${filename}` : filename;

      item.onclick = () => loadAnalysisDetail(uid, filename);
      container.appendChild(item);
    });
  } catch (error) {
    console.error('❌ 목록 불러오기 실패:', error);
  }
}

export async function loadAnalysisDetail(userId, filename) {
  const recipeId = filename.split('__')[0];
  console.log('filename');
  console.log(filename);

  console.log(recipeId);

  fetchRecordDetailsRecipeData(recipeId, userId);

  try {
    const res = await fetch(
      `https://api.reonai.net/api/analysis/${userId}/${filename}`
    );
    const result = await res.json();

    console.log(result);

    const box = document.getElementById('loadgptAnalysisResult');
    if (result.status === 200 && result.data?.analysis) {
      box.innerText = result.data.analysis;
    } else {
      box.innerText = '❌ 분석 데이터를 불러올 수 없습니다.';
    }
  } catch (error) {
    document.getElementById('loadgptAnalysisResult').innerText =
      '❌ 분석 로딩 실패';
    console.error(error);
  }
}

// 선택한 레시피를 서버에서 가지고오는 함수
async function fetchRecordDetailsRecipeData(recordId, recordMemberId) {
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
    displayDataRecipeData(jsonData); // JSON 데이터를 UI에 반영

    console.log('JSON 데이터를 UI에 반영');
  } catch (error) {
    console.error('Error fetching record details:', error);
  }
}

// JSON 데이터를 UI에 반영하는 함수
function displayDataRecipeData(data) {
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

    //my Recipe chart 에 넣기
    Highcharts.charts[6].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });
    Highcharts.charts[7].update({
      xAxis: {
        max: chartLengthData, // 필요한 경우 여유분을 추가 (+10)
      },
    });
    Highcharts.charts[6].series[3].setData(JSON.parse(details.temp4 || '[]'));
    Highcharts.charts[6].series[4].setData(JSON.parse(details.ror || '[]'));
    Highcharts.charts[6].series[5].setData(JSON.parse(details.temp1 || '[]'));
    Highcharts.charts[6].series[6].setData(JSON.parse(details.temp2 || '[]'));
    Highcharts.charts[6].series[7].setData(JSON.parse(details.temp3 || '[]'));

    Highcharts.charts[6].series[9].addPoint(
      [tpUnderTime, tpUnderTemp],
      true,
      false
    );

    Highcharts.charts[6].series[11].addPoint(
      [CpUnderTime, cpUnderTemp],
      true,
      false
    );

    Highcharts.charts[7].series[3].setData(JSON.parse(details.fan || '[]'));
    Highcharts.charts[7].series[4].setData(JSON.parse(details.heater || '[]'));
    Highcharts.charts[7].series[5].setData(JSON.parse(details.fan2 || '[]'));
  }
}
