import './globals.css';
import DevNavigator from './DevNavigator';

export const metadata = {
  title: '우리 학교 기후환경 매니저',
  description: '학교 공간을 관찰하고 개선 제안을 만드는 기후환경 교육 MVP',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#2f7d4f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <DevNavigator />
        {children}
      </body>
    </html>
  );
}
