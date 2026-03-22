import { Command } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'AI Agents', href: '#services' },
    { label: 'Retreats', href: '#services' },
    { label: 'Tax & Capital', href: '#services' },
    { label: 'Command Center', href: '/dashboard' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Mission', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ],
  Resources: [
    { label: 'Investment Dashboard', href: '/investments' },
    { label: 'Kingdom Blueprint', href: '#contact' },
    { label: 'Partner Network', href: '#' },
    { label: 'Give-Back Report', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ai via-retreats to-tax">
                <Command className="h-5 w-5 text-background" />
              </div>
              <div>
                <span className="text-lg font-bold">Kingdom</span>
                <span className="text-lg font-light text-muted-foreground ml-1">Command</span>
              </div>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              AI Agents. Transformative Retreats. Strategic Tax & Capital.
              Three pillars. One kingdom. Built to last generations.
            </p>
            <p className="text-xs text-muted-foreground/60">
              20% of all profits are allocated to Kingdom give-back initiatives.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Kingdom Command. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
