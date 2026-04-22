import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import NoticeSection from "@/components/sections/NoticeSection";
import MoveSection from "@/components/sections/MoveSection";
import CampusMapSection from "@/components/sections/CampusMapSection";

/* ── 추후 확장 예정 섹션 ──
import HomeSection from "@/components/sections/HomeSection";         // 시간표, 학식
import CommunitySection from "@/components/sections/CommunitySection"; // 커뮤니티
import AISection from "@/components/sections/AISection";               // AI 학습 도우미
*/

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NoticeSection />
        <CampusMapSection />
        <MoveSection />
      </main>
      <Footer />
    </>
  );
}
