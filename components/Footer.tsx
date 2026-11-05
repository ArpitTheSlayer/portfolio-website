import Link from "next/link";
import { profile } from "@/lib/profile";
import SocialLinks from "./SocialLinks";

const footerNav = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-site px-6 py-14 md:px-10 lg:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink">
              {profile.name}
            </p>
            <p className="mt-1 font-mono text-meta uppercase text-muted">
              {profile.role}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
              <span>{profile.availability}</span>
            </p>
          </div>

          <div>
            <p className="font-mono text-label uppercase text-muted">Navigate</p>
            <ul className="mt-4 flex flex-col gap-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-label uppercase text-muted">Elsewhere</p>
            <div className="mt-4">
              <SocialLinks className="flex flex-col gap-2" />
            </div>
          </div>

          <div>
            <p className="font-mono text-label uppercase text-muted">Contact</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.phoneHref}
                  className="text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
                >
                  {profile.phone}
                </a>
              </li>
              <li>
                <a
                  href={profile.cv}
                  className="text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
                >
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
