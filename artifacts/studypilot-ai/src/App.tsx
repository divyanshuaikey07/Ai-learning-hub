import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowUpRight, BookOpen, BrainCircuit, Check, ChevronRight, CircleHelp, Compass,
  Film, Globe2, Layers3, Lightbulb, Mail, Menu,
  Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users, X, Zap,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Guide = {
  slug: string; title: string; dek: string; category: string; minutes: number;
  date: string; featured?: boolean; tone: 'teal' | 'coral' | 'gold';
};
type Tool = {
  slug: string; name: string; type: string; description: string; bestFor: string; access: string; pricing: string; url: string;
  features: string[]; useCases: string[];
  tags: string[]; accent: 'teal' | 'coral' | 'gold';
};

const guides: Guide[] = [
  { slug: 'first-conversation-with-ai', title: 'Your first conversation with AI: a gentle starting point', dek: 'A clear, low-stakes way to ask better questions and understand what comes back.', category: 'Getting started', minutes: 7, date: 'May 21, 2025', featured: true, tone: 'teal' },
  { slug: 'prompts-that-show-your-work', title: 'Prompts that show your work, not just your answer', dek: 'Use AI as a thinking partner without handing over the thinking.', category: 'Study habits', minutes: 9, date: 'May 15, 2025', tone: 'coral' },
  { slug: 'how-to-check-an-ai-answer', title: 'How to check an AI answer before you trust it', dek: 'A small verification routine for facts, sources, and confident-sounding mistakes.', category: 'AI literacy', minutes: 6, date: 'May 09, 2025', tone: 'gold' },
  { slug: 'make-a-study-plan-with-ai', title: 'Make a study plan with AI — then make it yours', dek: 'A practical framework for turning a blank page into a realistic week.', category: 'Study habits', minutes: 8, date: 'May 02, 2025', tone: 'teal' },
  { slug: 'privacy-before-you-paste', title: 'Before you paste: a student’s privacy check', dek: 'What to keep out of an AI chat, and how to ask for help without oversharing.', category: 'Digital judgment', minutes: 5, date: 'April 24, 2025', tone: 'gold' },
  { slug: 'ai-for-the-stuck-moment', title: 'When you are stuck: five useful ways to ask for a hint', dek: 'Move from “do this for me” to questions that help you move forward.', category: 'Getting started', minutes: 6, date: 'April 17, 2025', tone: 'coral' },
];

const tools: Tool[] = [
  { slug: 'chatgpt', name: 'ChatGPT', type: 'AI Chatbots', description: 'A flexible place to brainstorm, explain a topic, or rehearse an idea in plain language.', bestFor: 'Back-and-forth learning', access: 'Official site', pricing: 'Freemium', url: 'https://chatgpt.com/', features: ['Conversational answers and explanations', 'Writing, brainstorming, and study support', 'Optional access to additional models and tools'], useCases: ['Turn a confusing concept into a simpler explanation', 'Generate practice questions from your notes', 'Improve a first draft while keeping your own voice'], tags: ['Writing', 'Explaining'], accent: 'teal' },
  { slug: 'claude', name: 'Claude', type: 'AI Chatbots', description: 'A thoughtful chat workspace for working through long notes, drafts, and difficult questions.', bestFor: 'Reading & reflection', access: 'Official site', pricing: 'Freemium', url: 'https://claude.ai/', features: ['Long-form conversation and document analysis', 'Writing, summarizing, and reasoning support', 'Project spaces for keeping related context together'], useCases: ['Summarize a long reading before reviewing it yourself', 'Compare two draft structures', 'Ask for feedback on clarity and assumptions'], tags: ['Documents', 'Writing'], accent: 'coral' },
  { slug: 'gemini', name: 'Gemini', type: 'AI Chatbots', description: 'Google’s conversational assistant for exploring ideas, getting explanations, and working across formats.', bestFor: 'Everyday questions', access: 'Official site', pricing: 'Freemium', url: 'https://gemini.google.com/', features: ['Conversational research and explanations', 'Support for text, images, and other input formats', 'Connections to selected Google experiences may vary by plan'], useCases: ['Get a first explanation of a new topic', 'Brainstorm examples for a presentation', 'Turn a broad question into a research checklist'], tags: ['Explaining', 'Ideas'], accent: 'gold' },
  { slug: 'midjourney', name: 'Midjourney', type: 'Image Generation', description: 'A creative image-making tool for exploring visual directions from a written prompt.', bestFor: 'Visual concepts', access: 'Official site', pricing: 'Paid', url: 'https://www.midjourney.com/', features: ['Prompt-based image generation', 'Visual exploration across styles and directions', 'Web-based creation and image organization'], useCases: ['Explore a moodboard for a creative assignment', 'Test visual directions before designing manually', 'Create concept references for a presentation'], tags: ['Images', 'Concepts'], accent: 'coral' },
  { slug: 'adobe-firefly', name: 'Adobe Firefly', type: 'Image Generation', description: 'Adobe’s generative tools for creating and exploring images, styles, and visual variations.', bestFor: 'Design exploration', access: 'Official site', pricing: 'Freemium', url: 'https://firefly.adobe.com/', features: ['Text-to-image and generative editing tools', 'Style, composition, and variation controls', 'Integration with parts of Adobe’s creative workflow'], useCases: ['Create visual starting points for a slide deck', 'Explore alternate compositions for a poster', 'Edit or extend an image concept'], tags: ['Images', 'Design'], accent: 'gold' },
  { slug: 'runway', name: 'Runway', type: 'Video', description: 'A creative toolkit for experimenting with AI-assisted video, motion, and visual storytelling.', bestFor: 'Short video ideas', access: 'Official site', pricing: 'Freemium', url: 'https://runwayml.com/', features: ['Generative video and image-to-video workflows', 'Creative editing and visual effects tools', 'Tools for exploring motion from an initial concept'], useCases: ['Storyboard a short creative video', 'Animate a still visual for a presentation', 'Experiment with visual storytelling techniques'], tags: ['Video', 'Motion'], accent: 'teal' },
  { slug: 'descript', name: 'Descript', type: 'Video', description: 'An editor that makes working with video and audio feel closer to editing a document.', bestFor: 'Editing & captions', access: 'Official site', pricing: 'Freemium', url: 'https://www.descript.com/', features: ['Text-based audio and video editing', 'Transcription and caption tools', 'Screen recording and collaborative editing features'], useCases: ['Clean up a recorded class presentation', 'Create captions for a short explainer', 'Edit an interview by working from its transcript'], tags: ['Editing', 'Audio'], accent: 'coral' },
  { slug: 'grammarly', name: 'Grammarly', type: 'Writing', description: 'Writing feedback for clarity and tone. Keep your own voice in the final pass.', bestFor: 'Polishing a draft', access: 'Official site', pricing: 'Freemium', url: 'https://www.grammarly.com/', features: ['Grammar, spelling, and clarity suggestions', 'Tone and rewrite support', 'Writing assistance across supported apps and websites'], useCases: ['Proofread an email or application draft', 'Make a paragraph easier to follow', 'Compare a few ways to phrase a sentence'], tags: ['Editing', 'Writing'], accent: 'teal' },
  { slug: 'quillbot', name: 'QuillBot', type: 'Writing', description: 'A writing assistant for rephrasing, summarizing, and finding a clearer way to express an idea.', bestFor: 'Reworking a draft', access: 'Official site', pricing: 'Freemium', url: 'https://quillbot.com/', features: ['Paraphrasing and rewrite modes', 'Summarization and grammar tools', 'Citation and translation features may vary by plan'], useCases: ['Try alternate wording for a rough sentence', 'Condense a reading into review notes', 'Spot places where a draft needs clearer language'], tags: ['Rewriting', 'Summaries'], accent: 'gold' },
  { slug: 'github-copilot', name: 'GitHub Copilot', type: 'Coding', description: 'A coding companion that can explain code, suggest next steps, and help you learn by example.', bestFor: 'Learning to code', access: 'Official site', pricing: 'Paid with eligible free plans', url: 'https://github.com/features/copilot', features: ['Code suggestions inside supported editors', 'Code explanation and chat assistance', 'Help with tests, debugging, and documentation'], useCases: ['Understand an unfamiliar function', 'Generate a small example to study and adapt', 'Ask for help diagnosing an error message'], tags: ['Code', 'Explaining'], accent: 'coral' },
  { slug: 'cursor', name: 'Cursor', type: 'Coding', description: 'An AI-first code editor for asking questions about a project and moving from idea to implementation.', bestFor: 'Project work', access: 'Official site', pricing: 'Freemium', url: 'https://www.cursor.com/', features: ['Project-aware code chat', 'Inline edits and code generation', 'Editor workflows for navigating a codebase'], useCases: ['Learn how an unfamiliar project is organized', 'Refactor a small piece of code with review', 'Prototype a feature while staying in the editor'], tags: ['Editor', 'Code'], accent: 'teal' },
  { slug: 'notion-ai', name: 'Notion AI', type: 'Productivity', description: 'An assistant inside a flexible workspace for organizing notes, plans, and project material.', bestFor: 'Planning & notes', access: 'Official site', pricing: 'Paid add-on', url: 'https://www.notion.so/product/ai', features: ['Writing and summarizing inside workspace pages', 'Search and question-answering across supported content', 'Templates and planning workflows'], useCases: ['Turn meeting notes into action items', 'Create a first project outline', 'Find a detail across a collection of notes'], tags: ['Notes', 'Planning'], accent: 'gold' },
  { slug: 'otter', name: 'Otter', type: 'Productivity', description: 'A transcription and meeting-notes tool for turning spoken material into a reviewable outline.', bestFor: 'Reviewing lectures', access: 'Official site', pricing: 'Freemium', url: 'https://otter.ai/', features: ['Live or uploaded audio transcription', 'Searchable transcripts and summaries', 'Speaker and action-item support may vary by plan'], useCases: ['Review a recorded lecture more efficiently', 'Create a searchable outline from an interview', 'Capture follow-up tasks after a group meeting'], tags: ['Transcripts', 'Notes'], accent: 'coral' },
  { slug: 'notebooklm', name: 'NotebookLM', type: 'Education', description: 'A source-grounded notebook for asking questions about materials you provide.', bestFor: 'Class notes & packets', access: 'Official site', pricing: 'Free to use with account', url: 'https://notebooklm.google.com/', features: ['Questions grounded in uploaded sources', 'Summaries, study guides, and audio overviews', 'Citations back to the provided material'], useCases: ['Ask questions about a course packet', 'Turn notes into a study guide', 'Compare ideas across several source documents'], tags: ['Notes', 'Study'], accent: 'teal' },
  { slug: 'elicit', name: 'Elicit', type: 'Education', description: 'A guided research tool for finding and comparing academic papers around a question.', bestFor: 'Literature reviews', access: 'Official site', pricing: 'Freemium', url: 'https://elicit.com/', features: ['Research-question-led paper discovery', 'Paper summaries and comparison tables', 'Tools for organizing evidence during early research'], useCases: ['Find starting papers around a topic', 'Compare claims across a small paper set', 'Build a clearer reading list before deep review'], tags: ['Papers', 'Research'], accent: 'coral' },
  { slug: 'canva-magic-studio', name: 'Canva Magic Studio', type: 'Education', description: 'A visual workspace with AI-assisted tools for slides, posters, and early concepts.', bestFor: 'Visual assignments', access: 'Official site', pricing: 'Freemium', url: 'https://www.canva.com/magic-studio/', features: ['AI-assisted design and presentation workflows', 'Image, layout, and copy generation tools', 'Large library of editable visual templates'], useCases: ['Explore directions for a class presentation', 'Turn an outline into a visual draft', 'Create a first poster concept to refine yourself'], tags: ['Slides', 'Design'], accent: 'gold' },
];

const nav = [
  { href: '/', label: 'Home' }, { href: '/tools', label: 'AI Tools' },
  { href: '/students', label: 'AI for Students' }, { href: '/videos', label: 'AI Videos' },
  { href: '/guides', label: 'Guides' },
];

function Meta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', 'description'); document.head.appendChild(tag); }
    tag.setAttribute('content', description);
  }, [title, description]);
  return null;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-logo">
      <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <Compass size={20} strokeWidth={1.7} />
      </span>
      <span className="font-serif text-[22px] font-bold tracking-[-0.03em]">StudyPilot<span className="text-accent">.</span></span>
    </Link>
  );
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors hover:bg-secondary ${location === item.href || (item.href === '/guides' && location.startsWith('/guide/')) ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/about" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground" data-testid="link-nav-about">About</Link>
          <Link href="/contact" className="rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-header-contact">Ask a question <ArrowUpRight className="ml-1 inline" size={14} /></Link>
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="animate-fade border-t border-border bg-background px-5 py-3 lg:hidden" aria-label="Mobile navigation">
          {[...nav, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3.5 text-sm font-semibold" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-[270px] text-sm leading-6 text-muted-foreground">A calm, practical place to learn what AI can do — and where it needs your judgment.</p>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Made for curious beginners</p>
        </div>
        <FooterGroup title="Explore" items={[['AI Tools', '/tools'], ['AI for Students', '/students'], ['AI Videos', '/videos'], ['Guides', '/guides']]} />
        <FooterGroup title="StudyPilot" items={[['About us', '/about'], ['Contact', '/contact'], ['Privacy', '/privacy']]} />
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">A useful reminder</p>
          <p className="mt-4 font-serif text-xl leading-7">“Good tools support good thinking.”</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-border/70 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-8">
        <span data-testid="text-copyright">© 2025 StudyPilot AI. Original guidance for everyday learners.</span><span>Built with care, not hype.</span>
      </div>
    </footer>
  );
}

function FooterGroup({ title, items }: { title: string; items: string[][] }) {
  return <div><p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{title}</p><div className="mt-4 grid gap-2.5">{items.map(([label, href]) => <Link key={href} href={href} className="w-fit text-sm text-foreground/75 hover:text-primary" data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}</div></div>;
}

function Shell({ children }: { children: ReactNode }) {
  return <><Header /><main className="min-h-[calc(100dvh-72px)]">{children}</main><Footer /></>;
}

function Eyebrow({ children, icon: Icon = Sparkles }: { children: ReactNode; icon?: typeof Sparkles }) {
  return <div className="mb-5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary"><Icon size={13} />{children}</div>;
}

function ButtonLink({ href, children, secondary = false, testId }: { href: string; children: ReactNode; secondary?: boolean; testId: string }) {
  return <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${secondary ? 'border border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary' : 'bg-primary text-primary-foreground'}`} data-testid={testId}>{children}<ArrowUpRight size={15} /></Link>;
}

function GuideCard({ guide, featured = false }: { guide: Guide; featured?: boolean }) {
  const tone = guide.tone === 'coral' ? 'bg-accent/10 text-accent' : guide.tone === 'gold' ? 'bg-[#d3a52f]/15 text-[#896b12]' : 'bg-primary/10 text-primary';
  return (
    <Link href={`/guide/${guide.slug}`} className={`group block ${featured ? 'md:col-span-2' : ''}`} data-testid={`card-guide-${guide.slug}`}>
      <article className={`h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-paper ${featured ? 'grid md:grid-cols-[1.05fr_1fr]' : ''}`}>
        <div className={`relative flex min-h-[170px] flex-col justify-between overflow-hidden p-6 ${guide.tone === 'teal' ? 'bg-primary' : guide.tone === 'coral' ? 'bg-accent' : 'bg-[#d8b34d]'}`}>
          <span className="relative z-10 w-fit rounded-full bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">{guide.category}</span>
          <div className="absolute -right-8 -top-9 h-40 w-40 rounded-full border-[26px] border-background/15" />
          <div className="absolute -bottom-16 right-12 h-32 w-32 rounded-full border-[18px] border-background/15" />
          <div className="relative z-10 flex items-end justify-between text-primary-foreground/85"><span className="font-mono text-[10px] uppercase tracking-[0.14em]">StudyPilot note</span><ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} /></div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3 text-[11px] text-muted-foreground"><span>{guide.date}</span><span className="h-1 w-1 rounded-full bg-border" /><span>{guide.minutes} min read</span></div>
          <h3 className={`font-serif text-2xl leading-[1.12] tracking-[-0.025em] text-foreground ${featured ? 'md:text-[30px]' : ''}`}>{guide.title}</h3>
          <p className="mt-3 max-w-[440px] text-sm leading-6 text-muted-foreground">{guide.dek}</p>
          <span className={`mt-6 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${tone}`}>Read guide <ChevronRight size={13} /></span>
        </div>
      </article>
    </Link>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [, setLocation] = useLocation();
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); setLocation(`/guides${query ? `?q=${encodeURIComponent(query)}` : ''}`); };
  const startCards: { number: string; title: string; text: string; href: string; Icon: typeof BrainCircuit }[] = [
    { number: '01', title: 'Ask for a starting point', text: 'Use a question that gives the tool enough context — without asking it to do the whole job.', href: '/guide/first-conversation-with-ai', Icon: BrainCircuit },
    { number: '02', title: 'Keep your bearings', text: 'Learn a simple way to spot guesses, missing context, and answers that need a second look.', href: '/guide/how-to-check-an-ai-answer', Icon: ShieldCheck },
    { number: '03', title: 'Make it yours', text: 'Turn a generated outline into work that reflects your thinking, your voice, and your sources.', href: '/guide/prompts-that-show-your-work', Icon: Layers3 },
  ];
  const toolCategories: { number: string; title: string; text: string; href: string; Icon: typeof BrainCircuit }[] = [
    { number: '01', title: 'Writing & communication', text: 'Draft, revise, and find your clearest way to say what you mean.', href: '/tools', Icon: BookOpen },
    { number: '02', title: 'Research & sources', text: 'Start with better questions and follow the trail back to the evidence.', href: '/tools', Icon: Search },
    { number: '03', title: 'Study & tutoring', text: 'Break down a difficult topic, practice, and ask for the hint you need.', href: '/students', Icon: BrainCircuit },
    { number: '04', title: 'Creative work', text: 'Turn an early idea into a visual, presentation, or useful first draft.', href: '/tools', Icon: Sparkles },
    { number: '05', title: 'Notes & organization', text: 'Make long material easier to navigate, review, and remember.', href: '/tools', Icon: Layers3 },
    { number: '06', title: 'Digital judgment', text: 'Learn where to pause, check, and keep your private information safe.', href: '/guide/privacy-before-you-paste', Icon: ShieldCheck },
  ];
  return (
    <>
      <Meta title="StudyPilot AI — Learn AI with a clear head" description="Practical, honest guides and tools for students and beginners learning to use AI well." />
      <section className="site-grid relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 pt-16 md:grid-cols-[1fr_0.82fr] md:items-center md:pb-24 md:pt-24 lg:px-8">
          <div className="animate-rise">
            <Eyebrow icon={Compass}>A field guide for modern learning</Eyebrow>
            <h1 className="max-w-[680px] font-serif text-[clamp(3.25rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.065em]">Use AI with a <span className="text-primary">clear head.</span></h1>
            <p className="mt-7 max-w-[520px] text-lg leading-8 text-muted-foreground">StudyPilot is a practical resource hub for students and first-time explorers. Learn what to ask, what to check, and when to trust your own judgment.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/tools" testId="link-home-explore-tools">Explore AI tools</ButtonLink>
              <Link href="/students" className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary" data-testid="link-home-student-toolkit">Start with the student toolkit <ArrowUpRight size={15} /></Link>
            </div>
            <form onSubmit={submit} className="mt-9 flex max-w-[510px] items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-paper" role="search">
              <Search className="ml-3 text-muted-foreground" size={19} />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" placeholder="What are you trying to learn?" aria-label="Search StudyPilot" data-testid="input-home-search" />
              <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-home-search">Search</button>
            </form>
            {submitted && <p className="mt-3 text-xs text-primary" data-testid="status-home-search">Showing the best matches for “{query || 'all topics'}” in the guides library.</p>}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>Try:</span>{['first prompt', 'check an answer', 'study plan'].map((term) => <button key={term} onClick={() => setQuery(term)} className="rounded-full border border-border px-3 py-1.5 hover:border-primary/40 hover:text-primary" data-testid={`button-search-suggestion-${term.replaceAll(' ', '-')}`}>{term}</button>)}</div>
          </div>
          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="relative mx-auto max-w-[430px] rotate-2 rounded-[28px] border border-primary/20 bg-primary p-5 shadow-[12px_16px_0_hsl(var(--accent)/.18)]">
              <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-4 text-primary-foreground"><span className="font-mono text-[10px] uppercase tracking-[0.18em]">Pilot’s log / 01</span><span className="h-2 w-2 rounded-full bg-accent" /></div>
              <div className="py-12 text-primary-foreground"><Target className="mb-7" size={36} strokeWidth={1.3} /><p className="font-serif text-4xl leading-[1.05]">Start with a better question.</p><p className="mt-5 max-w-[270px] text-sm leading-6 text-primary-foreground/70">The quality of an AI conversation often begins before the first answer.</p></div>
              <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground/65"><span>Learning, in progress</span><span>01—24</span></div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-xl border border-border bg-card px-4 py-3 shadow-paper md:-left-10"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent"><Check size={15} /></span><span className="text-xs font-semibold">No hype. Just useful.</span></div></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Eyebrow icon={Zap}>Start here</Eyebrow><h2 className="max-w-[550px] font-serif text-4xl leading-[1.05] tracking-[-0.04em] md:text-5xl">A good first step beats a perfect setup.</h2></div><ButtonLink href="/students" secondary testId="link-home-students">See the student toolkit</ButtonLink></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {startCards.map(({ number, title, text, href, Icon }, index) => (
            <Link href={href} key={number} className={`group card-reveal rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-paper [animation-delay:${index * 80}ms]`} data-testid={`card-start-${number}`}>
              <div className="flex items-start justify-between"><span className="font-mono text-xs text-accent">{number}</span><div className="rounded-xl bg-secondary p-2.5 text-primary"><Icon size={20} strokeWidth={1.5} /></div></div><h3 className="mt-7 font-serif text-2xl leading-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p><span className="mt-6 flex items-center gap-1 text-xs font-bold text-primary">Explore <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Eyebrow icon={Sparkles}>Find your starting point</Eyebrow>
              <h2 className="max-w-[650px] font-serif text-4xl leading-[1.05] tracking-[-0.04em] md:text-5xl">AI tools for the work in front of you.</h2>
            </div>
            <Link href="/tools" className="flex items-center gap-1 text-sm font-bold text-primary" data-testid="link-home-category-directory">See all tools <ArrowUpRight size={15} /></Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolCategories.map(({ number, title, text, href, Icon }, index) => (
              <Link href={href} key={number} className={`group card-reveal rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-secondary/55 hover:shadow-paper [animation-delay:${index * 70}ms]`} data-testid={`card-home-category-${number}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{number}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"><Icon size={18} strokeWidth={1.6} /></span>
                </div>
                <h3 className="mt-7 font-serif text-2xl leading-tight tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 flex items-center gap-1 text-xs font-bold text-primary">Browse category <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-secondary/45"><div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24"><div className="flex items-end justify-between"><div><Eyebrow icon={BookOpen}>The latest guides</Eyebrow><h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">Small reads, real use.</h2></div><Link href="/guides" className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex" data-testid="link-home-all-guides">Browse all guides <ArrowUpRight size={15} /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3">{guides.slice(0, 3).map((guide, index) => <GuideCard key={guide.slug} guide={guide} featured={index === 0} />)}</div><Link href="/guides" className="mt-7 flex items-center gap-1 text-sm font-bold text-primary sm:hidden" data-testid="link-home-all-guides-mobile">Browse all guides <ArrowUpRight size={15} /></Link></div></section>
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24"><div className="grid overflow-hidden rounded-3xl bg-primary md:grid-cols-[1.15fr_0.85fr]"><div className="p-8 text-primary-foreground md:p-12 lg:p-16"><Eyebrow icon={Mail}>A note in your inbox</Eyebrow><h2 className="max-w-[510px] font-serif text-4xl leading-[1.03] tracking-[-0.04em] md:text-5xl">A little more clarity, once in a while.</h2><p className="mt-5 max-w-[430px] text-sm leading-6 text-primary-foreground/70">Occasional notes on better questions, useful tools, and the limits worth remembering. No noise.</p><div className="mt-8 flex flex-col gap-2 sm:flex-row"><input className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/50" placeholder="Your email address" aria-label="Email for newsletter" data-testid="input-home-newsletter" /><button onClick={() => setNewsletterSent(true)} className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-primary-foreground hover:brightness-105" data-testid="button-home-newsletter">Sign me up</button></div>{newsletterSent && <p className="mt-3 text-xs text-primary-foreground/80" data-testid="status-home-newsletter">You’re on the list for the next useful note.</p>}</div><div className="relative hidden min-h-[280px] overflow-hidden bg-accent md:block"><div className="absolute left-16 top-16 h-48 w-48 rounded-full border-[32px] border-primary/20" /><div className="absolute -bottom-12 right-10 h-56 w-56 rounded-full border-[46px] border-background/25" /><div className="absolute bottom-10 left-12 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">One useful thing at a time</div></div></div></section>
    </>
  );
}

function PageIntro({ eyebrow, title, text, icon }: { eyebrow: string; title: string; text: string; icon?: typeof BookOpen }) {
  return <section className="site-grid border-b border-border"><div className="mx-auto max-w-[1240px] px-5 pb-14 pt-14 lg:px-8 lg:pb-20 lg:pt-20"><Eyebrow icon={icon}>{eyebrow}</Eyebrow><h1 className="max-w-[780px] font-serif text-[clamp(3rem,7vw,5.8rem)] leading-[.95] tracking-[-0.06em]">{title}</h1><p className="mt-6 max-w-[620px] text-lg leading-8 text-muted-foreground">{text}</p></div></section>;
}

function ToolsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All types');
  const filtered = useMemo(() => tools.filter((tool) => `${tool.name} ${tool.type} ${tool.description} ${tool.bestFor} ${tool.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (type === 'All types' || tool.type === type)), [query, type]);
  const types = ['All types', ...Array.from(new Set(tools.map((tool) => tool.type)))];
  return <><Meta title="AI Tools Directory — StudyPilot" description="Discover useful AI chatbots, image, video, writing, coding, productivity, and education tools with plain-language descriptions." /><PageIntro eyebrow="The field kit" title="Tools worth knowing about." text="A considered directory of AI tools for learning, writing, research, and making. Start with the job you have, not the tool everyone is talking about." icon={Zap} /><div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-paper md:flex-row"><div className="flex flex-1 items-center gap-3 rounded-xl bg-secondary/60 px-4"><Search size={18} className="text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by tool name, category, or task" className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Search AI tools by name or category" data-testid="input-tools-search" /></div><div className="flex items-center gap-2 overflow-x-auto px-1"><SlidersHorizontal size={16} className="shrink-0 text-muted-foreground" />{types.map((item) => <button key={item} onClick={() => setType(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${type === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`} data-testid={`button-tool-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div></div><div className="mt-8 flex items-center justify-between gap-4"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground" data-testid="text-tools-count">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'} in the field kit</p><p className="hidden text-xs text-muted-foreground sm:block">Links open the official tool website</p></div>{filtered.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((tool, index) => <ToolCard key={tool.name} tool={tool} index={index} />)}</div> : <EmptySearch label="No tools match that search." onReset={() => { setQuery(''); setType('All types'); }} />}</div></>;
}

function ToolCategoryIcon({ category, size = 20 }: { category: string; size?: number }) {
  const Icon = category === 'AI Chatbots' ? BrainCircuit : category === 'Image Generation' ? Sparkles : category === 'Video' ? Film : category === 'Writing' ? BookOpen : category === 'Coding' ? Zap : category === 'Productivity' ? Layers3 : ShieldCheck;
  return <Icon size={size} strokeWidth={1.6} />;
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const tone = tool.accent === 'coral' ? 'bg-accent/12 text-accent' : tool.accent === 'gold' ? 'bg-[#d3a52f]/15 text-[#896b12]' : 'bg-primary/10 text-primary';
  const [, setLocation] = useLocation();
  const openDetails = () => setLocation(`/tools/${tool.slug}`);
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.target as Element | null)?.closest('a')) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };
  return <article role="link" tabIndex={0} aria-label={`View details for ${tool.name}`} onClick={(event) => { if (!(event.target as Element | null)?.closest('a')) openDetails(); }} onKeyDown={handleCardKeyDown} className={`group card-reveal flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [animation-delay:${Math.min(index, 8) * 45}ms]`} data-testid={`card-tool-${tool.name.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between gap-4"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone} transition-transform duration-300 group-hover:scale-105`}><ToolCategoryIcon category={tool.type} /></div><span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{tool.type}</span></div><div className="mt-5 flex items-start justify-between gap-3"><h2 className="font-serif text-2xl tracking-[-0.025em]">{tool.name}</h2><ChevronRight className="mt-1 shrink-0 text-primary transition-transform group-hover:translate-x-1" size={18} /></div><p className="mt-2 min-h-[72px] text-sm leading-6 text-muted-foreground">{tool.description}</p><div className="mt-5 border-t border-border pt-4"><div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">Best for</span><strong className="text-right">{tool.bestFor}</strong></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{tool.access}</span><div className="flex flex-wrap justify-end gap-1.5">{tool.tags.map((tag) => <span key={tag} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">{tag}</span>)}</div></div></div><a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid={`link-tool-try-${tool.name.toLowerCase().replaceAll(' ', '-')}`}>Try tool <ArrowUpRight size={15} /></a></article>;
}

function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return <NotFound />;
  const tone = tool.accent === 'coral' ? 'bg-accent/12 text-accent' : tool.accent === 'gold' ? 'bg-[#d3a52f]/15 text-[#896b12]' : 'bg-primary/10 text-primary';
  return <><Meta title={`${tool.name} — AI Tools — StudyPilot`} description={`${tool.name}: ${tool.description} Explore features, use cases, pricing, and the official website.`} /><article><section className="site-grid border-b border-border"><div className="mx-auto max-w-[1240px] px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-16"><Link href="/tools" className="mb-12 inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-accent" data-testid="link-tool-back"><ChevronRight className="rotate-180" size={14} />Back to AI Tools</Link><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><ToolCategoryIcon category={tool.type} size={18} /></span><span>{tool.type}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{tool.pricing}</span></div><h1 className="mt-6 max-w-[820px] font-serif text-[clamp(3rem,7vw,6rem)] leading-[.94] tracking-[-0.06em]">{tool.name}</h1><p className="mt-6 max-w-[680px] text-lg leading-8 text-muted-foreground">{tool.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid="link-tool-visit-official">Visit {tool.name} <ArrowUpRight size={15} /></a><span className="text-xs text-muted-foreground">Opens the official website in a new tab</span></div></div></section><section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-20"><div className="grid gap-10"><section><Eyebrow icon={Sparkles}>Main features</Eyebrow><div className="grid gap-3 sm:grid-cols-2">{tool.features.map((feature, index) => <div key={feature} className="rounded-2xl border border-border bg-card p-5" data-testid={`tool-feature-${index}`}><span className="font-mono text-xs text-accent">0{index + 1}</span><p className="mt-5 font-serif text-2xl leading-tight">{feature}</p></div>)}</div></section><section><Eyebrow icon={Target}>Good places to start</Eyebrow><div className="grid gap-0 border-t border-border">{tool.useCases.map((useCase, index) => <div key={useCase} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[42px_1fr]"><span className="font-mono text-xs text-accent">0{index + 1}</span><p className="text-base leading-7 text-muted-foreground">{useCase}</p></div>)}</div></section></div><aside className="h-fit rounded-2xl border border-border bg-secondary/45 p-6 lg:sticky lg:top-8"><Eyebrow icon={ShieldCheck}>At a glance</Eyebrow><div className="grid gap-5"><div><span className="text-xs text-muted-foreground">Category</span><p className="mt-1 font-serif text-2xl">{tool.type}</p></div><div><span className="text-xs text-muted-foreground">Pricing</span><p className="mt-1 font-serif text-2xl">{tool.pricing}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Plans and availability can change. Confirm current details on the official site.</p></div><div><span className="text-xs text-muted-foreground">Best for</span><p className="mt-1 font-serif text-2xl">{tool.bestFor}</p></div><div><span className="text-xs text-muted-foreground">Also useful for</span><div className="mt-2 flex flex-wrap gap-1.5">{tool.tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">{tag}</span>)}</div></div></div><a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid="link-tool-visit-sidebar">Visit official site <ArrowUpRight size={15} /></a></aside></section></article></>;
}

function EmptySearch({ label, onReset }: { label: string; onReset: () => void }) {
  return <div className="my-10 rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-14 text-center"><CircleHelp className="mx-auto text-primary" size={28} strokeWidth={1.5} /><p className="mt-4 font-serif text-2xl" data-testid="status-empty-search">{label}</p><button onClick={onReset} className="mt-5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground" data-testid="button-reset-search">Clear filters</button></div>;
}

function GuidesPage() {
  const initial = new URLSearchParams(window.location.search).get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [category, setCategory] = useState('All guides');
  const categories = ['All guides', ...Array.from(new Set(guides.map((guide) => guide.category)))];
  const filtered = guides.filter((guide) => `${guide.title} ${guide.dek} ${guide.category}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All guides' || category === guide.category));
  return <><Meta title="Guides — StudyPilot AI" description="Searchable, practical guides for students and beginners learning to use AI well." /><PageIntro eyebrow="The library" title="Guides for the moments that matter." text="Short, honest reads for your next question — from opening your first chat to checking an answer before it makes it into your work." /><div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col gap-3 md:flex-row"><label className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 shadow-sm"><Search size={18} className="text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the guides" className="w-full bg-transparent py-3.5 text-sm outline-none" aria-label="Search guides" data-testid="input-guides-search" /></label><div className="flex gap-1 overflow-auto rounded-xl border border-border bg-card p-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-semibold ${category === item ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'}`} data-testid={`button-guide-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div></div><div className="mt-10 flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground" data-testid="text-guides-count">{filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}</p><span className="hidden text-xs text-muted-foreground sm:block">Written for a first read, useful on a second</span></div>{filtered.length ? <div className="mt-5 grid gap-5 md:grid-cols-2">{filtered.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div> : <EmptySearch label="No guides match that search." onReset={() => { setQuery(''); setCategory('All guides'); }} />}</div></>;
}

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return <NotFound />;
  return <><Meta title={`${guide.title} — StudyPilot AI`} description={guide.dek} /><article><div className="border-b border-border bg-secondary/35"><div className="mx-auto max-w-[900px] px-5 pb-14 pt-14 lg:pb-20 lg:pt-20"><Link href="/guides" className="mb-10 inline-flex items-center gap-1 text-xs font-bold text-primary" data-testid="link-article-back"><ChevronRight className="rotate-180" size={14} />All guides</Link><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><span>{guide.category}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{guide.minutes} min read</span></div><h1 className="mt-5 max-w-[800px] font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[.96] tracking-[-0.06em]">{guide.title}</h1><p className="mt-6 max-w-[650px] text-lg leading-8 text-muted-foreground">{guide.dek}</p><p className="mt-8 text-xs text-muted-foreground">By the StudyPilot editorial desk · {guide.date}</p></div></div><div className="mx-auto grid max-w-[1060px] gap-12 px-5 py-14 lg:grid-cols-[minmax(0,680px)_220px] lg:px-8 lg:py-20"><div className="prose prose-lg prose-headings:font-serif prose-headings:tracking-[-0.03em] prose-p:leading-8 prose-p:text-muted-foreground prose-strong:text-foreground"><p className="lead !text-xl !leading-8 !text-foreground">The most useful way to start with an AI tool is to make the first conversation small. You do not need a clever formula or a grand plan — just a clear next step.</p><h2>Give the tool a job, not a performance</h2><p>Imagine you are asking a new study partner for help. Share the task, the context, and the kind of support you want. “Explain this in simpler language, then ask me two questions” is more useful than “Tell me everything about this.”</p><div className="not-prose my-9 rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground/70"><Lightbulb size={14} />Try this instead</div><p className="mt-4 font-serif text-2xl leading-tight">“I’m learning about [topic]. Give me the short version, name one thing beginners often misunderstand, and end with a question I can answer myself.”</p></div><h2>Keep one hand on the wheel</h2><p>An AI response is a draft of help, not a verdict. Read it with the same care you would give a hurried explanation from a classmate. Notice what feels vague, ask where a claim came from, and compare important details with your course materials.</p><h2>End with your own next move</h2><p>The conversation is doing its job when you can take the next step without it. Close the tab and write a two-sentence summary, solve a similar example, or explain the idea out loud. The point is not to outsource the moment of understanding.</p><div className="not-prose mt-10 border-t border-border pt-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">A final check</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Could you explain what you used, what you changed, and what you still need to verify? If yes, you are using the tool with intention.</p></div></div><aside className="hidden lg:block"><div className="sticky top-8 border-l-2 border-accent pl-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">In this guide</p><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><span>Give the tool a job</span><span>Keep one hand on the wheel</span><span>End with your next move</span></div></div></aside></div></article></>;
}

function StudentsPage() {
  const blocks = [['Study smarter', 'Turn a big assignment into smaller, answerable questions.', 'Break down a brief, make a study plan, or ask for practice questions without skipping the learning.'], ['Write with ownership', 'Use AI to see options — then make the decisions yourself.', 'Compare tones, find a clearer structure, or get feedback on a draft while keeping your voice in charge.'], ['Check the edges', 'Build a habit of pausing when an answer sounds too certain.', 'Ask for sources, look for missing context, and treat important details as things to verify.']];
  return <><Meta title="AI for Students — StudyPilot" description="A practical starting place for students who want to use AI without losing their own voice or judgment." /><PageIntro eyebrow="The student desk" title="A better way to bring AI to your studies." text="AI can be useful in the messy middle of learning: when you need a starting point, a fresh explanation, or a way to practice. It should not replace the part where you think." icon={BookOpen} /><section className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20"><div className="grid gap-4 md:grid-cols-3">{blocks.map(([eyebrow, title, text], index) => <div className={`rounded-2xl p-7 ${index === 0 ? 'bg-primary text-primary-foreground' : index === 1 ? 'bg-accent text-primary-foreground' : 'border border-border bg-card'}`} key={title}><span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">0{index + 1} / {eyebrow}</span><h2 className="mt-12 font-serif text-3xl leading-tight tracking-[-0.03em]">{title}</h2><p className="mt-4 text-sm leading-7 opacity-75">{text}</p></div>)}</div><div className="mt-16 grid gap-12 md:grid-cols-[.8fr_1.2fr] md:items-start"><div><Eyebrow icon={ShieldCheck}>A simple compass</Eyebrow><h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] md:text-5xl">Before you use a tool, ask three questions.</h2></div><div className="grid gap-0 border-t border-border">{[['Can I explain this afterwards?', 'If not, ask for a hint, a worked example, or a question back.'], ['What should I check?', 'Names, numbers, quotations, sources, and anything that affects a real decision.'], ['Is this mine to share?', 'Keep private information, assessment rules, and other people’s work out of the chat.']].map(([question, answer], index) => <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-[42px_1fr]" key={question}><span className="font-mono text-xs text-accent">0{index + 1}</span><div><h3 className="font-serif text-2xl">{question}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p></div></div>)}</div></div></section><section className="bg-secondary/45"><div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Eyebrow icon={Target}>For your next study session</Eyebrow><h2 className="font-serif text-4xl tracking-[-0.04em]">Choose a useful read.</h2></div><ButtonLink href="/guides" testId="link-students-guides">Open the guides</ButtonLink></div><div className="mt-8 grid gap-5 md:grid-cols-3">{guides.filter((guide) => ['Study habits', 'AI literacy', 'Digital judgment'].includes(guide.category)).map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div></div></section></>;
}

function VideosPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const videos = [{ title: 'What is a prompt, really?', length: '04:12', category: 'Basics', text: 'A visual introduction to giving an AI tool enough context to be useful.' }, { title: 'The two-minute answer check', length: '02:08', category: 'Good judgment', text: 'A quick routine for pausing before you copy, cite, or share.' }, { title: 'AI as a study partner', length: '06:30', category: 'Study habits', text: 'Three ways to ask for support while keeping the work yours.' }];
  return <><Meta title="AI Videos — StudyPilot" description="Short, clear videos about AI basics, study habits, and digital judgment." /><PageIntro eyebrow="The watch list" title="See the idea in motion." text="Short videos are on the way. For now, browse the library we are shaping around the questions beginners actually ask." icon={Film} /><div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20"><div className="grid gap-5 md:grid-cols-3">{videos.map((video, index) => <article key={video.title} className="group rounded-2xl border border-border bg-card p-3 shadow-sm" data-testid={`card-video-${index}`}><button onClick={() => setPlaying(video.title)} className={`relative flex aspect-video w-full items-end overflow-hidden rounded-xl p-5 text-left ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : 'bg-[#d8b34d]'}`} data-testid={`button-video-play-${index}`}><div className="absolute -right-7 -top-7 h-32 w-32 rounded-full border-[22px] border-background/15" /><span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-background text-primary transition-transform group-hover:scale-105"><span className="ml-0.5 block h-0 w-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-primary" /></span><span className="absolute bottom-5 right-5 font-mono text-[10px] text-primary-foreground/75">{video.length}</span></button><div className="p-3 pb-4"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{video.category}</span><h2 className="mt-3 font-serif text-2xl leading-tight">{video.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{video.text}</p></div></article>)}</div>{playing && <div className="mt-8 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/10 px-5 py-4 text-sm text-primary" data-testid="status-video-placeholder"><span><strong>{playing}</strong> will be available in the next library release.</span><button onClick={() => setPlaying(null)} aria-label="Dismiss video message" data-testid="button-dismiss-video"><X size={17} /></button></div>}<div className="mt-20 grid gap-6 rounded-3xl border border-border bg-secondary/40 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12"><div><Eyebrow icon={Mail}>Know what you need?</Eyebrow><h2 className="font-serif text-3xl tracking-[-0.03em]">Tell us what should be on the watch list.</h2></div><ButtonLink href="/contact" secondary testId="link-videos-contact">Send a suggestion</ButtonLink></div></div></>;
}

function AboutPage() {
  return <><Meta title="About StudyPilot — Practical AI learning" description="Meet StudyPilot, a publication for clear, honest, practical AI guidance." /><PageIntro eyebrow="The editorial desk" title="Less spectacle. More signal." text="StudyPilot exists for the moment after the big AI headline, when you are left wondering what to actually do with a tool." icon={Globe2} /><section className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20"><div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-12"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground/65">Our point of view</span><p className="mt-16 font-serif text-4xl leading-[1.05] tracking-[-0.04em]">A tool is only as useful as the judgment around it.</p></div><div className="max-w-[630px] text-base leading-8 text-muted-foreground"><p>We write for students, career changers, and curious people who want a place to start without being talked down to. Our guides use plain language, specific examples, and enough friction to keep the reader thinking.</p><p className="mt-6">We do not promise shortcuts. We do not treat confident output as truth. And we will always say when a tool’s limits matter more than its novelty.</p><div className="mt-10 grid gap-5 border-t border-border pt-7 sm:grid-cols-2"><div><ShieldCheck className="text-primary" size={21} /><h3 className="mt-3 font-serif text-2xl">Honest by default</h3><p className="mt-2 text-sm leading-6">Uncertainty is useful information, not a footnote.</p></div><div><Users className="text-accent" size={21} /><h3 className="mt-3 font-serif text-2xl">Made for people</h3><p className="mt-2 text-sm leading-6">Every page begins with a real beginner question.</p></div></div></div></div><div className="mt-20 border-t border-border pt-10"><Eyebrow icon={Sparkles}>What you can expect here</Eyebrow><div className="grid gap-5 md:grid-cols-3">{['A useful place to begin', 'A clear line between help and hype', 'A nudge back to your own thinking'].map((item, i) => <div key={item} className="flex gap-4"><span className="font-mono text-xs text-accent">0{i + 1}</span><p className="font-serif text-2xl leading-tight">{item}</p></div>)}</div></div></section></>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };
  return <><Meta title="Contact StudyPilot — Ask a question" description="Get in touch with the StudyPilot editorial desk with a question, suggestion, or correction." /><PageIntro eyebrow="The open channel" title="Have a question? Bring it here." text="Tell us what you are trying to learn, what felt confusing, or what you would like to see next. We read every note." icon={Mail} /><div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-20"><div><div className="flex items-start gap-4 border-t border-border py-6"><Mail className="mt-1 text-primary" size={20} /><div><h2 className="font-serif text-2xl">Editorial notes</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Spot something unclear or have an idea for a guide? This is the right inbox.</p><p className="mt-3 text-sm font-semibold text-primary">hello@studypilot.example</p></div></div><div className="flex items-start gap-4 border-t border-border py-6"><CircleHelp className="mt-1 text-accent" size={20} /><div><h2 className="font-serif text-2xl">A quick note</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">StudyPilot is an educational resource, not a replacement for your instructor, institution, or professional advice.</p></div></div></div><form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-paper md:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" placeholder="Your name" data-testid="input-contact-name" /></label><label className="grid gap-2 text-xs font-bold">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" placeholder="you@example.com" data-testid="input-contact-email" /></label></div><label className="mt-5 grid gap-2 text-xs font-bold">Your message<textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" placeholder="What is on your mind?" data-testid="input-contact-message" /></label>{sent ? <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary" data-testid="status-contact-sent"><Check size={17} />Thanks, {form.name || 'there'} — your note is in the queue.</div> : <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="button-contact-submit">Send note <Send size={15} /></button>}</form></div></>;
}

function PrivacyPage() {
  return <><Meta title="Privacy — StudyPilot AI" description="StudyPilot's plain-language privacy notes for this frontend-only resource hub." /><PageIntro eyebrow="The fine print, made readable" title="Privacy without the fog." text="This prototype is a presentation-first resource hub. Here is the short version of what that means." icon={ShieldCheck} /><div className="mx-auto max-w-[850px] px-5 py-14 lg:px-8 lg:py-20"><div className="grid gap-9 text-sm leading-7 text-muted-foreground"><section><h2 className="font-serif text-3xl text-foreground">What we collect here</h2><p className="mt-3">The current StudyPilot experience uses local placeholder content and client-side state. Search terms stay in your browser while you use the page. The contact form is a visual prototype and does not transmit information.</p></section><section><h2 className="font-serif text-3xl text-foreground">Cookies and analytics</h2><p className="mt-3">This prototype does not add advertising, AdSense, tracking pixels, or third-party analytics. If that changes, this page should change first and explain what is different.</p></section><section><h2 className="font-serif text-3xl text-foreground">A note about links</h2><p className="mt-3">The tools directory describes products in original, plain-language terms. Tool availability, pricing, and features can change. Check the provider’s own information before making a decision.</p></section><section className="border-t border-border pt-8"><p>Last updated: May 2025 · Questions about this note? <Link href="/contact" className="font-semibold text-primary hover:underline" data-testid="link-privacy-contact">Contact the editorial desk.</Link></p></section></div></div></>;
}

function NotFound() {
  return <><Meta title="Page not found — StudyPilot AI" description="The StudyPilot page you were looking for could not be found." /><div className="mx-auto max-w-[700px] px-5 py-24 text-center"><span className="font-mono text-xs text-accent">404 / off course</span><h1 className="mt-5 font-serif text-6xl tracking-[-0.06em]">That page drifted.</h1><p className="mx-auto mt-5 max-w-[430px] text-muted-foreground">The link may be old, or the page is still being mapped. Let’s get you somewhere useful.</p><ButtonLink href="/" testId="link-not-found-home">Back to the home base</ButtonLink></div></>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/tools/:slug" component={ToolDetailPage} /><Route path="/tools" component={ToolsPage} /><Route path="/students" component={StudentsPage} /><Route path="/videos" component={VideosPage} /><Route path="/guides" component={GuidesPage} /><Route path="/guide/:slug" component={ArticlePage} /><Route path="/about" component={AboutPage} /><Route path="/contact" component={ContactPage} /><Route path="/privacy" component={PrivacyPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Shell><Router /></Shell></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;