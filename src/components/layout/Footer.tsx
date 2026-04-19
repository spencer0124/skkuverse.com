import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-grey-100 py-16">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.svg"
                alt="스꾸버스 로고"
                width={28}
                height={28}
                className="w-7 h-7 rounded-lg"
                unoptimized
              />
              <h3 className="text-t4 font-bold text-grey-900">스꾸버스</h3>
            </div>
            <p className="text-t6 text-grey-500 leading-relaxed">
              오늘의 공지·셔틀·장소, 성대생이 함께
            </p>
          </div>
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">서비스</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  시간표
                </a>
              </li>
              <li>
                <a href="#" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  학식 메뉴
                </a>
              </li>
              <li>
                <a href="#" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  셔틀버스
                </a>
              </li>
              <li>
                <a href="#" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  커뮤니티
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">문의</h4>
            <ul className="space-y-3">
              <li>
                <a href="/support" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  문의하기
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-t6 text-grey-500 hover:text-grey-700 transition-colors">
                  인스타그램
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-grey-200">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-t7 text-grey-400">
              &copy; 2025 스꾸버스. All rights reserved.
            </p>
            <a href="/privacy" className="text-t7 text-grey-400 hover:text-grey-600 transition-colors">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
