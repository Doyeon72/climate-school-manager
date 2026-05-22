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
  '동천중학교',
]

export const metadata = {
  title: '수지구 기후환경 매니저 초대',
  description: '수지구 중학교별 기후환경 매니저 초대 링크 모음',
}

export default function InvitePage() {
  return (
    <main className="invite-page">
      <section className="invite-hero">
        <p className="invite-eyebrow">기후환경 매니저 초대 링크</p>
        <h1>우리 학교 링크로 바로 시작해요</h1>
        <p>
          수지구 중학교별 초대 화면입니다. 학교 이름을 선택하면 학생들이 우리 학교
          기후환경 매니저 화면으로 들어갈 수 있어요.
        </p>
      </section>

      <section className="invite-grid" aria-label="학교별 초대 링크">
        {SCHOOLS.map((school) => (
          <Link className="invite-school-card" key={school} href={`/invite/${encodeURIComponent(school)}`}>
            <span>{school}</span>
            <strong>초대 화면 열기</strong>
          </Link>
        ))}
      </section>

      <style>{`
        .invite-page {
          min-height: 100vh;
          width: min(1080px, calc(100% - 32px));
          margin: 0 auto;
          padding: 42px 0 56px;
          color: #1e2d24;
        }
        .invite-hero {
          padding: 30px;
          border: 1px solid #d7e4da;
          border-radius: 28px;
          background: linear-gradient(135deg, #ffffff 0%, #e4f3e9 100%);
          box-shadow: 0 18px 52px rgba(18, 52, 31, .1);
        }
        .invite-eyebrow {
          margin: 0 0 10px;
          color: #1f5f3c;
          font-size: 13px;
          font-weight: 800;
        }
        .invite-hero h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1.08;
        }
        .invite-hero p:last-child {
          max-width: 680px;
          margin: 16px 0 0;
          color: #65746a;
          line-height: 1.7;
        }
        .invite-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
        .invite-school-card {
          display: grid;
          min-height: 118px;
          align-content: space-between;
          padding: 18px;
          border: 1px solid #d7e4da;
          border-radius: 20px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(18, 52, 31, .07);
        }
        .invite-school-card:hover {
          border-color: #2f7d4f;
          background: #f5fbf6;
        }
        .invite-school-card span {
          font-size: 18px;
          font-weight: 900;
        }
        .invite-school-card strong {
          color: #2f7d4f;
          font-size: 14px;
        }
        @media (max-width: 900px) {
          .invite-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .invite-page { width: min(100% - 24px, 1080px); padding-top: 24px; }
          .invite-hero { padding: 22px; border-radius: 22px; }
          .invite-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  )
}
