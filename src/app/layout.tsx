import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DATA } from '@/data/resume';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	metadataBase: new URL(DATA.url),
	title: {
		default: `${DATA.name} - Software Engineer in Sydney, Australia | Full Stack Developer`,
		template: `%s | ${DATA.name} - Software Engineer Sydney`,
	},
	description:
		'Experienced Software Engineer based in Sydney, Australia. Specializing in full-stack development with React, Next.js, Node.js, and modern web technologies. Available for software engineering opportunities in Sydney and remote work.',
	keywords: [
		'Software Engineer Sydney',
		'Full Stack Developer Sydney',
		'React Developer Sydney',
		'Next.js Developer Sydney',
		'Web Developer Sydney',
		'Software Engineer Australia',
		'Full Stack Developer Australia',
		'JavaScript Developer Sydney',
		'TypeScript Developer Sydney',
		'Node.js Developer Sydney',
		'Frontend Developer Sydney',
		'Backend Developer Sydney',
		'Software Engineer NSW',
		'Web Development Sydney',
		'Software Development Sydney',
		'React.js Developer',
		'Next.js Developer',
		'Node.js Developer',
		'MongoDB Developer',
		'PostgreSQL Developer',
		'AWS Developer Sydney',
		'Freelance Software Engineer Sydney',
		'Contract Software Engineer Sydney',
		'Software Engineer for hire Sydney',
		'Sydney Software Engineer',
		'Australian Software Engineer',
		'Sydney Tech Jobs',
		'Software Engineering Sydney',
		'Web Development Australia',
		'Software Development Australia',
	],
	authors: [{ name: DATA.name }],
	creator: DATA.name,
	publisher: DATA.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: `${DATA.name} - Software Engineer in Sydney, Australia`,
		description:
			'Experienced Software Engineer based in Sydney, Australia. Specializing in full-stack development with React, Next.js, Node.js, and modern web technologies. Available for software engineering opportunities in Sydney and remote work.',
		url: DATA.url,
		siteName: `${DATA.name} - Software Engineer Sydney`,
		locale: 'en_AU',
		type: 'website',
		images: [
			{
				url: `${DATA.url}/og-image.jpg`,
				width: 1200,
				height: 630,
				alt: `${DATA.name} - Software Engineer in Sydney, Australia`,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: `${DATA.name} - Software Engineer in Sydney, Australia`,
		description:
			'Experienced Software Engineer based in Sydney, Australia. Specializing in full-stack development with React, Next.js, Node.js, and modern web technologies.',
		images: [`${DATA.url}/og-image.jpg`],
		creator: '@aminul_haque',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		google: 'your-google-verification-code',
		yandex: '',
	},
	alternates: {
		canonical: DATA.url,
	},
	category: 'Technology',
	classification: 'Software Engineer',
	other: {
		'geo.region': 'AU-NSW',
		'geo.placename': 'Sydney',
		'geo.position': '-33.8688;151.2093',
		ICBM: '-33.8688, 151.2093',
		'DC.title': `${DATA.name} - Software Engineer Sydney`,
		'DC.description':
			'Experienced Software Engineer based in Sydney, Australia',
		'DC.subject':
			'Software Engineering, Web Development, Full Stack Development',
		'DC.creator': DATA.name,
		'DC.publisher': DATA.name,
		'DC.contributor': DATA.name,
		'DC.date': '2025',
		'DC.type': 'Text',
		'DC.format': 'text/html',
		'DC.identifier': DATA.url,
		'DC.language': 'en',
		'DC.coverage': 'Sydney, Australia',
		'DC.rights': 'Copyright 2025',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel='icon' href='/favicon.ico' />
				<link rel='apple-touch-icon' href='/apple-touch-icon.png' />
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#000000' />
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='msapplication-config' content='/browserconfig.xml' />

				{/* Structured Data for Person */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'Person',
							name: DATA.name,
							jobTitle: 'Software Engineer',
							description: DATA.description,
							url: DATA.url,
							image: `${DATA.url}${DATA.avatarUrl}`,
							sameAs: [
								DATA.contact.social.LinkedIn.url,
								DATA.contact.social.GitHub.url,
								DATA.contact.social.Medium.url,
							],
							address: {
								'@type': 'PostalAddress',
								addressLocality: 'Sydney',
								addressRegion: 'NSW',
								addressCountry: 'AU',
							},
							worksFor: {
								'@type': 'Organization',
								name: 'Freelance',
							},
							alumniOf: {
								'@type': 'Organization',
								name: 'University of Wollongong',
							},
							knowsAbout: DATA.skills,
							telephone: DATA.contact.tel,
							email: DATA.contact.email,
							nationality: 'Australian',
							birthPlace: 'Bangladesh',
							knowsLanguage: ['English', 'Bengali'],
							hasOccupation: {
								'@type': 'Occupation',
								name: 'Software Engineer',
								occupationLocation: {
									'@type': 'City',
									name: 'Sydney',
								},
							},
						}),
					}}
				/>

				{/* Structured Data for WebSite */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'WebSite',
							name: `${DATA.name} - Software Engineer Sydney`,
							url: DATA.url,
							description:
								'Professional portfolio of Software Engineer based in Sydney, Australia',
							author: {
								'@type': 'Person',
								name: DATA.name,
							},
							publisher: {
								'@type': 'Person',
								name: DATA.name,
							},
							potentialAction: {
								'@type': 'SearchAction',
								target: `${DATA.url}/search?q={search_term_string}`,
								'query-input': 'required name=search_term_string',
							},
						}),
					}}
				/>

				{/* Structured Data for Organization */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'Organization',
							name: `${DATA.name} - Software Engineer`,
							url: DATA.url,
							logo: `${DATA.url}${DATA.avatarUrl}`,
							contactPoint: {
								'@type': 'ContactPoint',
								telephone: DATA.contact.tel,
								contactType: 'customer service',
								email: DATA.contact.email,
								areaServed: 'AU',
								availableLanguage: 'English',
							},
							address: {
								'@type': 'PostalAddress',
								addressLocality: 'Sydney',
								addressRegion: 'NSW',
								addressCountry: 'AU',
							},
							sameAs: [
								DATA.contact.social.LinkedIn.url,
								DATA.contact.social.GitHub.url,
								DATA.contact.social.Medium.url,
							],
						}),
					}}
				/>
			</head>
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6',
					fontSans.variable
				)}
			>
				<ThemeProvider attribute='class' defaultTheme='light'>
					<TooltipProvider delayDuration={0}>
						{children}
						<Navbar />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
