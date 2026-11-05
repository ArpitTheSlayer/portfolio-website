"use client";

import { useState } from "react";
import { profile } from "@/lib/profile";
import SocialLinks from "@/components/SocialLinks";

export default function ContactPanel() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  }

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(profile.phone.replace(/\D/g, ""));
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2500);
    } catch {
      setCopiedPhone(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-t border-line pt-5">
        <p className="font-mono text-label uppercase text-muted">Email</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="min-w-0 break-words text-sm text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className="grid size-11 shrink-0 place-items-center border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {copiedEmail ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <p className="font-mono text-label uppercase text-muted">Phone</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href={profile.phoneHref}
            className="min-w-0 text-sm text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
          >
            {profile.phone}
          </a>
          <button
            type="button"
            onClick={copyPhone}
            aria-label="Copy phone number"
            className="grid size-11 shrink-0 place-items-center border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {copiedPhone ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <p className="font-mono text-label uppercase text-muted">Location</p>
        <p className="mt-2 text-sm text-ink-soft">{profile.location}</p>
      </div>

      <div className="border-t border-line pt-5">
        <p className="font-mono text-label uppercase text-muted">Status</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
          <span>{profile.availability}</span>
        </p>
      </div>

      <div className="border-t border-line pt-5">
        <p className="font-mono text-label uppercase text-muted">Elsewhere</p>
        <div className="mt-3">
          <SocialLinks className="flex flex-col gap-2" />
        </div>
      </div>
    </div>
  );
}
