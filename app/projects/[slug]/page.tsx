import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCarousel from "@/components/MediaCarousel";
import MarkdownViewer from "@/components/MarkdownViewer";
import {
  findProjectIndex,
  getProjects,
  getProjectBySlug,
} from "@/lib/projects";
import { slugify } from "@/lib/slug";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.name} — Project Case Study`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = findProjectIndex(projects, slug);

  if (index === -1) {
    notFound();
  }

  const project = projects[index];
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const hasAnyLink = Boolean(project.liveLink || project.github);

  return (
    <>
      <Navbar />
      <main
        id="main"
        className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16 lg:px-0"
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
        >
          <span aria-hidden="true">←</span>
          <span>All projects</span>
        </Link>

        <header className="mt-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            {project.tags && project.tags.length > 0 ? (
              <p className="font-mono text-meta uppercase text-muted">
                {project.tags.join(" · ")}
              </p>
            ) : null}
            {!hasAnyLink ? (
              <span className="font-mono text-meta uppercase text-accent-ink">
                Private / internal project
              </span>
            ) : null}
          </div>

          <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-page">
            {project.name}
          </h1>

          <p className="max-w-3xl text-body-lg text-ink-soft">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveLink ? (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
              >
                <span>Live preview</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}

            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink/5"
              >
                <span>Source repository</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}

            {!hasAnyLink ? (
              <p className="text-sm text-muted">
                Code repository and live environments are private per
                confidentiality agreement.
              </p>
            ) : null}
          </div>
        </header>

        <section className="mt-12">
          <MediaCarousel
            mainImage={project.src}
            alt={project.alt || `${project.name} showcase`}
            screenshots={project.screenshots || []}
            videos={project.videos || []}
          />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <MarkdownViewer
            content={
              project.readme ||
              `# ${project.name}\n\n${project.description}\n\n## Core Technologies\n${
                project.tags
                  ? project.tags.map((tag) => `- ${tag}`).join("\n")
                  : ""
              }`
            }
          />
        </section>

        <nav
          aria-label="Project navigation"
          className="mt-16 grid gap-6 border-t border-line pt-8 sm:grid-cols-2"
        >
          <div>
            {previous ? (
              <Link
                href={`/projects/${previous.slug ?? slugify(previous.name)}`}
                className="group block"
              >
                <span className="font-mono text-label uppercase text-muted">
                  ← Previous
                </span>
                <span className="mt-2 block text-card font-semibold underline-offset-4 group-hover:underline">
                  {previous.name}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-label uppercase text-muted">
                ← Previous
              </span>
            )}
          </div>
          <div className="sm:text-right">
            {next ? (
              <Link
                href={`/projects/${next.slug ?? slugify(next.name)}`}
                className="group block"
              >
                <span className="font-mono text-label uppercase text-muted">
                  Next →
                </span>
                <span className="mt-2 block text-card font-semibold underline-offset-4 group-hover:underline">
                  {next.name}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-label uppercase text-muted">
                Next →
              </span>
            )}
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
