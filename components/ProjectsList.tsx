"use client";

import { useEffect, useState } from "react";
import { defaultProjects, type ProjectItem } from "@/lib/defaultProjects";
import { slugify } from "@/lib/slug";
import SectionLabel from "@/components/SectionLabel";
import WorkCard from "@/components/WorkCard";

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (
            data.success &&
            Array.isArray(data.projects) &&
            data.projects.length > 0
          ) {
            setProjects(data.projects);
          }
        }
      } catch (err) {
        console.warn("Using fallback projects data", err);
      }
    }

    loadProjects();
  }, []);

  const count = String(projects.length).padStart(2, "0");

  return (
    <>
      <SectionLabel label="Selected work" right={count} />
      <h1 className="mt-6 text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-page">
        Work, shipped.
      </h1>
      <p className="mt-4 max-w-[620px] text-body-lg text-ink-soft">
        Selected projects from the last few years — commercial platforms,
        full-stack apps and UI builds.
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-14 lg:grid-cols-2">
        {projects.map((project, index) => {
          const projectSlug =
            project.slug || slugify(project.name) || project._id || String(index);

          return (
            <WorkCard
              key={project._id ?? projectSlug}
              project={project}
              href={`/projects/${projectSlug}`}
              index={index}
              variant="full"
            />
          );
        })}
      </div>
    </>
  );
}
