'use client';
import { DATA } from '@/data/resume';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';

type ProjectLink = {
	href: string;
	icon?: React.ReactNode;
	type?: string;
	title?: string;
};

export default function ProjectPage({ params }: { params: { id: string } }) {
	const project = DATA.projects.find(p => p.id === params.id);

	// Prefer images array, fallback to single image
	const images =
		project && project.images && project.images.length > 0
			? project.images
			: project && project.image
			? [project.image]
			: [];
	const [current, setCurrent] = useState(0);

	if (!project) return notFound();

	const nextImage = () => setCurrent(prev => (prev + 1) % images.length);
	const prevImage = () =>
		setCurrent(prev => (prev - 1 + images.length) % images.length);

	return (
		<main className='flex flex-col min-h-[100dvh] space-y-10'>
			<section className='w-full max-w-2xl mx-auto'>
				{/* Back Button Row */}
				<div className='flex items-center mb-2'>
					<Link href='/'>
						<button className='w-6 h-6 flex items-center justify-center rounded bg-background border shadow hover:bg-muted transition'>
							<ChevronLeft className='w-4 h-4' />
						</button>
					</Link>
				</div>
				{/* Banner Carousel */}
				{images.length > 0 && (
					<div className='relative w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6 shadow-md'>
						<Image
							src={images[current]}
							alt={project.title}
							fill
							className='object-cover object-top transition-all duration-700'
							priority
						/>
						{/* Carousel Controls */}
						{images.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className='absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 rounded-full p-2 shadow hover:bg-background/90 transition'
									aria-label='Previous image'
								>
									<ChevronsLeft className='w-4 h-4' />
								</button>
								<button
									onClick={nextImage}
									className='absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 rounded-full p-2 shadow hover:bg-background/90 transition'
									aria-label='Next image'
								>
									<ChevronsRight className='w-4 h-4' />
								</button>
								{/* Dots */}
								<div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1'>
									{images.map((_, idx) => (
										<span
											key={idx}
											className={`h-2 w-2 rounded-full inline-block ${
												idx === current ? 'bg-white' : 'bg-white/50'
											}`}
										/>
									))}
								</div>
							</>
						)}
					</div>
				)}
				<div className='space-y-4'>
					<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl mb-2'>
						{project.title}
					</h1>
					<h1 className='font-sans'>{project.dates}</h1>
					<div className='flex flex-wrap gap-2 items-center text-sm text-muted-foreground'>
						<h1 className='font-sans'>Stack:</h1>
						{project.technologies &&
							project.technologies.map(tech => (
								<Badge key={tech} variant='secondary'>
									{tech}
								</Badge>
							))}
					</div>
					<p className='prose dark:prose-invert text-pretty text-muted-foreground text-base mt-2'>
						{project.description}
					</p>
					{project.features && project.features.length > 0 && (
						<ul className='list-disc pl-6 space-y-1 text-muted-foreground text-base'>
							{project.features.map((feature, idx) => (
								<li key={idx}>{feature}</li>
							))}
						</ul>
					)}
					{Array.isArray(project.links) && project.links.length > 0 && (
						<div className='flex flex-wrap gap-2 mt-4'>
							{(project.links as ProjectLink[]).map((link, idx) => (
								<Link
									href={link.href}
									key={idx}
									target='_blank'
									rel='noopener noreferrer'
								>
									<Badge className='flex gap-2 px-2 py-1 text-[10px]'>
										{link.icon}
										{link.type}
									</Badge>
								</Link>
							))}
						</div>
					)}
					{project.href && (
						<div className='mt-4'>
							<Link
								href={project.href}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-500 hover:underline'
							>
								Visit Project ↗
							</Link>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
