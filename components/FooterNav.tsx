const links = [
  { label: "About",   href: "/about",                                              external: false },
  { label: "Email",   href: "mailto:yishan.zhang007@gmail.com",                   external: false },
  { label: "Connect", href: "https://www.linkedin.com/in/yishan-zhang-8611a1237", external: true  },
  { label: "Archive", href: "https://case-study-site-git-main-yishanzhang007s-projects.vercel.app", external: true  },
];

export function FooterNav() {
  return (
    <nav className="text-muted flex gap-[15px] items-center text-[14px]">
      {links.map((l, i) => (
        <span key={l.label} className="flex items-center gap-[15px]">
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
          >
            {l.label}
          </a>
          {i < links.length - 1 && <span aria-hidden>•</span>}
        </span>
      ))}
    </nav>
  );
}
