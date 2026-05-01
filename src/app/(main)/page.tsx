import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { WorkSection } from '@/components/home/WorkSection';
import { EducationSection } from '@/components/home/EducationSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { DATA } from '@/data/resume';

const BLUR_FADE_DELAY = 0.04;

/**
 * Main homepage layout, composed of section components.
 */
export default function Page() {
	return (
		<main className='flex flex-col min-h-[100dvh] space-y-10'>
			{/* Hero Section */}
			<HeroSection
				name={DATA.name}
				description={DATA.description}
				avatarUrl={DATA.avatarUrl}
				initials={DATA.initials}
				blurFadeDelay={BLUR_FADE_DELAY}
			/>
			{/* About Section */}
			<AboutSection summary={DATA.summary} blurFadeDelay={BLUR_FADE_DELAY} />
			{/* Work Experience Section */}
			<WorkSection work={DATA.work} blurFadeDelay={BLUR_FADE_DELAY} />
			{/* Education Section */}
			<EducationSection
				education={DATA.education}
				blurFadeDelay={BLUR_FADE_DELAY}
			/>
			{/* Skills Section */}
			<SkillsSection skills={DATA.skills} blurFadeDelay={BLUR_FADE_DELAY} />
			{/* Projects Section */}
			<ProjectsSection
				projects={DATA.projects}
				blurFadeDelay={BLUR_FADE_DELAY}
			/>
			{/* Contact Section */}
			<ContactSection
				linkedinUrl={DATA.contact.social.LinkedIn.url}
				email={DATA.contact.email}
				blurFadeDelay={BLUR_FADE_DELAY}
			/>
		</main>
	);
}
