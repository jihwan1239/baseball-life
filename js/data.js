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
  { id: 'night',  name: '특급 데이트', cost: 600000, aff: 12, cond: 0, special: true },
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

// ===== 선택형 이벤트 (인터뷰, 대화) =====
// fx: mental, fame, fat, money, attr(주 능력치 +), aff(연인 호감), scout, injury(주), flag
const CHOICES = [
  {
    id: 'hero_interview', pro: true, cond: (S, c) => c.perf > 2.2,
    title: '수훈선수 인터뷰', text: '오늘 경기 수훈선수로 뽑혔다. 기자가 마이크를 내민다.\n"오늘 활약의 비결이 뭘까요?"',
    opts: [
      { label: '"동료들이 만들어준 찬스였어요."', fx: { mental: 3, fame: 2, trust: 3 }, msg: '겸손한 대답에 팬들이 호감을 보였다. 덕아웃 분위기도 좋아졌다.' },
      { label: '"이제 시작입니다. 더 보여드릴게요."', fx: { fame: 5 }, msg: '자신감 넘치는 한마디가 화제가 됐다.', risk: { p: 0.3, fx: { mental: -5 }, msg: '다음 날 부진하자 "말만 앞선다"는 댓글이 쏟아졌다.' } },
      { label: '"팬분들 응원 덕분이에요!"', fx: { fame: 3, mental: 2 }, msg: '응원석에서 큰 함성이 터졌다.' },
    ],
  },
  {
    id: 'slump_q', pro: true, cond: (S, c) => c.perf < -1.2,
    title: '부진에 대한 질문', text: '경기 후 기자가 묻는다.\n"최근 부진이 길어지는데, 스스로 어떻게 보세요?"',
    opts: [
      { label: '"핑계 대지 않겠습니다. 제가 부족했어요."', fx: { mental: -2, fame: 2, trust: 3 }, msg: '솔직한 태도에 팬들이 응원 메시지를 보내왔다.' },
      { label: '"컨디션 문제일 뿐이에요. 금방 올라옵니다."', fx: { mental: 3, fame: -1 }, msg: '마음은 편해졌지만, 일부 팬들은 아쉬워했다.' },
      { label: '인터뷰를 정중히 사양한다', fx: { mental: 4, fame: -2 }, msg: '조용히 경기장을 빠져나왔다. 생각을 정리할 시간이 필요했다.' },
    ],
  },
  {
    id: 'coach_rest', pro: true, cond: (S) => S.fat > 62,
    title: '감독님 면담', text: '감독님이 조용히 불렀다.\n"요즘 많이 지쳐 보이는데, 이번 주는 좀 쉬어갈래?"',
    opts: [
      { label: '"네, 몸부터 추스르겠습니다."', fx: { fat: -25, mental: 2 }, msg: '푹 쉬고 나니 몸이 한결 가벼워졌다.' },
      { label: '"괜찮습니다. 뛰겠습니다."', fx: { fame: 2, mental: 2, trust: 5 }, msg: '감독님이 고개를 끄덕였다. 투지를 인정받았다.', risk: { p: 0.25, fx: { injury: 2 }, msg: '무리한 탓에 결국 몸에 탈이 났다.' } },
    ],
  },
  {
    id: 'team_dinner', pro: true, cond: () => true,
    title: '선배의 회식 초대', text: '고참 선배가 원정 숙소 근처 고깃집으로 부른다.\n"오늘 다 같이 밥 먹자. 너도 와."',
    opts: [
      { label: '참석한다', fx: { mental: 6, fat: 4, attr: 0.8, trust: 2 }, msg: '선배에게 들은 노하우가 꽤 쓸모 있었다.' },
      { label: '정중히 거절하고 개인 훈련', fx: { attr: 1.3, mental: -2 }, msg: '혼자 남아 스윙을 돌렸다. 조금은 외로웠다.' },
    ],
  },
  {
    id: 'fan_sign', pro: true, cond: (S) => S.fame >= 15,
    title: '식당에서 만난 팬', text: '밥을 먹는데 어린 팬과 아버지가 조심스럽게 다가온다.\n"사인 한 장만 받을 수 있을까요?"',
    opts: [
      { label: '사인에 사진까지 흔쾌히', fx: { fame: 2, mental: 3 }, msg: '아이가 사인을 품에 안고 활짝 웃었다.' },
      { label: '식사 중이라 양해를 구한다', fx: {}, msg: '팬은 아쉬워하며 돌아갔다.', risk: { p: 0.35, fx: { fame: -4 }, msg: 'SNS에 "불친절했다"는 후기가 올라왔다.' } },
    ],
  },
  {
    id: 'youtube', pro: true, cond: (S) => S.fame >= 30,
    title: '유튜브 출연 제안', text: '구독자 200만 스포츠 채널에서 출연 요청이 왔다.',
    opts: [
      { label: '출연한다', fx: { fame: 4, fat: 4, money: 'yt' }, msg: '영상이 인기 급상승에 올랐다. 출연료도 두둑했다.' },
      { label: '시즌 중엔 야구만 하겠다', fx: { mental: 2 }, msg: '거절했다. 지금은 야구에 집중할 때다.' },
    ],
  },
  {
    id: 'agent', pro: true, cond: (S) => !S.flags.agent && !S.flags.agentNo && S.fame >= 10,
    title: '에이전트 계약 제안', text: '대형 에이전시가 연봉 협상과 FA를 맡겠다고 한다.\n수수료는 연봉의 3%.',
    opts: [
      { label: '계약한다', fx: { flag: 'agent' }, msg: '이제 협상 테이블에는 에이전트가 앉는다. 연봉 협상과 FA에서 유리해진다.' },
      { label: '혼자 하겠다', fx: { flag: 'agentNo' }, msg: '수수료를 아끼기로 했다.' },
    ],
  },
  {
    id: 'rookie_help', pro: true, cond: (S) => S.age >= 24,
    title: '후배의 부탁', text: '올해 들어온 신인이 쭈뼛거리며 다가온다.\n"선배님, 훈련 끝나고 조금만 봐주실 수 있을까요?"',
    opts: [
      { label: '시간 내서 같이 훈련한다', fx: { fat: 4, mental: 4, fame: 1 }, msg: '후배의 눈빛이 달라졌다. 가르치면서 나도 배운 게 있었다.' },
      { label: '"다음에 하자."', fx: {}, msg: '후배는 꾸벅 인사하고 돌아갔다.' },
    ],
  },
  {
    id: 'rival', pro: true, cond: (S) => S.fame >= 20,
    title: '상대 선수의 도발', text: '다음 상대 팀 선수가 인터뷰에서 나를 콕 집어 말했다.\n"솔직히 과대평가된 선수죠."',
    opts: [
      { label: '"그라운드에서 보여드리죠."', fx: { fame: 4, mental: 2 }, msg: '맞대결 기사가 쏟아졌다. 다음 경기 예매가 매진됐다.', risk: { p: 0.3, fx: { mental: -5 }, msg: '그 경기에서 침묵하자 조롱이 이어졌다.' } },
      { label: '무시한다', fx: { mental: 2 }, msg: '신경 쓰지 않기로 했다.' },
      { label: 'SNS에 유쾌하게 받아친다', fx: { fame: 3 }, msg: '센스 있는 답글이 화제가 됐다.' },
    ],
  },
  {
    id: 'partner_call', pro: true, cond: (S) => S.partner && !S.spouse,
    title: '연인의 서운함', text: '원정이 길어져 연락이 뜸했더니 메시지가 왔다.\n"요즘 많이 바쁘지? 그냥… 목소리 듣고 싶었어."',
    opts: [
      { label: '피곤해도 바로 영상통화', fx: { aff: 6, fat: 3, mental: 3 }, msg: '화면 너머로 웃는 얼굴을 보니 피로가 풀렸다.' },
      { label: '경기 끝나고 길게 답장', fx: { aff: 2 }, msg: '"고마워, 푹 자."라는 답이 왔다.' },
      { label: '"시즌 중이라 이해해줘."', fx: { aff: -6 }, msg: '"…응, 알겠어." 짧은 답이 왔다.' },
    ],
  },
  {
    id: 'hs_exam', hs: true, cond: () => true,
    title: '시험 기간', text: '중간고사가 코앞이다. 감독님은 훈련도 빠지지 말라고 하신다.',
    opts: [
      { label: '밤새 공부한다', fx: { mental: 6, fat: 8 }, msg: '성적표를 받은 부모님 얼굴이 밝았다.' },
      { label: '야간 훈련을 계속한다', fx: { attr: 1.2, mental: -4 }, msg: '성적은 바닥이었지만 방망이 감은 좋아졌다.' },
      { label: '둘 다 적당히', fx: { attr: 0.5, mental: 2 }, msg: '무난하게 넘겼다.' },
    ],
  },
  {
    id: 'hs_friend', hs: true, cond: () => true,
    title: '친구 생일파티', text: '반 친구가 생일파티에 오라고 한다. 오늘은 개인 훈련하려던 날인데.',
    opts: [
      { label: '간다', fx: { mental: 8 }, msg: '오랜만에 실컷 웃었다.' },
      { label: '훈련하러 간다', fx: { attr: 1 }, msg: '"다음엔 꼭 와라." 친구가 아쉬워했다.' },
    ],
  },
  {
    id: 'hs_coach', hs: true, cond: (S) => S.grade >= 2,
    title: '감독님의 질문', text: '훈련이 끝나고 감독님이 물었다.\n"너, 프로 가고 싶냐?"',
    opts: [
      { label: '"꼭 가겠습니다!"', fx: { mental: 4, scout: 3 }, msg: '감독님이 스카우트들에게 내 얘기를 해주셨다고 한다.' },
      { label: '"아직 잘 모르겠어요."', fx: { mental: 1 }, msg: '"천천히 생각해 봐라." 감독님이 어깨를 두드렸다.' },
    ],
  },
  {
    id: 'hs_pain', hs: true, cond: (S, c) => S.fat > 50 && c.tourn,
    title: '통증을 참고 출전할까?', text: '대회 중인데 어깨가 욱신거린다. 감독님은 아직 모르신다.',
    opts: [
      { label: '참고 뛴다', fx: { scout: 4, fame: 1 }, msg: '이를 악물고 경기를 마쳤다.', risk: { p: 0.35, fx: { injury: 3 }, msg: '결국 통증이 심해져 전력에서 이탈했다.' } },
      { label: '감독님께 솔직히 말씀드린다', fx: { fat: -18 }, msg: '"잘 말했다. 몸이 먼저다." 며칠 쉬기로 했다.' },
    ],
  },
];

// 연락하기 답장 톤 (사람마다 좋아하는 톤이 다름)
const REPLY_TONES = [
  { id: 'warm', label: '다정하게 받아준다' },
  { id: 'fun', label: '장난스럽게 대답한다' },
  { id: 'base', label: '오늘 경기 이야기를 꺼낸다' },
];
const HERO_TONE = { minji: 'warm', chaerin: 'fun', jisu: 'base', seoyun: 'warm', ella: 'fun' };

// ===== 대학 / 독립리그 =====
const UNIVS = [
  { name: '연세대', region: '서울', str: 74, c1: '#003876', c2: '#ffffff' },
  { name: '고려대', region: '서울', str: 74, c1: '#8b0029', c2: '#ffffff' },
  { name: '성균관대', region: '서울', str: 72, c1: '#1d7a3a', c2: '#f2c230' },
  { name: '한양대', region: '서울', str: 71, c1: '#0e4a84', c2: '#ffffff' },
  { name: '동국대', region: '서울', str: 70, c1: '#e8761c', c2: '#ffffff' },
  { name: '중앙대', region: '서울', str: 68, c1: '#1b5fae', c2: '#e8463c' },
  { name: '단국대', region: '경기', str: 69, c1: '#003f8a', c2: '#ffffff' },
  { name: '건국대', region: '서울', str: 67, c1: '#036b3f', c2: '#ffffff' },
  { name: '경희대', region: '서울', str: 66, c1: '#8b1a2a', c2: '#ffffff' },
  { name: '홍익대', region: '서울', str: 66, c1: '#1f2a6b', c2: '#ffffff' },
  { name: '동아대', region: '부산', str: 66, c1: '#1e3c72', c2: '#ffffff' },
  { name: '인하대', region: '인천', str: 65, c1: '#00427a', c2: '#7fd1ff' },
  { name: '원광대', region: '전북', str: 64, c1: '#2d5aa0', c2: '#ffffff' },
];
const INDY_TEAMS = [
  { id: 'I_YC', name: '연천 미라클', short: '연천', c1: '#0b5ea8', c2: '#f2c230', park: '연천 베이스볼파크' },
  { id: 'I_PJ', name: '파주 챌린저스', short: '파주', c1: '#2b2b2b', c2: '#e8463c', park: '파주 구장' },
  { id: 'I_SN', name: '성남 맥파이스', short: '성남', c1: '#203a6b', c2: '#ffffff', park: '성남 탄천구장' },
  { id: 'I_SW', name: '수원 파인이그스', short: '수원', c1: '#2e7d32', c2: '#ffffff', park: '수원 구장' },
  { id: 'I_GP', name: '가평 웨일스', short: '가평', c1: '#1b75bb', c2: '#ffffff', park: '가평 구장' },
];

// 특급 데이트가 끝난 뒤 나오는 문구
const NIGHT_LINES = [
  '그날 밤, 둘 사이에 더 이상 말은 필요 없었다.',
  '다음 날 아침, 커튼 사이로 들어온 햇살이 유난히 눈부셨다.',
  '"오늘은… 집에 안 가도 돼." 그녀가 귓가에 작게 속삭였다.',
  '창밖 도시의 불빛이 하나둘 꺼져 갔다. 우리 방 불은 조금 더 오래 켜져 있었다.',
  '다음 날 훈련장에서 동료가 물었다. "너 오늘 왜 이렇게 실실 웃냐?"',
  '셔츠 깃에 남은 립스틱 자국. 세탁은… 내일 하자.',
  '"벌써 아침이야?" 둘 다 알람 소리를 못 들은 척했다.',
  '그날 밤 일은 둘만의 비밀로 하기로 했다. 그녀의 얼굴이 빨개졌다.',
];
