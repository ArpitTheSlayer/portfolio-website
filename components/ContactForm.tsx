"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to submit message. Please try again.",
        });
      }
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "A network error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-line p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-ink"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="e.g. John Doe"
            className="mt-1.5 w-full rounded-[2px] border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/25"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ink"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="e.g. john@example.com"
            className="mt-1.5 w-full rounded-[2px] border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/25"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-ink"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, message: event.target.value }))
            }
            placeholder="Tell me about your project, timeline, or idea..."
            className="mt-1.5 w-full resize-y rounded-[2px] border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/25"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 rounded-full border-2 border-paper border-t-transparent animate-spin" />
              <span>Sending…</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Send message</span>
              <span aria-hidden="true">→</span>
            </span>
          )}
        </Button>

        <div role="status" aria-live="polite">
          {status.type === "success" ? (
            <p className="border border-ok/30 bg-ok/5 p-4 text-sm text-ok">
              {status.message}
            </p>
          ) : null}
          {status.type === "error" ? (
            <p className="border border-accent/30 bg-accent/5 p-4 text-sm text-accent-ink">
              {status.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
