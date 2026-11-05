import { profile } from "@/lib/profile";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {profile.socials.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-meta uppercase text-muted underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
          >
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
