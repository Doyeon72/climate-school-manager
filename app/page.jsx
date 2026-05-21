'use client'

import { useEffect, useMemo, useState } from 'react'

const DEFAULT_SCHOOL = {
  name: '상현중학교',
  region: '용인시 수지구',
  type: '기후환경 매니저 시범 학교',
  carbonText: '1.32 kgCO₂-eq/m²',
  efficiencyTier: '수지구 에너지 효율 중위권',
  tierMessage: '지금도 잘 관리되고 있는 부분이 있지만, 조금만 더 살펴보면 더 아끼고 더 편안하게 바꿀 수 있는 공간을 찾을 수 있어요.',
}

const SCHOOL_OPTIONS = [
  '대지중학교',
  '용인대덕중학교',
  '죽전중학교',
  '현암중학교',
  '문정중학교',
  '수지중학교',
  '이현중학교',
  '정평중학교',
  '상현중학교',
  '서원중학교',
  '성복중학교',
  '손곡중학교',
  '용인한빛중학교',
  '신봉중학교',
  '홍천중학교',
]

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)

const INITIAL_OBSERVATIONS = [
  {
    id: 'sample-1',
    building: '본관',
    floor: '3층',
    space: '복도',
    problemType: '더운 공간',
    detail: '오후에 햇빛이 강해서 복도와 창가 쪽이 많이 더워요.',
    points: 5,
    status: '공감 모으는 중',
    createdAt: '2026-05-07T00:00:00.000Z',
    empathy: 7,
  },
  {
    id: 'sample-2',
    building: '별관',
    floor: '1층',
    space: '화장실',
    problemType: '물 낭비',
    detail: '수도꼭지에서 물이 조금씩 새는 것 같아요.',
    points: 5,
    status: '학생자치 1차 확인',
    createdAt: '2026-05-07T00:00:00.000Z',
    empathy: 4,
  },
]

const INITIAL_SUGGESTIONS = [
  {
    id: 'suggestion-1',
    location: '본관 3층 복도 창가',
    problem: '오후에 햇빛이 강해서 덥고 눈이 부셔요.',
    reason: '에어컨을 틀어도 창가 쪽은 계속 덥고 수업 집중도가 떨어져요.',
    solution: '고장난 블라인드를 고치거나 차광 필름을 붙이면 좋겠어요.',
    beneficiary: '3층 교실을 쓰는 학생들',
    energyLink: '냉방 효율이 좋아질 수 있어요.',
    status: '월간 TOP 후보',
    votes: 12,
    points: 10,
  },
]

const BUILDINGS = ['본관', '별관', '체육관', '급식실', '운동장 주변']
const FLOORS = ['지하', '1층', '2층', '3층', '4층', '5층', '실외']
const SPACES = ['교실', '복도', '창가', '화장실', '계단', '출입구', '운동장', '기타']
const PROBLEM_TYPES = ['더운 공간', '추운 공간', '햇빛 강함', '전기 낭비', '물 낭비', '시설 불편']

const MANAGER_MISSIONS = [
  ['창가와 복도의 더운 공간을 찾아보기', '햇빛, 냉방 효율, 블라인드 상태를 함께 살펴봐요.'],
  ['빈 교실의 전기 낭비를 찾아보기', '켜진 조명, 모니터, 냉난방기처럼 낭비되는 전기를 관찰해요.'],
  ['화장실과 급수대의 물 낭비를 확인하기', '수도꼭지 누수나 물이 계속 흐르는 곳이 있는지 살펴봐요.'],
  ['겨울에 유난히 추운 공간을 찾아보기', '창문 틈새, 출입구 바람, 난방이 약한 공간을 기록해요.'],
  ['고장난 시설이 있는 공간을 찾아보기', '블라인드, 창문, 문, 조명처럼 불편을 만드는 시설을 확인해요.'],
  ['햇빛이 너무 강한 자리를 찾아보기', '눈부심이 심하거나 수업 집중을 방해하는 공간을 기록해요.'],
].map(([title, description]) => ({ title, description }))

const ENERGY_TIPS = [
  ['빈 교실 조명부터 확인하기', '쉬는 시간이나 이동 수업 전에 비어 있는 교실의 조명과 모니터가 꺼져 있는지 살펴봐요.'],
  ['블라인드로 햇빛 조절하기', '오후에 햇빛이 강한 창가는 블라인드를 활용하면 냉방 부담을 줄이는 데 도움이 돼요.'],
  ['창문과 출입문 닫힘 상태 확인하기', '냉난방 중에는 창문이나 출입문이 계속 열려 있지 않은지 확인해요.'],
  ['수도꼭지 물샘 바로 기록하기', '수도꼭지에서 물이 조금씩 새는 곳을 발견하면 기록해서 빠르게 고칠 수 있게 해요.'],
  ['자연광을 쓸 수 있는 시간 찾기', '햇빛이 충분한 시간에는 불필요한 조명을 줄일 수 있는 공간이 있는지 관찰해요.'],
].map(([title, description]) => ({ title, description }))

const COSTUMES = [
  {
    id: 'basic',
    name: '기본 조아용',
    description: '처음 시작할 때 제공되는 기본 조아용이에요.',
    requiredPoints: 0,
    level: 1,
    imageSrc: '/joayong-basic.png',
  },
  {
    id: 'park',
    name: '공원 조아용',
    description: '누적 20pt를 달성하면 열리는 공원 테마 조아용이에요.',
    requiredPoints: 20,
    level: 2,
    imageSrc: '/joayong-park.png',
  },
  {
    id: 'recycle',
    name: '재활용 조아용',
    description: '누적 40pt를 달성하면 열리는 재활용 테마 조아용이에요.',
    requiredPoints: 40,
    level: 3,
    imageSrc: '/joayong-recycle.png',
  },
  {
    id: 'carbon',
    name: '탄소중립 조아용',
    description: '누적 60pt를 달성하면 열리는 탄소중립 테마 조아용이에요.',
    requiredPoints: 60,
    level: 4,
    imageSrc: '/joayong-carbon.png',
  },
]

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function isWithinDays(dateString, days) {
  const then = new Date(dateString).getTime()
  const now = Date.now()
  return now - then < days * 24 * 60 * 60 * 1000
}

function getDailyPoints(pointsLog) {
  const today = todayKey()
  return pointsLog.filter((item) => item.date === today).reduce((sum, item) => sum + item.points, 0)
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getClimateLevel(totalPoints) {
  if (totalPoints >= 60) return 4
  if (totalPoints >= 40) return 3
  if (totalPoints >= 20) return 2
  return 1
}

function getNextReward(totalPoints) {
  return COSTUMES.find((item) => item.requiredPoints > totalPoints) || COSTUMES[COSTUMES.length - 1]
}

function hasEnoughText(value, minLength = 5) {
  return value.trim().length >= minLength
}

function getMissingSuggestionFields(form) {
  const checks = [
    ['location', '어디에서 발견했나요?', 3],
    ['problem', '어떤 문제가 있나요?', 5],
    ['reason', '왜 문제가 된다고 생각하나요?', 5],
    ['solution', '어떻게 바꾸면 좋을까요?', 5],
    ['beneficiary', '누구에게 도움이 될까요?', 3],
    ['energyLink', '에너지와 어떤 관련이 있나요?', 5],
  ]
  return checks.filter(([key, , minLength]) => !hasEnoughText(form[key], minLength)).map(([, label]) => label)
}

function JoayongMascot({ costume, compact = false, large = false }) {
  return (
    <div className={`joayong-wrap ${compact ? 'compact' : ''} ${large ? 'large' : ''}`}>
      <img
        className="joayong-image"
        src={costume?.imageSrc || '/joayong-basic.png'}
        alt={costume?.name || '조아용 캐릭터'}
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = '/joayong-park.png'
        }}
      />
    </div>
  )
}

export default function HomePage() {
  const [tab, setTab] = useState('home')
  const [observations, setObservations] = useState(INITIAL_OBSERVATIONS)
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS)
  const [pointsLog, setPointsLog] = useState([])
  const [selectedCostumeId, setSelectedCostumeId] = useState('basic')
  const [selectedSchoolName, setSelectedSchoolName] = useState(DEFAULT_SCHOOL.name)
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [toast, setToast] = useState('')
  const [dailyMission, setDailyMission] = useState(MANAGER_MISSIONS[0])
  const [energyTip, setEnergyTip] = useState(ENERGY_TIPS[0])
  const [observationForm, setObservationForm] = useState({
    building: '본관',
    floor: '3층',
    space: '복도',
    problemType: '더운 공간',
    detail: '',
  })
  const [suggestionForm, setSuggestionForm] = useState({
    location: '',
    problem: '',
    reason: '',
    solution: '',
    beneficiary: '',
    energyLink: '',
  })

  useEffect(() => {
    setObservations(loadFromStorage('observations', INITIAL_OBSERVATIONS))
    setSuggestions(loadFromStorage('suggestions', INITIAL_SUGGESTIONS))
    setPointsLog(loadFromStorage('pointsLog', []))
    setSelectedCostumeId(loadFromStorage('selectedCostumeId', 'basic'))
    setSelectedSchoolName(loadFromStorage('selectedSchoolName', DEFAULT_SCHOOL.name))
    setSelectedMonth(loadFromStorage('selectedMonth', 1))
    setDailyMission(getRandomItem(MANAGER_MISSIONS))
    setEnergyTip(getRandomItem(ENERGY_TIPS))
  }, [])

  useEffect(() => saveToStorage('observations', observations), [observations])
  useEffect(() => saveToStorage('suggestions', suggestions), [suggestions])
  useEffect(() => saveToStorage('pointsLog', pointsLog), [pointsLog])
  useEffect(() => saveToStorage('selectedCostumeId', selectedCostumeId), [selectedCostumeId])
  useEffect(() => saveToStorage('selectedSchoolName', selectedSchoolName), [selectedSchoolName])
  useEffect(() => saveToStorage('selectedMonth', selectedMonth), [selectedMonth])

  const dailyPoints = useMemo(() => getDailyPoints(pointsLog), [pointsLog])
  const totalPoints = useMemo(() => pointsLog.reduce((sum, item) => sum + item.points, 0), [pointsLog])
  const selectedSchool = useMemo(() => ({ ...DEFAULT_SCHOOL, name: selectedSchoolName }), [selectedSchoolName])
  const climateLevel = getClimateLevel(totalPoints)
  const selectedCostume = COSTUMES.find((item) => item.id === selectedCostumeId) || COSTUMES[0]
  const nextReward = getNextReward(totalPoints)
  const nextThreshold = nextReward.requiredPoints || 20
  const previousThreshold = climateLevel === 1 ? 0 : COSTUMES[climateLevel - 1]?.requiredPoints || 0
  const rewardProgress = nextReward.requiredPoints <= totalPoints ? 100 : Math.min(100, Math.max(0, Math.round(((totalPoints - previousThreshold) / (nextThreshold - previousThreshold)) * 100)))

  function addPoints(points, reason) {
    const today = todayKey()
    const cappedPoints = Math.max(0, Math.min(points, 30 - getDailyPoints(pointsLog)))
    if (cappedPoints === 0) {
      setToast('오늘 받을 수 있는 포인트 한도 30pt에 도달했어요. 활동은 저장되지만 포인트는 추가되지 않아요.')
      return 0
    }
    setPointsLog((prev) => [...prev, { id: crypto.randomUUID(), date: today, points: cappedPoints, reason }])
    return cappedPoints
  }

  function submitObservation(event) {
    event.preventDefault()
    if (!hasEnoughText(observationForm.detail, 5)) {
      setToast('상세 내용을 5글자 이상 적어야 관찰 기록을 등록할 수 있어요.')
      return
    }

    const sameGroup = observations.find(
      (item) =>
        item.building === observationForm.building &&
        item.floor === observationForm.floor &&
        item.space === observationForm.space &&
        item.problemType === observationForm.problemType &&
        isWithinDays(item.createdAt, 30)
    )
    const basePoints = sameGroup ? 2 : 5
    const earned = addPoints(basePoints, sameGroup ? '중복 위치 공감/보완' : '학교 환경 관찰 기록')
    const trimmedDetail = observationForm.detail.trim()
    const newItem = {
      id: crypto.randomUUID(),
      ...observationForm,
      detail: trimmedDetail,
      points: earned,
      status: sameGroup ? '기존 기록에 공감으로 묶임' : '공감 모으는 중',
      createdAt: new Date().toISOString(),
      empathy: sameGroup ? 1 : 0,
    }
    setObservations((prev) => [newItem, ...prev])
    setSuggestionForm((prev) => ({
      ...prev,
      location: `${observationForm.building} ${observationForm.floor} ${observationForm.space}`,
      problem: trimmedDetail,
    }))
    setObservationForm((prev) => ({ ...prev, detail: '' }))
    setToast(sameGroup ? `비슷한 기록이 있어 공감/보완으로 묶었어요. +${earned}pt` : `관찰 기록이 등록됐어요. 바로 아래에서 개선 제안으로 이어갈 수 있어요. +${earned}pt`)
  }

  function submitSuggestion(event) {
    event.preventDefault()
    const missingFields = getMissingSuggestionFields(suggestionForm)
    if (missingFields.length > 0) {
      setToast(`다음 항목을 조금 더 구체적으로 적어야 해요: ${missingFields.join(', ')}`)
      return
    }
    const earned = addPoints(10, '구조화된 개선 제안 작성')
    setSuggestions((prev) => [
      {
        id: crypto.randomUUID(),
        ...suggestionForm,
        location: suggestionForm.location.trim(),
        problem: suggestionForm.problem.trim(),
        reason: suggestionForm.reason.trim(),
        solution: suggestionForm.solution.trim(),
        beneficiary: suggestionForm.beneficiary.trim(),
        energyLink: suggestionForm.energyLink.trim(),
        status: '학생자치 1차 검토 대기',
        votes: 0,
        points: earned,
      },
      ...prev,
    ])
    setSuggestionForm({ location: '', problem: '', reason: '', solution: '', beneficiary: '', energyLink: '' })
    setToast(`개선 제안이 등록됐어요. +${earned}pt`)
  }

  function voteSuggestion(id) {
    const alreadyVoted = pointsLog.filter((item) => item.date === todayKey() && item.reason === '친구 제안 공감').length
    if (alreadyVoted >= 3) {
      setToast('공감 투표 포인트는 하루 3회까지만 받을 수 있어요.')
      return
    }
    const earned = addPoints(1, '친구 제안 공감')
    setSuggestions((prev) => prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item)))
    setToast(`공감이 반영됐어요. +${earned}pt`)
  }

  function selectCostume(costume) {
    const isUnlocked = totalPoints >= costume.requiredPoints
    if (!isUnlocked) {
      setToast(`${costume.name}은 누적 ${costume.requiredPoints}pt부터 사용할 수 있어요.`)
      return
    }
    setSelectedCostumeId(costume.id)
    setToast(`${costume.name}으로 변경했어요.`)
    setTab('home')
  }

  function resetDemo() {
    window.localStorage.clear()
    setObservations(INITIAL_OBSERVATIONS)
    setSuggestions(INITIAL_SUGGESTIONS)
    setPointsLog([])
    setSelectedCostumeId('basic')
    setSelectedSchoolName(DEFAULT_SCHOOL.name)
    setSelectedMonth(1)
    setDailyMission(getRandomItem(MANAGER_MISSIONS))
    setEnergyTip(getRandomItem(ENERGY_TIPS))
    setToast('데모 데이터가 초기화됐어요.')
  }

  return (
    <main className="app-shell" onClickCapture={() => toast && setToast('')}>
      <section className="hero-card">
        <div>
          <p className="eyebrow">카카오 테크포임팩트리빙랩 단국대학교 기후보호대</p>
          <label className="school-picker" aria-label="학교 선택">
            <select value={selectedSchoolName} onChange={(event) => setSelectedSchoolName(event.target.value)}>
              {SCHOOL_OPTIONS.map((schoolName) => (
                <option key={schoolName} value={schoolName}>
                  {schoolName}
                </option>
              ))}
            </select>
          </label>
          <h1>우리 학교 기후환경 매니저</h1>
          <p className="hero-copy">우리의 제안 한 건 한 건이 더 나은 학교생활을 만듭니다.</p>
        </div>
        <div className="mascot-card" aria-label="조아용 캐릭터 영역">
          <button className="gear-button" type="button" aria-label="조아용 상점 열기" onClick={(event) => { event.stopPropagation(); setToast(''); setTab('closet') }}>
            <svg className="shop-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7 10.5 9.4 4.8a2 2 0 0 1 1.9-1.2h1.4a2 2 0 0 1 1.9 1.2l2.4 5.7" />
              <path d="M5.4 9.8h13.2a1.8 1.8 0 0 1 1.8 2.1l-1 6.4a2.4 2.4 0 0 1-2.4 2H7a2.4 2.4 0 0 1-2.4-2l-1-6.4a1.8 1.8 0 0 1 1.8-2.1Z" />
              <path d="M8 13.2v4.4" />
              <path d="M12 13.2v4.4" />
              <path d="M16 13.2v4.4" />
            </svg>
          </button>
          <JoayongMascot costume={selectedCostume} large />
          <strong>{selectedCostume.name}</strong>
          <span>기후환경 레벨 {climateLevel}</span>
          <span>관찰 {observations.length}건 · 제안 {suggestions.length}건</span>
        </div>
      </section>

      <nav className="tab-nav" aria-label="주요 화면 이동">
        {[
          ['home', '홈'],
          ['energy', '에너지 카드'],
          ['record', '기록·제안'],
          ['points', '포인트'],
        ].map(([key, label]) => (
          <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      {toast && <div className="toast">{toast}</div>}

      {tab === 'home' && (
        <section className="grid two">
          <article className="card highlight">
            <p className="eyebrow">오늘의 매니저 미션</p>
            <h2>{dailyMission.title}</h2>
            <p>{dailyMission.description}</p>
            <button onClick={() => setTab('record')}>관찰 기록하러 가기</button>
          </article>
          <article className="card">
            <p className="eyebrow">이번 달 개선 제안 TOP</p>
            {suggestions.slice(0, 3).map((item) => (
              <div className="list-row" key={item.id}>
                <span>{item.location}</span>
                <strong>{item.votes} 공감</strong>
              </div>
            ))}
          </article>
          <article className="card">
            <p className="eyebrow">내 누적 포인트</p>
            <h2>{totalPoints} pt</h2>
            <p>오늘 획득 {dailyPoints}/30pt · 누적 포인트로 조아용 테마를 모으고, 모의 기부에도 참여할 수 있어요.</p>
          </article>
          <article className="card">
            <p className="eyebrow">이번 달 우리 반 목표</p>
            <ul className="plain-list">
              <li>우리 반 관찰 기록 30건 모으기</li>
            </ul>
            <p className="muted-text">팀 회의 후 목표를 더 추가할 수 있어요.</p>
          </article>
        </section>
      )}

      {tab === 'energy' && (
        <section className="grid two">
          <article className="card big-number">
            <div className="energy-card-header">
              <p className="eyebrow">우리 학교 에너지 카드</p>
              <label className="month-picker" aria-label="월 선택">
                <select value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))}>
                  {MONTH_OPTIONS.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <h2>{selectedSchool.carbonText}</h2>
            <p>
              이 숫자는 학교 건물 1㎡를 1년 동안 사용하는 과정에서 나온 탄소의 양을 뜻해요. 전기와 난방, 냉방 사용이 많아지면 이 숫자가 커질 수 있어요. 우리 학교의 에너지 사용을 이해하는 참고 자료로 봐 주세요.
            </p>
          </article>
          <article className="card">
            <p className="eyebrow">우리 학교의 에너지 효율</p>
            <h2>{selectedSchool.efficiencyTier}</h2>
            <p>{selectedSchool.tierMessage}</p>
            <p className="note-text">이 카드는 성적표가 아니에요. 우리 학교를 더 잘 이해하고, 어떤 공간을 살펴보면 좋을지 정하는 자료예요.</p>
          </article>
          <article className="card">
            <p className="eyebrow">올해의 관찰 질문</p>
            <ul className="plain-list">
              <li>오후에 유난히 더운 공간은 어디일까?</li>
              <li>블라인드, 창문, 단열 상태 때문에 냉방 효율이 떨어지는 곳은 어디일까?</li>
              <li>빈 교실 조명이나 모니터가 켜져 있는 공간은 어디일까?</li>
            </ul>
          </article>
          <article className="card soft">
            <p className="eyebrow">오늘의 에너지 절약 팁</p>
            <h2>{energyTip.title}</h2>
            <p>{energyTip.description}</p>
            <small>데모에서는 새로고침할 때마다 바뀌고, 실제 배포에서는 24시간마다 바뀌도록 설정할 예정이에요.</small>
          </article>
        </section>
      )}

      {tab === 'record' && (
        <section className="grid two">
          <article className="card">
            <p className="eyebrow">1단계 · 공간 문제 기록</p>
            <h2>먼저 어디에 어떤 문제가 있는지 남겨요</h2>
            <form className="form" onSubmit={submitObservation}>
              <label>건물<select value={observationForm.building} onChange={(e) => setObservationForm({ ...observationForm, building: e.target.value })}>{BUILDINGS.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>층<select value={observationForm.floor} onChange={(e) => setObservationForm({ ...observationForm, floor: e.target.value })}>{FLOORS.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>공간<select value={observationForm.space} onChange={(e) => setObservationForm({ ...observationForm, space: e.target.value })}>{SPACES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>문제 유형<select value={observationForm.problemType} onChange={(e) => setObservationForm({ ...observationForm, problemType: e.target.value })}>{PROBLEM_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="full">상세 내용<textarea required minLength={5} placeholder="예: 오후 2시쯤 창가가 너무 더워요." value={observationForm.detail} onChange={(e) => setObservationForm({ ...observationForm, detail: e.target.value })} /></label>
              <button type="submit">관찰 기록 등록</button>
            </form>
          </article>
          <article className="card">
            <p className="eyebrow">2단계 · 개선 제안으로 이어가기</p>
            <h2>문제 발견 → 원인 생각 → 해결 제안</h2>
            <form className="form single" onSubmit={submitSuggestion}>
              <label>어디에서 발견했나요?<input required minLength={3} value={suggestionForm.location} onChange={(e) => setSuggestionForm({ ...suggestionForm, location: e.target.value })} placeholder="예: 본관 3층 복도 창가" /></label>
              <label>어떤 문제가 있나요?<textarea required minLength={5} value={suggestionForm.problem} onChange={(e) => setSuggestionForm({ ...suggestionForm, problem: e.target.value })} /></label>
              <label>왜 문제가 된다고 생각하나요?<textarea required minLength={5} value={suggestionForm.reason} onChange={(e) => setSuggestionForm({ ...suggestionForm, reason: e.target.value })} /></label>
              <label>어떻게 바꾸면 좋을까요?<textarea required minLength={5} value={suggestionForm.solution} onChange={(e) => setSuggestionForm({ ...suggestionForm, solution: e.target.value })} /></label>
              <label>누구에게 도움이 될까요?<input required minLength={3} value={suggestionForm.beneficiary} onChange={(e) => setSuggestionForm({ ...suggestionForm, beneficiary: e.target.value })} /></label>
              <label>에너지와 어떤 관련이 있나요?<input required minLength={5} value={suggestionForm.energyLink} onChange={(e) => setSuggestionForm({ ...suggestionForm, energyLink: e.target.value })} /></label>
              <button type="submit">개선 제안 등록</button>
            </form>
          </article>
          <article className="card">
            <p className="eyebrow">최근 관찰 기록</p>
            <div className="scroll-list compact-list">
              {observations.map((item) => (
                <div className="issue-card" key={item.id}>
                  <div><strong>{item.problemType}</strong><span>{item.building} · {item.floor} · {item.space}</span></div>
                  <p>{item.detail}</p>
                  <small>{item.status} · +{item.points}pt</small>
                </div>
              ))}
            </div>
          </article>
          <article className="card">
            <p className="eyebrow">제안 목록</p>
            <div className="scroll-list compact-list">
              {suggestions.map((item) => (
                <div className="issue-card" key={item.id}>
                  <div><strong>{item.location}</strong><span>{item.status}</span></div>
                  <p>{item.solution}</p>
                  <small>{item.energyLink}</small>
                  <button className="ghost" onClick={() => voteSuggestion(item.id)}>공감 {item.votes}</button>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {tab === 'points' && (
        <section className="grid two">
          <article className="card big-number">
            <p className="eyebrow">개인 누적 포인트</p>
            <h2>{totalPoints} pt</h2>
            <p>하루에 받을 수 있는 포인트는 최대 30pt예요. 누적 포인트는 조아용 테마와 모의 기부 활동에 사용할 수 있어요.</p>
            <button onClick={() => setToast('시범 단계에서는 실제 기부가 아니라 모의 기부 리포트로 표시합니다.')}>50pt 모의 기부하기</button>
          </article>
          <article className="card">
            <p className="eyebrow">기후환경 레벨 보상</p>
            <h2>현재 레벨 {climateLevel}</h2>
            <p>관찰 기록과 개선 제안을 쌓으면 기후환경 레벨이 올라가고, 누적 포인트 기준에 따라 조아용 테마가 하나씩 열려요.</p>
            <div className="progress"><span style={{ width: `${rewardProgress}%` }} /></div>
            <p className="note-text">
              {totalPoints >= 60 ? '현재 데모 기준의 조아용 테마를 모두 열었어요.' : `다음 보상: 누적 ${nextReward.requiredPoints}pt 달성 시 ${nextReward.name}`}
            </p>
          </article>
          <article className="card">
            <p className="eyebrow">포인트 내역</p>
            {pointsLog.length === 0 ? <p>아직 획득한 포인트가 없어요.</p> : pointsLog.slice().reverse().map((item) => (
              <div className="list-row" key={item.id}><span>{item.reason}</span><strong>+{item.points}pt</strong></div>
            ))}
          </article>
          <article className="card soft">
            <p className="eyebrow">데모 관리</p>
            <p>멘토님께 화면을 보여준 뒤 초기 상태로 되돌릴 수 있어요.</p>
            <button className="ghost" onClick={resetDemo}>데모 초기화</button>
          </article>
        </section>
      )}

      {tab === 'closet' && (
        <section className="grid two">
          <article className="card highlight closet-preview">
            <p className="eyebrow">조아용 꾸미기</p>
            <h2>{selectedCostume.name}</h2>
            <JoayongMascot costume={selectedCostume} large />
            <p>{selectedCostume.description}</p>
            <button onClick={() => setTab('home')}>홈으로 돌아가기</button>
          </article>
          <article className="card">
            <p className="eyebrow">내가 모은 테마</p>
            <div className="costume-grid">
              {COSTUMES.map((costume) => {
                const isUnlocked = totalPoints >= costume.requiredPoints
                const isSelected = costume.id === selectedCostumeId
                return (
                  <button
                    type="button"
                    key={costume.id}
                    className={`costume-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                    onClick={() => selectCostume(costume)}
                  >
                    <JoayongMascot costume={costume} compact />
                    <strong>{costume.name}</strong>
                    <span>{isUnlocked ? `레벨 ${costume.level} 보상 보유 중` : `누적 ${costume.requiredPoints}pt 필요`}</span>
                  </button>
                )
              })}
            </div>
          </article>
        </section>
      )}

      <footer className="site-footer">
        <img src="/yongin-city-logo.svg" alt="용인시" />
      </footer>
    </main>
  )
}
