let gptRecipeAnalysisResult;

export async function getChatGPTResponse(userMessage) {
  const response = await fetch('http://3.38.94.176:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content:
            '너는 커피 로스팅 전문가야. 사용자의 로스팅 레시피를 분석하고 피드백을 줘.',
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

export async function saveAnalysisToServer(recipeId, memberId, analysis) {
  console.log('🧪 서버 저장 요청:', { recipeId, memberId, analysis });

  if (!recipeId || !memberId || !analysis) {
    console.warn('❌ 저장 요청 누락된 필드 있음');
    return false;
  }

  try {
    const response = await fetch('http://3.38.94.176:3000/api/save-analysis', {
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

    if (result.status === 200) {
      console.log('✅ 분석 결과 서버에 저장됨');
      return true;
    } else {
      console.warn('⚠️ 저장 실패:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ 저장 중 오류 발생:', error);
    return false;
  }
}

window.addEventListener('DOMContentLoaded', loadAnalysisList);
async function loadAnalysisList() {
  try {
    const res = await fetch('http://3.38.94.176:3000/api/analysis-list');
    const result = await res.json();
    const list = result.data;

    const container = document.getElementById('analysisList');
    container.innerHTML = '';

    console.log('목록 불러오기');

    list.forEach((recipeId) => {
      const item = document.createElement('button');

      console.log('recipeI');
      console.log(recipeId);
      item.className =
        'w-full text-left px-4 py-2 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition';
      item.innerText = `${recipeId}`;
      item.onclick = () => loadAnalysisDetail(recipeId);
      container.appendChild(item);
    });
  } catch (error) {
    console.error('❌ 목록 불러오기 실패:', error);
  }
}

async function loadAnalysisDetail(recipeId) {
  console.log(recipeId);
  try {
    const res = await fetch(`http://3.38.94.176:3000/api/analysis/${recipeId}`);
    const result = await res.json();

    console.log(result);

    const box = document.getElementById('loadgptAnalysisResult');
    if (result.status === 200 && result.data?.analysis) {
      box.innerText = result.data.analysis;
    } else {
      box.innerText = '❌ 분석 데이터가 없습니다.';
    }
  } catch (error) {
    document.getElementById('loadgptAnalysisResult').innerText =
      '❌ 분석 로딩 실패';
    console.error(error);
  }
}
