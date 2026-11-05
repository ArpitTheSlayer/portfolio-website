export interface ProjectItem {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  readme?: string;
  src: string;
  alt?: string;
  github?: string;
  liveLink?: string;
  screenshots?: string[];
  videos?: string[];
  tags?: string[];
  order?: number;
}

export const defaultProjects: ProjectItem[] = [
  {
    name: "Digital Poonam Web Platform",
    slug: "digital-poonam-web-platform",
    description:
      "Overhauled company's legacy platform into a high-performance, fully responsive Next.js web application with AI-augmented workflows, Shopify inventory sync, and live custom domain deployment.",
    readme: `# Digital Poonam Web Platform

A high-performance modern web platform engineered for **Digital Poonam (Shree Shivam Venture)**.

## Project Overview
This project involved a complete architectural overhaul from a legacy structure into a responsive, component-driven **Next.js** web application. Designed to manage high visitor traffic, synchronized inventory lookup, and high-conversion commercial showcases.

### Key Highlights & Features
- **Next.js Framework Platform Migration**: Migrated layout and animations for modern performance.
- **AI-Augmented Product Pipeline**: Automated ingestion mapping retail database API streams into a clean frontend.
- **Interactive Stock Check Dashboard**: Real-time lookup interface for multi-outlet retail items.
- **Vercel Edge Deployment**: Deployed with custom SSL domain integration and automated workflows.

## Technology Stack
| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js, React.js, Tailwind CSS |
| **Integration** | Shopify Storefront API, Custom Retail APIs |
| **Automation** | AI Image Parsing, Inventory Sync Pipeline |
| **Hosting** | Vercel Edge Network |
`,
    src: "/images/project-images/digital-poonam.png",
    alt: "Digital Poonam screenshot",
    github: "https://github.com/ArpitTheSlayer",
    liveLink: "https://digitalpoonam.com",
    tags: ["Next.js", "Shopify API", "Tailwind CSS", "Vercel"],
    order: 1,
  },
  {
    name: "AI Bizz Pro Platform",
    slug: "ai-bizz-pro-platform",
    description:
      "Engineered a high-converting landing platform with automated conversational workflows to manage user scaling, traffic ingestion, and automated WhatsApp/email communications.",
    readme: `# AI Bizz Pro Platform

Automated marketing and conversational workflow platform built to scale startup conversions.

## Overview
**AI Bizz Pro** bridges high-speed marketing landing pages with enterprise communication pipelines. Designed to capture leads, qualify visitor intents, and trigger instant WhatsApp and email notifications.

### Core Capabilities
- **Automated Messaging**: Real-time WhatsApp API integration for immediate lead engagement.
- **Responsive Presentation**: Crafted with Tailwind CSS and modern reactive micro-interactions.
- **Analytics & Tracking**: Event pipeline measuring conversion funnels and inquiry submissions.

## Tech Stack
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **APIs**: WhatsApp Business API, Email Webhooks
- **Deployment**: Vercel
`,
    src: "/images/project-images/aibizzpro.png",
    alt: "AI Bizz Pro screenshot",
    github: "https://github.com/ArpitTheSlayer",
    liveLink: "https://aibizzpro.com",
    tags: ["Next.js", "AI Automation", "WhatsApp API", "Tailwind CSS"],
    order: 2,
  },
  {
    name: "Tomato - Food Delivery Web App",
    slug: "tomato-food-delivery",
    description:
      "Full-stack food delivery application with cart, secure Stripe payment, admin panel, and real-time order tracking.",
    readme: `# Tomato - Food Delivery Web Application

A full-stack, end-to-end food ordering platform featuring client ordering, Stripe payments, and a separate administrative management portal.

## Features
- **Menu Browsing & Filtering**: Dynamic category filters, search, and dish detail modals.
- **Cart Management**: Real-time quantity updates and price calculations.
- **Stripe Checkout**: Secure payment processing with webhooks and order persistence.
- **Admin Management Portal**: Real-time dish creation, status toggles, and incoming order processing.

## Architecture
| Component | Technologies |
| :--- | :--- |
| **Client Frontend** | React.js, Tailwind CSS, Context API |
| **Admin Panel** | React.js, Vite |
| **Backend API** | Node.js, Express.js |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Payments** | Stripe API |
`,
    src: "/images/project-images/tomato.png",
    alt: "Tomato food delivery screenshot",
    github: "https://github.com/ArpitTheSlayer/Tomato",
    liveLink: "https://tomato-frontend-whxx.onrender.com/",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    order: 3,
  },
  {
    name: "MeTube - YouTube Clone",
    slug: "metube-youtube-clone",
    description:
      "Feature-packed video streaming clone of YouTube utilizing the YouTube RapidAPI with search, video playback, and channel insights.",
    readme: `# MeTube - Video Streaming Platform

A responsive YouTube clone offering search, playback, channel exploration, and category feeds.

## Highlights
- **Video Playback**: Integrated React Player with playback controls and recommended video feeds.
- **Search & Filter**: Keyword-based search and popular category pill selectors.
- **Channel Profiles**: Detailed view of channel subscriber counts, video archives, and descriptions.

## Tech Stack
- React.js
- RapidAPI (YouTube V3)
- Tailwind CSS
- React Player
`,
    src: "/images/project-images/metube.png",
    alt: "MeTube screenshot",
    github: "https://github.com/ArpitTheSlayer/7_Youtube_Clone",
    liveLink: "https://metube1.netlify.app/",
    tags: ["React", "RapidAPI", "Tailwind CSS"],
    order: 4,
  },
  {
    name: "X UI Clone",
    slug: "x-ui-clone",
    description:
      "High-fidelity responsive user interface clone of Twitter/X crafted with clean modern Tailwind CSS styling.",
    readme: `# X (Twitter) UI Clone

A pixel-accurate desktop and mobile responsive reproduction of the Twitter/X feed interface.

## Highlights
- **Feed & Timeline**: Dynamic tweet cards, retweets, and engagement counters.
- **Navigation Sidebar & Trends**: Responsive sidebar with trend ranking and search bar.
- **Clean Responsive Layout**: Built exclusively with modern utility classes in Tailwind CSS.
`,
    src: "/images/project-images/x-ui-clone.png",
    alt: "X UI Clone screenshot",
    github: "https://github.com/ArpitTheSlayer/x-clone",
    liveLink: "https://arpittheslayer.github.io/x-clone/",
    tags: ["Tailwind CSS", "HTML5", "Responsive Design"],
    order: 5,
  },
  {
    name: "Contact Management Web App",
    slug: "contact-management-app",
    description:
      "Intuitive contact manager web application featuring full CRUD capabilities, instant search, and contact filtering.",
    readme: `# Contact Management Web Application

A clean contact organizer featuring quick search, contact categorization, and complete CRUD functionality.

## Features
- Create, view, edit, and delete contact details.
- Real-time instant search by name or email.
- Mobile-friendly card and list views.
`,
    src: "/images/project-images/contact-management.png",
    alt: "Contact Management screenshot",
    github: "https://github.com/ArpitTheSlayer/contact-management-web-app",
    liveLink: "https://contact-management-web-app-vert.vercel.app/",
    tags: ["React", "REST API", "Tailwind CSS"],
    order: 6,
  },
  {
    name: "Todo List App",
    slug: "todo-list-app",
    description:
      "Lightweight and productive task tracking app built with React state management and local storage persistence.",
    readme: `# Todo List Application

Productivity task tracker with local storage persistence and completion filters.
`,
    src: "/images/project-images/todo-list.png",
    alt: "Todo List screenshot",
    github: "https://github.com/ArpitTheSlayer/todo-list-app",
    liveLink: "https://todo-list-app6.netlify.app/",
    tags: ["React", "JavaScript", "CSS3"],
    order: 7,
  },
  {
    name: "Dummy Landing Page",
    slug: "dummy-landing-page",
    description:
      "Modern corporate marketing landing page with responsive layouts, fluid typography, and clean design aesthetics.",
    readme: `# Corporate Marketing Landing Page

Clean, high-conversion marketing showcase landing page.
`,
    src: "/images/project-images/dummy-landing-page.png",
    alt: "Dummy Landing Page screenshot",
    github: "https://github.com/arpittheslayer/dummy-landing-page",
    liveLink: "https://dummy-landing-page-alpha.vercel.app/",
    tags: ["HTML5", "CSS3", "JavaScript"],
    order: 8,
  },
];
