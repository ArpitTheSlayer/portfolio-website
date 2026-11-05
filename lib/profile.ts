export type SkillLevel = "Advanced" | "Proficient" | "Intermediate";

export interface SocialLink {
  label: string;
  href: string;
}

export interface ToolkitItem {
  name: string;
  level?: SkillLevel;
}

export interface ToolkitGroup {
  label: string;
  items: ToolkitItem[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  score: string;
}

export interface ExperienceAchievement {
  title: string;
  description: string;
  url?: string;
  linkLabel?: string;
}

export interface AboutSection {
  title: string;
  body: string;
}

export const profile = {
  name: "Arpit Pandey",
  role: "Frontend Developer",
  location: "Raipur, Chhattisgarh, India",
  shortLocation: "Raipur, IN",
  availability: "Available for work",
  email: "arpitpandey.2001@gmail.com",
  phone: "+91-8318346405",
  phoneHref: "tel:+918318346405",
  cv: "/Resume.pdf",
  intro:
    "Frontend developer with a full-stack foundation. I turn complex requirements into responsive Next.js products — currently rebuilding the Digital Poonam platform and shipping AI-augmented tooling.",
  credentials: "MCA 9.34 CGPA · BCA 9.00 CGPA · 6+ PROJECTS SHIPPED",
  current: {
    role: "Frontend Developer",
    company: "Digital Poonam (Shree Shivam Venture)",
    period: "13 May 2026 — Present",
    location: "Raipur, Chhattisgarh",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/arpittheslayer" },
    { label: "LinkedIn", href: "https://linkedin.com/in/arpittheslayer" },
    { label: "Instagram", href: "https://instagram.com/arpittheslayer" },
  ] satisfies SocialLink[],
};

export const experience = {
  role: "Frontend Developer",
  company: "Digital Poonam (Shree Shivam Venture)",
  period: "13 May 2026 — Present",
  location: "Raipur, Chhattisgarh",
  achievements: [
    {
      title: "Next.js Framework Platform Migration",
      description:
        "Migrated the company’s main web platform layout to a modern Next.js framework (digitalpoonam.com) using AI and visual platforms to design high-end animations and content structure.",
      url: "https://digitalpoonam.com",
      linkLabel: "digitalpoonam.com",
    },
    {
      title: "AI-Driven Automated Product Listing Pipeline",
      description:
        "Built an AI-driven automated product listing pipeline that leverages internal inventory APIs and image parsing tools to generate structured data for ingestion into Shopify stores.",
    },
    {
      title: "Interactive Stock Check & Lookup Dashboard",
      description:
        "Created a visual lookup interface and interactive Stock Check dashboard, mapping retail database API streams into a clean, responsive frontend layout.",
    },
    {
      title: "Scalable Landing Pages & Workflows on Vercel",
      description:
        "Deployed scalable landing platforms (aibizzpro.com and marketing landing pages) on Vercel with integrated automated email and WhatsApp communication workflows.",
      url: "https://aibizzpro.com",
      linkLabel: "aibizzpro.com",
    },
    {
      title: "Full-Stack Startup Engineering",
      description:
        "Maintained core full-stack parameters; merged foundational coding with modern automation tools to support daily startup technical needs.",
    },
  ] satisfies ExperienceAchievement[],
  technologies: [
    "Next.js",
    "React",
    "Shopify APIs",
    "AI Image Parsing",
    "Vercel",
    "WhatsApp API",
    "Tailwind CSS",
    "REST APIs",
  ],
};

export const toolkit: ToolkitGroup[] = [
  {
    label: "Frontend",
    items: [
      { name: "HTML5", level: "Advanced" },
      { name: "CSS3", level: "Advanced" },
      { name: "JavaScript", level: "Proficient" },
      { name: "React.js", level: "Proficient" },
      { name: "Next.js", level: "Proficient" },
      { name: "Tailwind CSS", level: "Proficient" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Node.js", level: "Intermediate" },
      { name: "Express.js", level: "Proficient" },
      { name: "MySQL", level: "Proficient" },
      { name: "MongoDB", level: "Intermediate" },
    ],
  },
  {
    label: "Design",
    items: [{ name: "Figma", level: "Proficient" }],
  },
  {
    label: "Practice",
    items: [
      { name: "AI-augmented workflows" },
      { name: "REST APIs" },
      { name: "Responsive systems" },
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "MATS University",
    location: "Raipur, Chhattisgarh",
    duration: "July 2024 - July 2026",
    score: "9.34 CGPA",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "MATS University",
    location: "Raipur, Chhattisgarh",
    duration: "July 2022 - May 2024",
    score: "9.00 CGPA",
  },
  {
    degree: "Diploma in Computer Applications (DCA)",
    institution: "Kalinga University",
    location: "Raipur, Chhattisgarh",
    duration: "July 2020 - May 2021",
    score: "8.38 CGPA",
  },
];

export const about: AboutSection[] = [
  {
    title: "The journey",
    body: "I started with a Diploma in Computer Applications, then a BCA and an MCA at MATS University, finishing with 9.34 and 9.00 CGPA. Alongside the degrees I kept building: small interfaces first, then full-stack apps, then production platforms. That mix of formal computer science and hands-on shipping is how I learned to read a requirement, question it, and turn it into something people can actually use.",
  },
  {
    title: "How I work",
    body: "I work close to the design and close to the data. A good interface is not decoration; it is the shortest honest path between a person and what they came to do. In practice that means understanding the API before styling the screen, keeping components small, testing at real widths, and trimming anything that does not help the reader. I use AI to move faster, but I review what it produces.",
  },
];
