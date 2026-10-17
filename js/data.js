// ===== 게임 데이터 =====
// 팀 이름을 바꾸고 싶으면 이 파일의 name 값만 수정하면 됩니다.

const KBO_TEAMS = [
  { id: 'LG',  name: 'LG 트윈스',     short: 'LG', c1: '#c30452', c2: '#1a1a1a', park: '잠실야구장' },
  { id: 'OB',  name: '두산 베어스',   short: '두산', c1: '#131230', c2: '#ed1c24', park: '잠실야구장' },
  { id: 'SSG', name: 'SSG 랜더스',    short: 'SSG', c1: '#ce0e2d', c2: '#ffb81c', park: '인천SSG랜더스필드' },
  { id: 'KW',  name: '키움 히어로즈', short: '키움', c1: '#820024', c2: '#b07f4a', park: '고척스카이돔' },
  { id: 'KT',  name: 'KT 위즈',       short: 'KT', c1: '#1a1a1a', c2: '#eb1c24', park: '수원KT위즈파크' },
  { id: 'SS',  name: '삼성 라이온즈', short: '삼성', c1: '#074ca1', c2: '#c9d3df', park: '대구삼성라이온즈파크' },
  { id: 'HH',  name: '한화 이글스',   short: '한화', c1: '#ff6600', c2: '#07111f', park: '대전한화생명볼파크' },
  { id: 'LT',  name: '롯데 자이언츠', short: '롯데', c1: '#041e42', c2: '#d00f31', park: '사직야구장' },
  { id: 'HT',  name: 'KIA 타이거즈',  short: 'KIA', c1: '#ea0029', c2: '#06141f', park: '광주기아챔피언스필드' },
  { id: 'NC',  name: 'NC 다이노스',   short: 'NC', c1: '#315288', c2: '#c7a079', park: '창원NC파크' },
];

const MLB_TEAMS = [
  { id: 'NYY', name: '뉴욕 양키스', c1: '#0c2340', c2: '#c4ced4', park: '양키 스타디움', lg: 'AL' },
  { id: 'BOS', name: '보스턴 레드삭스', c1: '#bd3039', c2: '#0c2340', park: '펜웨이 파크', lg: 'AL' },
  { id: 'TOR', name: '토론토 블루제이스', c1: '#134a8e', c2: '#e8291c', park: '로저스 센터', lg: 'AL' },
  { id: 'TB',  name: '탬파베이 레이스', c1: '#092c5c', c2: '#8fbce6', park: '트로피카나 필드', lg: 'AL' },
  { id: 'BAL', name: '볼티모어 오리올스', c1: '#df4601', c2: '#1a1a1a', park: '캠든 야즈', lg: 'AL' },
  { id: 'CLE', name: '클리블랜드 가디언스', c1: '#00385d', c2: '#e50022', park: '프로그레시브 필드', lg: 'AL' },
  { id: 'MIN', name: '미네소타 트윈스', c1: '#002b5c', c2: '#d31145', park: '타깃 필드', lg: 'AL' },
  { id: 'DET', name: '디트로이트 타이거스', c1: '#0c2340', c2: '#fa4616', park: '코메리카 파크', lg: 'AL' },
  { id: 'KC',  name: '캔자스시티 로열스', c1: '#004687', c2: '#bd9b60', park: '카우프먼 스타디움', lg: 'AL' },
  { id: 'CWS', name: '시카고 화이트삭스', c1: '#27251f', c2: '#c4ced4', park: '레이트 필드', lg: 'AL' },
  { id: 'HOU', name: '휴스턴 애스트로스', c1: '#002d62', c2: '#eb6e1f', park: '다이킨 파크', lg: 'AL' },
  { id: 'SEA', name: '시애틀 매리너스', c1: '#0c2c56', c2: '#00a19b', park: 'T-모바일 파크', lg: 'AL' },
  { id: 'TEX', name: '텍사스 레인저스', c1: '#003278', c2: '#c0111f', park: '글로브 라이프 필드', lg: 'AL' },
  { id: 'LAA', name: 'LA 에인절스', c1: '#ba0021', c2: '#003263', park: '에인절 스타디움', lg: 'AL' },
  { id: 'ATH', name: '애슬레틱스', c1: '#003831', c2: '#efb21e', park: '서터 헬스 파크', lg: 'AL' },
  { id: 'NYM', name: '뉴욕 메츠', c1: '#002d72', c2: '#ff5910', park: '시티 필드', lg: 'NL' },
  { id: 'ATL', name: '애틀랜타 브레이브스', c1: '#13274f', c2: '#ce1141', park: '트루이스트 파크', lg: 'NL' },
  { id: 'PHI', name: '필라델피아 필리스', c1: '#e81828', c2: '#002d72', park: '시티즌스 뱅크 파크', lg: 'NL' },
  { id: 'MIA', name: '마이애미 말린스', c1: '#00a3e0', c2: '#ef3340', park: '론디포 파크', lg: 'NL' },
  { id: 'WSH', name: '워싱턴 내셔널스', c1: '#ab0003', c2: '#14225a', park: '내셔널스 파크', lg: 'NL' },
  { id: 'CHC', name: '시카고 컵스', c1: '#0e3386', c2: '#cc3433', park: '리글리 필드', lg: 'NL' },
  { id: 'MIL', name: '밀워키 브루어스', c1: '#12284b', c2: '#ffc52f', park: '아메리칸 패밀리 필드', lg: 'NL' },
  { id: 'STL', name: '세인트루이스 카디널스', c1: '#c41e3a', c2: '#0c2340', park: '부시 스타디움', lg: 'NL' },
  { id: 'CIN', name: '신시내티 레즈', c1: '#c6011f', c2: '#1a1a1a', park: '그레이트 아메리칸 볼파크', lg: 'NL' },
  { id: 'PIT', name: '피츠버그 파이리츠', c1: '#27251f', c2: '#fdb827', park: 'PNC 파크', lg: 'NL' },
  { id: 'LAD', name: 'LA 다저스', c1: '#005a9c', c2: '#ef3e42', park: '다저 스타디움', lg: 'NL' },
  { id: 'SD',  name: '샌디에이고 파드리스', c1: '#2f241d', c2: '#ffc425', park: '펫코 파크', lg: 'NL' },
  { id: 'SF',  name: '샌프란시스코 자이언츠', c1: '#fd5a1e', c2: '#27251f', park: '오라클 파크', lg: 'NL' },
  { id: 'ARI', name: '애리조나 다이아몬드백스', c1: '#a71930', c2: '#e3d4ad', park: '체이스 필드', lg: 'NL' },
  { id: 'COL', name: '콜로라도 로키스', c1: '#33006f', c2: '#c4ced4', park: '쿠어스 필드', lg: 'NL' },
];

const SCHOOLS = [
  { name: '덕수고', region: '서울', str: 78, c1: '#1d3f8f', c2: '#f2c230' },
  { name: '서울고', region: '서울', str: 72, c1: '#1f4e9c', c2: '#ffffff' },
  { name: '장충고', region: '서울', str: 74, c1: '#0d5c3a', c2: '#f2c230' },
  { name: '휘문고', region: '서울', str: 70, c1: '#5a1f8f', c2: '#ffffff' },
  { name: '충암고', region: '서울', str: 73, c1: '#0e3c7a', c2: '#e8463c' },
  { name: '배재고', region: '서울', str: 65, c1: '#7a1f2b', c2: '#ffffff' },
  { name: '신일고', region: '서울', str: 66, c1: '#1f6b9c', c2: '#ffffff' },
  { name: '선린인터넷고', region: '서울', str: 68, c1: '#123a6b', c2: '#7fd1ff' },
  { name: '경기고', region: '서울', str: 64, c1: '#2b2b2b', c2: '#d9b44a' },
  { name: '유신고', region: '경기', str: 77, c1: '#0a2f6b', c2: '#e8463c' },
  { name: '야탑고', region: '경기', str: 69, c1: '#14507a', c2: '#ffffff' },
  { name: '인천고', region: '인천', str: 71, c1: '#16336b', c2: '#ffffff' },
  { name: '동산고', region: '인천', str: 67, c1: '#2e7d32', c2: '#ffffff' },
  { name: '북일고', region: '충남', str: 76, c1: '#e8761c', c2: '#1a1a1a' },
  { name: '세광고', region: '충북', str: 66, c1: '#1b5e9c', c2: '#ffffff' },
  { name: '대전고', region: '대전', str: 64, c1: '#16336b', c2: '#f2c230' },
  { name: '대구고', region: '대구', str: 75, c1: '#0a3c7a', c2: '#e8463c' },
  { name: '경북고', region: '대구', str: 72, c1: '#123a8a', c2: '#ffffff' },
  { name: '상원고', region: '대구', str: 68, c1: '#7a1f2b', c2: '#ffffff' },
  { name: '경남고', region: '부산', str: 74, c1: '#16336b', c2: '#ffffff' },
  { name: '부산고', region: '부산', str: 70, c1: '#0e5a8a', c2: '#ffffff' },
  { name: '마산용마고', region: '경남', str: 71, c1: '#16336b', c2: '#e8463c' },
  { name: '광주제일고', region: '광주', str: 73, c1: '#0b3d91', c2: '#ffffff' },
  { name: '동성고', region: '광주', str: 67, c1: '#a01c1c', c2: '#ffffff' },
  { name: '강릉고', region: '강원', str: 72, c1: '#123a6b', c2: '#60c8f0' },
  { name: '전주고', region: '전북', str: 69, c1: '#0f4c81', c2: '#ffffff' },
  { name: '군산상일고', region: '전북', str: 63, c1: '#8a1c1c', c2: '#ffffff' },
];

// 구종: 구속 비율, 변화 방향(우투 기준, 존 단위: x는 오른쪽+, y는 아래+)
const PITCHES = {
  FF: { name: '포심', full: '포심 패스트볼', spd: 1.00, bx: 0.05, by: -0.12, fast: true },
  SI: { name: '투심', full: '투심 패스트볼', spd: 0.97, bx: 0.40, by: 0.25, fast: true },
  FC: { name: '커터', full: '커터', spd: 0.95, bx: -0.30, by: 0.10, fast: true },
  SL: { name: '슬라이더', full: '슬라이더', spd: 0.90, bx: -0.65, by: 0.30 },
  SW: { name: '스위퍼', full: '스위퍼', spd: 0.88, bx: -1.00, by: 0.12 },
  CU: { name: '커브', full: '커브', spd: 0.84, bx: -0.35, by: 0.95 },
  CH: { name: '체인지업', full: '체인지업', spd: 0.88, bx: 0.35, by: 0.55 },
  FS: { name: '포크', full: '스플리터/포크', spd: 0.90, bx: 0.05, by: 0.85 },
};

const HOUSES = [
  { id: 'home',  name: '본가', price: 0, desc: '부모님과 함께 사는 집', cond: 0, mental: 1, icon: 'house', tier: 0 },
  { id: 'one',   name: '원룸 오피스텔', price: 200000000, desc: '구장 근처 깔끔한 원룸', cond: 2, mental: 0, icon: 'house', tier: 1 },
  { id: 'apt',   name: '신축 아파트 34평', price: 900000000, desc: '넉넉한 신혼집으로도 충분', cond: 4, mental: 2, icon: 'house', tier: 2 },
  { id: 'river', name: '한강뷰 아파트', price: 3000000000, desc: '거실에서 한강이 보이는 집', cond: 6, mental: 3, icon: 'house', tier: 3 },
  { id: 'pent',  name: '펜트하우스', price: 7000000000, desc: '루프탑 수영장과 개인 실내 타격장', cond: 8, mental: 5, icon: 'house', tier: 4 },
  { id: 'us',    name: 'LA 저택', price: 12000000000, desc: '수영장과 정원이 있는 미국 저택 (MLB 선수 전용)', cond: 9, mental: 5, icon: 'house', tier: 5, mlbOnly: true },
];

const CARS = [
  { id: 'mini',  name: '경차', price: 15000000, desc: '첫 차로는 이만한 게 없다', fame: 0, date: 1, color: '#7fd1ff', tier: 1 },
  { id: 'sedan', name: '국산 중형 세단', price: 35000000, desc: '무난하고 든든한 데일리카', fame: 1, date: 2, color: '#d0d6e0', tier: 2 },
  { id: 'suv',   name: '국산 대형 SUV', price: 65000000, desc: '야구 장비 싣기 딱 좋은 차', fame: 2, date: 3, color: '#2b3a55', tier: 3 },
  { id: 'german', name: '독일 고급 세단', price: 130000000, desc: '성공한 선수의 상징', fame: 4, date: 5, color: '#1a1a1a', tier: 4 },
  { id: 'sport', name: '스포츠카', price: 250000000, desc: '경기장 주차장에서 시선 집중', fame: 6, date: 6, color: '#e8463c', tier: 5 },
  { id: 'super', name: '이탈리아 슈퍼카', price: 550000000, desc: '꿈의 슈퍼카', fame: 9, date: 8, color: '#ffc425', tier: 6 },
];

const DATE_PLACES = [
  { id: 'cafe',   name: '카페 데이트', cost: 50000, aff: 4, cond: 3 },
  { id: 'movie',  name: '영화관', cost: 100000, aff: 5, cond: 3 },
  { id: 'river',  name: '한강 피크닉', cost: 80000, aff: 6, cond: 5, needCar: false },
  { id: 'park',   name: '놀이공원', cost: 250000, aff: 7, cond: 2 },
  { id: 'dining', name: '파인다이닝', cost: 600000, aff: 8, cond: 4 },
  { id: 'drive',  name: '바다 드라이브', cost: 300000, aff: 9, cond: 6, needCar: true },
  { id: 'trip',   name: '해외 여행', cost: 15000000, aff: 18, cond: 15, offseason: true },
];

const GIFTS = [
  { id: 'flower', name: '꽃다발', cost: 100000, aff: 3 },
  { id: 'perfume', name: '향수', cost: 300000, aff: 5 },
  { id: 'bag', name: '명품 가방', cost: 5000000, aff: 10 },
  { id: 'ring', name: '프러포즈 반지', cost: 20000000, aff: 0, ring: true },
];

// 연애 상대 (모두 성인, 프로 데뷔 이후 만남)
const HEROINES = [
  {
    id: 'minji', name: '오민지', age: 24, job: '카페 사장',
    look: { skin: '#f7d9c4', hair: '#5a3b2a', style: 'bob', eye: '#3a2418', outfit: '#e9e2d0', accent: '#9a6b4a' },
    fav: 'cafe', meet: '숙소 앞 단골 카페',
    intro: ['어서 오세요! 아, 혹시 새로 들어온 신인 선수 맞죠?', '여기 선수들 단골 카페거든요. 아메리카노 한 잔 서비스예요. 응원할게요!'],
    talk: [
      ['오늘도 훈련 끝나고 왔어요? 얼굴이 피곤해 보여요.', '신메뉴 시음해 줄래요? 솔직하게 말해줘야 해요.'],
      ['어제 경기 봤어요! 손님들이랑 같이 소리 질렀다니까요.', '가게 문 닫고 나면 저도 가끔 야구장 가요.'],
      ['요즘 당신 오는 시간만 기다리게 돼요. 이상하죠?', '당신 자리는 항상 비워둘게요. 창가 두 번째 자리.'],
      ['오늘 하루도 고생했어. 나한테는 그냥 기대도 돼.', '가게 이름 옆에 당신 사인 걸어두면 안 돼? 자랑하고 싶어서.'],
    ],
  },
  {
    id: 'chaerin', name: '윤채린', age: 23, job: '구단 치어리더',
    look: { skin: '#f9dfcf', hair: '#2a1a14', style: 'pony', eye: '#2a1810', outfit: '#ff5d8f', accent: '#ffffff' },
    fav: 'park', meet: '홈 개막전 응원석', kboOnly: true,
    intro: ['안녕하세요! 응원단 윤채린이에요!', '오늘 첫 타석 때 제가 응원가 제일 크게 불렀어요. 들렸어요?'],
    talk: [
      ['오늘 응원가 새로 만들었는데 들어볼래요? 아직 비밀이에요!', '연습 때 보니까 진짜 열심히 하던데요?'],
      ['홈런 치면 제가 특별 응원 해줄게요. 약속!', '팬들이 당신 유니폼 엄청 사가요. 질투 나게.'],
      ['경기 끝나고 단장님 몰래 잠깐 만날래요?', '응원석에서 당신만 보게 되는 거 들키면 안 되는데.'],
      ['오늘도 내가 제일 크게 응원했어. 알지?', '시즌 끝나면 우리 둘이 놀이공원 가자!'],
    ],
  },
  {
    id: 'jisu', name: '한지수', age: 26, job: '스포츠 아나운서',
    look: { skin: '#f5d6c6', hair: '#3b2418', style: 'long', eye: '#2b1a12', outfit: '#2c3e70', accent: '#ffffff' },
    fav: 'dining', meet: '수훈선수 인터뷰', fame: 18,
    intro: ['오늘의 수훈선수 인터뷰입니다! 축하드려요.', '인터뷰 끝나고 말씀드리는 건데, 답변이 참 솔직해서 좋았어요.'],
    talk: [
      ['다음 주 하이라이트 프로그램에 선수님 나와요. 미리 알려드리는 거예요.', '방송 없는 날엔 저도 그냥 야구 팬이에요.'],
      ['기록 분석해 봤는데 요즘 타구 질이 정말 좋아졌더라고요.', '카메라 꺼지면 말 편하게 해도 돼요.'],
      ['다른 선수 인터뷰할 때도 자꾸 당신 생각나요. 프로답지 못하죠?', '오늘 저녁, 시간 있어요?'],
      ['오늘 방송에서 당신 얘기할 때 목소리 떨렸어. 아무도 몰랐겠지?', '당신 은퇴 기자회견은 내가 진행할 거야.'],
    ],
  },
  {
    id: 'seoyun', name: '박서윤', age: 27, job: '재활 트레이너',
    look: { skin: '#f3d2bd', hair: '#1e1612', style: 'pony2', eye: '#22140e', outfit: '#3ba7a0', accent: '#ffffff' },
    fav: 'river', meet: '재활 센터', injury: true,
    intro: ['오늘부터 재활 담당하는 박서윤이에요.', '무리하면 제가 바로 혼낼 거예요. 같이 빨리 복귀해요.'],
    talk: [
      ['스트레칭 매일 했어요? 거짓말하면 다 티 나요.', '몸이 재산이에요. 잠은 꼭 8시간!'],
      ['복귀전 보고 저 울 뻔했어요. 비밀이에요.', '오늘 컨디션 체크 좀 해볼까요? 손 줘봐요.'],
      ['당신이 다치면 제일 먼저 달려갈 사람, 저라는 거 알죠?', '퇴근하고 한강 걸을래요? 회복에도 좋아요.'],
      ['당신 몸은 내가 평생 관리해 줄게. 각오해.', '오늘은 아무 생각 말고 푹 쉬어. 내가 옆에 있을게.'],
    ],
  },
  {
    id: 'ella', name: '엘라 김', age: 27, job: '구단 통역사',
    look: { skin: '#f0cdb6', hair: '#8a5a32', style: 'wave', eye: '#3a2a1a', outfit: '#1f3550', accent: '#ffd23f' },
    fav: 'drive', meet: '메이저리그 클럽하우스', mlbOnly: true,
    intro: ['Hi! 오늘부터 통역 맡게 된 엘라예요. 한국어 편하게 하셔도 돼요.', '미국 생활 모르는 거 있으면 다 물어봐요. 맛집도 제가 알려줄게요.'],
    talk: [
      ['감독님이 오늘 "excellent"라고 했어요. 세 번이나!', '한국 음식 그리울 때 말해요. 코리아타운 데려갈게요.'],
      ['기자들이 당신 별명 지었어요. 맘에 들지는 모르겠지만.', '미국 운전은 익숙해졌어요? 오늘은 제가 운전할게요.'],
      ['통역 말고 그냥 당신 옆에 있고 싶을 때가 있어요.', '이번 원정 끝나면 바다 보러 갈래요?'],
      ['당신 말은 내가 세상에서 제일 잘 통역할 수 있어.', '여기가 집처럼 느껴지는 건 당신 때문이야.'],
    ],
  },
];

const KR_SURNAMES = '김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남심노하곽성차주우구민나진지엄채원천방공현함변염여추도소석선설마길연위표명기반왕금옥육인맹제모남궁탁국'.split('');
const KR_GIVEN_A = '민서지현준도하우시건태성재영동승은주원진상정연규호희용석혁찬'.split('');
const KR_GIVEN_B = '준우호현민수빈혁훈진성석원재영규찬욱환기철범결율후웅'.split('');
const EN_FIRST = ['Mike','Jake','Tyler','Ryan','Chris','Matt','Josh','Kyle','Luis','Carlos','Juan','Jose','Brandon','Austin','Logan','Mason','Ethan','Noah','Aaron','Bryce','Corey','Derek','Evan','Freddie','Gavin','Hunter','Ian','Javier','Kevin','Marcus','Nolan','Owen','Pete','Rafael','Shane','Trevor','Victor','Wyatt','Yordan','Zack'];
const EN_LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Clark','Lewis','Walker','Hall','Allen','Young','King','Wright','Scott','Torres','Hill','Green','Adams','Baker','Nelson','Carter'];

function krName() {
  const r = (a) => a[Math.floor(Math.random() * a.length)];
  return r(KR_SURNAMES.slice(0, 40)) + r(KR_GIVEN_A) + r(KR_GIVEN_B);
}
function enName() {
  const r = (a) => a[Math.floor(Math.random() * a.length)];
  return r(EN_FIRST) + ' ' + r(EN_LAST);
}

const USD = 1400; // 게임 내 고정 환율 (1달러 = 1,400원)
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
