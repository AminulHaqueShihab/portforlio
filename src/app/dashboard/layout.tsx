export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className='relative left-1/2 w-screen max-w-none min-h-screen -translate-x-1/2 bg-background px-4 py-10 sm:px-6 lg:px-10'>
			<div className='mx-auto w-full max-w-7xl'>{children}</div>
		</div>
	);
}
