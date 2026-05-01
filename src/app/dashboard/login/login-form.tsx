'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export function DashboardLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const fallback = '/dashboard';

	const redirectTo = useMemo(() => {
		const raw = searchParams.get('from');
		if (
			raw?.startsWith('/dashboard') &&
			!raw.startsWith('/dashboard/login')
		) {
			return raw;
		}
		return fallback;
	}, [searchParams]);

	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
				credentials: 'include',
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				const msg =
					typeof data.error === 'string' ? data.error : 'Login failed.';
				throw new Error(msg);
			}
			router.replace(redirectTo);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed.');
		} finally {
			setLoading(false);
			setPassword('');
		}
	}

	return (
		<div className='mx-auto w-full max-w-md'>
			<Card className='border-border'>
				<CardHeader className='space-y-1'>
					<h1 className='text-xl font-semibold tracking-tight'>Admin login</h1>
					<p className='text-sm text-muted-foreground'>
						Enter the configured admin password to view visitor analytics.
					</p>
				</CardHeader>
				<form onSubmit={onSubmit}>
					<CardContent className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								autoComplete='current-password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error ? (
							<p className='text-sm text-destructive' role='alert'>
								{error}
							</p>
						) : null}
					</CardContent>
					<CardFooter>
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? 'Signing in…' : 'Sign in'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
