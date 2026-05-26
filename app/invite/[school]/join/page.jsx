'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

const SCHOOLS = [
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
  '성서중학교',
]

const DEFAULT_CLASS_COUNTS_BY_GRADE = {
  1: 12,
  2: 12,
  3: 12,
}

const CLASS_COUNTS_BY_SCHOOL = {
  상현중학교: {
    1: 9,
    2: 10,
    3: 8,
  },
}

function getSchoolName(rawSchool) {
  const decodedSchool = decodeURIComponent(rawSchool || '')
  return SCHOOLS.includes(decodedSchool) ? decodedSchool : '수지구 중학교'
}

function getClassOptions(schoolName, grade) {
  const gradeClassCounts = CLASS_COUNTS_BY_SCHOOL[schoolName] || DEFAULT_CLASS_COUNTS_BY_GRADE
  const classCount = gradeClassCounts[grade] || DEFAULT_CLASS_COUNTS_BY_GRADE[grade] || 12
  return Array.from({ length: classCount }, (_, index) => String(index + 1))
}

export default function StudentJoinPage() {
  const params = useParams()
  const schoolName = useMemo(() => getSchoolName(params?.school), [params?.school])
  const [form, setForm] = useState({
    grade: '1',
    classNumber: '1',
    studentNumber: '',
    studentName: '',
  })
  const classOptions = useMemo(() => getClassOptions(schoolName, form.grade), [form.grade, schoolName])
  const [message, setMessage] = useState('')

  function updateField(key, value) {
    setForm((prev) => {
      if (key === 'grade') {
        const nextClassOptions = getClassOptions(schoolName, value)
        return { ...prev, grade: value, classNumber: nextClassOptions.includes(prev.classNumber) ? prev.classNumber : '1' }
      }
      return { ...prev, [key]: value }
    })
  }

  function submitStudent(event) {
    event.preventDefault()
    const classNumber = form.classNumber.trim()
    const studentNumber = form.studentNumber.trim()
    const studentName = form.studentName.trim()

    if (!classNumber || !studentNumber || studentName.length < 2) {
      setMessage('학년, 반, 번호, 이름을 모두 입력해 주세요.')
      return
    }

    const profile = {
      schoolName,
      grade: form.grade,
      classNumber,
      studentNumber,
      studentName,
      joinedAt: new Date().toISOString(),
    }

    window.localStorage.setItem('selectedSchoolName', JSON.stringify(schoolName))
    window.localStorage.setItem('studentProfile', JSON.stringify(profile))
    window.location.href = '/'
  }

  return (
    <main className="join-page">
      <section className="join-card">
        <Link className="back-link" href={`/invite/${encodeURIComponent(schoolName)}`}>초대 화면</Link>
        <p className="join-eyebrow">{schoolName} 기후환경 매니저</p>
        <h1>참여 정보를 입력해 주세요</h1>
        <p className="join-copy">입력한 정보는 이 기기 안에 저장되고, 다음 화면에서 포인트 활동을 이어갈 수 있어요.</p>

        <form className="join-form" onSubmit={submitStudent}>
          <label>
            학년
            <select value={form.grade} onChange={(event) => updateField('grade', event.target.value)}>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </label>
          <label>
            반
            <select
              value={form.classNumber}
              onChange={(event) => updateField('classNumber', event.target.value)}
            >
              {classOptions.map((classNumber) => (
                <option key={classNumber} value={classNumber}>
                  {classNumber}반
                </option>
              ))}
            </select>
          </label>
          <label>
            번호
            <input
              inputMode="numeric"
              min="1"
              placeholder="예: 12"
              type="number"
              value={form.studentNumber}
              onChange={(event) => updateField('studentNumber', event.target.value)}
            />
          </label>
          <label>
            이름
            <input
              placeholder="예: 홍길동"
              value={form.studentName}
              onChange={(event) => updateField('studentName', event.target.value)}
            />
          </label>
          {message && <p className="join-message">{message}</p>}
          <button type="submit">포인트 쌓으러 가기</button>
        </form>
      </section>

      <footer className="site-footer">
        <img className="footer-logo dankook" src="/logo-dankook-trimmed.png" alt="단국대학교" />
        <img className="footer-logo" src="/logo-kakao-impact-trimmed.png" alt="카카오임팩트" />
        <img className="footer-logo climate-platform" src="/logo-gg-climate-platform.png" alt="경기기후플랫폼" />
        <img className="footer-logo biohealth" src="/logo-biohealth-trimmed.png" alt="바이오헬스" />
        <img className="footer-logo" src="/logo-yongin-trimmed.png" alt="용인시" />
      </footer>

      <style>{`
        .join-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 18px;
          padding: 28px 16px;
          color: #1e2d24;
        }
        .join-card {
          width: min(680px, 100%);
          padding: 30px;
          border: 1px solid #d7e4da;
          border-radius: 28px;
          background: linear-gradient(135deg, #ffffff 0%, #e4f3e9 100%);
          box-shadow: 0 22px 60px rgba(18, 52, 31, .12);
        }
        .back-link {
          display: inline-flex;
          margin-bottom: 22px;
          color: #1f5f3c;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }
        .join-eyebrow {
          margin: 0 0 10px;
          color: #1f5f3c;
          font-size: 13px;
          font-weight: 800;
        }
        .join-card h1 {
          margin: 0;
          font-size: clamp(32px, 6vw, 54px);
          line-height: 1.08;
        }
        .join-copy {
          margin: 14px 0 24px;
          color: #65746a;
          line-height: 1.7;
        }
        .join-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }
        .join-form label {
          display: grid;
          gap: 7px;
          color: #65746a;
          font-weight: 800;
        }
        .join-form input,
        .join-form select {
          width: 100%;
          border: 1px solid #d7e4da;
          border-radius: 16px;
          padding: 13px 14px;
          background: #fbfdfb;
          color: #1e2d24;
          font: inherit;
        }
        .join-message {
          grid-column: 1 / -1;
          margin: 0;
          padding: 12px 14px;
          border: 1px solid #ecd98f;
          border-radius: 16px;
          background: #fff6d6;
          color: #5b4a13;
          font-weight: 800;
        }
        .join-form button {
          grid-column: 1 / -1;
          border: 0;
          border-radius: 999px;
          padding: 15px 18px;
          background: #2f7d4f;
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
        }
        .join-form button:hover { background: #1f5f3c; }
        @media (max-width: 560px) {
          .join-card { padding: 22px; border-radius: 22px; }
          .join-form { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  )
}
