// DOMContentLoaded 이벤트를 사용하여 DOM이 완전히 로드된 이후에 document.getElementById로 요소를 찾도록 수정
document.addEventListener('DOMContentLoaded', () => {
    // 버튼 클릭 이벤트 바인딩
    const rewriteBtn = document.getElementById('rewriteBtn');
    if (rewriteBtn) {
        rewriteBtn.addEventListener('click', mistralRewrite);
    }

    const grammarBtn = document.getElementById('grammarBtn');
    if (grammarBtn) {
        grammarBtn.addEventListener('click', mistralGrammar);
    }
    const grammarBtn2 = document.getElementById('grammarBtn2');
    if (grammarBtn2) {
        grammarBtn2.addEventListener('click', mistralGrammar2);
    }
    const pdfScanStyleBtn = document.getElementById('pdfScanStyleBtn');
    if (pdfScanStyleBtn) {
        pdfScanStyleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanStyle();
        });
    }
    const pdfScanRewriteBtn = document.getElementById('pdfScanRewriteBtn');
    if (pdfScanRewriteBtn) {
        pdfScanRewriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanRewrite();
        });
    }
    const pdfScanSummaryBtn = document.getElementById('pdfScanSummaryBtn');
    if (pdfScanSummaryBtn) {
        pdfScanSummaryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanSummary();
        });
    }
    const pdfScanExpandBtn = document.getElementById('pdfScanExpandBtn');
    if (pdfScanExpandBtn) {
        pdfScanExpandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanExpand();
        });
    }
    const pdfScanGrammarBtn = document.getElementById('pdfScanGrammarBtn');
    if (pdfScanGrammarBtn) {
        pdfScanGrammarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanGrammar();
        });
    }
    const pdfScanHonorificBtn = document.getElementById('pdfScanHonorificBtn');
    if (pdfScanHonorificBtn) {
        pdfScanHonorificBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanHonorific();
        });
    }
    const pdfScanInformalBtn = document.getElementById('pdfScanInformalBtn');
    if (pdfScanInformalBtn) {
        pdfScanInformalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanInformal();
        });
    }
    const pdfScanTranslateBtn = document.getElementById('pdfScanTranslateBtn');
    if (pdfScanTranslateBtn) {
        pdfScanTranslateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfScanTranslate();
        });
    }
});

async function searchExample() {
    const userInput = document.getElementById('userInput').value.trim();

    if (!userInput) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    exampleOffset = 0;
    loadMoreExamples();
}

let exampleOffset = 0;
let currentInput = '';
let lastExtractedText = '';

async function loadMoreExamples() {
    const userInput = document.getElementById('userInput').value.trim();
    const container = document.getElementById('exampleContainer');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    if (!userInput) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    if (exampleOffset === 0) {
        currentInput = userInput; // 첫 요청 시 저장
        container.innerHTML = ''; // 초기화
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/searchExample', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: currentInput,
                offset: exampleOffset,
            }),
        });

        const data = await response.json();

        if (data.examples) {
            const examples = data.examples
                .split(/\d+\.\s+/)
                .filter((e) => e.trim());
            examples.forEach((ex, i) => {
                const div = document.createElement('div');
                div.style.textAlign = 'left';
                div.style.marginBottom = '10px';

                const span = document.createElement('span');
                span.innerText = `${exampleOffset + i + 1}. ${ex.trim()} `;

                const copyBtn = document.createElement('button');
                copyBtn.innerText = '📋';
                copyBtn.title = '예문 복사';
                copyBtn.style.border = 'none';
                copyBtn.style.background = 'transparent';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.fontSize = '16px';
                copyBtn.style.padding = '0';
                copyBtn.style.margin = '0';
                copyBtn.style.display = 'inline'; // 핵심: 인라인으로 붙이기

                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(ex.trim());
                    copyBtn.innerText = '✅';
                    setTimeout(() => (copyBtn.innerText = '📋'), 1000);
                };

                span.appendChild(copyBtn);
                div.appendChild(span);
                container.appendChild(div);
            });

            exampleOffset += examples.length;

            const moreBtn = document.getElementById('loadMoreBtn');
            if (moreBtn) {
                moreBtn.style.display = 'inline-block';
            }

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    const content =
                        document.getElementById('exampleContainer').innerText;
                    saveAsPDF(content, '예문 제공.pdf');
                };
            }
        } else {
            container.innerText = '예문을 불러오지 못했습니다.';
        }
    } catch (error) {
        console.error('예문 요청 오류:', error);
        alert('❗ 예문 불러오기 중 오류 발생');
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function mistralRewrite() {
    const userInput = document.getElementById('userInput').value;
    const originalText = userInput;
    const resultArea = document.getElementById('rewriteResults');
    const spinner = document.getElementById('loadingSpinner');

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    resultArea.innerHTML = '';
    if (spinner) spinner.style.display = 'block';

    try {
        const response = await fetch('http://127.0.0.1:8000/mistralRewrite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();

        console.log('📥 서버 응답:', data.result);

        if (!data.result || data.result.trim() === '') {
            resultArea.innerHTML =
                '<p style="color: red;">❗ 결과가 비어 있습니다.</p>';
            return;
        }

        const examples = data.result
            .split(/예시문(?: \d+)?:/)
            .map((text) => text.trim())
            .filter((text) => text.length > 0);

        const first = examples[0] || '결과 없음';

        const wrapper = document.createElement('div');
        wrapper.className = 'rewriteBox';
        wrapper.style.whiteSpace = 'normal';
        wrapper.style.lineHeight = '1.6';
        wrapper.style.marginBottom = '20px';

        const label = document.createElement('div');
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '5px';

        const content = document.createElement('div');
        content.id = 'example1';
        content.style.whiteSpace = 'normal';
        content.style.lineHeight = '1.6';
        content.style.margin = '0';
        content.style.padding = '0';

        try {
            content.innerHTML = highlightDiffWithType(originalText, first);
        } catch (e) {
            content.innerText = first;
            console.warn('highlightDiff 실패, 기본 출력 사용:', e);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(content);
        resultArea.appendChild(wrapper);

        // PDF 저장 버튼 재연결
        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            const newBtn = pdfBtn.cloneNode(true);
            pdfBtn.replaceWith(newBtn);
            newBtn.addEventListener('click', () =>
                saveAsPDF(wrapper, '첨삭.pdf')
            );
        }
    } catch (error) {
        console.error('Fetch error:', error);
        resultArea.innerHTML =
            '<p style="color: red;">❗ 요청 중 오류가 발생했습니다.</p>';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function changeStyle(exampleId) {
    const selectedText = document.getElementById(exampleId).innerText.trim();
    const styleRaw = document.getElementById(`${exampleId}-style`).value;
    const style = styleRaw.toLowerCase();
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    console.log('🛠 스타일 적용 요청:', { selectedText, style });

    if (!selectedText) {
        alert('선택된 예시문이 비어있습니다.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/gptStyleChange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText, style: style }),
        });

        const data = await response.json();
        if (data.styled_text) {
            document.getElementById(exampleId).innerText = data.styled_text;
            document
                .getElementById('pdfDownloadBtn')
                .addEventListener('click', function () {
                    saveAsPDF(data.styled_text, '문체 변경.pdf'); // 이 방법으로 HTML을 PDF로 변환
                });
        } else {
            alert('스타일 변환 실패: ' + (data.error || '알 수 없는 오류'));
        }
    } catch (error) {
        console.error('스타일 변경 중 오류:', error);
        alert('❗스타일 변경 요청 중 오류가 발생했습니다.');
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function summarizeText() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = '';
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();
        if (data.result) {
            resultArea.innerHTML = `
              <h5>📚 요약 결과:</h5>
              <p style="white-space: pre-wrap;">${data.result}</p>
            `;

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    saveAsPDF(data.result, '요약.pdf');
                };
            }
        } else {
            resultArea.innerText = `⚠️ 요약 실패: ${
                data.error || '알 수 없는 오류'
            }`;
        }
    } catch (error) {
        console.error('요약 요청 중 오류:', error);
        resultArea.innerText = '❗요약 요청 중 오류가 발생했습니다.';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function expandText() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    resultArea.innerHTML = '';

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();
        if (data.result) {
            resultArea.innerHTML = `
              <h5>🚀 확장 결과:</h5>
              <p style="white-space: pre-wrap;">${data.result}</p>
            `;
            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    saveAsPDF(data.result, '확장.pdf');
                };
            }
        } else {
            resultArea.innerText = `⚠️ 확장 실패: ${
                data.error || '알 수 없는 오류'
            }`;
        }
    } catch (error) {
        console.error('확장 요청 중 오류:', error);
        resultArea.innerText = '❗확장 요청 중 오류가 발생했습니다.';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function mistralGrammar() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    const grammarTable = document.getElementById('grammarTable');
    const tbody = grammarTable ? grammarTable.querySelector('tbody') : null;

    if (!tbody) {
        console.log('⚠️ tbody 요소가 없습니다. HTML 구조를 확인하세요.');
        return;
    }
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/mistralGrammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();
        const text = data.result;

        if (text) {
            const lines = text
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 0); // 여기서 빈 줄 제거됨

            const table = document.getElementById('grammarTable');

            function removeIcons(text) {
                // 이모지 제거
                return text.replace(/^[^\w가-힣]+/, '').trim();
            }

            let hasError = false; // 틀린 문장이 하나라도 발견되었음을 기록

            for (let i = 0; i < lines.length; i += 4) {
                const cleanLine1 = removeIcons(lines[i]);
                const cleanLine2 = removeIcons(lines[i + 1]);

                if (cleanLine1 === cleanLine2) {
                    // 맞는 문장이면 기록하지 않고 넘어감
                    continue;
                }

                hasError = true;

                const row = document.createElement('tr');

                const tdLeft = document.createElement('td');
                const tdRight = document.createElement('td');
                tdRight.classList.add('right');

                tdLeft.innerHTML = `<span class="sentence">${textDiff(
                    cleanLine1,
                    cleanLine2
                )}</span>`;

                // tdRight는 기존처럼 규칙 설명 출력
                tdRight.textContent = lines[i + 2] + '\n' + lines[i + 3];

                row.appendChild(tdLeft);
                row.appendChild(tdRight);
                tbody.appendChild(row);

                // 교정문 복사 버튼
                const copyBtn = document.createElement('button');
                copyBtn.innerText = '📋';
                copyBtn.title = '교정문 복사';
                copyBtn.style.border = 'none';
                copyBtn.style.background = 'transparent';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.fontSize = '16px';
                copyBtn.style.padding = '0';
                copyBtn.style.margin = '0';
                copyBtn.style.display = 'inline'; // 핵심: 인라인으로 붙이기

                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(cleanLine2.trim());
                    copyBtn.innerText = '✅';
                    setTimeout(() => (copyBtn.innerText = '📋'), 1000);
                };

                tdLeft.appendChild(copyBtn);

                const pdfBtn = document.getElementById('pdfDownloadBtn');
                if (pdfBtn) {
                    pdfBtn.onclick = function () {
                        saveAsPDF(resultArea, '문법 교정.pdf');
                    };
                }
            }

            if (!hasError) {
                alert('🎉 틀린 부분이 없습니다.');
            }
        } else if (data.error) {
            resultArea.innerText = `⚠️ 오류: ${data.error}\n\n🔍 상세 내용: ${
                data.detail || '없음'
            }`;
            console.error('에러 응답 내용:', data);
        } else {
            resultArea.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
            console.warn('예상치 못한 응답 구조:', data);
        }
    } catch (error) {
        resultArea.innerText = '❗요청 중 오류가 발생했습니다.' + error;
        console.error('Fetch error:', error);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// async function mistralGrammar2() {
//     const userInput = document.getElementById('userInput').value;
//     const resultArea = document.getElementById('resultArea');
//     const spinner = document.getElementById('loadingSpinner');
//     spinner.style.display = 'block';

//     const tbody = document.querySelector('tbody');
//     if (!tbody) {
//         console.log('⚠️ tbody 요소가 없습니다. HTML 구조를 확인하세요.');
//         return;
//     }
//     while (tbody.firstChild) {
//         tbody.removeChild(tbody.firstChild);
//     }

//     if (!userInput.trim()) {
//         alert('입력된 문장이 없습니다.');
//         return;
//     }

//     try {
//         const response = await fetch('http://127.0.0.1:8000/mistralGrammar2', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ content: userInput }), // 전체 글 파이썬으로 보냄
//         });

//         const data = await response.json();
//         const array = data.result; // 텍스트가 아니라 배열 받아야 함. -> 받아지나?
//         const len = data.arrayLen; // 툴린 문장 개수

//         if (array) {
//             const table = document.getElementById('grammarTable');

//             for (let i = 0; i < len; i += 1) {
//                 const row = document.createElement('tr');
//                 const tdLeft = document.createElement('td');
//                 const tdRight = document.createElement('td');
//                 tdRight.classList.add('right');

//                 tdLeft.innerHTML = `<span class="sentence">${textDiff(
//                     array[i][0],
//                     array[i][1]
//                 )}</span>`;

//                 // tdRight는 미스트랄 응답 결과 출력
//                 tdRight.textContent = array[i][2];

//                 row.appendChild(tdLeft);
//                 row.appendChild(tdRight);
//                 tbody.appendChild(row);

//                 // 교정문 복사 버튼
//                 const copyBtn = document.createElement('button');
//                 copyBtn.innerText = '📋';
//                 copyBtn.title = '교정문 복사';
//                 copyBtn.style.border = 'none';
//                 copyBtn.style.background = 'transparent';
//                 copyBtn.style.cursor = 'pointer';
//                 copyBtn.style.fontSize = '16px';
//                 copyBtn.style.padding = '0';
//                 copyBtn.style.margin = '0';
//                 copyBtn.style.display = 'inline'; // 핵심: 인라인으로 붙이기

//                 copyBtn.onclick = () => {
//                     navigator.clipboard.writeText(array[i][1].trim());
//                     copyBtn.innerText = '✅';
//                     setTimeout(() => (copyBtn.innerText = '📋'), 1000);
//                 };

//                 tdLeft.appendChild(copyBtn);

//                 const pdfBtn = document.getElementById('pdfDownloadBtn');
//                 if (pdfBtn) {
//                     pdfBtn.onclick = function () {
//                         saveAsPDF(resultArea, '문법 교정.pdf');
//                     };
//                 }
//             }
//         } else if (data.error) {
//             resultArea.innerText = `⚠️ 오류: ${data.error}\n\n🔍 상세 내용: ${
//                 data.detail || '없음'
//             }`;
//             console.error('에러 응답 내용:', data);
//         } else {
//             resultArea.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
//             console.warn('예상치 못한 응답 구조:', data);
//         }
//     } catch (error) {
//         resultArea.innerText = '❗요청 중 오류가 발생했습니다.' + error;
//         console.error('Fetch error:', error);
//     } finally {
//         spinner.style.display = 'none';
//     }
// }

function textDiff(text1, text2) {
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(text1, text2);
    const diffs_pretty = dmp.diff_prettyHtml(diffs);

    return diffs_pretty;
}

async function cohereHonorific() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
    resultArea.innerHTML = ''; // HTML 내용을 지움

    if (!userInput.trim()) {
        resultArea.innerText = '입력된 문장이 없습니다.';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/cohereHonorific', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();

        if (data.result) {
            resultArea.innerText = data.result;
            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    saveAsPDF(data.result, '경어체.pdf');
                };
            }
        } else if (data.error) {
            resultArea.innerText = `⚠️ 오류: ${data.error}\n\n🔍 상세 내용: ${
                data.detail || '없음'
            }`;
            console.error('에러 응답 내용:', data);
        } else {
            resultArea.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
            console.warn('예상치 못한 응답 구조:', data);
        }
    } catch (error) {
        resultArea.innerText = '❗요청 중 오류가 발생했습니다.' + error;
        console.log('Fetch error:', error);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function cohereInformal() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
    resultArea.innerHTML = ''; // HTML 내용을 지움

    if (!userInput.trim()) {
        resultArea.innerText = '입력된 문장이 없습니다.';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/cohereInformal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();

        if (data.result) {
            resultArea.innerText = data.result;
            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    saveAsPDF(data.result, '평어체.pdf');
                };
            }
        } else if (data.error) {
            resultArea.innerText = `⚠️ 오류: ${data.error}\n\n🔍 상세 내용: ${
                data.detail || '없음'
            }`;
            console.error('에러 응답 내용:', data);
        } else {
            resultArea.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
            console.warn('예상치 못한 응답 구조:', data);
        }
    } catch (error) {
        resultArea.innerText = '❗요청 중 오류가 발생했습니다.' + error;
        console.log('Fetch error:', error);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function applyTranslation() {
    const text = document.getElementById('translateInput').value.trim();
    const sourceLang = document.getElementById('sourceSelector').value;
    const targetLang = document.getElementById('targetSelector').value;
    const resultBox = document.getElementById('translateResult');
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
    resultBox.innerText = '';

    if (!text) {
        alert('번역할 문장을 입력해주세요.');
        return;
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                source: sourceLang,
                target: targetLang,
            }),
        });

        const data = await res.json();

        if (data.result) {
            resultBox.innerText = data.result;
            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                pdfBtn.onclick = function () {
                    saveAsPDF(data.result, '번역.pdf');
                };
            }
        } else if (data.error) {
            resultBox.innerText = `⚠️ 번역 오류: ${data.error}\n상세: ${
                data.detail || '없음'
            }`;
            console.error('Papago 오류 응답:', data);
        } else {
            resultBox.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
            console.warn('예상치 못한 응답 구조:', data);
        }
    } catch (err) {
        console.error('번역 요청 중 오류:', err);
        resultBox.innerText = '❗ 번역 중 오류가 발생했습니다.';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function handlePdfScanAndProcess({
    apiEndpoint,
    boxClass,
    resultKey = 'result',
    extraPayload = {},
}) {
    const spinner = document.getElementById('loadingSpinner');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput ? fileInput.files[0] : null;

    if (!spinner || !resultArea) {
        console.error('❗ spinner 또는 resultArea 요소가 없습니다.');
        return;
    }

    spinner.style.display = 'block';

    const formData = new FormData();
    if (file) formData.append('pdf', file);

    try {
        let extractedText = '';

        if (lastExtractedText && !file) {
            extractedText = lastExtractedText;
        } else if (file) {
            const extractResponse = await fetch(
                'http://127.0.0.1:8000/pdfScan',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const contentType = extractResponse.headers.get('content-type');
            if (!extractResponse.ok) {
                throw new Error(`PDF 업로드 실패: ${extractResponse.status}`);
            }

            if (!contentType || !contentType.includes('application/json')) {
                const raw = await extractResponse.text();
                console.error('❌ JSON 응답 아님:', raw);
                throw new Error('JSON 형식이 아님: ' + raw);
            }

            const extractResult = await extractResponse.json();
            console.log('🧾 추출된 텍스트:', extractResult.text);
            extractedText =
                extractResult.text || '[텍스트를 추출하지 못했습니다]';
            lastExtractedText = extractedText;
        } else {
            alert('PDF 파일을 업로드하거나 텍스트를 먼저 추출해주세요.');
            spinner.style.display = 'none';
            return;
        }

        let requestBody = {};
        if (apiEndpoint === 'gptStyleChange') {
            requestBody = { text: extractedText, ...extraPayload };
        } else {
            requestBody = { content: extractedText, ...extraPayload };
        }

        const apiResponse = await fetch(
            `http://127.0.0.1:8000/${apiEndpoint}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await apiResponse.json();
        const resultText = data[resultKey];

        resultArea.innerHTML = '';

        if (resultText) {
            const firstResult =
                typeof resultText === 'string'
                    ? resultText.split(/\n{2,}/)[0]
                    : Array.isArray(resultText)
                    ? resultText[0]
                    : resultText;

            const box = document.createElement('div');
            box.className = boxClass;
            box.innerHTML = `<p style="white-space: pre-wrap;">${firstResult}</p>`;
            resultArea.appendChild(box);

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                const newBtn = pdfBtn.cloneNode(true);
                pdfBtn.replaceWith(newBtn);
                newBtn.addEventListener('click', () =>
                    saveAsPDF(box, 'PDF_SCAN_결과.pdf')
                );
            }
        } else {
            const errorBox = document.createElement('div');
            errorBox.className = boxClass;
            errorBox.innerText = `⚠️ 처리 실패: ${
                data.error || '알 수 없는 오류'
            }`;
            resultArea.appendChild(errorBox);
        }
    } catch (err) {
        alert('📛 PDF 추출 중 오류: ' + err.message);
        console.error('❌ PDF 추출 실패:', err);
        const errorBox = document.createElement('div');
        errorBox.className = boxClass;
        errorBox.innerText = '❗ 처리 중 오류가 발생했습니다.';
        resultArea.innerHTML = '';
        resultArea.appendChild(errorBox);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// async function pdfScanGrammar() {
//     await handlePdfScanAndProcess({
//         apiEndpoint: 'mistralGrammar',
//         boxClass: 'grammarBox',
//         resultKey: 'result',
//     });
// }

async function pdfScanGrammar() {
    const form = document.getElementById('uploadForm');
    const grammarTable = document.getElementById('grammarTable');
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';
    if (grammarTable) {
        grammarTable.style.visibility = 'visible';
    }
    const tbody = document.querySelector('tbody');
    if (!tbody) {
        console.error('grammarTable 내부에 tbody가 없습니다.');
        return;
    }

    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('pdf', file);

    const resultArea = document.getElementById('resultArea');

    try {
        const response = await fetch('http://127.0.0.1:8000/pdfScan', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('Success:', result.text);

        const grammarOriginalText =
            result.text || '[텍스트를 추출하지 못했습니다]';

        // 이 시점에서 grammarOriginalText를 가지고 두 번째 fetch
        const grammarResponse = await fetch(
            'http://127.0.0.1:8000/mistralGrammar',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: grammarOriginalText }),
            }
        );

        const grammarData = await grammarResponse.json();
        console.log('Grammar Check Result:', grammarData.result);

        const text = grammarData.result;

        if (text) {
            const lines = text
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 0); // 여기서 빈 줄 제거됨

            const table = document.getElementById('grammarTable');

            function removeIcons(text) {
                // 이모지 제거
                return text.replace(/^[^\w가-힣]+/, '').trim();
            }

            let hasError = false; // 틀린 문장이 하나라도 발견되었음을 기록

            for (let i = 0; i < lines.length; i += 4) {
                const cleanLine1 = removeIcons(lines[i]);
                const cleanLine2 = removeIcons(lines[i + 1]);

                if (cleanLine1 === cleanLine2) {
                    // 맞는 문장이면 기록하지 않고 넘어감
                    continue;
                }

                hasError = true;

                const row = document.createElement('tr');

                const tdLeft = document.createElement('td');
                const tdRight = document.createElement('td');
                tdRight.classList.add('right');

                tdLeft.innerHTML = `<span class="sentence">${textDiff(
                    cleanLine1,
                    cleanLine2
                )}</span>`;

                // tdRight는 기존처럼 규칙 설명 출력
                tdRight.textContent = lines[i + 2] + '\n' + lines[i + 3];

                row.appendChild(tdLeft);
                row.appendChild(tdRight);
                tbody.appendChild(row);

                // 교정문 복사 버튼
                const copyBtn = document.createElement('button');
                copyBtn.innerText = '📋';
                copyBtn.title = '교정문 복사';
                copyBtn.style.border = 'none';
                copyBtn.style.background = 'transparent';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.fontSize = '16px';
                copyBtn.style.padding = '0';
                copyBtn.style.margin = '0';
                copyBtn.style.display = 'inline'; // 핵심: 인라인으로 붙이기

                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(cleanLine2.trim());
                    copyBtn.innerText = '✅';
                    setTimeout(() => (copyBtn.innerText = '📋'), 1000);
                };

                tdLeft.appendChild(copyBtn);

                const pdfBtn = document.getElementById('pdfDownloadBtn');
                if (pdfBtn) {
                    pdfBtn.onclick = function () {
                        saveAsPDF(resultArea, '스캔 문법 교정.pdf');
                    };
                }
            }

            if (!hasError) {
                alert('🎉 틀린 부분이 없습니다.');
            }
        } else if (data.error) {
            resultArea.innerText = `⚠️ 오류: ${data.error}\n\n🔍 상세 내용: ${
                data.detail || '없음'
            }`;
            console.error('에러 응답 내용:', data);
        } else {
            resultArea.innerText = '⚠️ 알 수 없는 오류가 발생했습니다.';
            console.warn('예상치 못한 응답 구조:', data);
        }
    } catch (error) {
        console.error('Error:', error);
        resultArea.textContent =
            '[에러 발생: PDF를 처리하거나 문법 교정에 실패했습니다]';
    } finally {
        spinner.style.display = 'none';
    }
}

async function pdfScanStyle() {
    const style = document.getElementById('styleSelect').value;

    await handlePdfScanAndProcess({
        apiEndpoint: 'gptStyleChange',
        boxClass: 'styleResult',
        resultKey: 'styled_text',
        extraPayload: { style },
    });
}

async function pdfScanRewrite() {
    await handlePdfScanAndProcess({
        apiEndpoint: 'mistralRewrite',
        boxClass: 'rewriteBox',
        extraPayload: { source: 'scan' },
    });
}

async function pdfScanSummary() {
    await handlePdfScanAndProcess({
        apiEndpoint: 'summary',
        boxClass: 'summaryBox',
    });
}

async function pdfScanExpand() {
    await handlePdfScanAndProcess({
        apiEndpoint: 'expand',
        boxClass: 'expandBox',
    });
}

async function pdfScanHonorific() {
    await handlePdfScanAndProcess({
        apiEndpoint: 'cohereHonorific',
        boxClass: 'honorificBox',
    });
}

async function pdfScanInformal() {
    await handlePdfScanAndProcess({
        apiEndpoint: 'cohereInformal',
        boxClass: 'informalBox',
    });
}

async function pdfScanTranslate() {
    const sourceLang = document.getElementById('sourceSelector').value;
    const targetLang = document.getElementById('targetSelector').value;

    const fileInput = document.getElementById('pdfFile');
    const file = fileInput ? fileInput.files[0] : null;

    if (!file && (!lastExtractedText || !lastExtractedText.trim())) {
        alert('PDF 파일을 먼저 업로드해 주세요.');
        return;
    }

    let textToTranslate = lastExtractedText;

    // 새로 파일이 업로드되었으면 텍스트 추출
    if (file) {
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const extractResponse = await fetch(
                'http://127.0.0.1:8000/pdfScan',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const extractResult = await extractResponse.json();
            textToTranslate = extractResult.text;
            lastExtractedText = textToTranslate;
        } catch (err) {
            alert('PDF 텍스트 추출 실패: ' + err.message);
            return;
        }
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'translate',
        boxClass: 'translateBox',
        resultKey: 'result',
        extraPayload: {
            text: textToTranslate,
            source: sourceLang,
            target: targetLang,
        },
    });
}

function highlightDiffWithType(original, revised) {
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(original, revised);
    dmp.diff_cleanupSemantic(diffs);

    const result = [];

    for (let i = 0; i < diffs.length; i++) {
        const [op, text] = diffs[i];

        if (op === 0) {
            result.push(text);
        } else if (op === -1 && diffs[i + 1] && diffs[i + 1][0] === 1) {
            const addedText = diffs[i + 1][1];
            const deletedText = text;

            let cssClass = 'tooltip-wrapper highlight-edit';
            let tip = '표현이 바뀌었어요';

            if (
                /^(은|는|이|가|을|를|에|에서|으로|로|와|과|도|만|까지)$/.test(
                    deletedText.trim()
                )
            ) {
                cssClass = 'tooltip-wrapper highlight-particle';
                tip = '조사를 문맥에 더 잘 맞게 다듬었어요';
            } else if (addedText.length > deletedText.length + 10) {
                cssClass = 'tooltip-wrapper highlight-extended';
                tip = '생각을 더 풍부하게 풀어냈어요';
            } else if (deletedText.length === addedText.length) {
                cssClass = 'tooltip-wrapper highlight-synonym';
                tip = '같은 뜻을 더 적절한 말로 바꿨어요';
            } else {
                cssClass = 'tooltip-wrapper highlight-formal';
                tip = '글 흐름에 더 어울리는 표현이에요';
            }

            result.push(`
                <span class="${cssClass}">
                    ${addedText}
                    <span class="custom-tooltip">${tip}</span>
                </span>
            `);
            i++;
        } else if (op === 1) {
            result.push(`
                <span class="tooltip-wrapper highlight-added">
                    ${text}
                    <span class="custom-tooltip">새로 추가된 표현이에요</span>
                </span>
            `);
        }
    }

    return result.join('');
}

function saveAsPDF(content, filename = 'converted.pdf') {
    let source;

    // content가 문자열이면 HTML 문자열로 가정하고 줄바꿈 처리
    if (typeof content === 'string') {
        const formattedHTML = `<div style="white-space: pre-wrap;">${content.replace(
            /\n/g,
            '<br>'
        )}</div>`;
        source = formattedHTML;
    }
    // content가 HTMLElement이면 그대로 사용
    else if (content instanceof HTMLElement) {
        source = content;
    } else {
        console.error(
            '❗ PDF 저장 실패: content는 문자열 또는 DOM 요소여야 합니다.'
        );
        return;
    }

    html2pdf()
        .set({
            margin: [10, 10, 10, 10], // 여백 mm
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(source)
        .save();
}
