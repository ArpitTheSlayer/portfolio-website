import Image from "next/image";
import Link from "next/link";
import profilePic from "@/assets/images/profile-pic.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";
import Proficiency from "@/components/Proficiency";
import WorkCard from "@/components/WorkCard";
import SocialLinks from "@/components/SocialLinks";
import { FEATURED_COUNT, getProjects } from "@/lib/projects";
import {
  about,
  education,
  experience,
  profile,
  toolkit,
} from "@/lib/profile";
import { slugify } from "@/lib/slug";

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();
  const featured = projects.slice(0, FEATURED_COUNT);
  const count = `${String(featured.length).padStart(2, "0")} / ${String(
    projects.length
  ).padStart(2, "0")}`;

  return (
    <>
      <Navbar />
      <main
        id="main"
        className="mx-auto w-full max-w-site px-6 pb-4 md:px-10 lg:px-16"
      >
        <section className="grid gap-12 pt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7" duration={0.36}>
            <p className="font-mono text-label uppercase text-muted">
              Portfolio — 2026 / {profile.shortLocation}
            </p>
            <h1 className="mt-6 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-[56px] sm:leading-[1.04] lg:text-display">
              <span className="block">I build fast,</span>
              <span className="block">considered interfaces</span>
              <span className="block">for real products.</span>
            </h1>
            <p className="mt-6 max-w-[610px] text-body-lg text-ink-soft">
              {profile.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button text="View selected work" link="/#work" />
              <Button text="Download CV" link={profile.cv} variant="outline" />
            </div>
            <p className="mt-8 font-mono text-meta uppercase text-muted">
              {profile.credentials}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.12} duration={0.48}>
            <div className="relative aspect-[4/5] w-full max-w-[396px] overflow-hidden border border-line bg-paper-deep lg:ml-auto lg:aspect-[396/440]">
              <Image
                src={profilePic}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 396px"
                className="object-cover"
              />
            </div>
            <p className="mt-3 max-w-[396px] font-mono text-meta uppercase text-muted lg:ml-auto">
              {profile.name} / {profile.current.company}
            </p>
            <div className="mt-6 max-w-[396px] border-t border-line pt-4 lg:ml-auto">
              <p className="font-mono text-label uppercase text-muted">
                Currently
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">
                {profile.current.role}
              </p>
              <p className="text-sm text-ink-soft">{profile.current.company}</p>
              <p className="mt-1 font-mono text-meta uppercase text-muted">
                {profile.current.period} · {profile.current.location}
              </p>
            </div>
          </Reveal>
        </section>

        <section
          id="work"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="Selected work" right={count} />
          <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, index) => (
              <WorkCard
                key={project.slug ?? project.name}
                project={project}
                href={`/projects/${project.slug ?? slugify(project.name)}`}
                priority={index === 0}
              />
            ))}
          </div>
          <div className="mt-10">
            <Button text="All projects →" link="/projects" variant="text" />
          </div>
        </section>

        <section
          id="experience"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="Experience" />
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                {experience.role}
              </h2>
              <p className="mt-1 text-ink-soft">{experience.company}</p>
              <p className="mt-2 font-mono text-meta uppercase text-muted">
                {experience.period} · {experience.location}
              </p>
              <p className="mt-6 font-mono text-meta uppercase text-muted">
                {experience.technologies.join(" · ")}
              </p>
            </div>
            <ul className="space-y-6 lg:col-span-8">
              {experience.achievements.map((achievement) => (
                <li
                  key={achievement.title}
                  className="border-l-2 border-accent/40 pl-4"
                >
                  <h3 className="font-semibold text-ink">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-ink-soft">
                    {achievement.description}
                  </p>
                  {achievement.url && achievement.linkLabel ? (
                    <a
                      href={achievement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-accent-ink underline-offset-4 hover:underline"
                    >
                      {achievement.linkLabel} ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="toolkit"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="Toolkit" />
          <div className="mt-2">
            {toolkit.map((group) => (
              <div
                key={group.label}
                className="grid gap-2 border-t border-line py-5 md:grid-cols-[200px_1fr]"
              >
                <p className="font-mono text-meta uppercase text-muted">
                  {group.label}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline gap-2 text-ink"
                    >
                      <span>{item.name}</span>
                      {item.level ? (
                        <Proficiency level={item.level} />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="education"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="Education" />
          <div className="mt-2">
            {education.map((item) => (
              <div
                key={item.degree}
                className="grid gap-2 border-t border-line py-5 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <h3 className="text-card font-semibold">{item.degree}</h3>
                  <p className="text-sm text-ink-soft">
                    {item.institution} · {item.location}
                  </p>
                  <p className="mt-1 font-mono text-meta uppercase text-muted">
                    {item.duration}
                  </p>
                </div>
                <p className="font-mono text-sm text-accent-ink">
                  {item.score}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="About" />
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {about.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="mt-3 text-ink-soft">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="mt-20 border-t border-line pt-12 md:mt-28 md:pt-16"
        >
          <SectionLabel label="Contact" />
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 block break-words text-[clamp(1.75rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink underline-offset-8 transition-colors hover:text-accent-ink hover:underline"
          >
            {profile.email}
          </a>
          <div className="mt-8 grid gap-6 border-t border-line pt-6 md:grid-cols-3">
            <div>
              <p className="font-mono text-label uppercase text-muted">Phone</p>
              <a
                href={profile.phoneHref}
                className="mt-2 inline-block text-ink-soft underline-offset-4 hover:text-accent-ink hover:underline"
              >
                {profile.phone}
              </a>
            </div>
            <div>
              <p className="font-mono text-label uppercase text-muted">
                Location
              </p>
              <p className="mt-2 text-ink-soft">{profile.location}</p>
            </div>
            <div>
              <p className="font-mono text-label uppercase text-muted">Status</p>
              <p className="mt-2 flex items-center gap-2 text-ink-soft">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-ok"
                />
                <span>{profile.availability}</span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <SocialLinks className="flex flex-wrap gap-4" />
          </div>
          <div className="mt-10">
            <Link
              href="/contact"
              className="text-sm font-semibold text-accent-ink underline-offset-4 hover:underline"
            >
              Contact page →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
