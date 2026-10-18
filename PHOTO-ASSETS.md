# 실사풍 이미지 에셋 업데이트

집 6종, 자동차 6종, 개인 시설 3종, 시계 컬렉션 1종을 추가했습니다.
부모님 집 선물은 신축 아파트 이미지를 함께 사용합니다.
홈·선수 정보·은퇴 화면에는 같은 가상 선수의 연령별 사진이 표시됩니다.

| 게임 나이 | 사진 |
|---|---|
| 19세 미만 | young.webp (고교 시절) |
| 19~25세 | rookie.webp (신인) |
| 26~32세 | prime.webp (전성기) |
| 33~39세 | veteran.webp (베테랑) |
| 40세 이상 | senior.webp (40대) |

이미지는 `images/assets/` 및 `images/player/`에 있습니다.
기존 저장 형식과 경제·성장 로직은 그대로 사용합니다. 선수의 나이가 변경되고 화면이 다시 그려지면 사진도 바뀝니다.
압축을 풀고 baseball-life 폴더의 전체 파일을 기존 배포 위치에 덮어쓰세요. images 폴더도 함께 올려야 합니다.

## 생성 방식 및 프롬프트
내장 이미지 생성 도구로 만든 가상 사진입니다. 실제 선수나 특정 제품의 공식 사진이 아닙니다.

자산 공통 프롬프트: “Photorealistic game inventory asset. [subject]. Premium realistic photography, natural materials, soft daylight, clean composition, landscape 3:2 frame. No people, captions, watermark, logos or readable text.”
차량 추가 조건: “Full vehicle visible, front three-quarter view, parked on understated modern plaza, no other vehicles.”
대상: 한국 가정 거실 / 원룸 오피스텔 / 신축 34평 아파트 / 한강뷰 아파트 / 루프탑 수영장 펜트하우스 / LA 저택 / 하늘색 경차 / 은색 중형 세단 / 남색 대형 SUV / 검정 고급 세단 / 빨강 스포츠카 / 노랑 슈퍼카 / 개인 훈련장 / 산소 캡슐과 냉온탕 회복 센터 / 배팅·피칭 랩 / 명품 시계 컬렉션.

선수 기본 프롬프트: “One fictional Korean male baseball player, age 17, natural youthful face, short black hair, straight eyebrows, oval face, athletic build. Head and upper torso, facing camera, white baseball uniform with navy piping, no logos or text, no cap. Soft daylight, blurred empty baseball field backdrop, realistic skin texture, centered square composition.”
노화 프롬프트: “Identity-preserving age progression. Same fictional Korean baseball player in reference, now age [22/29/36/44]. Keep recognizable facial identity, same eyes nose mouth, framing, uniform and backdrop. Natural believable athlete skin and facial maturity.” 36세 이후에는 미세한 눈가 주름, 44세에는 관자놀이의 약한 새치를 추가했습니다.

## 확인
나이 구간 경계값 10개, 집·차 12개 렌더링, 자동차 구매, 시설·선물 5개 이미지 연결, 은퇴 사진을 코드 실행으로 확인했습니다.

추가 이미지 21장의 최적화 후 합계 용량은 약 1.29MiB입니다. 실제 브라우저 시각 검사는 실행 환경 제약으로 수행하지 못했습니다.
