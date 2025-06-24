import { DATA } from '@/data/resume';
import { ProjectCard } from '@/components/project-card';
import Link from 'next/link';

export default function ProjectsPage() {
	return (
		<main className='flex flex-col min-h-[100dvh] space-y-10'>
			<section className='space-y-12 w-full py-12 max-w-2xl mx-auto'>
				<div className='flex flex-col items-center justify-center space-y-4 text-center'>
					<div className='space-y-2'>
						<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
							Projects
						</div>
						<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							All Software Engineering Projects
						</h1>
						<p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Explore my portfolio of software engineering projects, from web
							apps to platforms.
						</p>
					</div>
				</div>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto'>
					{DATA.projects.map(project => (
						<Link
							key={project.id}
							href={`/projects/${project.id}`}
							className='block'
						>
							<ProjectCard
								href={project.href}
								title={project.title}
								description={project.description}
								dates={project.dates}
								tags={project.technologies}
								image={project?.image}
								images={project?.images}
								links={project?.links}
							/>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
