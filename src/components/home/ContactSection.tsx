import BlurFade from '@/components/magicui/blur-fade';
import Link from 'next/link';
import React from 'react';

interface ContactSectionProps {
	linkedinUrl: string;
	email: string;
	blurFadeDelay: number;
}

/**
 * ContactSection displays the contact area.
 */
export function ContactSection({
	linkedinUrl,
	email,
	blurFadeDelay,
}: ContactSectionProps) {
	return (
		<section id='contact' aria-labelledby='contact-heading'>
			<div className='grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12'>
				<BlurFade delay={blurFadeDelay * 16}>
					<div className='space-y-3'>
						<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
							Contact
						</div>
						<h2
							id='contact-heading'
							className='text-3xl font-bold tracking-tighter sm:text-5xl'
						>
							Get in Touch
						</h2>
						<p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Looking to connect or hire a Software Engineer in Sydney? I&apos;m
							open to new opportunities—both onsite in Sydney and remote roles.
							Let&apos;s chat! Reach out via{' '}
							<Link
								href={linkedinUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-500 hover:underline'
							>
								LinkedIn
							</Link>{' '}
							or{' '}
							<Link
								href={`mailto:${email}`}
								className='text-blue-500 hover:underline'
							>
								email
							</Link>
							{', '}and I&apos;ll get back to you as soon as I can.
						</p>
					</div>
				</BlurFade>
			</div>
		</section>
	);
}
