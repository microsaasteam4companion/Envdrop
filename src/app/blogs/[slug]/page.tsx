import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

const blogPosts: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  content: { type: string; text?: string; items?: string[] }[];
}> = {
  "hidden-cost-of-exposed-env-files": {
    title: "The hidden cost of exposed .env files in 2026",
    category: "Security",
    date: "April 02, 2026",
    readTime: "6 min read",
    image: "/assets/blog1.png",
    author: "envdrop Engineering",
    authorRole: "Security Team",
    content: [
      { type: "p", text: "In 2026, exposed environment files remain one of the most underestimated attack vectors in modern software development. Despite widespread awareness, teams continue to leak secrets through misconfigured repositories, insecure handoffs, and forgotten staging environments." },
      { type: "h2", text: "The Real Cost Is Not Just Financial" },
      { type: "p", text: "When a .env file leaks, the immediate impact is obvious — API keys get revoked, services go down, and the incident response team kicks off. But the hidden costs compound silently: customer trust erodes, compliance audits are triggered, and developer velocity drops for weeks as security reviews slow every merge." },
      { type: "h2", text: "How It Happens — Still, in 2026" },
      { type: "ul", items: ["Sharing .env files over Slack or email during onboarding", "Accidentally committing to a public fork of a private repo", "Leaving secrets in CI/CD build logs", "Passing secrets as plain text in pull request comments"] },
      { type: "h2", text: "The Zero-Knowledge Alternative" },
      { type: "p", text: "Tools like envdrop encrypt secrets client-side before they ever touch a server. The decryption key lives only in the URL fragment — which by design is never sent to any server. This means even if the backend is fully compromised, your secrets remain protected." },
      { type: "h2", text: "What You Should Do Today" },
      { type: "ul", items: ["Rotate any key that has ever been in a .env file sent over plaintext", "Adopt a zero-knowledge sharing flow for all new secret handoffs", "Audit your CI/CD pipelines for secrets printed in logs", "Never share secret material through chat or email again"] },
      { type: "p", text: "The good news: the tooling to prevent this has never been more accessible. The bad news: most teams won't change until after an incident. Don't be that team." },
    ]
  },
  "zero-knowledge-backend-redis": {
    title: "Building a Zero-Knowledge backend with Redis",
    category: "Engineering",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    image: "/assets/blog2.png",
    author: "envdrop Engineering",
    authorRole: "Platform Team",
    content: [
      { type: "p", text: "At envdrop, our backend stores encrypted ciphertext — and literally nothing else. Here's exactly how we built a Redis-backed system that makes it mathematically impossible for us to read your secrets." },
      { type: "h2", text: "The Architecture" },
      { type: "p", text: "The core insight is simple: encrypt before you send. Using the Web Crypto API's AES-256-GCM implementation, the client encrypts the plaintext secret and generates a random 256-bit key. The ciphertext gets sent to our API; the key becomes the URL fragment." },
      { type: "h2", text: "Why URL Fragments?" },
      { type: "p", text: "The fragment identifier (the part after #) is never sent to the server by the browser. This is a fundamental property of HTTP. So when you share a link like https://envdrop.com/share/abc123#key=xyz, our servers only ever see /share/abc123 — never the key." },
      { type: "h2", text: "Redis as an Ephemeral Buffer" },
      { type: "ul", items: ["SET with EXAT for automatic TTL expiry", "DEL on first read for burn-after-reading semantics", "No persistent disk storage — data dies with the instance if TTL hasn't fired", "Upstash for serverless-compatible Redis at the edge"] },
      { type: "h2", text: "The Threat Model" },
      { type: "p", text: "Even if an attacker gains full access to our Redis cluster, all they find is AES-256-GCM ciphertext with no associated key material. Without the URL fragment, decryption is computationally infeasible — it would take longer than the age of the universe to brute-force a 256-bit key." },
      { type: "p", text: "This is what zero-knowledge actually means in practice: not a policy promise, but a cryptographic guarantee." },
    ]
  },
  "team-needs-secret-handshake": {
    title: "Why your team needs a secret handshake",
    category: "Product",
    date: "Mar 22, 2026",
    readTime: "5 min read",
    image: "/assets/blog3.png",
    author: "envdrop Engineering",
    authorRole: "Product Team",
    content: [
      { type: "p", text: "Every team has a ritual for sharing environment variables with a new developer. Most of those rituals involve some combination of Slack messages, email attachments, or that one shared Notion page with seventeen different versions of the production database URL." },
      { type: "h2", text: "The Problem with Tribal Knowledge" },
      { type: "p", text: "When secret-sharing is informal, it becomes invisible to your security posture. You don't know who has what, when they got it, or whether what they have is current. This isn't just a security problem — it's an ops problem that costs real engineering hours every sprint." },
      { type: "h2", text: "A Secret Handshake is a Protocol" },
      { type: "ul", items: ["One canonical way to share secrets — no exceptions", "Audit trail of every handoff with timestamps and recipients", "Automatic expiry so stale credentials don't linger", "Zero plaintext transmission at any point in the chain"] },
      { type: "h2", text: "What Changes When You Have a Protocol" },
      { type: "p", text: "Onboarding becomes a 2-minute operation instead of a 30-minute treasure hunt. Security reviews go from 'we think we shared this securely' to 'here is the cryptographic proof.' And when something goes wrong, you have receipts." },
      { type: "p", text: "Build the protocol once. Your future self — and your security auditor — will thank you." },
    ]
  },
  "automating-environment-sync-cicd": {
    title: "Automating environment sync in CI/CD pipelines",
    category: "DevOps",
    date: "Mar 15, 2026",
    readTime: "7 min read",
    image: "/assets/blog1.png",
    author: "envdrop Engineering",
    authorRole: "DevOps Team",
    content: [
      { type: "p", text: "CI/CD pipelines are the most common place where secrets get mishandled at scale. When you automate everything, you automate the risks too — unless you design the secret layer correctly from the start." },
      { type: "h2", text: "The Three Common Mistakes" },
      { type: "ul", items: ["Hardcoding secrets in pipeline YAML files committed to git", "Printing environment variables in build logs for debugging", "Using the same secrets across staging, preview, and production environments"] },
      { type: "h2", text: "The Right Model: Inject, Don't Embed" },
      { type: "p", text: "Secrets should be injected at runtime from a secure vault, never embedded in pipeline configuration. Your pipeline YAML should contain only references to secret names, never values. The CI runner fetches values at execution time under its own scoped identity." },
      { type: "h2", text: "Using envdrop in Your Pipeline" },
      { type: "p", text: "With the envdrop CLI, you can create time-limited secrets programmatically and pass them as one-time URLs to downstream pipeline stages. Each handoff is encrypted, logged, and automatically purged after reading — so even if a pipeline step is replayed, old secret URLs are already burnt." },
      { type: "ul", items: ["envdrop CLI: create a secret and get a burn-link", "Pass the link as a pipeline artifact, not the secret itself", "Downstream stages decode and inject into process environment", "TTL ensures the window for replay attacks is seconds, not days"] },
    ]
  },
  "rise-of-ephemeral-secrets": {
    title: "The rise of ephemeral secrets in cloud computing",
    category: "Trends",
    date: "Mar 08, 2026",
    readTime: "5 min read",
    image: "/assets/blog2.png",
    author: "envdrop Engineering",
    authorRole: "Research Team",
    content: [
      { type: "p", text: "The industry is converging on a philosophy: secrets should live for exactly as long as they are needed, and no longer. This shift toward ephemerality is driven by both improved tooling and a more mature understanding of the threat landscape." },
      { type: "h2", text: "Why Long-Lived Credentials Are a Liability" },
      { type: "p", text: "Every day a credential exists is another day it can be exfiltrated. Static API keys, long-lived database passwords, and indefinite service account tokens are concentration points of risk. The longer they live, the more systems they touch, and the harder they are to rotate safely." },
      { type: "h2", text: "The Ephemeral Pattern" },
      { type: "ul", items: ["Short-lived JWTs signed at request time with sub-minute expiry", "OIDC federation instead of static cloud access keys", "Burn-after-reading links for secret handoffs", "Process-scoped environment injection that doesn't persist to disk"] },
      { type: "h2", text: "Where This Is Headed" },
      { type: "p", text: "The next five years will see credentials with lifetimes measured in seconds become standard practice. Hardware attestation (TPM, Secure Enclave) will bind credentials to verified machine identities. The static .env file will look as archaic as passing passwords in a GET parameter." },
    ]
  },
  "securing-keys-microservices": {
    title: "Securing keys in a microservices architecture",
    category: "Engineering",
    date: "Feb 28, 2026",
    readTime: "9 min read",
    image: "/assets/blog3.png",
    author: "envdrop Engineering",
    authorRole: "Platform Team",
    content: [
      { type: "p", text: "Microservices amplify the secret management problem by a factor equal to the number of services you run. Instead of one .env file, you now have dozens, each with its own set of credentials, each needing rotation, each representing a potential breach point." },
      { type: "h2", text: "The Blast Radius Problem" },
      { type: "p", text: "In a monolith, a compromised secret is a bad day. In a microservices architecture, one compromised service can be the stepping stone to credentials for every other service it communicates with. Secret sprawl directly increases blast radius." },
      { type: "h2", text: "Service Identity as the Foundation" },
      { type: "ul", items: ["Each service should have a cryptographic identity (mTLS certificate)", "Credentials should be issued to identities, not to deployment targets", "SPIFFE/SPIRE for workload identity in Kubernetes environments", "Short-lived credentials bound to service identity, not environment variables"] },
      { type: "h2", text: "For Teams Not Yet at That Scale" },
      { type: "p", text: "If you're not yet running a full SPIFFE mesh, the minimum viable improvement is: centralized secret storage (not per-service .env files), individual service API tokens with minimal scope, and automatic rotation cadence. envdrop handles the handoff layer — the moment you need to bootstrap a new service with its initial credentials." },
    ]
  },
  "envdrop-vs-traditional-secret-managers": {
    title: "envdrop vs Traditional Secret Managers",
    category: "Compare",
    date: "Feb 21, 2026",
    readTime: "6 min read",
    image: "/assets/blog1.png",
    author: "envdrop Engineering",
    authorRole: "Product Team",
    content: [
      { type: "p", text: "Traditional secret managers like Hashicorp Vault, AWS Secrets Manager, and Azure Key Vault are powerful — and also heavyweight, expensive to operate, and overkill for the secret handoff problem. envdrop focuses specifically on the moment of transfer." },
      { type: "h2", text: "Where They Excel" },
      { type: "ul", items: ["Long-term secret storage and versioning", "Fine-grained access policies with IAM integration", "Audit logging at enterprise scale", "Dynamic secret generation (database credentials, cloud tokens)"] },
      { type: "h2", text: "Where They Fall Short" },
      { type: "p", text: "None of them solve the bootstrapping problem elegantly. How do you securely share the initial credentials to bootstrap a new developer, a new environment, or a new service? You still end up Slacking someone a password. That's the gap envdrop fills." },
      { type: "h2", text: "The Right Mental Model" },
      { type: "p", text: "Think of envdrop as a secure courier service for secrets. Traditional secret managers are the vault. You still need the courier to move new credentials from the vault to their destination securely. envdrop handles that last-mile problem with zero-knowledge encryption and burn-after-reading semantics." },
      { type: "h2", text: "Use Both" },
      { type: "p", text: "The answer isn't either/or. Store your secrets in Vault or Secrets Manager. Use envdrop when you need to share or bootstrap. They complement each other perfectly." },
    ]
  },
  "designing-for-zero-trust": {
    title: "Designing for zero-trust at every handshake",
    category: "Security",
    date: "Feb 14, 2026",
    readTime: "7 min read",
    image: "/assets/blog2.png",
    author: "envdrop Engineering",
    authorRole: "Security Team",
    content: [
      { type: "p", text: "Zero-trust is a philosophy, not a product. It means assuming breach at every layer and designing systems that remain secure even when individual components are compromised. Applying it to secret sharing changes the entire design conversation." },
      { type: "h2", text: "The Four Principles Applied to Secrets" },
      { type: "ul", items: ["Never trust — verify every access request cryptographically, not just by identity", "Minimal privilege — secrets should be scope-limited to exactly the permissions needed", "Assume breach — design as if the server is already compromised", "Explicit verification — every handoff should produce an auditable record"] },
      { type: "h2", text: "What Zero-Trust Means for Secret Sharing" },
      { type: "p", text: "Traditional secret sharing trusts the communication channel. Zero-trust secret sharing encrypts the payload so the channel doesn't need to be trusted. The secret is safe even if the transmission is intercepted, the server is compromised, or the recipient's connection is monitored." },
      { type: "h2", text: "Practical Implementation" },
      { type: "p", text: "Client-side encryption with a key fragment in the URL is the practical realization of zero-trust for secret handoffs. The server is literally incapable of reading your data — not because we promise not to, but because we don't have the key. That's the only honest definition of zero-trust in this context." },
    ]
  },
  "fintech-scaled-with-envdrop": {
    title: "How a Fintech scaled with envdrop Engineering",
    category: "Story",
    date: "Feb 07, 2026",
    readTime: "5 min read",
    image: "/assets/blog3.png",
    author: "envdrop Engineering",
    authorRole: "Customer Success",
    content: [
      { type: "p", text: "A fintech team processing over $2M/day in transactions needed to onboard 15 new engineers across three time zones in a single sprint. Their existing process: a shared Google Doc with environment variables updated manually. The doc had 47 edit conflicts in the previous month." },
      { type: "h2", text: "The Problem at Scale" },
      { type: "p", text: "At scale, informal secret sharing becomes an incident waiting to happen. This team had experienced two near-misses where production credentials were accidentally shared in a public Slack channel. Their security audit was 6 weeks away." },
      { type: "h2", text: "The Implementation" },
      { type: "ul", items: ["Migrated all secret handoffs to envdrop in one afternoon", "Created per-environment bundles with 24-hour TTLs", "Every new engineer gets a burn-link, not a doc", "DevOps lead gets notification on every share and access event"] },
      { type: "h2", text: "The Outcome" },
      { type: "p", text: "Onboarding time dropped from 45 minutes to under 5 minutes. The security audit passed with zero findings related to secret management. Three months in, they haven't had a single secret-related incident. The CTO's comment: 'We should have done this a year ago.'" },
    ]
  },
  "top-10-env-mistakes": {
    title: "Top 10 .env mistakes developers keep making",
    category: "Guide",
    date: "Jan 31, 2026",
    readTime: "6 min read",
    image: "/assets/blog1.png",
    author: "envdrop Engineering",
    authorRole: "Developer Relations",
    content: [
      { type: "p", text: "After analyzing thousands of security incidents and developer workflows, these are the ten mistakes we see most commonly — and how to fix each one." },
      { type: "h2", text: "The List" },
      { type: "ul", items: [
        "Committing .env to git (even 'just once' or 'just locally')",
        "Using the same credentials for development and production",
        "Sharing .env files over email or Slack",
        "Not adding .env to .gitignore at project creation",
        "Storing .env files in cloud storage (Dropbox, Google Drive)",
        "Not rotating credentials after a team member leaves",
        "Using weak, guessable values for secrets during development",
        "Printing secrets in application logs for debugging",
        "Embedding secrets in Docker images",
        "Never auditing who has access to what credentials"
      ]},
      { type: "h2", text: "The Fix for All Ten" },
      { type: "p", text: "Treat every secret as if it is already compromised. Assume the git history is public. Assume the logs are being read. Assume the Docker Hub image is public. When you design with this assumption, the right tooling choices become obvious: client-side encryption, burn-after-reading transmission, automatic rotation, and zero plaintext in transit." },
      { type: "p", text: "Start with one change today: never share a secret over plaintext again. Use envdrop for every handoff. The rest will follow naturally." },
    ]
  },
};

// Required for static export / ISR — tells Next.js which slugs to pre-render
export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
