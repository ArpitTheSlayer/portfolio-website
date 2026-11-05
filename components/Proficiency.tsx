import type { SkillLevel } from "@/lib/profile";

export default function Proficiency({ level }: { level: SkillLevel }) {
  return <span className="text-sm font-normal text-muted">{level}</span>;
}
