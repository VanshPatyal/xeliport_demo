import { Logo } from './logo'

const links = ['Platform', 'Customs AI', 'Trade Lanes', 'Pricing']

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Logo />
      <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
        {links.map((link) => (
          <a
            key={link}
            href="#dashboard"
            className="text-sm font-semibold text-navy transition-colors hover:text-cargo-strong"
          >
            {link}
          </a>
        ))}
      </nav>
      <a
        href="#dashboard"
        className="rounded-lg border border-steel bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-navy"
      >
        Sign in
      </a>
    </header>
  )
}
