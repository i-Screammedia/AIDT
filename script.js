const COMMENTS_PAGE_SIZE = 20;

function isEventApiConfigured() {
  return (
    typeof EVENT_API_URL !== 'undefined' &&
    Boolean(EVENT_API_URL) &&
    !EVENT_API_URL.includes('REPLACE')
  );
}

function getEventApiUrl(params = {}) {
  const url = new URL(EVENT_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function requestEventApi(action, options = {}) {
  if (!isEventApiConfigured()) {
    return {
      ok: false,
      errorCode: 'API_NOT_CONFIGURED',
      message: '이벤트 API 설정이 완료되지 않았습니다.',
    };
  }

  try {
    const response = await fetch(getEventApiUrl({ action }), {
      ...options,
      cache: 'no-store',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      ok: false,
      errorCode: 'NETWORK_ERROR',
      message: '이벤트 API 요청에 실패했습니다.',
      error,
    };
  }
}

function formatPhoneForGoogle(phone) {
  const digits = normalizePhone(phone);
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.trim();
}

async function submitEventEntry(data) {
  if (!isEventApiConfigured()) {
    return {
      ok: false,
      errorCode: 'API_NOT_CONFIGURED',
      message: '이벤트 API 설정이 완료되지 않았습니다.',
    };
  }

  return requestEventApi('submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
}

function setSubmitLoading(isLoading) {
  if (!submitBtn) return;

  submitBtn.disabled = isLoading || !(consentCheck?.checked && getSelectedFeature());
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtn.textContent = isLoading ? '등록 중...' : '기대평 등록';
}

const FEATURE_LABELS = {
  'feature-1': '수학 익힘책 메뉴 신설',
  'feature-2': '평가 2세트',
  'feature-3': '친절하고 보기 쉬운 학급 리포트',
  'feature-4': '수학 게임 콘텐츠 및 기초 학습관',
  'feature-5': '다양해진 펫&직업군 아바타',
  'feature-6': '21종 다양한 수학 교구 보드',
};

const FEATURE_DETAILS = {
  'feature-1': {
    tag: '#수학 익힘',
    icon: '📒',
    title: '수학 익힘책 메뉴 신설',
    period: '27년 1학기',
    images: [
      { src: 'Mastering math02.png', alt: '수학 익힘책 메뉴 신설 소개 1' },
      { src: 'Mastering math03.png', alt: '수학 익힘책 메뉴 신설 소개 2' },
    ],
    body: `
      <p>수업 내에 수학 익힘 메뉴가 새롭게 추가됩니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 익힘책 단원·차시별 메뉴 구성 (교사가 오픈 관리)</p>
      <p>· 교과 연계 익힘 문제 바로 접근</p>
      <p>· 학생이 풀이한 답안과 필기 화면을 확인</p>
      <strong>기대 효과</strong>
      <p>익힘책 학습을 더 체계적으로 관리하고 수업에 활용할 수 있습니다.</p>
    `,
  },
  'feature-2': {
    tag: '#평가 문항',
    icon: '📝',
    title: '평가 2세트',
    period: '26년 2학기',
    image: 'evaluation.png',
    imageAlt: '평가 2세트 소개 이미지',
    body: `
      <p>평가 문항이 2세트로 제공되고, 재응시 기능이 개선됩니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 형성, 단원, 총괄 평가 2세트 출제 지원</p>
      <p>· 첫 번째 세트는 수업 후 자동 출제, 두 번째 세트는 평가&gt;오픈 관리 메뉴에서 출제</p>
      <p>· 평가 결과 분석 강화</p>
      <strong>기대 효과</strong>
      <p>다양한 평가로 학습 성취도를 더 정확하게 확인할 수 있습니다.</p>
    `,
  },
  'feature-3': {
    tag: '#맞춤 대시보드',
    icon: '📊',
    title: '친절하고 보기 쉬운 학급 리포트',
    period: '평가 리포트(26년 2학기), 수업/스스로 학습 리포트(27년 1학기)',
    images: [
      { src: 'dashboard.png', alt: '맞춤 대시보드 학급 리포트 소개 1' },
      { src: 'dashboard01.png', alt: '맞춤 대시보드 학급 리포트 소개 2' },
      { src: 'dashboard02.png', alt: '맞춤 대시보드 학급 리포트 소개 3' },
      { src: 'dashboard03.png', alt: '맞춤 대시보드 학급 리포트 소개 4' },
      { src: 'dashboard04.png', alt: '맞춤 대시보드 학급 리포트 소개 5' },
    ],
    body: `
      <p>학습 현황을 한눈에 볼 수 있는 맞춤 대시보드가 순차적으로 고도화 됩니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 직관적인 학습 리포트 UI</p>
      <p>· 학급·개인별 성취도 시각화</p>
      <p>· 취약 영역 한눈에 파악</p>
      <strong>기대 효과</strong>
      <p>복잡한 데이터를 쉽게 이해하고 수업에 바로 활용할 수 있습니다.</p>
    `,
  },
  'feature-4': {
    tag: '#기초 학습관 #수학 게임',
    icon: '🎮',
    title: '수학 게임 콘텐츠 및 기초 학습관',
    period: '26년 2학기',
    images: [
      { src: 'game.png', alt: '수학 게임 콘텐츠 및 기초 학습관 소개 1' },
      { src: 'basic.png', alt: '수학 게임 콘텐츠 및 기초 학습관 소개 2' },
    ],
    body: `
      <p>수학 기초 학습을 돕는 교구형 콘텐츠와 게임이 추가됩니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 수학 기초 개념 학습용 교구 콘텐츠</p>
      <p>· 게임형 학습 활동 제공</p>
      <p>· 학생 참여 유도형 인터랙션</p>
      <strong>기대 효과</strong>
      <p>재미있는 학습 경험으로 수학에 대한 흥미를 높일 수 있습니다.</p>
    `,
  },
  'feature-5': {
    tag: '#아바타 꾸미기',
    icon: '🎨',
    title: '다양해진 펫&직업군 아바타',
    period: '27년 1학기',
    images: [
      { src: 'avatar.png', alt: '다양해진 펫&직업군 아바타 소개 1' },
      { src: 'avatar01.png', alt: '다양해진 펫&직업군 아바타 소개 2' },
    ],
    body: `
      <p>학생 아바타 꾸미기 기능이 확장되어 더 다양한 펫과 직업군 아바타를 제공합니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 새로운 펫 아바타 추가</p>
      <p>· 다양한 직업군 테마 아바타</p>
      <p>· 학습 보상과 연계된 꾸미기 요소</p>
      <strong>기대 효과</strong>
      <p>학생들의 학습 동기와 참여도를 자연스럽게 높일 수 있습니다.</p>
    `,
  },
  'feature-6': {
    tag: '#수학 교구',
    icon: '🧮',
    title: '21종 다양한 수학 교구 보드',
    period: '26년 2학기',
    image: 'mathboard.png',
    imageAlt: '21종 다양한 수학 교구 보드 소개 이미지',
    body: `
      <p>수업과 자기주도 학습에 활용할 수 있는 21종의 수학 교구 보드가 제공됩니다.</p>
      <strong>주요 업데이트</strong>
      <p>· 21종 다양한 수학 교구 보드 제공</p>
      <p>· 눈으로 보고 직접 조작하는 수학 학습 지원</p>
      <p>· 수업·보충 학습에 바로 활용 가능</p>
      <strong>기대 효과</strong>
      <p>추상적인 수학 개념을 시각적으로 이해하도록 도와 수업 효과를 높일 수 있습니다.</p>
    `,
  },
  'feature-convenience': {
    title: '수업 환경 개선 및 편의 기능 고도화',
    showcase: [
      {
        title: '대시보드 PDF 저장',
        src: 'dashboard04.png',
        alt: '대시보드 PDF 저장 기능 소개',
      },
      {
        title: '과제, 문제지 만들기(5,6학년 한정 기능)시 차시 중복 선택 가능',
        src: 'makeevaluation.png',
        alt: '과제·문제지 만들기 차시 중복 선택 기능 소개',
      },
      {
        title: '모니터링 개별 화면 확대 & 정오답 태그',
        src: 'monitoring.png',
        alt: '모니터링 개별 화면 확대 & 정오답 태그 소개',
      },
      {
        title: '총괄 평가 신설',
        src: 'summative assessment.png',
        alt: '총괄 평가 신설 소개',
      },
      {
        title: '수업 중 바로 쓸 수 있는 도구',
        src: 'Teaching materials.png',
        alt: '수업 중 바로 쓸 수 있는 도구 소개',
      },
      {
        title: '안내 영상 및 매뉴얼 제공',
        src: 'FAQ.png',
        alt: '안내 영상 및 매뉴얼 제공 소개',
      },
    ],
  },
};

// ── 모바일 햄버거 메뉴 ──
const hamburger = document.querySelector('.top-nav__hamburger');
const menu = document.querySelector('.top-nav__menu');

if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── DOM refs ──
const consentCheck = document.getElementById('consentCheck');
const consentAccordion = document.getElementById('consentAccordion');
const consentDetail = document.getElementById('consentDetail');
const reviewForm = document.getElementById('reviewForm');
const reviewFormFields = document.getElementById('reviewFormFields');
const submitBtn = document.getElementById('submitBtn');
const commentList = document.getElementById('commentList');
const commentEmpty = document.getElementById('commentEmpty');
const commentPagination = document.getElementById('commentPagination');
const liveCount = document.getElementById('liveCount');
const featureInputs = document.querySelectorAll('input[name="feature"]');

const formInputs = reviewForm
  ? [...reviewForm.querySelectorAll('.text-input')]
  : [];
let isSubmittingReview = false;
let currentCommentPage = 1;
let cachedComments = [];

function getSelectedFeature() {
  const checked = document.querySelector('input[name="feature"]:checked');
  return checked ? checked.value : null;
}

function getSelectedFeatureLabel() {
  const key = getSelectedFeature();
  return key ? (FEATURE_LABELS[key] ?? '') : '';
}

function updateCommentPrefix() {
  const prefix = document.getElementById('commentPrefix');
  const prefixText = document.getElementById('commentPrefixText');
  const compose = document.getElementById('commentCompose');
  const label = getSelectedFeatureLabel();

  if (!prefix || !prefixText || !compose) return;

  if (label) {
    prefixText.textContent = label;
    prefix.hidden = false;
    compose.classList.add('has-prefix');
  } else {
    prefixText.textContent = '';
    prefix.hidden = true;
    compose.classList.remove('has-prefix');
  }
}

// ── 개인정보 동의 아코디언 ──
if (consentAccordion && consentDetail) {
  consentAccordion.addEventListener('click', () => {
    const expanded = consentAccordion.getAttribute('aria-expanded') === 'true';
    consentAccordion.setAttribute('aria-expanded', String(!expanded));
    consentDetail.hidden = expanded;
  });
}

// ── STEP 1 선택 + 동의 → STEP 2 폼 활성화 ──
function setFormEnabled(enabled) {
  formInputs.forEach((input) => {
    input.disabled = !enabled;
    if (enabled && input.id === 'comment') {
      input.placeholder = '선택한 기능명 아래에 기대평을 이어서 작성해 주세요.';
    } else if (!enabled && input.id === 'comment') {
      input.placeholder =
        'STEP 1에서 기능을 선택하고, 개인정보 수집·이용에 동의하시면 입력할 수 있어요.';
    }
  });

  if (submitBtn) submitBtn.disabled = !enabled;
  if (reviewForm) reviewForm.classList.toggle('is-enabled', enabled);

  const compose = document.getElementById('commentCompose');
  if (compose) compose.classList.toggle('is-enabled', enabled);

  const step2Block = document.getElementById('step2');
  if (step2Block) step2Block.classList.toggle('is-active', enabled);

  const step2Status = document.getElementById('step2Status');
  if (step2Status) {
    step2Status.classList.toggle('step-status--locked', !enabled);
    step2Status.classList.toggle('step-status--ready', enabled);
    step2Status.textContent = enabled
      ? '작성란이 활성화되었습니다. 아래에서 기대평을 입력해 주세요.'
      : 'STEP 1 기능 선택 및 개인정보 동의 후 작성 가능합니다.';
  }
}

function updateFormState() {
  const consent = consentCheck?.checked ?? false;
  const featureSelected = getSelectedFeature() !== null;
  updateCommentPrefix();
  setFormEnabled(consent && featureSelected);

  const consentBlock = document.querySelector('.consent-block');
  if (consentBlock) consentBlock.classList.toggle('is-complete', consent);
}

if (consentCheck) {
  consentCheck.addEventListener('change', updateFormState);
}

featureInputs.forEach((input) => {
  input.addEventListener('change', updateFormState);
});

// ── 유틸 ──
function maskName(name) {
  const trimmed = name.trim();
  if (!trimmed) return '익**';
  if (trimmed.length === 1) return `${trimmed}*`;
  return `${trimmed[0]}**`;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

function scrollToElementWithHeaderOffset(element) {
  if (!element) return;

  const header = document.querySelector('.top-nav');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  });
}

function updateLiveCount(count) {
  if (liveCount) liveCount.textContent = `전체 ${count}개`;
}

function setCommentEmptyMessage(text) {
  if (commentEmpty) commentEmpty.textContent = text;
}

function setCommentEmptyVisible(isVisible) {
  if (commentEmpty) commentEmpty.hidden = !isVisible;
}

function dedupeComments(comments) {
  const seen = new Set();
  return comments.filter((comment) => {
    const key = [
      comment.date,
      comment.maskedName,
      comment.featureLabel,
      comment.comment,
    ].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTotalCommentPages(totalCount) {
  return Math.max(1, Math.ceil(totalCount / COMMENTS_PAGE_SIZE));
}

function renderCommentPagination(totalCount) {
  if (!commentPagination) return;

  const totalPages = getTotalCommentPages(totalCount);
  if (totalPages <= 1) {
    commentPagination.innerHTML = '';
    return;
  }

  const pageButtons = [];
  pageButtons.push(`
    <button type="button" class="comment-page-btn" data-page="prev" ${currentCommentPage === 1 ? 'disabled' : ''}>
      이전
    </button>
  `);

  for (let page = 1; page <= totalPages; page += 1) {
    pageButtons.push(`
      <button
        type="button"
        class="comment-page-btn ${page === currentCommentPage ? 'is-active' : ''}"
        data-page="${page}"
        aria-current="${page === currentCommentPage ? 'page' : 'false'}"
      >
        ${page}
      </button>
    `);
  }

  pageButtons.push(`
    <button type="button" class="comment-page-btn" data-page="next" ${currentCommentPage === totalPages ? 'disabled' : ''}>
      다음
    </button>
  `);

  commentPagination.innerHTML = pageButtons.join('');
}

async function loadComments(extraComments = []) {
  const result = await requestEventApi('list');
  if (!result.ok) return result;

  return {
    ok: true,
    comments: dedupeComments([
      ...(Array.isArray(result.comments) ? result.comments : []),
      ...extraComments,
    ]),
  };
}

function renderCommentPage() {
  if (!commentList) return;

  const comments = [...cachedComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalPages = getTotalCommentPages(comments.length);
  currentCommentPage = Math.min(Math.max(1, currentCommentPage), totalPages);
  const pageStart = (currentCommentPage - 1) * COMMENTS_PAGE_SIZE;
  const pageComments = comments.slice(pageStart, pageStart + COMMENTS_PAGE_SIZE);

  updateLiveCount(comments.length);
  commentList.innerHTML = '';
  setCommentEmptyMessage('아직 등록된 기대평이 없습니다. 첫 번째 기대평을 남겨보세요!');
  setCommentEmptyVisible(comments.length === 0);
  renderCommentPagination(comments.length);

  pageComments.forEach((item) => {
    const featureLabel = item.featureLabel || FEATURE_LABELS[item.feature] || '';
    const featureTag = featureLabel
      ? `<span class="comment-card__feature">${escapeHtml(featureLabel)}</span>`
      : '';

    let bodyText = item.comment || '';
    if (featureLabel && bodyText.startsWith(featureLabel)) {
      bodyText = bodyText.slice(featureLabel.length).replace(/^\n+/, '');
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <article class="comment-card">
        <header class="comment-card__header">
          <span class="comment-card__author">${escapeHtml(item.maskedName)}</span>
          <time class="comment-card__date" datetime="${item.date}">${item.date}</time>
        </header>
        ${featureTag}
        <p class="comment-card__body">${escapeHtml(bodyText)}</p>
      </article>
    `;
    commentList.appendChild(li);
  });
}

async function renderComments(extraComments = []) {
  if (!commentList) return;

  setCommentEmptyMessage('등록된 기대평을 불러오는 중입니다.');

  const result = await loadComments(extraComments);
  if (!result.ok) {
    updateLiveCount(0);
    cachedComments = [];
    commentList.innerHTML = '';
    if (commentPagination) commentPagination.innerHTML = '';
    setCommentEmptyMessage(
      result.errorCode === 'API_NOT_CONFIGURED'
        ? '이벤트 API 설정 후 등록된 기대평 목록이 표시됩니다.'
        : '등록된 기대평을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
    );
    setCommentEmptyVisible(true);
    return;
  }

  cachedComments = result.comments;
  renderCommentPage();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showFormMessage(type, text) {
  const existing = reviewForm.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = `form-message form-message--${type}`;
  msg.textContent = text;
  reviewFormFields.insertAdjacentElement('afterend', msg);

  if (type === 'success') {
    setTimeout(() => msg.remove(), 4000);
  }
}

// ── 폼 제출 ──
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmittingReview) return;

    const selectedFeature = getSelectedFeature();
    if (!selectedFeature) {
      showFormMessage('error', 'STEP 1에서 기대 기능을 1개 선택해 주세요.');
      scrollToElementWithHeaderOffset(document.getElementById('step1'));
      return;
    }

    if (!consentCheck?.checked) {
      showFormMessage('error', '개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    const honeypot = reviewForm.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const office = document.getElementById('office').value.trim();
    const school = document.getElementById('school').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const userComment = document.getElementById('comment').value.trim();
    const featureLabel = getSelectedFeatureLabel();
    const phoneDigits = normalizePhone(phone);

    if (!office || !school || !name || !phone || !userComment) {
      showFormMessage('error', '모든 항목을 입력해 주세요.');
      return;
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      showFormMessage('error', '연락처 형식을 확인해 주세요. (예: 010-0000-0000)');
      return;
    }

    if (userComment.length < 10) {
      showFormMessage('error', '기대평 본문은 10자 이상 작성해 주세요.');
      return;
    }

    const submission = {
      office,
      school,
      name,
      phone: formatPhoneForGoogle(phone),
      phoneDigits,
      feature: selectedFeature,
      featureLabel,
      comment: userComment,
      consent: true,
    };

    isSubmittingReview = true;
    setSubmitLoading(true);

    const submitResult = await submitEventEntry(submission);

    if (!submitResult.ok) {
      showFormMessage(
        'error',
        submitResult.errorCode === 'DUPLICATE_PHONE'
          ? '이미 참여하셨습니다. 1인 1회만 참여 가능합니다.'
          : submitResult.errorCode === 'API_NOT_CONFIGURED'
            ? '이벤트 API 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.'
            : '기대평 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
      isSubmittingReview = false;
      setSubmitLoading(false);
      return;
    }

    currentCommentPage = 1;
    await renderComments(submitResult.comment ? [submitResult.comment] : []);

    reviewForm.reset();
    consentCheck.checked = false;
    featureInputs.forEach((input) => {
      input.checked = false;
    });
    updateFormState();

    showFormMessage('success', '기대평이 등록되었습니다. 소중한 참여 감사합니다!');
    scrollToElementWithHeaderOffset(commentList?.closest('.comment-list-block'));
    isSubmittingReview = false;
    setSubmitLoading(false);
  });
}

if (commentPagination) {
  commentPagination.addEventListener('click', (event) => {
    const button = event.target.closest('.comment-page-btn');
    if (!button || button.disabled) return;

    const page = button.dataset.page;
    const pageButtons = [...commentPagination.querySelectorAll('.comment-page-btn[data-page]')];
    const numberedPages = pageButtons
      .map((item) => Number(item.dataset.page))
      .filter(Number.isFinite);
    const totalPages = numberedPages.length ? Math.max(...numberedPages) : 1;

    if (page === 'prev') {
      currentCommentPage = Math.max(1, currentCommentPage - 1);
    } else if (page === 'next') {
      currentCommentPage = Math.min(totalPages, currentCommentPage + 1);
    } else {
      currentCommentPage = Number(page);
    }

    renderCommentPage();
    scrollToElementWithHeaderOffset(commentList?.closest('.comment-list-block'));
  });
}

// ── 초기화 ──
updateFormState();
renderComments();

// ── 작성 예시 토글 ──
const exampleToggle1 = document.getElementById('exampleToggle1');
const exampleFull1 = document.getElementById('exampleFull1');
const examplePreview = document.querySelector('.example-card__preview');

if (exampleToggle1 && exampleFull1) {
  exampleToggle1.addEventListener('click', () => {
    const expanded = exampleToggle1.getAttribute('aria-expanded') === 'true';
    exampleToggle1.setAttribute('aria-expanded', String(!expanded));
    exampleFull1.hidden = expanded;
    if (examplePreview) examplePreview.hidden = !expanded;
    exampleToggle1.textContent = expanded ? '전체 보기 ▼' : '가리기 ▲';
  });
}

const exampleMoreToggle = document.getElementById('exampleMoreToggle');
const exampleMore = document.getElementById('exampleMore');

if (exampleMoreToggle && exampleMore) {
  exampleMoreToggle.addEventListener('click', () => {
    const expanded = exampleMoreToggle.getAttribute('aria-expanded') === 'true';
    exampleMoreToggle.setAttribute('aria-expanded', String(!expanded));
    exampleMore.hidden = expanded;
    exampleMoreToggle.textContent = expanded ? '예시 더보기 ▼' : '가리기 ▲';
  });
}

// ── 기능 상세 팝업 ──
const featureModal = document.getElementById('featureModal');
const featureModalBackdrop = document.getElementById('featureModalBackdrop');
const featureModalClose = document.getElementById('featureModalClose');
const featureModalTag = document.getElementById('featureModalTag');
const featureModalIcon = document.getElementById('featureModalIcon');
const featureModalTitle = document.getElementById('featureModalTitle');
const featureModalPeriod = document.getElementById('featureModalPeriod');
const featureModalBody = document.getElementById('featureModalBody');
const featureModalMedia = document.getElementById('featureModalMedia');
const imageLightbox = document.getElementById('imageLightbox');
const imageLightboxBackdrop = document.getElementById('imageLightboxBackdrop');
const imageLightboxClose = document.getElementById('imageLightboxClose');
const imageLightboxImage = document.getElementById('imageLightboxImage');
const imageLightboxCaption = document.getElementById('imageLightboxCaption');
let lastFocusedElement = null;
let lightboxLastFocusedElement = null;

function openImageLightbox(src, alt) {
  if (!imageLightbox || !imageLightboxImage) return;

  lightboxLastFocusedElement = document.activeElement;
  imageLightboxImage.src = src;
  imageLightboxImage.alt = alt;
  if (imageLightboxCaption) {
    imageLightboxCaption.textContent = alt;
  }

  imageLightbox.hidden = false;
  imageLightbox.setAttribute('aria-hidden', 'false');
  imageLightboxClose?.focus();
}

function closeImageLightbox() {
  if (!imageLightbox) return;

  imageLightbox.hidden = true;
  imageLightbox.setAttribute('aria-hidden', 'true');
  if (imageLightboxImage) {
    imageLightboxImage.src = '';
  }
  lightboxLastFocusedElement?.focus();
}

function getFeatureImages(detail) {
  if (detail.images?.length) return detail.images;
  if (detail.image) {
    return [{ src: detail.image, alt: detail.imageAlt || detail.title }];
  }
  return [];
}

function bindFeatureModalZoomButtons() {
  if (!featureModalMedia) return;

  featureModalMedia.querySelectorAll('[data-lightbox-src]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openImageLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxAlt);
    });
  });
}

function renderFeatureModalShowcase(detail) {
  const items = detail.showcase || [];

  if (!items.length || !featureModalMedia) {
    featureModalMedia.innerHTML = '';
    featureModalMedia.hidden = true;
    featureModalMedia.classList.remove('feature-modal__media--showcase');
    return;
  }

  featureModalMedia.classList.add('feature-modal__media--showcase');
  featureModalMedia.innerHTML = `
    <div class="feature-modal__showcase">
      ${items
        .map(
          (item, index) => `
        <article class="feature-modal__showcase-card">
          <p class="feature-modal__showcase-title">${escapeHtml(item.title)}</p>
          <button
            type="button"
            class="feature-modal__zoom-btn"
            data-lightbox-src="${item.src}"
            data-lightbox-alt="${escapeHtml(item.alt || item.title)}"
            aria-label="${escapeHtml(item.title)} 이미지 크게 보기"
          >
            <img src="${item.src}" alt="${escapeHtml(item.alt || item.title)}" class="feature-modal__image" />
            <span class="feature-modal__zoom-hint">클릭하여 확대</span>
          </button>
        </article>
      `
        )
        .join('')}
    </div>
  `;
  featureModalMedia.hidden = false;
  bindFeatureModalZoomButtons();
}

function renderFeatureModalMedia(detail) {
  const images = getFeatureImages(detail);

  if (!featureModalMedia) return;

  featureModalMedia.classList.remove('feature-modal__media--showcase');

  if (!images.length) {
    featureModalMedia.innerHTML = '';
    featureModalMedia.hidden = true;
    return;
  }

  const gridClass = images.length > 1 ? ' feature-modal__media-grid' : '';

  featureModalMedia.innerHTML = `
    <div class="feature-modal__media-inner${gridClass}">
      ${images
        .map(
          (img, index) => `
        <button
          type="button"
          class="feature-modal__zoom-btn"
          data-lightbox-src="${img.src}"
          data-lightbox-alt="${escapeHtml(img.alt || detail.title)}"
          aria-label="이미지 ${index + 1} 크게 보기"
        >
          <img src="${img.src}" alt="${escapeHtml(img.alt || detail.title)}" class="feature-modal__image" />
          <span class="feature-modal__zoom-hint">클릭하여 확대</span>
        </button>
      `
        )
        .join('')}
    </div>
  `;
  featureModalMedia.hidden = false;
  bindFeatureModalZoomButtons();
}

function openFeatureModal(featureId) {
  const detail = FEATURE_DETAILS[featureId];
  if (!detail || !featureModal) return;

  closeImageLightbox();
  lastFocusedElement = document.activeElement;
  featureModalTag.textContent = detail.tag || '';
  featureModalIcon.textContent = detail.icon || '';
  featureModalTitle.textContent = detail.title;

  if (featureModalPeriod) {
    if (detail.period) {
      featureModalPeriod.textContent = detail.period;
      featureModalPeriod.hidden = false;
    } else {
      featureModalPeriod.textContent = '';
      featureModalPeriod.hidden = true;
    }
  }

  const header = featureModal.querySelector('.feature-modal__header');
  const hasShowcase = Boolean(detail.showcase?.length);
  header?.classList.toggle('feature-modal__header--title-only', hasShowcase);

  const dialog = featureModal.querySelector('.feature-modal__dialog');
  dialog?.classList.toggle('feature-modal__dialog--wide', hasShowcase);

  if (hasShowcase) {
    featureModalBody.innerHTML = '';
    featureModalBody.hidden = true;
    renderFeatureModalShowcase(detail);
  } else {
    featureModalBody.hidden = false;
    featureModalBody.innerHTML = detail.body || '';
    renderFeatureModalMedia(detail);
  }

  featureModal.hidden = false;
  featureModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  featureModalClose?.focus();
}

function closeFeatureModal() {
  if (!featureModal) return;

  closeImageLightbox();
  featureModal.hidden = true;
  featureModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  const dialog = featureModal.querySelector('.feature-modal__dialog');
  dialog?.classList.remove('feature-modal__dialog--wide');
  featureModal.querySelector('.feature-modal__header')?.classList.remove('feature-modal__header--title-only');
  if (featureModalBody) featureModalBody.hidden = false;

  lastFocusedElement?.focus();
}

document.querySelectorAll('.feature-detail-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openFeatureModal(btn.dataset.feature);
  });
});

featureModalClose?.addEventListener('click', closeFeatureModal);
featureModalBackdrop?.addEventListener('click', closeFeatureModal);

imageLightboxClose?.addEventListener('click', closeImageLightbox);
imageLightboxBackdrop?.addEventListener('click', closeImageLightbox);
imageLightboxImage?.addEventListener('click', closeImageLightbox);

// ── 후기 전문 팝업 ──
const reviewModal = document.getElementById('reviewModal');
const reviewModalBackdrop = document.getElementById('reviewModalBackdrop');
const reviewModalClose = document.getElementById('reviewModalClose');
const reviewModalName = document.getElementById('reviewModalName');
const reviewModalSchool = document.getElementById('reviewModalSchool');
const reviewModalBody = document.getElementById('reviewModalBody');
let reviewLastFocusedElement = null;

function openReviewModal(btn) {
  if (!reviewModal || !reviewModalBody) return;

  const template = document.getElementById(`reviewFull-${btn.dataset.review}`);
  if (!template) return;

  reviewLastFocusedElement = document.activeElement;
  reviewModalBody.innerHTML = '';
  reviewModalBody.appendChild(template.content.cloneNode(true));

  if (reviewModalName) reviewModalName.textContent = btn.dataset.reviewName || '';
  if (reviewModalSchool) reviewModalSchool.textContent = btn.dataset.reviewSchool || '';

  reviewModal.hidden = false;
  reviewModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  reviewModalClose?.focus();
}

function closeReviewModal() {
  if (!reviewModal) return;

  reviewModal.hidden = true;
  reviewModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (reviewModalBody) reviewModalBody.innerHTML = '';
  reviewLastFocusedElement?.focus();
}

document.querySelectorAll('.review-more-btn').forEach((btn) => {
  btn.addEventListener('click', () => openReviewModal(btn));
});

reviewModalClose?.addEventListener('click', closeReviewModal);
reviewModalBackdrop?.addEventListener('click', closeReviewModal);

// ── 선생님 영상 탭 ──
const teacherVideoTabs = document.querySelector('[data-teacher-video-tabs]');

if (teacherVideoTabs) {
  const tabButtons = teacherVideoTabs.querySelectorAll('.teacher-video__tab');
  const videoEl = teacherVideoTabs.querySelector('.teacher-video__video');

  function applyTeacherVideoTab(button) {
    const cdnSrc = (button.dataset.cdnSrc || '').trim();
    if (!videoEl || !cdnSrc) return;

    videoEl.pause();
    if (videoEl.getAttribute('src') !== cdnSrc) {
      videoEl.src = cdnSrc;
    }
    videoEl.load();
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');
      applyTeacherVideoTab(button);
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;

  if (imageLightbox && !imageLightbox.hidden) {
    closeImageLightbox();
    return;
  }

  if (reviewModal && !reviewModal.hidden) {
    closeReviewModal();
    return;
  }

  if (featureModal && !featureModal.hidden) {
    closeFeatureModal();
  }
});
