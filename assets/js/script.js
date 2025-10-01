const isLocal =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const BASE_URL = isLocal
    ? 'http://127.0.0.1:8000'
    : 'https://storycraft-ppxj.onrender.com';

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
    const speechStyleBtn = document.getElementById('speechStyleBtn');
    if (speechStyleBtn) {
        speechStyleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechStyle(lastRecordedFile);
        });
    }
    const speechRewriteBtn = document.getElementById('speechRewriteBtn');
    if (speechRewriteBtn) {
        speechRewriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechRewrite(lastRecordedFile);
        });
    }
    const speechSummaryBtn = document.getElementById('speechSummaryBtn');
    if (speechSummaryBtn) {
        speechSummaryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (lastRecordedFile) {
                speechSummary(lastRecordedFile); // 🔹 녹음 파일 전달
            } else {
                speechSummary(); // 🔹 업로드 input에서 가져오기
            }
        });
    }
    const speechExpandBtn = document.getElementById('speechExpandBtn');
    if (speechExpandBtn) {
        speechExpandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechExpand(lastRecordedFile);
        });
    }
    const speechHonorificBtn = document.getElementById('speechHonorificBtn');
    if (speechHonorificBtn) {
        speechHonorificBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechHonorific(lastRecordedFile);
        });
    }
    const speechInformalBtn = document.getElementById('speechInformalBtn');
    if (speechInformalBtn) {
        speechInformalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechInformal(lastRecordedFile);
        });
    }
    const speechTranslateBtn = document.getElementById('speechTranslateBtn');
    if (speechTranslateBtn) {
        speechTranslateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            speechTranslate(lastRecordedFile);
        });
    }
    const startRecord = document.getElementById('startRecord');
    if (startRecord) {
        startRecord.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('startRecord 있음');
            startRecording();
        });
    }
    const stopRecord = document.getElementById('stopRecord');
    if (stopRecord) {
        stopRecord.addEventListener('click', (e) => {
            e.preventDefault();
            stopRecording();
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
        const response = await fetch(`${BASE_URL}/searchExample`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: currentInput,
                offset: exampleOffset,
            }),
        });

        const data = await response.json();

        if (data.result) {
            const examples = data.result
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
                copyBtn.style.display = 'inline';

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

function rebindRewriteBtn() {
    const currentBtn = document.getElementById('rewriteBtn');
    if (!currentBtn) return;

    const newBtn = currentBtn.cloneNode(true);
    newBtn.id = 'rewriteBtn';
    currentBtn.replaceWith(newBtn);
    newBtn.addEventListener('click', mistralRewrite);
}

async function mistralRewrite() {
    const userInput = document.getElementById('userInput').value;
    const originalText = userInput;

    const outerArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        return;
    }

    outerArea.innerHTML = '';

    const resultArea = document.createElement('div');
    resultArea.id = 'rewriteResults';
    outerArea.appendChild(resultArea);

    resultArea.innerHTML = '';
    if (spinner) spinner.style.display = 'block';

    try {
        const response = await fetch(`${BASE_URL}/mistralRewrite`, {
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
        console.log(data.result);
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

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            const newBtn = pdfBtn.cloneNode(true);
            newBtn.id = 'pdfDownloadBtn';
            pdfBtn.replaceWith(newBtn);
            newBtn.addEventListener('click', () =>
                saveAsPDF(wrapper, '첨삭.pdf')
            );
        }

        rebindRewriteBtn();
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
        const response = await fetch(`${BASE_URL}/gptStyleChange`, {
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
                    saveAsPDF(data.styled_text, '문체 변경.pdf');
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

async function applyStyle() {
    const text = document.getElementById('styleInput').value;
    const style = document.getElementById('styleSelector').value;
    const result = document.getElementById('styleResult');
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';

    result.innerText = '';

    if (!text.trim()) {
        alert('문장을 입력해주세요.');
        spinner.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/gptStyleChange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, style }),
        });
        const data = await response.json();

        result.innerText =
            data.styled_text || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(data.styled_text, '문체 변경.pdf');
            };
        }
    } catch (error) {
        result.innerText = '❗요청 중 오류 발생';
        console.error(error);
    } finally {
        spinner.style.display = 'none';
    }
}

async function summarizeText() {
    const userInput = document.getElementById('userInput').value;
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('loadingSpinner');

    const rewriteBox = document.getElementById('rewriteResults');
    if (rewriteBox) rewriteBox.innerHTML = '';

    const oldSummary = document.getElementById('summaryContent');
    if (oldSummary) oldSummary.remove();

    const oldExpand = document.getElementById('expandContent');
    if (oldExpand) oldExpand.remove();

    const oldSummaryHeading = Array.from(document.querySelectorAll('h5')).find(
        (el) => el.innerText.includes('요약 결과')
    );
    if (oldSummaryHeading) oldSummaryHeading.remove();

    const oldExpandHeading = Array.from(document.querySelectorAll('h5')).find(
        (el) => el.innerText.includes('확장 결과')
    );
    if (oldExpandHeading) oldExpandHeading.remove();

    if (spinner) spinner.style.display = 'block';

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        if (spinner) spinner.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();

        if (data.result) {
            const heading = document.createElement('h5');
            heading.innerText = '📚 요약 결과:';

            const content = document.createElement('p');
            content.id = 'summaryContent';
            content.style.whiteSpace = 'pre-wrap';
            content.innerText = data.result;

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                const newBtn = pdfBtn.cloneNode(true);
                newBtn.id = 'pdfDownloadBtn';
                pdfBtn.replaceWith(newBtn);
                newBtn.addEventListener('click', () =>
                    saveAsPDF(content, '요약.pdf')
                );
            }

            resultArea.appendChild(heading);
            resultArea.appendChild(content);
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

    const rewriteBox = document.getElementById('rewriteResults');
    if (rewriteBox) rewriteBox.innerHTML = '';

    const oldExpand = document.getElementById('expandContent');
    if (oldExpand) oldExpand.remove();

    const oldSummary = document.getElementById('summaryContent');
    if (oldSummary) oldSummary.remove();

    const oldExpandHeading = Array.from(document.querySelectorAll('h5')).find(
        (el) => el.innerText.includes('확장 결과')
    );
    if (oldExpandHeading) oldExpandHeading.remove();

    const oldSummaryHeading = Array.from(document.querySelectorAll('h5')).find(
        (el) => el.innerText.includes('요약 결과')
    );
    if (oldSummaryHeading) oldSummaryHeading.remove();

    if (spinner) spinner.style.display = 'block';

    if (!userInput.trim()) {
        alert('입력된 문장이 없습니다.');
        if (spinner) spinner.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: userInput }),
        });

        const data = await response.json();

        if (data.result) {
            const heading = document.createElement('h5');
            heading.innerText = '🚀 확장 결과:';

            const content = document.createElement('p');
            content.id = 'expandContent';
            content.style.whiteSpace = 'pre-wrap';
            content.innerText = data.result;

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                const newBtn = pdfBtn.cloneNode(true);
                newBtn.id = 'pdfDownloadBtn';
                pdfBtn.replaceWith(newBtn);
                newBtn.addEventListener('click', () =>
                    saveAsPDF(content, '확장.pdf')
                );
            }

            resultArea.appendChild(heading);
            resultArea.appendChild(content);
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
        const response = await fetch(`${BASE_URL}/mistralGrammar`, {
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
                const cleanLine3 = removeIcons(lines[i + 2]);
                const cleanLine4 = removeIcons(lines[i + 3]);

                if (cleanLine1 === cleanLine2) {
                    // 맞는 문장이면 기록하지 않고 넘어감
                    continue;
                }

                hasError = true;

                const row = document.createElement('tr');
                const tdLeft = document.createElement('td');
                const tdRight = document.createElement('td');
                tdRight.classList.add('right');

                tag_delete = textDiff(cleanLine1, cleanLine2);
                del_tag_delete = tag_delete.replace(
                    /<del[^>]*>.*?<\/del>/g,
                    ''
                );
                ins_tag_delete = tag_delete.replace(
                    /<ins[^>]*>.*?<\/ins>/g,
                    ''
                );

                tdLeft.innerHTML = `<span class="sentence">❌${ins_tag_delete}<br>✅${del_tag_delete}</span>`;

                const style = document.createElement('style');
                style.innerHTML = `
                    del {
                        text-decoration: line-through;
                        background: #ff9999 !important
                    }
                    ins {
                        background: #81ff81 !important
                    }
                `;
                document.head.appendChild(style);

                // tdRight는 기존처럼 규칙 설명 출력
                tdRight.textContent = '📖 ' + cleanLine3 + '\n✍️ ' + cleanLine4;

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
        const response = await fetch(`${BASE_URL}/cohereHonorific`, {
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
        const response = await fetch(`${BASE_URL}/cohereInformal`, {
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
        const response = await fetch(`${BASE_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                source: sourceLang,
                target: targetLang,
            }),
        });

        const data = await response.json();

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

window.getSelectedFile = function () {
    const any = document.getElementById('fileAny');
    if (any && any.files && any.files[0]) return any.files[0];

    const img = document.getElementById('imageFile');
    if (img && img.files && img.files[0]) return img.files[0];

    const pdf = document.getElementById('pdfFile');
    if (pdf && pdf.files && pdf.files[0]) return pdf.files[0];

    return null;
};

window.isImageFile = function (file) {
    if (!file) return false;
    const mime = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    return (
        mime.startsWith('image/') ||
        /\.(png|jpe?g|gif|bmp|webp|tiff?)$/.test(name)
    );
};

window.extractTextFromAnyFile = async function (file) {
    if (!file) throw new Error('파일이 없습니다.');
    const fd = new FormData();
    fd.append('file', file); // 서버 /fileScan은 'file' 필드로 받음
    const res = await fetch(`${BASE_URL}/fileScan`, {
        method: 'POST',
        body: fd,
    });
    if (!res.ok) {
        const raw = await res.text().catch(() => '');
        throw new Error(`fileScan HTTP ${res.status} - ${raw || ''}`);
    }
    const js = await res.json();
    return (js.text || '').toString();
};

// 업로더에서 파일 하나만 꺼내오기 (image.html/scan.html 겸용)
function getSelectedFile() {
    const any = document.getElementById('fileAny');
    if (any && any.files && any.files[0]) return any.files[0];

    // 예전 id 호환 (혹시 남아있다면)
    const img = document.getElementById('imageFile');
    if (img && img.files && img.files[0]) return img.files[0];

    const pdf = document.getElementById('pdfFile');
    if (pdf && pdf.files && pdf.files[0]) return pdf.files[0];

    return null;
}

// 이미지 파일 여부 판별
function isImageFile(file) {
    if (!file) return false;
    // MIME 우선, 없으면 확장자 판별
    const mime = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    return (
        mime.startsWith('image/') ||
        /\.(png|jpe?g|gif|bmp|webp|tiff?)$/.test(name)
    );
}

async function handlePdfScanAndProcess({
    apiEndpoint,
    boxClass,
    resultKey = 'result',
    extraPayload = {},
}) {
    const resultArea =
        document.getElementById('resultArea') ||
        document.getElementById('ocrResult');
    const file = getSelectedFile();
    if (file) {
        if (isImageFile(file)) {
            const fd = new FormData();
            fd.append('image', file); // /visionOCR는 'image'로 받음
            const res = await fetch(`${BASE_URL}/visionOCR`, {
                method: 'POST',
                body: fd,
            });
            const js = await res.json();
            extractedText = (js.text || js.result || '').toString();
        } else {
            extractedText = await extractTextFromAnyFile(file); // ← 여기서 전역 함수 사용
        }
        window.lastExtractedText = extractedText;
    }

    const spinner = document.getElementById('loadingSpinner');
    if (!spinner || !resultArea) {
        console.error('❗ spinner 또는 resultArea 요소가 없습니다.');
        return;
    }

    spinner.style.display = 'block';

    const formData = new FormData();

    try {
        let extractedText = '';

        if (lastExtractedText && !file) {
            extractedText = lastExtractedText;
        } else if (file) {
            if (isImageFile(file)) {
                const fd = new FormData();
                fd.append('image', file);
                const res = await fetch(`${BASE_URL}/visionOCR`, {
                    method: 'POST',
                    body: fd,
                });
                if (!res.ok) {
                    const raw = await res.text().catch(() => '');
                    throw new Error(
                        `visionOCR HTTP ${res.status} - ${raw || ''}`
                    );
                }
                const js = await res.json();
                extractedText = (js.text || js.result || '').toString();
            } else {
                const text = await extractTextFromAnyFile(file); // 문서 → /fileScan
                extractedText = text || '[텍스트를 추출하지 못했습니다]';
            }
            lastExtractedText = extractedText;
        } else {
            alert('문서를 업로드하거나 텍스트를 먼저 추출해주세요.');
            spinner.style.display = 'none';
            return;
        }

        let requestBody = {};
        if (apiEndpoint === 'gptStyleChange') {
            requestBody = { text: extractedText, ...extraPayload };
        } else if (apiEndpoint === 'translate') {
            requestBody = { text: extractedText, ...extraPayload }; // 번역은 text로 통일
        } else {
            requestBody = { content: extractedText, ...extraPayload };
        }
        const apiResponse = await fetch(`${BASE_URL}/${apiEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await apiResponse.json();
        const resultText = data[resultKey];

        console.log('📦 API 응답 데이터 전체:', data); // ✅ 전체 응답 확인
        console.log('📌 추출된 resultText:', resultText);

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
            box.innerHTML = `<p style="white-space: pre-wrap;">${resultText}</p>`;
            resultArea.appendChild(box);

            let filename = 'PDF_SCAN_결과.pdf';
            switch (apiEndpoint) {
                case 'gptStyleChange':
                    filename = '스캔_문체_변경.pdf';
                    break;
                case 'mistralRewrite':
                    filename = '스캔_첨삭.pdf';
                    break;
                case 'summary':
                    filename = '스캔_요약.pdf';
                    break;
                case 'expand':
                    filename = '스캔_확장.pdf';
                    break;
                case 'cohereHonorific':
                    filename = '스캔_경어체.pdf';
                    break;
                case 'cohereInformal':
                    filename = '스캔_평어체.pdf';
                    break;
                case 'translate':
                    filename = '스캔_번역.pdf';
                    break;
            }

            const pdfBtn = document.getElementById('pdfDownloadBtn');
            if (pdfBtn) {
                const newBtn = pdfBtn.cloneNode(true);
                pdfBtn.replaceWith(newBtn);
                newBtn.addEventListener('click', () =>
                    saveAsPDF(box, filename)
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
        alert('📛 스캔/추출 중 오류: ' + err.message);
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
    const file = getSelectedFile();
    const grammarBox = document.getElementById('grammarBox');
    const grammarTable = document.getElementById('grammarTable');
    const tbody = grammarTable ? grammarTable.querySelector('tbody') : null;
    const resultArea =
        document.getElementById('resultArea') ||
        document.getElementById('ocrResult');
    const spinner = document.getElementById('loadingSpinner');

    // 초기화
    if (tbody) while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    if (resultArea) resultArea.textContent = '';
    if (grammarBox) grammarBox.style.display = 'none';
    if (spinner) spinner.style.display = 'block';

    // 0) 웜업(콜드스타트/프리플라이트 완화용)
    try {
        await fetch(`${BASE_URL}/whoami`, { cache: 'no-store' });
    } catch {}

    let sourceText = '';
    try {
        if (file) {
            if (isImageFile(file)) {
                const fd = new FormData();
                fd.append('image', file);
                const res = await fetch(`${BASE_URL}/visionOCR`, {
                    method: 'POST',
                    body: fd,
                });
                if (!res.ok) throw new Error(`visionOCR HTTP ${res.status}`);
                const js = await res.json();
                sourceText = (js.text || js.result || '').toString().trim();
            } else {
                sourceText = (await extractTextFromAnyFile(file))
                    .toString()
                    .trim();
            }
        } else {
            const lt =
                (typeof lastExtractedText !== 'undefined' &&
                    lastExtractedText) ||
                window.lastExtractedText;
            sourceText = (lt || '').toString().trim();
        }
    } catch (e) {
        console.error('원문 확보 실패:', e);
    }

    if (!sourceText) {
        if (spinner) spinner.style.display = 'none';
        alert(
            '📄 PDF를 업로드하거나 📷 이미지를 스캔하여 텍스트를 먼저 추출해주세요.'
        );
        return;
    }

    // 2) 프록시/모델 한도 보호: 길이 제한
    const MAX_LEN = 8000; // 필요 시 조정
    if (sourceText.length > MAX_LEN) {
        console.warn('⚠️ 길이가 길어 앞부분만 전송합니다:', MAX_LEN);
        sourceText = sourceText.slice(0, MAX_LEN);
    }

    try {
        const resp = await fetch(`${BASE_URL}/mistralGrammar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // JSON이면 프리플라이트 발생
            body: JSON.stringify({ content: sourceText }),
        });

        // 프록시가 만든 응답(413/502 등)은 CORS 헤더가 없어 CORS처럼 보입니다
        if (!resp.ok) {
            const txt = await resp.text().catch(() => '');
            throw new Error(
                `mistralGrammar HTTP ${resp.status} ${txt ? '- ' + txt : ''}`
            );
        }

        const data = await resp.json();
        const raw = (data.result || '').toString();
        const lines = raw
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        const removeIcons = (s) => s.replace(/^[^\w가-힣]+/, '').trim();

        let hasError = false;
        const correctedOnly = [];

        for (let i = 0; i < lines.length; i += 4) {
            const cleanLine1 = removeIcons(lines[i] || '');
            const cleanLine2 = removeIcons(lines[i + 1] || '');
            const rule1 = lines[i + 2] || '';
            const rule2 = lines[i + 3] || '';
            if (!cleanLine1 && !cleanLine2) continue;
            if (cleanLine1 === cleanLine2) continue;

            hasError = true;
            correctedOnly.push(cleanLine2);

            if (tbody) {
                const row = document.createElement('tr');
                const tdLeft = document.createElement('td');
                const tdRight = document.createElement('td');
                tdRight.classList.add('right');

                // 원문/교정문
                tag_delete = textDiff(cleanLine1, cleanLine2);
                del_tag_delete = tag_delete.replace(
                    /<del[^>]*>.*?<\/del>/g,
                    ''
                );
                ins_tag_delete = tag_delete.replace(
                    /<ins[^>]*>.*?<\/ins>/g,
                    ''
                );

                tdLeft.innerHTML = `<span class="sentence">❌${ins_tag_delete}<br>✅${del_tag_delete}</span>`;
                const style = document.createElement('style');
                style.innerHTML = `
                    del {
                        text-decoration: line-through;
                        background: #ff9999 !important
                    }
                    ins {
                        background: #81ff81 !important
                    }
                `;
                document.head.appendChild(style);
                // 규칙/설명
                tdRight.textContent = `${rule1}\n${rule2}`;

                // 복사 버튼
                const copyBtn = document.createElement('button');
                copyBtn.innerText = '📋';
                copyBtn.title = '교정문 복사';
                copyBtn.style =
                    'border:none;background:transparent;cursor:pointer;font-size:16px;';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(cleanLine2.trim());
                    copyBtn.innerText = '✅';
                    setTimeout(() => (copyBtn.innerText = '📋'), 900);
                };

                tdLeft.appendChild(copyBtn);
                row.appendChild(tdLeft);
                row.appendChild(tdRight);
                tbody.appendChild(row);
            }
        }

        // 표 + 교정문만 결과 영역에 출력
        /* if (grammarBox) grammarBox.style.display = 'block';
    if (resultArea) {
      const out = correctedOnly.length ? correctedOnly.join('\n') : '[틀린 부분이 없거나 교정 결과가 비어 있습니다]';
      const pre = document.createElement('pre');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.margin = '0';
      pre.textContent = out;
      resultArea.innerHTML = '';
      resultArea.appendChild(pre);
    }*/

        if (grammarBox && tbody && tbody.children.length > 0) {
            grammarBox.style.display = 'block';
            if (resultArea) resultArea.style.display = 'none';
        }

        if (!hasError) alert('🎉 틀린 부분이 없습니다.');

        // PDF 저장 버튼 리바인딩
        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            const newBtn = pdfBtn.cloneNode(true);
            pdfBtn.replaceWith(newBtn);
            newBtn.style.display = 'inline-block';
            newBtn.addEventListener('click', () =>
                saveAsPDF(grammarBox || grammarTable, '문법 교정.pdf')
            );
        }
    } catch (e) {
        console.error('문법 교정 실패:', e);
        // CORS처럼 보이는 경우: 프록시(413/502 등)일 가능성이 큼
        if (resultArea) {
            resultArea.style.display = 'block';
            resultArea.textContent = String(e).includes('HTTP 413')
                ? '⚠️ 텍스트가 너무 길어 일부만 보내 주세요.'
                : String(e).includes('HTTP 502')
                ? '⚠️ 서버가 잠시 응답하지 않았습니다. 잠시 후 다시 시도해주세요.'
                : '❌ 문법 교정 중 오류가 발생했습니다.';
        }
        if (grammarBox) grammarBox.style.display = 'none';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function pdfScanStyle() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    const style = document.getElementById('styleSelect').value;

    await handlePdfScanAndProcess({
        apiEndpoint: 'gptStyleChange',
        boxClass: 'styleResult',
        resultKey: 'styled_text',
        extraPayload: { style },
    });
}

async function pdfScanRewrite() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'mistralRewrite',
        boxClass: 'rewriteBox',
        extraPayload: { source: 'scan' },
    });
}

async function pdfScanSummary() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'summary',
        boxClass: 'summaryBox',
    });
}

async function pdfScanExpand() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'expand',
        boxClass: 'expandBox',
    });
}

async function pdfScanHonorific() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'cohereHonorific',
        boxClass: 'honorificBox',
    });
}

async function pdfScanInformal() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'cohereInformal',
        boxClass: 'informalBox',
    });
}

async function pdfScanTranslate() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
        const resultArea =
            document.getElementById('resultArea') ||
            document.getElementById('ocrResult');
        resultArea.style.display = 'block';
    }

    const sourceLang = document.getElementById('sourceSelector').value;
    const targetLang = document.getElementById('targetSelector').value;

    if (!lastExtractedText || !lastExtractedText.trim()) {
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'translate',
        boxClass: 'translateBox',
        resultKey: 'result',
        extraPayload: {
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

        if (text.trim() === '') {
            result.push(text); // 공백만 diff된 경우 마킹 없이 출력
            continue;
        }

        if (op === 0) {
            result.push(text);
        } else if (op === -1 && diffs[i + 1] && diffs[i + 1][0] === 1) {
            let deletedText = text;
            let addedText = diffs[i + 1][1];

            // 공백만 바뀐 경우 무시
            if (addedText.trim() === '' && deletedText.trim() === '') {
                result.push(addedText);
                i++;
                continue;
            }

            // 공백이 포함된 경우 → 앞뒤 공백 분리
            const prefix = addedText.match(/^\s*/)[0];
            const suffix = addedText.match(/\s*$/)[0];
            const cleanAdded = addedText.trim();

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

            result.push(
                `${prefix}<span class="${cssClass}">${cleanAdded}<span class="custom-tooltip">${tip}</span></span>${suffix}`
            );
            i++;
        } else if (op === 1) {
            // 삽입 단독 (del 없이 add만 있을 경우)
            const prefix = text.match(/^\s*/)[0];
            const suffix = text.match(/\s*$/)[0];
            const cleanText = text.trim();

            result.push(
                `${prefix}<span class="tooltip-wrapper highlight-added">${cleanText}<span class="custom-tooltip">새로 추가된 표현이에요</span></span>${suffix}`
            );
        }
    }

    return result.join('');
}

function saveAsPDF(content, filename = 'converted.pdf') {
    let source;

    if (typeof content === 'string') {
        const formattedHTML = `<div style="white-space: pre-wrap;">${content.replace(
            /\n/g,
            '<br>'
        )}</div>`;
        source = formattedHTML;
    } else if (content instanceof HTMLElement) {
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

async function performOCR() {
    const spinner = document.getElementById('loadingSpinner');
    const resultArea =
        document.getElementById('ocrResult') ||
        document.getElementById('resultArea');
    const grammarBox = document.getElementById('grammarBox');

    // 초기화
    if (grammarBox) grammarBox.style.display = 'none';
    if (resultArea) resultArea.textContent = '';
    if (spinner) spinner.style.display = 'block';

    // 0) 웜업(콜드스타트/프리플라이트 완화)
    try {
        await fetch(`${BASE_URL}/whoami`, { cache: 'no-store' });
    } catch {}

    const file = getSelectedFile();

    try {
        let extractedText = '';

        if (file) {
            if (isImageFile(file)) {
                // ✅ 이미지 → /visionOCR
                const fd = new FormData();
                fd.append('image', file); // 이미지일 때는 'image' 필드명으로!
                const res = await fetch(`${BASE_URL}/visionOCR`, {
                    method: 'POST',
                    body: fd,
                });
                if (!res.ok) {
                    const raw = await res.text().catch(() => '');
                    throw new Error(
                        `visionOCR HTTP ${res.status} - ${raw || ''}`
                    );
                }
                const js = await res.json();
                extractedText = (js.text || js.result || '').toString();
            } else {
                // ✅ 문서 → /fileScan
                extractedText = await extractTextFromAnyFile(file);
            }
            window.lastExtractedText = extractedText; // 후속 버튼(요약/번역/문체 등)을 위해 저장
        } else if (window.lastExtractedText) {
            // 파일 없이도 직전 스캔 결과를 재활용(이미지든 문서든 동일)
            extractedText = window.lastExtractedText;
        } else {
            alert('이미지 또는 문서를 먼저 업로드해 주세요.');
            return;
        }

        // 화면 출력(페이지 구조에 맞게)
        if (resultArea) {
            resultArea.textContent =
                extractedText || '[텍스트를 추출하지 못했습니다]';
        }
    } catch (err) {
        console.error('❌ 스캔 오류:', err);
        alert(`스캔 오류: ${err.message || err}`);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

async function translateOCR() {
    const sourceLang =
        document.getElementById('sourceSelector')?.value || 'auto';
    const targetLang = document.getElementById('targetSelector')?.value || 'en';

    if (!lastExtractedText || !lastExtractedText.trim()) {
        alert('먼저 이미지를 스캔해서 텍스트를 추출해주세요.');
        return;
    }

    const spinner = document.getElementById('loadingSpinner');

    const resultArea =
        document.getElementById('ocrResult') ||
        document.getElementById('resultArea');

    if (!spinner) {
        console.warn('❗ spinner 요소가 없습니다.');
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'translate',
        boxClass: 'translateBox',
        resultKey: 'result',
        extraPayload: {
            source: sourceLang,
            target: targetLang,
        },
    });
}

async function summarizeOCR() {
    if (!lastExtractedText || !lastExtractedText.trim()) {
        alert('먼저 이미지를 스캔해서 텍스트를 추출해주세요.');
        return;
    }

    await handlePdfScanAndProcess({
        apiEndpoint: 'summary',
        boxClass: 'summaryBox',
        extraPayload: { content: lastExtractedText },
    });
}

// 🎤 오디오 파일에서 텍스트 추출
async function getSpeechText(file) {
    if (!file) {
        const fileInput = document.getElementById('audioFile');
        file = fileInput ? fileInput.files[0] : null;
    }
    if (!file) throw new Error('업로드할 오디오 파일이 없습니다.');

    const formData = new FormData();
    formData.append('audio', file);

    const response = await fetch(`${BASE_URL}/speech`, {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();

    console.log('인식된 텍스트: ', result.text, '\n', result.time, '초');
    return result.text;
}

async function speechStyle(file = null) {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) grammarBox.style.display = 'none';

    const resultArea = document.getElementById('resultArea');
    const style = document.getElementById('styleSelect').value;

    try {
        // 음성 → 텍스트 변환
        const audio_text = await getSpeechText(file);

        // 스타일 변환 요청
        const response = await fetch(`${BASE_URL}/gptStyleChange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: audio_text, style: style }),
        });

        const data = await response.json();
        resultArea.innerText =
            data.styled_text || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechStyle 실패: ' + err.message);
        console.error(err);
    }
}

async function speechRewrite() {
    const grammarBox = document.getElementById('grammarBox');
    if (grammarBox) {
        grammarBox.style.display = 'none';
    }

    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('audioFile');
    const file = fileInput ? fileInput.files[0] : null;

    const formData = new FormData();
    if (file) formData.append('audio', file);

    try {
        const response = await fetch(`${BASE_URL}/speech`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        audio_text = result.text;

        console.log('인식된 텍스트: ', audio_text, '\n', result.time, '초');

        const audioRewriteResponse = await fetch(`${BASE_URL}/mistralRewrite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: audio_text }),
        });

        const audioRewriteData = await audioRewriteResponse.json();
        resultArea.innerText =
            audioRewriteData.result ||
            audioRewriteData.error ||
            '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('오디오에서 텍스트 추출 실패: ' + err.message);
        console.log(err.message);
        return;
    }
}

async function speechSummary(file = null) {
    try {
        const audio_text = await getSpeechText(file);

        const response = await fetch(`${BASE_URL}/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: audio_text }),
        });

        const data = await response.json();
        document.getElementById('resultArea').innerText =
            data.result || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechSummary 실패: ' + err.message);
    }
}

async function speechExpand(file = null) {
    try {
        const audio_text = await getSpeechText(file);

        const response = await fetch(`${BASE_URL}/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: audio_text }),
        });

        const data = await response.json();
        document.getElementById('resultArea').innerText =
            data.result || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechExpand 실패: ' + err.message);
    }
}

async function speechHonorific(file = null) {
    try {
        const audio_text = await getSpeechText(file);

        const response = await fetch(`${BASE_URL}/cohereHonorific`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: audio_text }),
        });

        const data = await response.json();
        document.getElementById('resultArea').innerText =
            data.result || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechHonorific 실패: ' + err.message);
    }
}

// 반말 변환
async function speechInformal(file = null) {
    try {
        const audio_text = await getSpeechText(file);

        const response = await fetch(`${BASE_URL}/cohereInformal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: audio_text }),
        });

        const data = await response.json();
        document.getElementById('resultArea').innerText =
            data.result || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechInformal 실패: ' + err.message);
    }
}

// 번역
async function speechTranslate(file = null) {
    try {
        const audio_text = await getSpeechText(file);

        const sourceLang = document.getElementById('sourceSelector').value;
        const targetLang = document.getElementById('targetSelector').value;

        const response = await fetch(`${BASE_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: audio_text,
                source: sourceLang,
                target: targetLang,
            }),
        });

        const data = await response.json();
        document.getElementById('resultArea').innerText =
            data.result || data.error || '오류가 발생했습니다.';

        const pdfBtn = document.getElementById('pdfDownloadBtn');
        if (pdfBtn) {
            pdfBtn.onclick = function () {
                saveAsPDF(resultArea, 'speech.pdf');
            };
        }
    } catch (err) {
        alert('speechTranslate 실패: ' + err.message);
    }
}

let mediaRecorder;
let recordedChunks = [];
let lastRecordedFile = null; // 🔹 마지막 녹음 파일 저장

// 🎤 녹음 시작
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        mediaRecorder = new MediaRecorder(stream);

        recordedChunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });

            // 👉 webm → wav 변환
            const wavBlob = await blobToWav(audioBlob);
            const wavFile = new File([wavBlob], 'recorded_audio.wav', {
                type: 'audio/wav',
            });

            // 🔹 녹음된 파일을 전역 변수에 저장
            lastRecordedFile = wavFile;
            console.log('녹음된 파일 준비 완료:', wavFile);
        };

        mediaRecorder.start();
        console.log('녹음 시작');
        document.getElementById('startRecord').disabled = true;
        document.getElementById('stopRecord').disabled = false;
    } catch (err) {
        alert('마이크 접근 실패: ' + err.message);
    }
}

// 🛑 녹음 종료
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('녹음 종료');
        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = true;
    }
}
function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    let offset = 0;
    writeString(view, offset, 'RIFF');
    offset += 4;
    view.setUint32(offset, 36 + samples.length * 2, true);
    offset += 4;
    writeString(view, offset, 'WAVE');
    offset += 4;
    writeString(view, offset, 'fmt ');
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, 1, true);
    offset += 2; // mono
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * 2, true);
    offset += 4;
    view.setUint16(offset, 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString(view, offset, 'data');
    offset += 4;
    view.setUint32(offset, samples.length * 2, true);
    offset += 4;

    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return buffer;
}

async function blobToWav(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const wavBuffer = encodeWAV(channelData, audioBuffer.sampleRate);
    return new Blob([wavBuffer], { type: 'audio/wav' });
}
