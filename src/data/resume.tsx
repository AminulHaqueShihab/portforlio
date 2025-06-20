import { Icons } from '@/components/icons';
import { HomeIcon, NotebookIcon } from 'lucide-react';

export const DATA = {
	name: 'Md Aminul Haque',
	initials: 'AH',
	url: 'https://www.aminulhaque.dev',
	location: 'Sydney, Australia',
	locationLink: 'https://www.google.com/maps/place/Sydney',
	description:
		'Software Engineer passionate about solving real-world problems and building scalable software solutions.',
	summary:
		'Currently pursuing a Master of Computer Science at the University of Wollongong. Previously worked at Zolo Inc. and Thinkcrypt.io, developing scalable ERP systems, e-commerce platforms, and large-scale booking systems. Led the end-to-end development of Eventpro, a feature-rich ticketing platform.',
	avatarUrl: '/me.jpg',
	skills: [
		'JavaScript',
		'TypeScript',
		'Python',
		'Java',
		'React.js',
		'Next.js',
		'Node.js',
		'Express.js',
		'Nest.js',
		'ASP.NET',
		'Redux Toolkit',
		'RTK Query',
		'Shadcn UI',
		'Chakra UI',
		'Tailwind CSS',
		'MongoDB',
		'PostgreSQL',
		'MySQL',
		'HTML',
		'CSS',
		'Puppeteer',
		'AWS S3',
	],
	navbar: [
		{ href: '/', icon: HomeIcon, label: 'Home' },
		// { href: '/blog', icon: NotebookIcon, label: 'Blog' },
	],
	contact: {
		email: 'aminulhaque853@gmail.com',
		tel: '+610432450337',
		social: {
			Medium: {
				name: 'Blog',
				url: 'https://medium.com/@aminul.haque.shihab',
				icon: NotebookIcon,
				navbar: true,
			},
			GitHub: {
				name: 'GitHub',
				url: 'https://github.com/AminulHaqueShihab',
				icon: Icons.github,
				navbar: true,
			},
			LinkedIn: {
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/md-aminul-haque-279b31192/',
				icon: Icons.linkedin,
				navbar: true,
			},
			email: {
				name: 'Send Email',
				url: 'mailto:aminulhaque853@gmail.com',
				icon: Icons.email,
				navbar: false,
			},
			Facebook: {
				name: 'Facebook',
				url: 'https://www.facebook.com/shihab4162',
				icon: Icons.facebook,
				navbar: true,
			},
			Instagram: {
				name: 'Instagram',
				url: 'https://www.instagram.com/its_h.a.w.k/',
				icon: Icons.instagram,
				navbar: true,
			},
		},
	},

	work: [
		{
			company: 'Zolo Inc.',
			href: '#',
			badges: [],
			location: 'Dhaka, BD',
			title: 'Software Engineer',
			logoUrl: '/logos/zolo-logo.jpeg',
			start: 'Sep 2024',
			end: 'Feb 2025',
			description:
				'I worked as a Software Engineer, developing and maintaining full-stack web applications using Next.js on the frontend and ASP.NET on the backend, with PostgreSQL for database operations. I collaborated closely with cross-functional teams to deliver scalable ERP systems tailored to client needs. My responsibilities included optimizing complex database queries and improving legacy codebases to enhance security, performance, and maintainability.',
		},
		{
			company: 'Thinkcrypt.io',
			href: '#',
			badges: [],
			location: 'Dhaka, BD',
			title: 'Software Engineer',
			logoUrl: '/logos/thinkcrypt-logo.jpeg',
			start: 'Oct 2023',
			end: 'Sep 2024',
			description:
				'As a Software Engineer, I was responsible for building, deploying, and maintaining web applications across diverse domains such as e-commerce (single and multi-vendor), flight ticketing, event management, POS systems, inventory management, and ERP platforms. I developed both frontend and backend systems using the MERN stack and was actively involved in upgrading legacy projects and launching new ones from scratch, all while upholding high coding standards.',
		},
		{
			company: 'Fiverr',
			href: 'https://www.fiverr.com/',
			badges: [],
			location: 'Remote',
			title: 'Freelance Web Developer',
			logoUrl: '/logos/fiverr-logo.png',
			start: 'Jan 2020',
			end: 'Present',
			description:
				'As a Freelance Web Developer, I delivered a variety of responsive websites and web applications tailored to client needs. I handled full project lifecycles — from requirement gathering to delivery — and consistently maintained a 5-star rating. I integrated third-party APIs, payment gateways, and CMS systems to ensure functionality and client satisfaction.',
		},
	],

	education: [
		{
			school: 'University of Wollongong',
			href: 'https://www.uow.edu.au',
			degree: 'Master of Computer Science',
			logoUrl: '/logos/uow-logo.png',
			start: '2025',
			end: 'Present',
		},
		{
			school: 'Brac University',
			href: 'https://bracu.ac.bd',
			degree: 'BSc in Computer Science and Engineering (CGPA: 3.87/4.00)',
			logoUrl: '/logos/bracu-logo.png',
			start: '2019',
			end: '2022',
		},
	],

	projects: [
		{
			title: 'ByteLab - Education Platform',
			href: 'https://bytelab.pro/',
			dates: '2025',
			active: true,
			image: '/projects/bytelab.png',
			images: [
				'/projects/bytelab.png',
				'/projects/bytelab-1.png',
				'/projects/bytelab-2.png',
				'/projects/bytelab-3.png',
				'/projects/bytelab-4.png',
			],
			description:
				'Full-featured education platform with separate CMS for instructors, parents and students, Class management, secure payment, and email automation.',
			technologies: [
				'Next.js',
				'Nest.js',
				'PostgreSQL',
				'Prisma',
				'Redux Toolkit',
				'SSLCommerz',
				'Nodemailer',
			],
			links: [],
		},
		{
			title: 'Eventpro - Ticketing Platform',
			href: 'https://eventpro-ticketing-frontend.vercel.app/',
			dates: '2024',
			active: true,
			image: '/projects/eventpro.png',
			images: [
				'/projects/eventpro.png',
				'/projects/eventpro-1.png',
				'/projects/eventpro-2.png',
				'/projects/eventpro-3.png',
				'/projects/eventpro-4.png',
				'/projects/eventpro-5.png',
				'/projects/eventpro-6.png',
			],
			description:
				'Full-featured event ticketing platform with CMS, CRM, secure payment, PDF ticketing, and email automation.',
			technologies: [
				'Next.js',
				'Express.js',
				'MongoDB',
				'Redux Toolkit',
				'SSLCommerz',
				'Puppeteer',
				'Nodemailer',
			],
			links: [],
		},
		{
			title: 'Fish & Meat Club',
			href: 'https://www.fishnmeatclub.com/',
			dates: '2023',
			active: true,
			image: '/projects/fishnmeat.png',
			description:
				'E-commerce site with admin dashboard, animations, JWT auth, and full-stack REST APIs.',
			technologies: ['Next.js', 'MongoDB', 'Chakra UI', 'Redux Toolkit'],
			links: [],
		},
		{
			title: 'Shohoz Air',
			href: 'https://air.shohoz.com/',
			dates: '2023',
			active: true,
			image: '/projects/shohoz.png',
			description:
				'Flight booking platform with flight APIs, booking and payment system, admin CMS, and refund modules.',
			technologies: ['React.js', 'Express.js', 'Sequelize', 'Joi'],
			links: [],
		},
		{
			title: 'Bazar365',
			href: 'https://www.bazar365.com/',
			dates: '2023',
			active: true,
			image: '/projects/bazar365.png',
			description:
				'Modern e-commerce platform with animations, dark mode, and customizable UI using Chakra and Framer Motion.',
			technologies: [
				'Next.js',
				'TypeScript',
				'Chakra UI',
				'Redux Toolkit',
				'Framer Motion',
			],
			links: [],
		},
		{
			title: 'Scary Pacman',
			href: 'https://aminulhaqueshihab.github.io/Scary-Pacman-game/',
			dates: '2022',
			active: true,
			image: '/projects/scary-pacman.png',
			description:
				'Fun browser game inspired by Pacman and Snake, built with vanilla JS, HTML, and CSS.',
			technologies: ['HTML', 'CSS', 'JavaScript'],
			links: [],
		},
	],

	hackathons: [],
};

// import { Icons } from "@/components/icons";
// import { HomeIcon, NotebookIcon } from "lucide-react";

// export const DATA = {
//   name: "Dillion Verma",
//   initials: "DV",
//   url: "https://dillion.io",
//   location: "San Francisco, CA",
//   locationLink: "https://www.google.com/maps/place/sanfrancisco",
//   description:
//     "Software Engineer turned Entrepreneur. I love building things and helping people. Very active on Twitter.",
//   summary:
//     "At the end of 2022, I quit my job as a software engineer to go fulltime into building and scaling my own SaaS businesses. In the past, [I pursued a double degree in computer science and business](/#education), [interned at big tech companies in Silicon Valley](https://www.youtube.com/watch?v=d-LJ2e5qKdE), and [competed in over 21 hackathons for fun](/#hackathons). I also had the pleasure of being a part of the first ever in-person cohort of buildspace called [buildspace sf1](https://buildspace.so/sf1).",
//   avatarUrl: "/me.png",
//   skills: [
//     "React",
//     "Next.js",
//     "Typescript",
//     "Node.js",
//     "Python",
//     "Go",
//     "Postgres",
//     "Docker",
//     "Kubernetes",
//     "Java",
//     "C++",
//   ],
//   navbar: [
//     { href: "/", icon: HomeIcon, label: "Home" },
//     { href: "/blog", icon: NotebookIcon, label: "Blog" },
//   ],
//   contact: {
//     email: "hello@example.com",
//     tel: "+123456789",
//     social: {
//       GitHub: {
//         name: "GitHub",
//         url: "https://dub.sh/dillion-github",
//         icon: Icons.github,

//         navbar: true,
//       },
//       LinkedIn: {
//         name: "LinkedIn",
//         url: "https://dub.sh/dillion-linkedin",
//         icon: Icons.linkedin,

//         navbar: true,
//       },
//       X: {
//         name: "X",
//         url: "https://dub.sh/dillion-twitter",
//         icon: Icons.x,

//         navbar: true,
//       },
//       Youtube: {
//         name: "Youtube",
//         url: "https://dub.sh/dillion-youtube",
//         icon: Icons.youtube,
//         navbar: true,
//       },
//       email: {
//         name: "Send Email",
//         url: "#",
//         icon: Icons.email,

//         navbar: false,
//       },
//     },
//   },

//   work: [
//     {
//       company: "Atomic Finance",
//       href: "https://atomic.finance",
//       badges: [],
//       location: "Remote",
//       title: "Bitcoin Protocol Engineer",
//       logoUrl: "/atomic.png",
//       start: "May 2021",
//       end: "Oct 2022",
//       description:
//         "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
//     },
//     {
//       company: "Shopify",
//       badges: [],
//       href: "https://shopify.com",
//       location: "Remote",
//       title: "Software Engineer",
//       logoUrl: "/shopify.svg",
//       start: "January 2021",
//       end: "April 2021",
//       description:
//         "Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
//     },
//     {
//       company: "Nvidia",
//       href: "https://nvidia.com/",
//       badges: [],
//       location: "Santa Clara, CA",
//       title: "Software Engineer",
//       logoUrl: "/nvidia.png",
//       start: "January 2020",
//       end: "April 2020",
//       description:
//         "Architected and wrote the entire MVP of the GeForce Now Cloud Gaming internal admin and A/B testing dashboard using React, Redux, TypeScript, and Python.",
//     },
//     {
//       company: "Splunk",
//       href: "https://splunk.com",
//       badges: [],
//       location: "San Jose, CA",
//       title: "Software Engineer",
//       logoUrl: "/splunk.svg",
//       start: "January 2019",
//       end: "April 2019",
//       description:
//         "Co-developed a prototype iOS app with another intern in Swift for the new Splunk Phantom security orchestration product (later publicly demoed and launched at .conf annual conference in Las Vegas). Implemented a realtime service for the iOS app in Django (Python) and C++; serialized data using protobufs transmitted over gRPC resulting in an approximate 500% increase in data throughput.",
//     },
//     {
//       company: "Lime",
//       href: "https://li.me/",
//       badges: [],
//       location: "San Francisco, CA",
//       title: "Software Engineer",
//       logoUrl: "/lime.svg",
//       start: "January 2018",
//       end: "April 2018",
//       description:
//         "Proposed and implemented an internal ruby API for sending/receiving commands to scooters over LTE networks. Developed a fully automated bike firmware update system to handle asynchronous firmware updates of over 100,000+ scooters worldwide, and provide progress reports in real-time using React, Ruby on Rails, PostgreSQL and AWS EC2 saving hundreds of developer hours.",
//     },
//     {
//       company: "Mitre Media",
//       href: "https://mitremedia.com/",
//       badges: [],
//       location: "Toronto, ON",
//       title: "Software Engineer",
//       logoUrl: "/mitremedia.png",
//       start: "May 2017",
//       end: "August 2017",
//       description:
//         "Designed and implemented a robust password encryption and browser cookie storage system in Ruby on Rails. Leveraged the Yahoo finance API to develop the dividend.com equity screener",
//     },
//   ],
//   education: [
//     {
//       school: "Buildspace",
//       href: "https://buildspace.so",
//       degree: "s3, s4, sf1, s5",
//       logoUrl: "/buildspace.jpg",
//       start: "2023",
//       end: "2024",
//     },
//     {
//       school: "University of Waterloo",
//       href: "https://uwaterloo.ca",
//       degree: "Bachelor's Degree of Computer Science (BCS)",
//       logoUrl: "/waterloo.png",
//       start: "2016",
//       end: "2021",
//     },
//     {
//       school: "Wilfrid Laurier University",
//       href: "https://wlu.ca",
//       degree: "Bachelor's Degree of Business Administration (BBA)",
//       logoUrl: "/laurier.png",
//       start: "2016",
//       end: "2021",
//     },
//     {
//       school: "International Baccalaureate",
//       href: "https://ibo.org",
//       degree: "IB Diploma",
//       logoUrl: "/ib.png",
//       start: "2012",
//       end: "2016",
//     },
//   ],
//   projects: [
//     {
//       title: "Chat Collect",
//       href: "https://chatcollect.com",
//       dates: "Jan 2024 - Feb 2024",
//       active: true,
//       description:
//         "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
//       technologies: [
//         "Next.js",
//         "Typescript",
//         "PostgreSQL",
//         "Prisma",
//         "TailwindCSS",
//         "Stripe",
//         "Shadcn UI",
//         "Magic UI",
//       ],
//       links: [
//         {
//           type: "Website",
//           href: "https://chatcollect.com",
//           icon: <Icons.globe className="size-3" />,
//         },
//       ],
//       image: "",
//       video:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
//     },
//     {
//       title: "Magic UI",
//       href: "https://magicui.design",
//       dates: "June 2023 - Present",
//       active: true,
//       description:
//         "Designed, developed and sold animated UI components for developers.",
//       technologies: [
//         "Next.js",
//         "Typescript",
//         "PostgreSQL",
//         "Prisma",
//         "TailwindCSS",
//         "Stripe",
//         "Shadcn UI",
//         "Magic UI",
//       ],
//       links: [
//         {
//           type: "Website",
//           href: "https://magicui.design",
//           icon: <Icons.globe className="size-3" />,
//         },
//         {
//           type: "Source",
//           href: "https://github.com/magicuidesign/magicui",
//           icon: <Icons.github className="size-3" />,
//         },
//       ],
//       image: "",
//       video: "https://cdn.magicui.design/bento-grid.mp4",
//     },
//     {
//       title: "llm.report",
//       href: "https://llm.report",
//       dates: "April 2023 - September 2023",
//       active: true,
//       description:
//         "Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.",
//       technologies: [
//         "Next.js",
//         "Typescript",
//         "PostgreSQL",
//         "Prisma",
//         "TailwindCSS",
//         "Shadcn UI",
//         "Magic UI",
//         "Stripe",
//         "Cloudflare Workers",
//       ],
//       links: [
//         {
//           type: "Website",
//           href: "https://llm.report",
//           icon: <Icons.globe className="size-3" />,
//         },
//         {
//           type: "Source",
//           href: "https://github.com/dillionverma/llm.report",
//           icon: <Icons.github className="size-3" />,
//         },
//       ],
//       image: "",
//       video: "https://cdn.llm.report/openai-demo.mp4",
//     },
//     {
//       title: "Automatic Chat",
//       href: "https://automatic.chat",
//       dates: "April 2023 - March 2024",
//       active: true,
//       description:
//         "Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.",
//       technologies: [
//         "Next.js",
//         "Typescript",
//         "PostgreSQL",
//         "Prisma",
//         "TailwindCSS",
//         "Shadcn UI",
//         "Magic UI",
//         "Stripe",
//         "Cloudflare Workers",
//       ],
//       links: [
//         {
//           type: "Website",
//           href: "https://automatic.chat",
//           icon: <Icons.globe className="size-3" />,
//         },
//       ],
//       image: "",
//       video:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
//     },
//   ],
//   hackathons: [
//     {
//       title: "Hack Western 5",
//       dates: "November 23rd - 25th, 2018",
//       location: "London, Ontario",
//       description:
//         "Developed a mobile application which delivered bedtime stories to children using augmented reality.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-western.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
//       links: [],
//     },
//     {
//       title: "Hack The North",
//       dates: "September 14th - 16th, 2018",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed a mobile application which delivers university campus wide events in real time to all students.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
//       links: [],
//     },
//     {
//       title: "FirstNet Public Safety Hackathon",
//       dates: "March 23rd - 24th, 2018",
//       location: "San Francisco, California",
//       description:
//         "Developed a mobile application which communcicates a victims medical data from inside an ambulance to doctors at hospital.",
//       icon: "public",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/firstnet.png",
//       links: [],
//     },
//     {
//       title: "DeveloperWeek Hackathon",
//       dates: "February 3rd - 4th, 2018",
//       location: "San Francisco, California",
//       description:
//         "Developed a web application which aggregates social media data regarding cryptocurrencies and predicts future prices.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/developer-week.jpg",
//       links: [
//         {
//           title: "Github",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/cryptotrends/cryptotrends",
//         },
//       ],
//     },
//     {
//       title: "HackDavis",
//       dates: "January 20th - 21st, 2018",
//       location: "Davis, California",
//       description:
//         "Developed a mobile application which allocates a daily carbon emission allowance to users to move towards a sustainable environment.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-davis.png",
//       win: "Best Data Hack",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg",
//       links: [
//         {
//           title: "Devpost",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://devpost.com/software/my6footprint",
//         },
//         {
//           title: "ML",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/Wallet6/my6footprint-machine-learning",
//         },
//         {
//           title: "iOS",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/Wallet6/CarbonWallet",
//         },
//         {
//           title: "Server",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/Wallet6/wallet6-server",
//         },
//       ],
//     },
//     {
//       title: "ETH Waterloo",
//       dates: "October 13th - 15th, 2017",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed a blockchain application for doctors and pharmacists to perform trustless transactions and prevent overdosage in patients.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/eth-waterloo.png",
//       links: [
//         {
//           title: "Organization",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/ethdocnet",
//         },
//       ],
//     },
//     {
//       title: "Hack The North",
//       dates: "September 15th - 17th, 2017",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed a virtual reality application allowing users to see themselves in third person.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
//       links: [
//         {
//           title: "Streamer Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/justinmichaud/htn2017",
//         },
//         {
//           title: "Client Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/RTSPClient",
//         },
//       ],
//     },
//     {
//       title: "Hack The 6ix",
//       dates: "August 26th - 27th, 2017",
//       location: "Toronto, Ontario",
//       description:
//         "Developed an open platform for people shipping items to same place to combine shipping costs and save money.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-6ix.jpg",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/ShareShip/ShareShip",
//         },
//         {
//           title: "Site",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://share-ship.herokuapp.com/",
//         },
//       ],
//     },
//     {
//       title: "Stupid Hack Toronto",
//       dates: "July 23rd, 2017",
//       location: "Toronto, Ontario",
//       description:
//         "Developed a chrome extension which tracks which facebook profiles you have visited and immediately texts your girlfriend if you visited another girls page.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/stupid-hackathon.png",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/nsagirlfriend/nsagirlfriend",
//         },
//       ],
//     },
//     {
//       title: "Global AI Hackathon - Toronto",
//       dates: "June 23rd - 25th, 2017",
//       location: "Toronto, Ontario",
//       description:
//         "Developed a python library which can be imported to any python game and change difficulty of the game based on real time emotion of player. Uses OpenCV and webcam for facial recognition, and a custom Machine Learning Model trained on a [Kaggle Emotion Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/leaderboard) using [Tensorflow](https://www.tensorflow.org/Tensorflow) and [Keras](https://keras.io/). This project recieved 1st place prize at the Global AI Hackathon - Toronto and was also invited to demo at [NextAI Canada](https://www.nextcanada.com/next-ai).",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/global-ai-hackathon.jpg",
//       win: "1st Place Winner",
//       links: [
//         {
//           title: "Article",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://syncedreview.com/2017/06/26/global-ai-hackathon-in-toronto/",
//         },
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/TinySamosas/",
//         },
//       ],
//     },
//     {
//       title: "McGill AI for Social Innovation Hackathon",
//       dates: "June 17th - 18th, 2017",
//       location: "Montreal, Quebec",
//       description:
//         "Developed realtime facial microexpression analyzer using AI",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/ai-for-social-good.jpg",
//       links: [],
//     },
//     {
//       title: "Open Source Circular Economy Days Hackathon",
//       dates: "June 10th, 2017",
//       location: "Toronto, Ontario",
//       description:
//         "Developed a custom admin interface for food waste startup <a href='http://genecis.co/'>Genecis</a> to manage their data and provide analytics.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/open-source-circular-economy-days.jpg",
//       win: "1st Place Winner",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/genecis",
//         },
//       ],
//     },
//     {
//       title: "Make School's Student App Competition 2017",
//       dates: "May 19th - 21st, 2017",
//       location: "International",
//       description: "Improved PocketDoc and submitted to online competition",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/make-school-hackathon.png",
//       win: "Top 10 Finalist | Honourable Mention",
//       links: [
//         {
//           title: "Medium Article",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://medium.com/make-school/the-winners-of-make-schools-student-app-competition-2017-a6b0e72f190a",
//         },
//         {
//           title: "Devpost",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://devpost.com/software/pocketdoc-react-native",
//         },
//         {
//           title: "YouTube",
//           icon: <Icons.youtube className="h-4 w-4" />,
//           href: "https://www.youtube.com/watch?v=XwFdn5Rmx68",
//         },
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/pocketdoc-react-native",
//         },
//       ],
//     },
//     {
//       title: "HackMining",
//       dates: "May 12th - 14th, 2017",
//       location: "Toronto, Ontario",
//       description: "Developed neural network to optimize a mining process",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-mining.png",
//       links: [],
//     },
//     {
//       title: "Waterloo Equithon",
//       dates: "May 5th - 7th, 2017",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed Pocketdoc, an app in which you take a picture of a physical wound, and the app returns common solutions or cures to the injuries or diseases.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/waterloo-equithon.png",
//       links: [
//         {
//           title: "Devpost",
//           icon: <Icons.globe className="h-4 w-4" />,
//           href: "https://devpost.com/software/pocketdoc-react-native",
//         },
//         {
//           title: "YouTube",
//           icon: <Icons.youtube className="h-4 w-4" />,
//           href: "https://www.youtube.com/watch?v=XwFdn5Rmx68",
//         },
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/pocketdoc-react-native",
//         },
//       ],
//     },
//     {
//       title: "SpaceApps Waterloo",
//       dates: "April 28th - 30th, 2017",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed Earthwatch, a web application which allows users in a plane to virtually see important points of interest about the world below them. They can even choose to fly away from their route and then fly back if they choose. Special thanks to CesiumJS for providing open source world and plane models.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/space-apps.png",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/earthwatch",
//         },
//       ],
//     },
//     {
//       title: "MHacks 9",
//       dates: "March 24th - 26th, 2017",
//       location: "Ann Arbor, Michigan",
//       description:
//         "Developed Super Graphic Air Traffic, a VR website made to introduce people to the world of air traffic controlling. This project was built completely using THREE.js as well as a node backend server.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/mhacks-9.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/threejs-planes",
//         },
//       ],
//     },
//     {
//       title: "StartHacks I",
//       dates: "March 4th - 5th, 2017",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed at StartHacks 2017, Recipic is a mobile app which allows you to take pictures of ingredients around your house, and it will recognize those ingredients using ClarifAI image recognition API and return possible recipes to make. Recipic recieved 1st place at the hackathon for best pitch and hack.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/starthacks.png",
//       win: "1st Place Winner",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
//       links: [
//         {
//           title: "Source (Mobile)",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/mattBlackDesign/recipic-ionic",
//         },
//         {
//           title: "Source (Server)",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/mattBlackDesign/recipic-rails",
//         },
//       ],
//     },
//     {
//       title: "QHacks II",
//       dates: "February 3rd - 5th, 2017",
//       location: "Kingston, Ontario",
//       description:
//         "Developed a mobile game which enables city-wide manhunt with random lobbies",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/qhacks.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
//       links: [
//         {
//           title: "Source (Mobile)",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/dillionverma/human-huntr-react-native",
//         },
//         {
//           title: "Source (API)",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/mattBlackDesign/human-huntr-rails",
//         },
//       ],
//     },
//     {
//       title: "Terrible Hacks V",
//       dates: "November 26th, 2016",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed a mock of Windows 11 with interesting notifications and functionality",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/terrible-hacks-v.png",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/justinmichaud/TerribleHacks2016-Windows11",
//         },
//       ],
//     },
//     {
//       title: "Portal Hackathon",
//       dates: "October 29, 2016",
//       location: "Kingston, Ontario",
//       description:
//         "Developed an internal widget for uploading assignments using Waterloo's portal app",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/portal-hackathon.png",
//       links: [
//         {
//           title: "Source",
//           icon: <Icons.github className="h-4 w-4" />,
//           href: "https://github.com/UWPortalSDK/crowmark",
//         },
//       ],
//     },
//   ],
// } as const;
