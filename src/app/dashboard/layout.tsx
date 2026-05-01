import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className='relative left-1/2 w-screen max-w-none min-h-screen -translate-x-1/2 bg-background'>
			<div className='mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row'>
				<DashboardSidebar />
				<div className='min-h-0 min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:py-10'>
					{children}
				</div>
			</div>
		</div>
	);
}
