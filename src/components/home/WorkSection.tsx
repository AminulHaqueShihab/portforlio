import BlurFade from '@/components/magicui/blur-fade';
import { ResumeCard } from '@/components/resume-card';
import React from 'react';

interface Work {
	company: string;
	logoUrl: string;
	title: string;
	href?: string;
	badges?: readonly string[];
	start: string;
	end?: string;
	description?: string;
}

interface WorkSectionProps {
	work: Work[];
	blurFadeDelay: number;
}

/**
 * WorkSection displays the work experience section.
 */
export function WorkSection({ work, blurFadeDelay }: WorkSectionProps) {
	return (
		<section id='work' aria-labelledby='work-heading'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={blurFadeDelay * 5}>
					<h2 id='work-heading' className='text-xl font-bold'>
						Work Experience
					</h2>
				</BlurFade>
				{work.map((item, id) => (
					<BlurFade key={item.company} delay={blurFadeDelay * 6 + id * 0.05}>
						<ResumeCard
							key={item.company}
							logoUrl={item.logoUrl}
							altText={`${item.company} - ${item.title}`}
							title={item.company}
							subtitle={item.title}
							href={item.href}
							badges={item.badges}
							period={`${item.start} - ${item.end ?? 'Present'}`}
							description={item.description}
						/>
					</BlurFade>
				))}
			</div>
		</section>
	);
}
