export const profile = {
	name: 'Nathanael Sheehan',
	role: 'Postdoctoral Researcher',
	chair: 'Chair of Philosophy and History of Science and Technology',
	institution: 'Technical University of Munich',
	department: 'Department of Science, Technology and Society',
	email: 'ns651@exeter.ac.uk',
	orcid: '0000-0002-2779-0976',
	links: {
		github: 'https://github.com/natesheehan',
		orcid: 'https://orcid.org/0000-0002-2779-0976',
		tum: 'https://www.sts.sot.tum.de/en/sts/people/researchers/nathanael-sheehan/',
		twitter: 'https://twitter.com/thanaelsheehan',
		cv: 'https://natesheehan.github.io/cv/CV.pdf',
		cvSource: 'https://github.com/natesheehan/cv',
		source: 'https://github.com/natesheehan/digital'
	}
};

export type OutputType = 'article' | 'thesis' | 'report' | 'data' | 'event';

export const outputTypes: { id: OutputType; label: string; plural: string }[] = [
	{ id: 'article', label: 'Journal article', plural: 'Articles' },
	{ id: 'thesis', label: 'PhD thesis', plural: 'Thesis' },
	{ id: 'report', label: 'Policy report', plural: 'Reports' },
	{ id: 'data', label: 'Data & code', plural: 'Data & code' },
	{ id: 'event', label: 'Workshop', plural: 'Workshops' }
];

export const typeLabel = (t: OutputType) => outputTypes.find((o) => o.id === t)?.label ?? t;

export type Publication = {
	type: OutputType;
	year: number;
	title: string;
	authors: string[];
	venue: string;
	details?: string;
	url: string;
	doi?: string;
	openAccess?: boolean;
	licence?: string;
	linkLabel?: string;
	abstract?: string;
};

/** Ordered newest first. Sources: ORCID, Crossref and Zenodo (September 2026). */
export const publications: Publication[] = [
	{
		type: 'article',
		year: 2026,
		title: 'The Sequence and the Standard: An Account of Participatory Informational Format Exclusion (PIFE)',
		authors: ['Sheehan, N.'],
		venue: 'Social Epistemology',
		details: '40(5), 571–583',
		url: 'https://doi.org/10.1080/02691728.2026.2682153',
		doi: '10.1080/02691728.2026.2682153',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'This paper explores how data formats shape the possibilities for participation in Open Research Data (ORD) infrastructures. In doing so, this paper introduces the concept of Participatory Informational Format Exclusion (PIFE) to capture the exclusion of epistemic agents from contributing to global scientific systems due to the misalignment of their data formats with infrastructural norms. Drawing on a single ethnographic episode, I show that format exclusion is not a technical problem but a structural misalignment between ORD infrastructure’s embedded conception of what data are and the epistemic tradition within which the agent works. The paper develops PIFE through four analytical properties and considers its implications for debates about openness and inequity in ORD infrastructures.'
	},
	{
		type: 'thesis',
		year: 2026,
		title: 'Varieties of Openness in Practice: Unrestricted, Regulated, and Controlled Models of Data Governance in Global Health Research Infrastructures',
		authors: ['Sheehan, N.'],
		venue: 'University of Exeter',
		url: 'https://doi.org/10.5281/zenodo.21509938',
		linkLabel: 'Thesis code on Zenodo',
		abstract:
			'Doctoral thesis funded by the Centre for Doctoral Training in Environmental Intelligence and part of the project “A Philosophy of Open Science for Diverse Research Environments” (PHIL_OS). The software scripts used in the thesis are openly archived on Zenodo (DOI 10.5281/zenodo.21509938, CC BY 4.0).'
	},
	{
		type: 'article',
		year: 2026,
		title: 'Open Science, Health Data and Epistemic Harms: A Multidisciplinary Reflection',
		authors: [
			'Chatikobo, T.',
			'Griffiths, F.',
			'Hayden, N.',
			'Leeming, G.',
			'Mishra, A.',
			'Morris, E.',
			'Schirru, L.',
			'Sheehan, N.',
			'Williams, A.',
			'Sekalala, S.'
		],
		venue: 'Data Science Journal',
		details: '25(1), 15',
		url: 'https://doi.org/10.5334/dsj-2026-015',
		doi: '10.5334/dsj-2026-015',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'Open Science (OS) promises to democratise knowledge and reduce epistemic inequalities. However, a critical analysis reveals the potential of OS to amplify structural vulnerabilities, especially for people and communities already at the margins. With a particular focus on health data, this interdisciplinary essay examines how OS infrastructures perpetuate epistemic harms through the dominance of Eurocentric knowledge norms, legal regimes and corporate capture. Amidst the rapidly evolving health and data landscape, realising the social justice potential of OS, especially in healthcare, demands moving beyond techno-optimism to approaches that centre plural epistemologies, relational accountability and community empowerment.'
	},
	{
		type: 'data',
		year: 2026,
		title: 'European Nucleotide Archive: Qualitative Interviews with Data Practitioners',
		authors: ['Sheehan, N.'],
		venue: 'Zenodo',
		details: 'Dataset',
		url: 'https://doi.org/10.5281/zenodo.18661612',
		doi: '10.5281/zenodo.18661612',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'Qualitative interviews about nucleotide sequence data curation, submission, reuse, and infrastructural labour within the European Nucleotide Archive (ENA). Interview partners include data submitters, curators, bioinformaticians, and infrastructure staff who generate, process, or steward ENA records. Topics include the organisation of sequencing and data production workflows; the history and institutional embedding of ENA within the International Nucleotide Sequence Database Collaboration; the perceived value of open nucleotide data and public archives; challenges in preparing, annotating, and submitting sequence data and metadata; opportunities and limitations of reusing ENA records; practices of validation, standardisation and quality control; and the role of ENA data in downstream analysis, surveillance and wider life-science infrastructures. Part of the PHIL_OS project.'
	},
	{
		type: 'report',
		year: 2025,
		title: 'Resilience in Times of Crisis: Strengthening Open Science Against Geopolitical Pressures. Recommendations to the Netherlands National Commission for UNESCO',
		authors: [
			'Azevedo, F.',
			'Bezuidenhout, L.',
			'Bosman, J.',
			'Ceran, O. M.',
			'Costas, R.',
			'D’Agostino, A.',
			'Gawehns, D.',
			'Gregory, K.',
			'Gum, J.',
			'Hanahoe, H.',
			'Havemann, J.',
			'Kellam, L.',
			'Lee, T.',
			'Sesink, L.',
			'Shanahan, H.',
			'Sheehan, N.',
			'Stall, S.'
		],
		venue: 'Zenodo',
		details: 'Recommendations',
		url: 'https://doi.org/10.5281/zenodo.18611624',
		doi: '10.5281/zenodo.18611624',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'This Recommendation summarises the findings from the workshop “Resilience in Times of Crisis: Strengthening Open Science Against Geopolitical Pressures”. These findings broadly outline areas of action to strengthen the UNESCO Recommendation on Open Science. As representatives from the Dutch and international research community, we request that the Netherlands National Commission for UNESCO support the findings and amplify the call for action within the broader UNESCO community.'
	},
	{
		type: 'article',
		year: 2025,
		title: 'Reconciling Data Actionability and Accountability in Global Health Research: The Case of SARS-CoV-2',
		authors: ['Sheehan, N.', 'Leonelli, S.'],
		venue: 'Global Public Health',
		details: '20(1), 2436422',
		url: 'https://doi.org/10.1080/17441692.2024.2436422',
		doi: '10.1080/17441692.2024.2436422',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'The requirements for actionability and accountability in data infrastructures are often viewed as incompatible, creating a trade-off where enhancing one diminishes the other. Through a comparative analysis of two data infrastructures used to share genomic data about the SARS-CoV-2 virus, we argue that making data actionable for knowledge development involves a commitment to ensuring that the data in question are representative of the phenomena being studied and accountable to data subjects and users. This in turn presupposes that: (1) enough data are contributed by a wide and diverse set of relevant sources; (2) mechanisms of feedback and inclusion are set up to ensure that data contributors can participate in data governance and interpretation, thereby helping to adequately contextualise data; and (3) accountability extends to the ways in which data infrastructures are run, financed and positioned vis-à-vis the communities they are meant to serve. Such a model of data sharing can only work on the understanding that data do not need to be easily accessible to be actionable; rather, actionability depends on the responsiveness and accountability of data infrastructures, and the efforts invested in ensuring open communication among contributors.'
	},
	{
		type: 'event',
		year: 2025,
		title: 'Towards a Philosophy of Open Scientific Practices: Comparing Research Environments',
		authors: [
			'Leonelli, S.',
			'Castaño, P.',
			'Koranteng-Acquah, J.',
			'Tsiroukis, F.',
			'Cavazzoni, E.',
			'Trappes, R.',
			'Sheehan, N.',
			'Goble, C.',
			'Williams, R.',
			'Hajek, K.',
			'Trauttmansdorff, P.',
			'Goldstein, R. B.'
		],
		venue: 'Zenodo',
		details: 'Workshop programme & slides, Landshut',
		url: 'https://doi.org/10.5281/zenodo.15295361',
		doi: '10.5281/zenodo.15295361',
		openAccess: true,
		licence: 'CC BY 4.0',
		abstract:
			'Programme and presentation slides from an international workshop held 27–30 April 2025 in Landshut, Bavaria, showcasing preliminary results from the PHIL_OS project “A Philosophy of Open Science for Diverse Research Environments” and tracing paths for its final two years, including data analysis, outputs and policy engagement.'
	},
	{
		type: 'article',
		year: 2024,
		title: 'Unrestricted Versus Regulated Open Data Governance: A Bibliometric Comparison of SARS-CoV-2 Nucleotide Sequence Databases',
		authors: ['Sheehan, N.', 'Botta, F.', 'Leonelli, S.'],
		venue: 'Data Science Journal',
		details: '23, 29',
		url: 'https://doi.org/10.5334/dsj-2024-029',
		doi: '10.5334/dsj-2024-029',
		openAccess: true,
		abstract:
			'Two distinct modes of data governance have emerged in accessing and reusing viral data pertaining to COVID-19: an unrestricted model, espoused by data repositories part of the International Nucleotide Sequence Database Collaboration and a regulated model promoted by the Global Initiative on Sharing All Influenza data. In this paper, we focus on publications mentioning either infrastructure in the period between January 2020 and January 2023, thus capturing a period of acute response to the COVID-19 pandemic. Through a variety of bibliometric and network science methods, we compare the extent to which either data infrastructure facilitated collaboration from different countries around the globe to understand how data reuse can enhance forms of diversity between institutions, countries, and funding groups. Our findings reveal disparities in representation and usage between the two data infrastructures. We conclude that both approaches offer useful lessons, with the unrestricted model providing insights into complex data linkage and the regulated model demonstrating the importance of global representation.'
	},
	{
		type: 'article',
		year: 2022,
		title: 'Active Travel Oriented Development: Assessing the Suitability of Sites for New Homes',
		authors: [
			'Talbot, J.',
			'Lucas-Smith, M.',
			'Speakman, A.',
			'Streb, M.',
			'Nuttall, S.',
			'Carlino, D.',
			'Johansson, P.',
			'Sheehan, N.',
			'Groot, N.',
			'Lovelace, R.'
		],
		venue: 'European Journal of Transport and Infrastructure Research',
		details: '22(4), 51–72',
		url: 'https://doi.org/10.18757/ejtir.2022.22.4.6015',
		doi: '10.18757/ejtir.2022.22.4.6015',
		openAccess: true,
		abstract:
			'The location of new housing developments, and the provision of safe space for walking and cycling to key destinations around them, have major and long lasting impacts on travel behaviour, health, and environmental outcomes. Transit Oriented Development (TOD) is a well-recognised concept in urban planning, but systematic evidence is often lacking on the likely ‘active travel performance’ of new developments, making it hard for the planning process to support sustainable transport objectives. This paper articulates the concept of ‘Active Travel Oriented Development’ (ATOD) and describes methods for operationalising it. We demonstrate the use of a set of simple metrics to assess the active travel performance of new and proposed development sites. ATOD has the benefits of building on the established concept of TOD and being easy to assess. We conclude that ATOD, and tools for measuring it, are needed to ensure that transport and development policies work in harmony.'
	}
];

export function formatCitation(p: Publication): string {
	const authors =
		p.authors.length > 1
			? `${p.authors.slice(0, -1).join(', ')}, & ${p.authors[p.authors.length - 1]}`
			: p.authors[0];
	const title = p.type === 'article' ? p.title : `${p.title} [${typeLabel(p.type)}]`;
	const venue = p.details && p.type === 'article' ? `${p.venue}, ${p.details}` : p.venue;
	const link = p.doi ? `https://doi.org/${p.doi}` : p.url;
	return `${authors} (${p.year}). ${title}. ${venue}. ${link}`;
}

export type Software = {
	name: string;
	kind: string;
	summary: string;
	description: string;
	tags: string[];
	repo: string;
	site: string;
	media?: { type: 'video' | 'image'; src: string; alt: string };
	cover: 'river' | 'grid' | 'dots';
};

export const software: Software[] = [
	{
		name: 'GIGWORK.city',
		kind: 'Interactive platform',
		summary: 'Courier stories from three European cities, behind the moving dot on the map.',
		description:
			'The work in the gig economy is characterised by opacity and alienation, digital platforms effectively hiding from view the intensive human labour that enables our daily instant gratifications. For platform food couriers, this hidden work is concealed behind a dot moving on and across a map, deprived of identity or history. Using graphic illustrations, GIS data and audio diaries, this interactive multimedia platform gathers courier stories from Manchester, Cluj and Lyon to problematise the discourses of flexibility, independence and entrepreneurship surrounding gig work. Part of the research project Doing Gig Work.',
		tags: ['Web', 'GIS', 'Audio', 'Storytelling'],
		repo: 'https://github.com/gigwork/Gigwork-Stories',
		site: 'https://gigwork.city/',
		media: { type: 'video', src: '/FM74HVOXwAEAte_.mp4', alt: 'Animated map from GIGWORK.city' },
		cover: 'grid'
	},
	{
		name: 'abstr',
		kind: 'R package',
		summary: 'An R interface to the A/B Street transport simulation and network editing software.',
		description:
			'abstr converts origin–destination data, combined with data on buildings representing origin and destination locations, into .json files that can be imported directly into the A/B Street city simulation. See the formats page in the A/B Street documentation for details of the schema the package outputs.',
		tags: ['R', 'Transport', 'Simulation'],
		repo: 'https://github.com/a-b-street/abstr',
		site: 'https://a-b-street.github.io/abstr/',
		media: {
			type: 'image',
			src: '/128907563-4aa95b30-a98d-4fbc-9275-97e0b30dd227.gif',
			alt: 'Simulated trips generated with abstr in A/B Street'
		},
		cover: 'grid'
	},
	{
		name: 'River Sentiment Dashboard',
		kind: 'Dashboard',
		summary: 'Social-media sentiment alongside the ecological status of 450+ rivers in the Thames basin.',
		description:
			'People talk about rivers online: from complaints about pollution to celebrations of wildlife, rivers provoke passionate social media comments. When people express their feelings about rivers on Twitter, we get a glimpse of how nature affects human wellbeing. The dashboard displays social media sentiment alongside data about the ecological status of more than 450 rivers in the Thames basin in England. A prototype developed by the University of Oxford and Thames21.',
		tags: ['Web', 'Sentiment analysis', 'Environment'],
		repo: 'https://github.com/Digital-Water-Publics/Thames21-Socio-Ecological-Dashboard',
		site: 'https://thames21ox.web.app/',
		cover: 'river'
	},
	{
		name: 'eaCatcheR',
		kind: 'R package',
		summary: 'Programmatic access to the Environment Agency catchment planner.',
		description:
			'eaCatcheR provides an interface to data from the environment.data.gov.uk catchment planner, a resource for spatial and ecological datasets on waterbodies in England. Three main functions — get_wb_rnag(), get_wb_classification() and get_wb_sf() — retrieve data by geography type (e.g. RBD, MC, OC) and name.',
		tags: ['R', 'Open government data', 'Hydrology'],
		repo: 'https://github.com/natesheehan/eaCatcheR',
		site: 'https://natesheehan.github.io/eaCatcheR/',
		cover: 'river'
	},
	{
		name: 'dimaqdata',
		kind: 'R data package',
		summary: 'Ten global air-quality datasets from the WHO Data Integration Task Force.',
		description:
			'Datasets provided by members of the Data Integration Task Force, a multi-disciplinary group established following the first meeting of the WHO Global Platform for Air Quality (Geneva, 2014): a WHO world map, yearly global ground-monitor stations, population-weighted PM2.5 concentrations, yearly exceedances by country, and global predictions for 2011–2016 at 0.1° × 0.1° resolution.',
		tags: ['R', 'Open data', 'Air quality'],
		repo: 'https://github.com/environmental-intelligence-exeter/dimaqdata',
		site: 'https://environmental-intelligence-exeter.github.io/dimaqdata/',
		cover: 'dots'
	}
];

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
