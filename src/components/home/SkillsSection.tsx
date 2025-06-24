import BlurFade from '@/components/magicui/blur-fade';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface SkillsSectionProps {
	skills: string[];
	blurFadeDelay: number;
}

/**
 * SkillsSection displays the technical skills section.
 */
export function SkillsSection({ skills, blurFadeDelay }: SkillsSectionProps) {
	return (
		<section id='skills' aria-labelledby='skills-heading'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={blurFadeDelay * 9}>
					<h2 id='skills-heading' className='text-xl font-bold'>
						Technical Skills
					</h2>
				</BlurFade>
				<div className='flex flex-wrap gap-1'>
					{skills.map((skill, id) => (
						<BlurFade key={skill} delay={blurFadeDelay * 10 + id * 0.05}>
							<Badge key={skill}>{skill}</Badge>
						</BlurFade>
					))}
				</div>
			</div>
		</section>
	);
}
