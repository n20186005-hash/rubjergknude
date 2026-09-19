import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import InfoSection from '@/components/InfoSection';
import HistoryTimeline from '@/components/HistoryTimeline';
import PracticalInfoSection from '@/components/PracticalInfoSection';
import FaqSection from '@/components/FaqSection';
import FaqStructuredData from '@/components/FaqStructuredData';
import TouristAttractionStructuredData from '@/components/TouristAttractionStructuredData';
import RouteSection from '@/components/RouteSection';
import PhotoSpotsSection from '@/components/PhotoSpotsSection';
import HotelsSection from '@/components/HotelsSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';
import WeatherForecast from '@/components/WeatherForecast';
import ServicesSection from '@/components/ServicesSection';
import TransportGuideSection from '@/components/TransportGuideSection';
import SeasonalSection from '@/components/SeasonalSection';
import RoutePlansSection from '@/components/RoutePlansSection';
import ScienceSection from '@/components/ScienceSection';
import StoriesSection from '@/components/StoriesSection';
import TidesSection from '@/components/TidesSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <FaqStructuredData />
      <TouristAttractionStructuredData />
      <Header />
      <main>
        <Hero />
        <Intro />
        <BasicInfo />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <TransportGuideSection />
        <PracticalInfoSection />
        <WeatherForecast />
        <TidesSection />
        <ServicesSection />
        <FaqSection />
        <InfoSection />
        <HistoryTimeline />
        <StoriesSection />
        <SeasonalSection />
        <ScienceSection />
        <RouteSection />
        <RoutePlansSection />
        <PhotoSpotsSection />
        <HotelsSection />
        <Gallery />
        <Reviews />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
