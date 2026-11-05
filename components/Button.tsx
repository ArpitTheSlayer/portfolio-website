import Link from "next/link";
import React from "react";

interface ButtonProps {
  text?: string;
  link?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "text";
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const baseClasses =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[2px] px-5 text-sm font-semibold tracking-[0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-ink/5",
  text: "h-auto px-0 text-accent-ink underline-offset-4 hover:underline",
};

const Button: React.FC<ButtonProps> = ({
  text,
  link,
  onClick,
  variant = "primary",
  className = "",
  children,
  type = "button",
  disabled = false,
}) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  const content = children ?? text;

  if (link) {
    return (
      <Link href={link} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
};

export default Button;
