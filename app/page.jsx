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

const SCHOOL_CARBON_BY_MONTH = {
  대지중학교: {
    1: 30.31,
    2: 20.47,
    3: 21.8,
    4: 20.34,
    5: 15.53,
    6: 15.55,
    7: 18.66,
    8: 12.69,
    9: 23.09,
    10: 16.96,
    11: 12.94,
    12: 20.83,
  },
  용인대덕중학교: {
    1: 30.61,
    2: 13.77,
    3: 16.04,
    4: 19.2,
    5: 13.71,
    6: 14.45,
    7: 17.39,
    8: 11.42,
    9: 19.42,
    10: 14.83,
    11: 13.54,
    12: 19.74,
  },
  죽전중학교: {
    1: 33.01,
    2: 15.76,
    3: 18.05,
    4: 20.99,
    5: 12.79,
    6: 13.72,
    7: 18.58,
    8: 12.73,
    9: 21.61,
    10: 14.46,
    11: 12.94,
    12: 20.58,
  },
  현암중학교: {
    1: 30.94,
    2: 19.61,
    3: 19.97,
    4: 21.03,
    5: 12.85,
    6: 13.47,
    7: 21.82,
    8: 12.77,
    9: 18.48,
    10: 13.71,
    11: 14.48,
    12: 22.76,
  },
  문정중학교: {
    1: 27.85,
    2: 17.69,
    3: 18.15,
    4: 18.98,
    5: 11.27,
    6: 10.71,
    7: 14.86,
    8: 11.2,
    9: 17.55,
    10: 12,
    11: 10.18,
    12: 17.54,
  },
  수지중학교: {
    1: 45.55,
    2: 21.92,
    3: 24.33,
    4: 26.49,
    5: 18.91,
    6: 17.19,
    7: 24.58,
    8: 15.47,
    9: 29.43,
    10: 20.87,
    11: 17.73,
    12: 27.19,
  },
  이현중학교: {
    1: 44.74,
    2: 22.35,
    3: 25.67,
    4: 30,
    5: 19.36,
    6: 21.22,
    7: 26.57,
    8: 18.41,
    9: 31.33,
    10: 23.9,
    11: 17.52,
    12: 28.32,
  },
  정평중학교: {
    1: 41.3,
    2: 21.57,
    3: 26.28,
    4: 24.99,
    5: 15.7,
    6: 19.3,
    7: 26.75,
    8: 16.78,
    9: 29.68,
    10: 23.17,
    11: 18.74,
    12: 26.56,
  },
  상현중학교: {
    1: 37.2,
    2: 22.32,
    3: 21.35,
    4: 24.12,
    5: 16.21,
    6: 18.32,
    7: 21.71,
    8: 11.5,
    9: 16.78,
    10: 17.3,
    11: 15.95,
    12: 25.18,
  },
  서원중학교: {
    1: 36.04,
    2: 18.92,
    3: 23.97,
    4: 26.86,
    5: 18.54,
    6: 20.87,
    7: 27.81,
    8: 16.01,
    9: 31.12,
    10: 21.86,
    11: 19.34,
    12: 28.52,
  },
  성복중학교: {
    1: 42.86,
    2: 17.77,
    3: 24.7,
    4: 25.59,
    5: 18.45,
    6: 23.41,
    7: 27.82,
    8: 19.53,
    9: 30.67,
    10: 22.36,
    11: 19.37,
    12: 26.92,
  },
  손곡중학교: {
    1: 28.44,
    2: 17.03,
    3: 17.84,
    4: 17.5,
    5: 13.64,
    6: 21.43,
    7: 15.07,
    8: 11.02,
    9: 17.87,
    10: 13.73,
    11: 12.52,
    12: 17.85,
  },
  용인한빛중학교: {
    1: 40.2,
    2: 44.28,
    3: 35.23,
    4: 24.9,
    5: 19.12,
    6: 16.18,
    7: 19.5,
    8: 17.24,
    9: 23.84,
    10: 18.37,
    11: 15.02,
    12: 25.24,
  },
  신봉중학교: {
    1: 33.75,
    2: 20.58,
    3: 20.64,
    4: 18.8,
    5: 12.92,
    6: 13.09,
    7: 15.14,
    8: 11.78,
    9: 16.26,
    10: 13.55,
    11: 12.52,
    12: 19.78,
  },
  홍천중학교: {
    1: 34.99,
    2: 18.64,
    3: 27.85,
    4: 25.9,
    5: 18.78,
    6: 18.35,
    7: 21.35,
    8: 16.62,
    9: 28.04,
    10: 19.06,
    11: 15.72,
    12: 25.33,
  },
}

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

const ENERGY_CARD_SECTIONS = [
  {
    title: '전기 사용량은 학교생활의 흔적이에요',
    items: [
      '오늘 우리 학교가 사용한 전기는 학교가 하루 동안 활동한 흔적이에요.',
      '전기 사용량은 단순한 숫자가 아니라, 조명, 냉난방, 전자기기 사용이 모인 결과예요.',
      '같은 학교라도 날씨, 시간표, 행사 여부에 따라 에너지 사용량은 달라질 수 있어요.',
      '에너지 사용량을 관찰하면 우리 학교의 생활 패턴도 함께 볼 수 있어요.',
    ],
  },
  {
    title: '탄소발자국과도 연결돼요',
    items: [
      '전기를 만드는 과정에서는 온실가스가 발생할 수 있어요. 그래서 전기를 아끼는 것은 탄소발자국을 줄이는 행동과 연결돼요.',
      '탄소발자국은 우리가 생활하면서 환경에 남기는 흔적이라고 생각할 수 있어요.',
      '조명 하나를 끄는 작은 행동도, 모이면 학교 전체의 탄소발자국을 줄이는 데 도움이 돼요.',
      '우리 학교의 전기 사용량을 줄이면 발전 과정에서 생기는 온실가스 배출도 줄이는 데 도움이 돼요.',
    ],
  },
  {
    title: '숫자를 보고 학교 안에서 찾아봐요',
    items: [
      '전기를 많이 쓴 날에는 어떤 공간에서 에너지가 많이 필요했는지 살펴볼 수 있어요.',
      '오늘은 숫자를 보는 것에서 끝나지 말고, 왜 이런 사용량이 나왔는지 학교 안에서 직접 찾아보세요.',
      '에너지 사용량이 높게 나온 날에는 날씨, 냉난방, 특별실 사용 여부를 함께 생각해보세요.',
      '에너지를 절약하는 가장 좋은 방법은 먼저 낭비되는 곳을 발견하는 거예요.',
    ],
  },
  {
    title: '작은 변화도 의미가 있어요',
    items: [
      '전기 사용량이 줄었다면, 우리 학교가 에너지를 더 효율적으로 사용했다는 신호일 수 있어요.',
      '오늘 줄인 전기 사용량은 우리 학교의 탄소발자국을 줄이는 작은 시작이 될 수 있어요.',
      '작은 변화라도 꾸준히 이어지면 학교의 에너지 습관이 달라질 수 있어요.',
      '우리 학교가 만든 변화는 숫자로 확인할 수 있는 환경 실천이에요.',
    ],
  },
]

const OBSERVATION_QUESTION_GROUPS = [
  {
    title: '교실 관찰형',
    questions: [
      '우리 반에서 가장 자주 불이 켜져 있는 시간대는 언제일까?',
      '수업이 끝난 뒤에도 조명이나 전자기기가 켜져 있는 교실은 어디일까?',
      '창가 자리와 복도 쪽 자리의 체감 온도는 얼마나 다를까?',
      '햇빛이 많이 들어오는 교실은 냉방을 더 많이 사용하게 될까?',
      '같은 층에서도 유난히 덥거나 추운 교실은 어디일까?',
      '에어컨을 켰을 때 창문이나 문이 열려 있는 교실은 없을까?',
      '쉬는 시간마다 교실 문을 열어두면 냉방 효율은 어떻게 달라질까?',
      '교실 안에서 전기를 가장 많이 쓰는 물건은 무엇일까?',
      '우리 반에서 하루 동안 가장 오래 켜져 있는 전자기기는 무엇일까?',
      '빈 교실인데도 멀티탭 전원이 켜져 있는 곳은 없을까?',
    ],
  },
  {
    title: '학교 공간 관찰형',
    questions: [
      '복도 조명은 자연광이 충분할 때도 계속 켜져 있을까?',
      '화장실 조명은 사람이 없을 때도 켜져 있는 시간이 많을까?',
      '도서관, 컴퓨터실, 과학실 중 전자기기를 가장 많이 사용하는 공간은 어디일까?',
      '급식실은 하루 중 언제 에너지를 가장 많이 사용할까?',
      '체육관은 조명과 냉난방을 언제 가장 많이 사용할까?',
      '특별실은 사용하지 않는 시간에도 전원이 켜져 있는 경우가 있을까?',
      '학교에서 냉방이 가장 오래 필요한 공간은 어디일까?',
      '햇빛이 잘 드는 공간과 그늘진 공간의 에너지 사용 방식은 어떻게 다를까?',
      '계단, 복도, 현관처럼 공용 공간의 조명은 꼭 필요한 만큼만 사용되고 있을까?',
      '우리 학교에서 에너지 낭비가 가장 쉽게 생기는 장소는 어디일까?',
    ],
  },
  {
    title: '계절과 날씨 연결형',
    questions: [
      '비 오는 날과 맑은 날의 전기 사용량은 어떻게 다를까?',
      '미세먼지가 심한 날에는 환기와 냉난방 사용이 어떻게 달라질까?',
      '여름철 오후에 전기 사용량이 늘어나는 이유는 무엇일까?',
      '겨울철 아침에 난방 에너지가 많이 필요한 공간은 어디일까?',
      '일교차가 큰 날에는 냉난방 사용이 어떻게 달라질까?',
      '바람이 잘 통하는 교실은 냉방을 덜 사용해도 괜찮을까?',
      '햇빛이 강한 날 블라인드 사용 여부에 따라 실내 온도는 달라질까?',
      '장마철에는 습도 때문에 냉방 사용이 늘어날까?',
      '시험 기간에는 학교의 전기 사용 패턴이 달라질까?',
      '방학 중 학교의 에너지 사용량은 학기 중과 어떻게 다를까?',
    ],
  },
  {
    title: '탄소발자국 생각형',
    questions: [
      '우리가 줄인 전기 사용량은 탄소발자국을 얼마나 줄이는 데 도움이 될까?',
      '오늘 우리 학교의 전기 사용량은 어제보다 늘었을까, 줄었을까?',
      '전기 사용량이 줄어들면 학교의 탄소배출도 함께 줄어들까?',
      '에너지를 아끼는 행동 중 학생들이 가장 쉽게 실천할 수 있는 것은 무엇일까?',
      '작은 절약 행동이 모이면 학교 전체에서는 어떤 변화가 생길까?',
      '우리 학교가 에너지 사용량을 줄이면 어떤 환경적 의미가 있을까?',
      '전기를 덜 쓰는 교실은 어떤 공통점을 가지고 있을까?',
      '에너지 절약을 잘하는 반은 어떤 습관을 가지고 있을까?',
      '우리 학교의 에너지 사용량을 줄이기 위해 가장 먼저 바꿀 수 있는 습관은 무엇일까?',
      '불편하지 않게 아끼는 방법에는 어떤 것들이 있을까?',
    ],
  },
]

const ENERGY_TIPS = [
  ['빈 교실 조명부터 확인하기', '쉬는 시간이나 이동 수업 전에 비어 있는 교실의 조명과 모니터가 꺼져 있는지 살펴봐요.'],
  ['블라인드로 햇빛 조절하기', '오후에 햇빛이 강한 창가는 블라인드를 활용하면 냉방 부담을 줄이는 데 도움이 돼요.'],
  ['창문과 출입문 닫힘 상태 확인하기', '냉난방 중에는 창문이나 출입문이 계속 열려 있지 않은지 확인해요.'],
  ['수도꼭지 물샘 바로 기록하기', '수도꼭지에서 물이 조금씩 새는 곳을 발견하면 기록해서 빠르게 고칠 수 있게 해요.'],
  ['자연광을 쓸 수 있는 시간 찾기', '햇빛이 충분한 시간에는 불필요한 조명을 줄일 수 있는 공간이 있는지 관찰해요.'],
  ['숫자에서 이유 찾기', '오늘은 숫자를 보는 것에서 끝나지 말고, 왜 이런 사용량이 나왔는지 학교 안에서 직접 찾아보세요.'],
  ['높은 사용량 살펴보기', '에너지 사용량이 높게 나온 날에는 날씨, 냉난방, 특별실 사용 여부를 함께 생각해보세요.'],
  ['우리 반 습관 바꾸기', '우리 반의 작은 습관이 학교 전체 에너지 그래프를 바꿀 수 있어요.'],
  ['낭비되는 곳 발견하기', '에너지를 절약하는 가장 좋은 방법은 먼저 낭비되는 곳을 발견하는 거예요.'],
  ['관찰을 행동으로 잇기', '오늘의 관찰이 내일의 절약 행동으로 이어질 수 있어요.'],
  ['우리 공간의 문제로 보기', '학교의 에너지 문제는 어른들만의 일이 아니라, 우리가 매일 생활하는 공간의 문제이기도 해요.'],
  ['어제보다 줄었다면', '어제보다 전기 사용량이 줄었다면, 우리 학교가 에너지를 더 효율적으로 사용한 하루였을 수 있어요.'],
  ['작은 변화 이어가기', '작은 변화라도 꾸준히 이어지면 학교의 에너지 습관이 달라질 수 있어요.'],
  ['절약을 쌓아가기', '오늘의 절약은 작아 보여도, 계속 쌓이면 의미 있는 변화가 돼요.'],
  ['숫자로 보는 실천', '우리 학교가 만든 변화는 숫자로 확인할 수 있는 환경 실천이에요.'],
  ['매일의 선택 기억하기', '에너지 절약은 거창한 일이 아니라, 매일 반복되는 작은 선택에서 시작돼요.'],
  ['탄소발자국 줄이기', '전기를 아끼는 것은 전기요금을 줄이는 것뿐 아니라, 지구에 남기는 부담을 줄이는 일이에요.'],
  ['조명 하나부터 시작하기', '조명 하나를 끄는 작은 행동도, 모이면 학교 전체의 탄소발자국을 줄이는 데 도움이 돼요.'],
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

function getStudentStorageId() {
  if (typeof window === 'undefined') return 'guest'
  const profile = loadFromStorage('studentProfile', null)
  if (!profile) return 'guest'
  return [profile.schoolName, profile.grade, profile.classNumber, profile.studentNumber, profile.studentName]
    .filter(Boolean)
    .join('-') || 'guest'
}

function getStoredDailyEnergyTip() {
  if (typeof window === 'undefined') return ENERGY_TIPS[0]
  const storageKey = 'dailyEnergyTip'
  const stored = loadFromStorage(storageKey, null)
  if (stored?.savedAt && stored?.tip && Date.now() - stored.savedAt < 24 * 60 * 60 * 1000) {
    return stored.tip
  }
  const tip = getRandomItem(ENERGY_TIPS)
  saveToStorage(storageKey, { savedAt: Date.now(), tip })
  return tip
}

function getStoredYearlyObservationQuestions() {
  const fallbackQuestions = OBSERVATION_QUESTION_GROUPS.map(({ title, questions }) => ({
    title,
    question: questions[0],
  }))
  if (typeof window === 'undefined') return fallbackQuestions

  const year = new Date().getFullYear()
  const storageKey = `yearlyObservationQuestions:${year}:${getStudentStorageId()}`
  const stored = loadFromStorage(storageKey, null)
  if (Array.isArray(stored) && stored.length === OBSERVATION_QUESTION_GROUPS.length) {
    return stored
  }

  const questionsForYear = OBSERVATION_QUESTION_GROUPS.map(({ title, questions }) => ({
    title,
    question: getRandomItem(questions),
  }))
  saveToStorage(storageKey, questionsForYear)
  return questionsForYear
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

function formatCarbonText(value) {
  return typeof value === 'number' ? `${value.toFixed(2)} tonCO₂-eq/m²` : DEFAULT_SCHOOL.carbonText
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

function MonthlyCarbonChart({ valuesByMonth, selectedMonth }) {
  const chartValues = MONTH_OPTIONS.map((month) => ({
    month,
    value: valuesByMonth?.[month] || 0,
  }))
  const values = chartValues.map((item) => item.value)
  const maxValue = Math.max(...values, 40)
  const yMax = Math.ceil(maxValue / 10) * 10
  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  const width = 1100
  const height = 318
  const visualMargin = 38
  const left = 68
  const graphRightMargin = 0
  const top = 28
  const bottom = 66
  const barWidth = 30
  const plotHeight = height - top - bottom
  const averageBadgeWidth = 70
  const averageBadgeGap = 4
  const plotRight = width - graphRightMargin - averageBadgeWidth - averageBadgeGap
  const plotWidth = plotRight - left
  const step = plotWidth / chartValues.length
  const averageBadgeX = plotRight + averageBadgeGap
  const y = (value) => top + plotHeight - (value / yMax) * plotHeight
  const x = (index) => left + step * index + step / 2
  const averageY = y(average)
  const points = chartValues.map((item, index) => `${x(index)},${y(item.value)}`).join(' ')
  const ticks = [0, 10, 20, 30, 40].filter((tick) => tick <= yMax)

  return (
    <section className="carbon-chart-panel" aria-label="상현중학교 월별 탄소배출량 그래프">
      <div className="carbon-chart-header">
        <strong>월별 흐름</strong>
        <span>단위: tonCO₂-eq/m²</span>
      </div>
      <svg className="carbon-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${selectedMonth}월 탄소배출량 강조 그래프`}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={left} y1={y(tick)} x2={plotRight} y2={y(tick)} className="carbon-grid-line" />
            <text x={left - 12} y={y(tick) + 5} textAnchor="end" className="carbon-axis-label">
              {tick}
            </text>
          </g>
        ))}
        <line x1={left} y1={top} x2={left} y2={top + plotHeight} className="carbon-axis-line" />
        <line x1={left} y1={top + plotHeight} x2={plotRight} y2={top + plotHeight} className="carbon-axis-line" />
        <line x1={left} y1={averageY} x2={averageBadgeX + averageBadgeWidth} y2={averageY} className="carbon-average-line" />
        <rect x={averageBadgeX} y={averageY - 14} width={averageBadgeWidth} height="28" rx="14" className="carbon-average-badge" />
        <text x={averageBadgeX + averageBadgeWidth / 2} y={averageY + 5} textAnchor="middle" className="carbon-average-text">
          평균 {average.toFixed(2)}
        </text>
        {chartValues.map((item, index) => {
          const isSelected = item.month === selectedMonth
          const barHeight = top + plotHeight - y(item.value)
          return (
            <g key={item.month}>
              <rect
                x={x(index) - barWidth / 2}
                y={y(item.value)}
                width={barWidth}
                height={barHeight}
                rx="8"
                className={isSelected ? 'carbon-bar selected' : 'carbon-bar'}
              />
              <text x={x(index)} y={top + plotHeight + 25} textAnchor="middle" className={isSelected ? 'carbon-value selected' : 'carbon-value'}>
                {item.value.toFixed(2)}
              </text>
              <text x={x(index)} y={top + plotHeight + 49} textAnchor="middle" className={isSelected ? 'carbon-month selected' : 'carbon-month'}>
                {item.month}월
              </text>
            </g>
          )
        })}
        <polyline points={points} className="carbon-trend-line" />
        {chartValues.map((item, index) => (
          <circle
            key={`point-${item.month}`}
            cx={x(index)}
            cy={y(item.value)}
            r={item.month === selectedMonth ? 5.5 : 4.7}
            className={item.month === selectedMonth ? 'carbon-point selected' : 'carbon-point'}
          />
        ))}
      </svg>
    </section>
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
  const [yearlyObservationQuestions, setYearlyObservationQuestions] = useState(() =>
    OBSERVATION_QUESTION_GROUPS.map(({ title, questions }) => ({ title, question: questions[0] }))
  )
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
    setEnergyTip(getStoredDailyEnergyTip())
    setYearlyObservationQuestions(getStoredYearlyObservationQuestions())
  }, [])

  useEffect(() => saveToStorage('observations', observations), [observations])
  useEffect(() => saveToStorage('suggestions', suggestions), [suggestions])
  useEffect(() => saveToStorage('pointsLog', pointsLog), [pointsLog])
  useEffect(() => saveToStorage('selectedCostumeId', selectedCostumeId), [selectedCostumeId])
  useEffect(() => saveToStorage('selectedSchoolName', selectedSchoolName), [selectedSchoolName])
  useEffect(() => saveToStorage('selectedMonth', selectedMonth), [selectedMonth])

  const dailyPoints = useMemo(() => getDailyPoints(pointsLog), [pointsLog])
  const totalPoints = useMemo(() => pointsLog.reduce((sum, item) => sum + item.points, 0), [pointsLog])
  const selectedSchool = useMemo(() => {
    const carbonValue = SCHOOL_CARBON_BY_MONTH[selectedSchoolName]?.[selectedMonth]
    return {
      ...DEFAULT_SCHOOL,
      name: selectedSchoolName,
      carbonText: formatCarbonText(carbonValue),
    }
  }, [selectedMonth, selectedSchoolName])
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
    setEnergyTip(getStoredDailyEnergyTip())
    setYearlyObservationQuestions(getStoredYearlyObservationQuestions())
    setToast('데모 데이터가 초기화됐어요.')
  }

  return (
    <main className="app-shell" onClickCapture={() => toast && setToast('')}>
      <section className="hero-card">
        <div>
          <p className="eyebrow">카카오 테크포임팩트리빙랩 단국대학교 기후보호대</p>
          <p className="selected-school-badge">{selectedSchool.name}</p>
          <h1>우리 학교 기후환경 매니저</h1>
          <p className="hero-copy">우리의 제안 한 건 한 건이 더 나은 학교생활을 만듭니다.</p>
        </div>
        <div className="mascot-card" aria-label="조아용 캐릭터 영역">
          <button className="gear-button" type="button" aria-label="조아용 설정 열기" onClick={(event) => { event.stopPropagation(); setToast(''); setTab('closet') }}>
            <svg className="gear-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.3a2 2 0 0 1-4 0V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2.7a2 2 0 0 1 0-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.3a2 2 0 0 1 4 0V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.3a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
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
        <section className="grid two energy-layout">
          <article className="card big-number energy-feature">
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
            <h2 className="carbon-metric">{selectedSchool.carbonText}</h2>
            <div className="energy-explainer">
              <p className="energy-lead">
                이 숫자는 {selectedMonth}월에 학교 건물 1㎡를 사용하는 과정에서 나온 탄소의 양을 뜻해요. 전기와 난방, 냉방 사용이 많아지면 이 숫자가 커질 수 있어요. 우리 학교의 에너지 사용을 이해하는 참고 자료로 봐 주세요.
              </p>
              <MonthlyCarbonChart valuesByMonth={SCHOOL_CARBON_BY_MONTH[selectedSchoolName]} selectedMonth={selectedMonth} />
              <div className="energy-explainer-grid">
                {ENERGY_CARD_SECTIONS
                  .filter((section) => !['탄소발자국과도 연결돼요', '작은 변화도 의미가 있어요'].includes(section.title))
                  .map((section) => (
                    <div className="energy-explainer-group" key={section.title}>
                      <h3>{section.title}</h3>
                      <ul>
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </article>
          <article className="card energy-feature">
            <p className="eyebrow">우리 학교의 에너지 효율</p>
            <h2>{selectedSchool.efficiencyTier}</h2>
            <p>{selectedSchool.tierMessage}</p>
            <p className="note-text">이 카드는 성적표가 아니에요. 우리 학교를 더 잘 이해하고, 어떤 공간을 살펴보면 좋을지 정하는 자료예요.</p>
            <div className="energy-explainer efficiency-explainer">
              <div className="energy-explainer-grid">
                {ENERGY_CARD_SECTIONS
                  .filter((section) => ['탄소발자국과도 연결돼요', '작은 변화도 의미가 있어요'].includes(section.title))
                  .map((section) => (
                    <div className="energy-explainer-group" key={section.title}>
                      <h3>{section.title}</h3>
                      <ul>
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </article>
          <article className="card">
            <p className="eyebrow">올해의 관찰 질문</p>
            <ul className="question-list">
              {yearlyObservationQuestions.map((item) => (
                <li key={item.title}>{item.question}</li>
              ))}
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
        <img className="footer-logo dankook" src="/logo-dankook-trimmed.png" alt="단국대학교" />
        <img className="footer-logo" src="/logo-kakao-impact-trimmed.png" alt="카카오임팩트" />
        <img className="footer-logo" src="/logo-biohealth-trimmed.png" alt="바이오헬스" />
        <img className="footer-logo" src="/logo-yongin-trimmed.png" alt="용인시" />
      </footer>
    </main>
  )
}
