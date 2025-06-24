import BlurFade from '@/components/magicui/blur-fade';
import { ResumeCard } from '@/components/resume-card';
import React from 'react';

interface Education {
	school: string;
	href: string;
	degree: string;
	logoUrl: string;
	start: string;
	end: string;
}

interface EducationSectionProps {
	education: Education[];
	blurFadeDelay: number;
}

/**
 * EducationSection displays the education section.
 */
export function EducationSection({
	education,
	blurFadeDelay,
}: EducationSectionProps) {
	return (
		<section id='education' aria-labelledby='education-heading'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={blurFadeDelay * 7}>
					<h2 id='education-heading' className='text-xl font-bold'>
						Education
					</h2>
				</BlurFade>
				{education.map((item, id) => (
					<BlurFade key={item.school} delay={blurFadeDelay * 8 + id * 0.05}>
						<ResumeCard
							key={item.school}
							href={item.href}
							logoUrl={item.logoUrl}
							altText={`${item.school} - ${item.degree}`}
							title={item.school}
							subtitle={item.degree}
							period={`${item.start} - ${item.end}`}
						/>
					</BlurFade>
				))}
			</div>
		</section>
	);
}
