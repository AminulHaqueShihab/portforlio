import BlurFadeText from '@/components/magicui/blur-fade-text';
import BlurFade from '@/components/magicui/blur-fade';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';

interface HeroSectionProps {
	name: string;
	description: string;
	avatarUrl: string;
	initials: string;
	blurFadeDelay: number;
}

/**
 * HeroSection displays the main introduction, avatar, and tagline.
 */
export function HeroSection({
	name,
	description,
	avatarUrl,
	initials,
	blurFadeDelay,
}: HeroSectionProps) {
	return (
		<header id='hero'>
			<div className='mx-auto w-full max-w-2xl space-y-8'>
				<div className='gap-2 flex justify-between'>
					<div className='flex-col flex flex-1 space-y-1.5'>
						<BlurFadeText
							delay={blurFadeDelay}
							className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'
							yOffset={8}
							text={`Hi, I'm ${name} 👋`}
						/>
						<BlurFadeText
							className='max-w-[600px] md:text-xl'
							delay={blurFadeDelay}
							text={description}
						/>
						<BlurFadeText
							className='text-sm text-muted-foreground'
							delay={blurFadeDelay * 2}
							text='Based in Sydney, Australia - Available for opportunities in Sydney and remote work'
						/>
					</div>
					<BlurFade delay={blurFadeDelay}>
						<Avatar className='size-28 border'>
							<AvatarImage
								alt={`${name} - Software Engineer Sydney`}
								src={avatarUrl}
							/>
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</BlurFade>
				</div>
			</div>
		</header>
	);
}
