import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Countdown } from '../components/Countdown';
import { Stats } from '../components/Stats';
import { AboutSection } from '../components/AboutSection';
import { ChallengeArena } from '../components/ChallengeArena';
import { Timeline } from '../components/Timeline';
import { PrizeVault } from '../components/PrizeVault';
import { HowItWorks } from '../components/HowItWorks';
import { OneHiveSection } from '../components/OneHiveSection';
import { FAQ } from '../components/FAQ';
import { Organizers } from '../components/Organizers';
import { DiscordCTA } from '../components/DiscordCTA';
import { SectionDivider } from '../components/SectionDivider';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'HiveMind 2026 | SSDC SLIET';
  }, []);

  return (
    <main className="relative">
      <Hero />
      <Countdown />
      <Stats />
      <SectionDivider label="NODE // ABOUT_MISSION" />
      <AboutSection />
      <SectionDivider label="NODE // CHALLENGE_ARENA" />
      <ChallengeArena />
      <SectionDivider label="NODE // ROADMAP_TIMELINE" />
      <Timeline />
      <SectionDivider label="NODE // PRIZE_VAULT" />
      <PrizeVault />
      <SectionDivider label="NODE // WORKFLOW" />
      <HowItWorks />
      <SectionDivider label="NODE // ORGANIZERS_TEAM" />
      <Organizers />
      <SectionDivider label="NODE // COMMUNITY" />
      <OneHiveSection />
      <SectionDivider label="NODE // FAQS" />
      <FAQ />
      <DiscordCTA />
    </main>
  );
};
