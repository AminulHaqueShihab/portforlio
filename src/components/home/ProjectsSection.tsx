import BlurFade from '@/components/magicui/blur-fade';
import { ProjectCard } from '@/components/project-card';
import Link from 'next/link';
import React from 'react';

interface Project {
	id: string;
	href: string;
	title: string;
	description: string;
	dates: string;
	technologies: string[];
	image?: string;
	images?: string[];
	links?: any[];
}

interface ProjectsSectionProps {
	projects: Project[];
	blurFadeDelay: number;
}

/**
 * ProjectsSection displays the projects grid section.
 */
export function ProjectsSection({
	projects,
	blurFadeDelay,
}: ProjectsSectionProps) {
	return (
		<section id='projects' aria-labelledby='projects-heading'>
			<div className='space-y-12 w-full py-12'>
				<BlurFade delay={blurFadeDelay * 11}>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
								My Projects
							</div>
							<h2
								id='projects-heading'
								className='text-3xl font-bold tracking-tighter sm:text-5xl'
							>
								Check out my latest work
							</h2>
							<p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
								I&apos;ve worked on a variety of projects, from simple websites
								to complex web applications. Here are a few of my favorites.
							</p>
						</div>
					</div>
				</BlurFade>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto'>
					{projects.map((project, id) => (
						<BlurFade
							key={project.title}
							delay={blurFadeDelay * 12 + id * 0.05}
						>
							<Link href={`/projects/${project.id}`}>
								<ProjectCard
									href={project.href}
									key={project.title}
									title={project.title}
									description={project.description}
									dates={project.dates}
									tags={project.technologies}
									image={project?.image}
									images={project?.images}
									links={project?.links}
								/>
							</Link>
						</BlurFade>
					))}
				</div>
			</div>
		</section>
	);
}
