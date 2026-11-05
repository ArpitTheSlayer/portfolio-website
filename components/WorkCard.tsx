import Image from "next/image";
import Link from "next/link";
import type { ProjectItem } from "@/lib/defaultProjects";

interface WorkCardProps {
  project: ProjectItem;
  href: string;
  index?: number;
  variant?: "compact" | "full";
  priority?: boolean;
}

export default function WorkCard({
  project,
  href,
  index,
  variant = "compact",
  priority = false,
}: WorkCardProps) {
  const tags = project.tags?.slice(0, variant === "compact" ? 2 : undefined) ?? [];

  if (variant === "compact") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[2.05/1] overflow-hidden border border-line bg-paper-deep">
          <Image
            src={project.src}
            alt={project.alt ?? project.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 416px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-card font-semibold underline-offset-4 group-hover:underline">
            {project.name}
          </h3>
          <span
            aria-hidden="true"
            className="text-accent transition-transform duration-150 group-hover:translate-x-[3px]"
          >
            ↗
          </span>
        </div>
        <p className="mt-1 font-mono text-meta uppercase text-muted">
          {tags.join(" · ")}
        </p>
      </Link>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="relative block aspect-[2.05/1] overflow-hidden border border-line bg-paper-deep"
      >
        <Image
          src={project.src}
          alt={project.alt ?? project.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
        />
      </Link>

      <div className="mt-4 flex items-baseline gap-3">
        {typeof index === "number" ? (
          <span className="font-mono text-meta text-accent-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <Link
          href={href}
          className="text-card font-semibold underline-offset-4 group-hover:underline"
        >
          {project.name}
        </Link>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
        {project.description}
      </p>

      <p className="mt-3 font-mono text-meta uppercase text-muted">
        {tags.join(" · ")}
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        {project.liveLink ? (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-ink underline-offset-4 hover:underline"
          >
            Live ↗
          </a>
        ) : null}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-ink underline-offset-4 hover:underline"
          >
            Source ↗
          </a>
        ) : null}
        {!project.liveLink && !project.github ? (
          <span className="text-muted">Private project</span>
        ) : null}
      </div>
    </article>
  );
}
