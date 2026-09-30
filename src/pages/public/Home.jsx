import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import CategorySection from "../../components/home/CategorySection";
import SuccessStories from "../../components/home/SuccessStories";
import SustainabilitySection from "../../components/home/SustainabilitySection";
import TrustedSellers from "../../components/home/TrustedSellers";

const Home = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <CategorySection />
      <SuccessStories />
      <SustainabilitySection />
      <TrustedSellers />
    </>
  );
};

export default Home;
