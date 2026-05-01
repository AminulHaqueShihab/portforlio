import { DashboardLoginForm } from '@/app/dashboard/login/login-form';
import { Suspense } from 'react';

export default function DashboardLoginPage() {
	return (
		<Suspense
			fallback={
				<div className='mx-auto w-full max-w-md text-sm text-muted-foreground'>
					Loading…
				</div>
			}>
			<DashboardLoginForm />
		</Suspense>
	);
}
