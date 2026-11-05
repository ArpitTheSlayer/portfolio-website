import { cache } from "react";
import { defaultProjects, type ProjectItem } from "./defaultProjects";
import { slugify } from "./slug";

export const FEATURED_COUNT = 3;

export const getProjects = cache(async (): Promise<ProjectItem[]> => {
  try {
    if (!process.env.MONGODB_URI) return defaultProjects;
    const { connectToDatabase } = await import("./mongodb");
    const Project = (await import("@/models/Project")).default;
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    if (!projects || projects.length === 0) return defaultProjects;
    return JSON.parse(JSON.stringify(projects)) as ProjectItem[];
  } catch (err) {
    console.warn("Using fallback projects data", err);
    return defaultProjects;
  }
});

export function findProjectIndex(projects: ProjectItem[], slug: string): number {
  return projects.findIndex(
    (p) =>
      p.slug === slug ||
      p._id === slug ||
      slugify(p.name) === slug ||
      p.name.toLowerCase() === slug.toLowerCase()
  );
}

export function findProject(
  projects: ProjectItem[],
  slug: string
): ProjectItem | null {
  const index = findProjectIndex(projects, slug);
  return index === -1 ? null : projects[index];
}

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectItem | null> => {
    const projects = await getProjects();
    return findProject(projects, slug);
  }
);
