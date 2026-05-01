/**
 * Portfolio pages only: centered column + vertical padding.
 * Dashboard lives outside this group so admin UI is flush to the top.
 */
export default function MainLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className='mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-24'>
			{children}
		</div>
	);
}
