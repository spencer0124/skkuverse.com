import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SplashSection from "@/components/sections/SplashSection";
import HeroSection from "@/components/sections/HeroSection";
import BusSection from "@/components/sections/BusSection";
import MapSection from "@/components/sections/MapSection";
import BuildingSection from "@/components/sections/BuildingSection";
import UtilitySection from "@/components/sections/UtilitySection";
import BusinessSection from "@/components/sections/BusinessSection";
import CTASection from "@/components/sections/CTASection";

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
        <SplashSection />
        <BusSection />
        <MapSection />
        <BuildingSection />
        <UtilitySection />
        <BusinessSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
