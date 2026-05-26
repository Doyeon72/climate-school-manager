import Link from 'next/link'

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

export async function generateMetadata({ params }) {
  const { school } = await params
  const schoolName = getSchoolName(school)

  return {
    title: `${schoolName} 기후환경 매니저 초대`,
    description: `${schoolName} 학생을 위한 기후환경 매니저 초대 화면`,
  }
}

function getSchoolName(rawSchool) {
  const decodedSchool = decodeURIComponent(rawSchool || '')
  return SCHOOLS.includes(decodedSchool) ? decodedSchool : '수지구 중학교'
}

export default async function SchoolInvitePage({ params }) {
  const { school } = await params
  const schoolName = getSchoolName(school)
  const isKnownSchool = SCHOOLS.includes(schoolName)
  const isSanghyun = schoolName === '상현중학교'

  return (
    <main className="school-invite-page">
      <section className="school-invite-card">
        <Link className="back-link" href="/invite">학교 목록</Link>
        <p className="invite-eyebrow">수지구 기후환경 매니저</p>
        <div className="school-title-row">
          <h1>{schoolName}</h1>
          {isSanghyun && (
            <img className="school-emblem" src="/sanghyun-school-emblem.png" alt="상현중학교 교표" />
          )}
        </div>
        <p className="invite-copy">
          우리 학교의 더운 공간, 전기 낭비, 물 낭비를 함께 발견하고 개선 제안으로
          이어가는 학생 참여 화면입니다.
        </p>

        <div className="invite-panel" aria-label="초대 정보">
          <div>
            <span>초대 대상</span>
            <strong>{isKnownSchool ? `${schoolName} 학생` : '수지구 중학교 학생'}</strong>
          </div>
          <div>
            <span>활동 방식</span>
            <strong>관찰 기록 + 개선 제안 + 공감 투표</strong>
          </div>
          <div>
            <span>참여 보상</span>
            <strong>기후환경 포인트와 조아용 테마</strong>
          </div>
        </div>

        <Link className="start-button" href={`/invite/${encodeURIComponent(schoolName)}/join`}>
          학년·반·번호·이름 입력하고 시작하기
        </Link>
      </section>

      <footer className="site-footer">
        <img className="footer-logo dankook" src="/logo-dankook-trimmed.png" alt="단국대학교" />
        <img className="footer-logo" src="/logo-kakao-impact-trimmed.png" alt="카카오임팩트" />
        <img className="footer-logo climate-platform" src="/logo-gg-climate-platform.png" alt="경기기후플랫폼" />
        <img className="footer-logo biohealth" src="/logo-biohealth-trimmed.png" alt="바이오헬스" />
        <img className="footer-logo" src="/logo-yongin-trimmed.png" alt="용인시" />
      </footer>

      <style>{`
        .school-invite-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 18px;
          padding: 28px 16px;
          color: #1e2d24;
        }
        .school-invite-card {
          width: min(720px, 100%);
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
        .invite-eyebrow {
          margin: 0 0 10px;
          color: #1f5f3c;
          font-size: 13px;
          font-weight: 800;
        }
        .school-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }
        .school-invite-card h1 {
          margin: 0;
          font-size: clamp(38px, 8vw, 68px);
          line-height: 1.02;
        }
        .school-emblem {
          width: clamp(118px, 20vw, 168px);
          height: auto;
          object-fit: contain;
          flex: 0 0 auto;
          margin-top: -28px;
        }
        .invite-copy {
          max-width: 590px;
          margin: 16px 0 0;
          color: #65746a;
          font-size: 17px;
          line-height: 1.7;
        }
        .invite-panel {
          display: grid;
          gap: 10px;
          margin: 26px 0;
        }
        .invite-panel div {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 15px 16px;
          border: 1px solid #d7e4da;
          border-radius: 18px;
          background: rgba(255, 255, 255, .78);
        }
        .invite-panel span {
          color: #65746a;
          font-weight: 700;
        }
        .invite-panel strong {
          text-align: right;
        }
        .start-button {
          display: inline-flex;
          justify-content: center;
          width: 100%;
          padding: 15px 18px;
          border-radius: 999px;
          background: #2f7d4f;
          color: #ffffff;
          font-weight: 900;
          text-decoration: none;
        }
        .start-button:hover { background: #1f5f3c; }
        @media (max-width: 560px) {
          .school-invite-card { padding: 22px; border-radius: 22px; }
          .school-title-row {
            align-items: flex-start;
            gap: 14px;
          }
          .school-emblem {
            width: 94px;
            margin-top: -12px;
          }
          .invite-panel div { display: grid; }
          .invite-panel strong { text-align: left; }
        }
      `}</style>
    </main>
  )
}
