import BlurFade from '@/components/magicui/blur-fade';
import Markdown from 'react-markdown';
import React from 'react';

interface AboutSectionProps {
	summary: string;
	blurFadeDelay: number;
}

/**
 * AboutSection displays the about/summary section.
 */
export function AboutSection({ summary, blurFadeDelay }: AboutSectionProps) {
	return (
		<section id='about' aria-labelledby='about-heading'>
			<BlurFade delay={blurFadeDelay * 3}>
				<h2 className='text-xl font-bold'>About</h2>
			</BlurFade>
			<BlurFade delay={blurFadeDelay * 4}>
				<Markdown className='prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert'>
					{summary}
				</Markdown>
			</BlurFade>
		</section>
	);
}
