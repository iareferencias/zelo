import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center space-y-8">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground">
          SaaS Starter
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A clean foundation for your next product.<br />
          Auth, database, and design system — ready to go.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
