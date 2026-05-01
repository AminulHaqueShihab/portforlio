'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut, MousePointerClick, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/dashboard/visitors', label: 'Visitors', icon: Users },
	{
		href: '/dashboard/click-events',
		label: 'Click events',
		icon: MousePointerClick,
		soon: true,
	},
];

export function DashboardSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
			router.replace('/dashboard/login');
			router.refresh();
		} catch {
			router.replace('/dashboard/login');
		}
	}

	return (
		<aside className='flex shrink-0 flex-col border-b bg-muted/30 pb-6 lg:h-auto lg:min-h-[calc(100vh-5rem)] lg:w-52 lg:border-b-0 lg:border-r lg:pb-0'>
			<div className='px-4 pt-8'>
				<p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					Portfolio admin
				</p>
				<h2 className='mt-1 text-lg font-semibold leading-tight'>Analytics</h2>
			</div>
			<nav aria-label='Dashboard sections' className='mt-6 flex flex-none gap-1 overflow-x-auto px-2 lg:flex-col lg:px-4'>
				{navItems.map(({ href, label, icon: Icon, soon }) => {
					const active =
						href === '/dashboard'
							? pathname === '/dashboard'
							: pathname === href || pathname.startsWith(`${href}/`);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex min-w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
								active
									? 'bg-background text-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
								soon && !active && 'opacity-80'
							)}>
							<Icon className='h-4 w-4 shrink-0 opacity-70' aria-hidden />
							<span className='whitespace-nowrap'>{label}</span>
							{soon ? (
								<span className='ml-1 rounded bg-muted px-1.5 py-0 text-[10px] font-semibold uppercase text-muted-foreground'>
									Soon
								</span>
							) : null}
						</Link>
					);
				})}
			</nav>
			<Separator className='mt-8 hidden lg:block lg:flex-none' />
			<div className='hidden flex-1 lg:block' />
			<div className='hidden px-4 pb-8 pt-6 lg:block'>
				<Button
					type='button'
					variant='outline'
					className='w-full justify-start gap-2'
					onClick={() => void handleLogout()}>
					<LogOut className='h-4 w-4' />
					Log out
				</Button>
			</div>
			<div className='mt-6 border-t px-4 pb-10 pt-4 lg:hidden'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='w-full gap-2'
					onClick={() => void handleLogout()}>
					<LogOut className='h-4 w-4' />
					Log out
				</Button>
			</div>
		</aside>
	);
}
