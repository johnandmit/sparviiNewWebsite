import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Phone, ArrowRight, Check, Clock, Menu, X, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---

interface NavLink {
  name: string;
  href: string;
}
interface Step {
  number: string;
  title: string;
  description: string;
}
interface PricingStageItem {
  number: string;
  title: string;
  leftBadge: string;
  leftDescription: string;
  rightBadge: string;
  rightDescription: string;
}
interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
}
interface MarqueeItem {
  text: string;
}
type ContactTab = 'callback' | 'email' | 'message';

// --- Data ---

const NAV_LINKS: NavLink[] = [{
  name: 'Home',
  href: '#home'
}, {
  name: 'How It Works',
  href: '#how-it-works'
}, {
  name: 'Pricing',
  href: '#pricing'
}, {
  name: 'Contact',
  href: '#contact'
}];
const MARQUEE_ITEMS: MarqueeItem[] = [{
  text: 'CUSTOM VOICE'
}, {
  text: 'BUILT FOR YOUR TRADE'
}, {
  text: 'TRANSPARENT PRICING'
}, {
  text: '24/7 CALL ANSWERING'
}, {
  text: 'DONE IN DAYS NOT MONTHS'
}, {
  text: 'NO LOCK-IN'
}, {
  text: 'CUSTOM VOICE'
}, {
  text: 'BUILT FOR YOUR TRADE'
}, {
  text: 'TRANSPARENT PRICING'
}, {
  text: '24/7 CALL ANSWERING'
}, {
  text: 'DONE IN DAYS NOT MONTHS'
}, {
  text: 'NO LOCK-IN'
}];
const STEPS: Step[] = [{
  number: '01',
  title: 'You sign up. We do the rest.',
  description: 'One call with us and we handle everything. Your AI gets your business name, your services, your tone of voice, and your booking system. Most tradies are live within a week.'
}, {
  number: '02',
  title: 'Every call gets answered.',
  description: 'Day or night, your AI picks up. It answers questions, quotes your services, and books jobs directly into your calendar. You only hear from it when there is a real job waiting.'
}, {
  number: '03',
  title: 'You show up. You get paid.',
  description: 'No more playing phone tag. No more jobs going to the next guy because you were on the tools. Just a full calendar and less stress.'
}];
const PRICING_STAGES: PricingStageItem[] = [{
  number: '1',
  title: 'One call. We figure out your world.',
  leftBadge: '$100 setup',
  leftDescription: 'We learn your trade, your customers, and how your business runs. Custom voice, custom script, your booking system connected. Fast because we have done this before.',
  rightBadge: 'Quoted upfront',
  rightDescription: 'We map out exactly what you need before anything is built. More complexity means more time here, and the quote reflects that honestly.'
}, {
  number: '2',
  title: 'We build it. You test it. We fix anything.',
  leftBadge: 'Included',
  leftDescription: 'You listen to it, you give us feedback, we refine. It does not go live until it sounds exactly like your business. No rush. Normally one to two weeks.',
  rightBadge: 'Included in quote',
  rightDescription: 'Same back and forth process as Standard. More moving parts means a longer runway. We do not go live until every edge case is handled.'
}, {
  number: '3',
  title: 'It goes live. You never touch it.',
  leftBadge: '$100 per month',
  leftDescription: 'We monitor it, maintain it, and update it when your services or prices change. You just answer the jobs it books you.',
  rightBadge: 'Ongoing, quoted',
  rightDescription: 'Whatever we build, we keep it running. Monitored, updated, and supported. Ongoing cost is quoted and agreed before we start.'
}];
const TEAM: TeamMember[] = [{
  initials: 'SP',
  name: 'Silver Phung',
  role: 'Co-Founder, Business Development',
  bio: 'Spent years watching businesses lose revenue to basic problems that technology had already solved. Built Sparvii because tradies deserved access to the same tools as big companies, without the big price tag or the confusing contract.'
}, {
  initials: 'JP',
  name: 'John Phung',
  role: 'Co-Founder, Automation Systems',
  bio: 'Builds everything that runs under the hood. Years of automating complex systems for enterprise clients, now applied to problems that actually matter to working people. If Sparvii does something, John built it.'
}];
const CONTACT_TABS: {
  id: ContactTab;
  label: string;
}[] = [{
  id: 'callback',
  label: 'Talk to a Real Person'
}, {
  id: 'email',
  label: 'Email'
}, {
  id: 'message',
  label: 'Message Us'
}];

// --- Shared form field styles ---
const inputClass = 'w-full bg-white/5 border border-white/10 focus:border-[#2ee8b5] outline-none px-3 py-2.5 text-white text-[13px] transition-all rounded-sm';
const labelClass = 'text-[10px] font-bold text-[#c8c8c8] uppercase tracking-[0.18em]';
const tealSubmitClass = 'w-full py-2.5 bg-[#2ee8b5] text-[#0d0d0d] font-sans font-bold text-[11px] uppercase tracking-[0.18em] hover:bg-[#25ca9c] hover:shadow-[0_0_18px_rgba(46,232,181,0.4)] transition-all active:scale-95';

// --- Sub-components ---

const Eyebrow = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={cn('inline-block text-[#2ee8b5] font-bold uppercase', 'text-[9px] tracking-[0.22em] pl-2 border-l border-[#2ee8b5]', className)}>
    {children}
  </span>;
const TealAsterisk = () => <span className="text-[#2ee8b5] ml-0.5 font-bold" aria-hidden="true">
    *
  </span>;
const FadeInWhenVisible = ({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => <motion.div initial={{
  opacity: 0,
  y: 18
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true,
  margin: '-60px'
}} transition={{
  duration: 0.55,
  delay,
  ease: [0.16, 1, 0.3, 1]
}} className={className}>
    {children}
  </motion.div>;
const ScrollProgressBar = () => {
  const {
    scrollYProgress
  } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2
  });
  return <motion.div style={{
    scaleX,
    transformOrigin: '0% 50%'
  }} className="fixed top-0 left-0 right-0 h-[2px] bg-[#2ee8b5] z-[60] shadow-[0_0_8px_rgba(46,232,181,0.6)]" />;
};
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-5 md:px-9', scrolled ? 'bg-[#0d0d0d]/75 backdrop-blur-md border-b border-[#2ee8b5]/10' : 'bg-transparent border-b border-transparent')}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[54px]">
        <a href="#home" className="text-white font-bold text-base tracking-[0.02em] font-heading uppercase">
          SPARVII
        </a>
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => <a key={link.name} href={link.href} className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[11px] font-normal tracking-[0.18em] uppercase">
              {link.name}
            </a>)}
          <button className="border border-[#2ee8b5] text-[#2ee8b5] hover:bg-[#2ee8b5] hover:text-[#0d0d0d] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all active:scale-95">
            Book a Call
          </button>
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="absolute top-full left-0 right-0 bg-[#0d0d0d] border-b border-white/10 flex flex-col p-5 space-y-2.5 md:hidden">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-[#c8c8c8] text-[12px] font-normal tracking-[0.18em] uppercase py-1.5 border-b border-white/5">
                {link.name}
              </a>)}
            <button className="border border-[#2ee8b5] text-[#2ee8b5] w-full py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] mt-1.5">
              Book a Call
            </button>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
const Marquee = () => <div className="relative overflow-hidden bg-[#0a0a0a] border-y border-white/5 py-2.5">
    <div className="flex whitespace-nowrap">
      <motion.div animate={{
      x: ['0%', '-50%']
    }} transition={{
      duration: 40,
      repeat: Infinity,
      ease: 'linear'
    }} className="flex items-center shrink-0">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => <div key={idx} className="flex items-center shrink-0">
            <span className="text-[#2ee8b5] text-[10px] font-bold uppercase tracking-[0.28em] px-7">
              {item.text}
            </span>
            <span className="inline-block w-1 h-1 bg-[#2ee8b5] rotate-45 shrink-0" aria-hidden="true" />
          </div>)}
      </motion.div>
    </div>
  </div>;

// --- Pricing Timeline Column ---

const PricingColumn = ({
  side,
  stages,
  delay = 0
}: {
  side: 'left' | 'right';
  stages: PricingStageItem[];
  delay?: number;
}) => {
  const isLeft = side === 'left';
  return <div className="relative">
      <div className="absolute" style={{
      left: '15px',
      top: '26px',
      bottom: '26px',
      width: '1.5px',
      background: 'linear-gradient(to bottom, #2ee8b5 0%, rgba(46,232,181,0.25) 100%)',
      boxShadow: '0 0 6px rgba(46,232,181,0.3)'
    }} />
      <div className="space-y-0">
        {stages.map((stage, idx) => <FadeInWhenVisible key={stage.number} delay={delay + idx * 0.08}>
            <div className={idx > 0 ? 'border-t border-white/5' : ''}>
              <div className="flex gap-0 items-stretch">
                <div className="relative flex flex-col items-center shrink-0" style={{
              width: '32px'
            }}>
                  <div className="flex items-start justify-center pt-4">
                    <div className="relative z-10">
                      <motion.span className="absolute inset-0 rounded-full border border-[#2ee8b5] pointer-events-none" style={{
                    opacity: 0
                  }} animate={{
                    scale: [1, 1.8],
                    opacity: [0, 0.6, 0]
                  }} transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: idx * 0.4,
                    times: [0, 0.15, 1]
                  }} />
                      <motion.span className="absolute inset-0 rounded-full border border-[#2ee8b5] pointer-events-none" style={{
                    opacity: 0
                  }} animate={{
                    scale: [1, 1.8],
                    opacity: [0, 0.45, 0]
                  }} transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: idx * 0.4 + 1,
                    times: [0, 0.15, 1]
                  }} />
                      <div className="relative z-10 w-[30px] h-[30px] rounded-full bg-[#0a0a0a] border border-[#2ee8b5] flex items-center justify-center" style={{
                    boxShadow: '0 0 10px rgba(46,232,181,0.2)'
                  }}>
                        <span className="text-[#2ee8b5] font-heading font-bold text-[10px] leading-none">
                          {stage.number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 pl-3.5 pr-2 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-block text-[#2ee8b5] text-[9px] font-bold uppercase tracking-[0.18em] px-1.5 py-[2px]" style={{
                  background: 'rgba(46,232,181,0.07)',
                  border: '1px solid rgba(46,232,181,0.18)'
                }}>
                      {isLeft ? stage.leftBadge : stage.rightBadge}
                    </span>
                  </div>
                  <h4 className="text-[#f0f0f0] font-heading font-bold text-[13px] mb-1 leading-snug tracking-tight">
                    {stage.title}
                  </h4>
                  <p className="text-[#999] leading-[1.6] text-[12px]">
                    {isLeft ? stage.leftDescription : stage.rightDescription}
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>)}
      </div>
    </div>;
};

// --- Call Back Form (shared between Demo and Contact sections) ---

const CallBackForm = ({
  onSuccess
}: {
  onSuccess?: () => void;
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<'idle' | 'calling' | 'success'>('idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setState('calling');
    setTimeout(() => {
      setState('success');
      if (onSuccess) onSuccess();
    }, 2000);
  };
  return <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
      <div className="space-y-1.5">
        <label htmlFor="cb-name" className={labelClass}>
          <span>Your name</span>
          <TealAsterisk />
        </label>
        <input id="cb-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" required className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="cb-company" className={labelClass}>
          <span>Company name</span>
        </label>
        <input id="cb-company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your business name (optional)" className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="cb-about" className={labelClass}>
          <span>Tell us about your business</span>
        </label>
        <textarea id="cb-about" rows={3} value={about} onChange={e => setAbout(e.target.value)} placeholder="What trade are you in? How many calls do you get a week? Anything else we should know? (optional)" className={cn(inputClass, 'resize-none')} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="cb-phone" className={labelClass}>
          <span>Your number</span>
          <TealAsterisk />
        </label>
        <input id="cb-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="04XX XXX XXX" required className={inputClass} />
      </div>
      <button disabled={state !== 'idle'} className={cn('w-full py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all', state === 'idle' ? 'bg-[#2ee8b5] text-[#0d0d0d] hover:bg-[#25ca9c] hover:shadow-[0_0_18px_rgba(46,232,181,0.4)]' : 'bg-white/10 text-white cursor-default')}>
        {state === 'idle' && 'Get the AI to Call Me'}
        {state === 'calling' && 'Initiating...'}
        {state === 'success' && 'Calling...'}
      </button>
      <AnimatePresence>
        {state === 'success' && <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-[#2ee8b5] text-[12px] text-center font-bold">
            Calling you now. Pick up in a sec.
          </motion.p>}
      </AnimatePresence>
      <p className="text-[10px] text-white/40 italic">The AI will call you within 30 seconds. This is a demo call only.</p>
    </form>;
};

// --- Contact Call Back Form (real human call back) ---

const ContactCallBackForm = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success'>('idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setState('sending');
    setTimeout(() => setState('success'), 1800);
  };
  if (state === 'success') {
    return <motion.div initial={{
      opacity: 0,
      scale: 0.97
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="py-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#2ee8b5]/10 border border-[#2ee8b5] flex items-center justify-center mx-auto mb-4">
          <Check size={22} className="text-[#2ee8b5]" />
        </div>
        <p className="text-[#f0f0f0] font-heading font-bold text-[18px] tracking-tight">Request received.</p>
        <p className="text-[#c8c8c8] text-[13px]">We will call you back soon.</p>
      </motion.div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
      <div className="space-y-1.5">
        <label htmlFor="rcb-name" className={labelClass}>
          <span>Your name</span>
          <TealAsterisk />
        </label>
        <input id="rcb-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" required className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="rcb-company" className={labelClass}>
          <span>Company name</span>
        </label>
        <input id="rcb-company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your business name (optional)" className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="rcb-about" className={labelClass}>
          <span>Tell us about your business</span>
        </label>
        <textarea id="rcb-about" rows={3} value={about} onChange={e => setAbout(e.target.value)} placeholder="What trade are you in? How many calls do you get a week? Anything else we should know? (optional)" className={cn(inputClass, 'resize-none')} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="rcb-phone" className={labelClass}>
          <span>Your number</span>
          <TealAsterisk />
        </label>
        <input id="rcb-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="04XX XXX XXX" required className={inputClass} />
      </div>
      <button disabled={state === 'sending'} className={cn('w-full py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all', state === 'idle' ? 'bg-[#2ee8b5] text-[#0d0d0d] hover:bg-[#25ca9c] hover:shadow-[0_0_18px_rgba(46,232,181,0.4)] active:scale-95' : 'bg-white/10 text-white cursor-default')}>
        {state === 'idle' ? 'Request a Call Back' : 'Sending...'}
      </button>
      <p className="text-[10px] text-white/40 italic">No spam. A real person from Sparvii will call you back.</p>
    </form>;
};

// --- Contact Section ---

const ContactSection = () => {
  const [activeTab, setActiveTab] = useState<ContactTab>('message');
  const [msgName, setMsgName] = useState('');
  const [msgCompany, setMsgCompany] = useState('');
  const [msgAbout, setMsgAbout] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgMessage, setMsgMessage] = useState('');
  const [msgState, setMsgState] = useState<'idle' | 'sending' | 'success'>('idle');
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName || !msgMessage) return;
    setMsgState('sending');
    setTimeout(() => setMsgState('success'), 1800);
  };
  return <section id="contact" className="py-16 md:py-24 px-5 md:px-9 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <FadeInWhenVisible className="mb-8 text-center">
          <div className="mb-3">
            <Eyebrow>Get in Touch</Eyebrow>
          </div>
          <h2 className="text-[25px] md:text-[36px] font-heading font-bold text-[#f0f0f0] tracking-[-0.02em] leading-[1.1] mb-2">
            Pick however you want to reach us.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.08}>
          {/* Tab Selector */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap">
            {CONTACT_TABS.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('px-5 py-2 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all border', activeTab === tab.id ? 'bg-[#2ee8b5] text-[#0d0d0d] border-[#2ee8b5]' : 'bg-transparent text-[#2ee8b5] border-[#2ee8b5] hover:bg-[#2ee8b5]/10')}>
                {tab.label}
              </button>)}
          </div>

          {/* Tab Content */}
          <div className="rounded-sm" style={{
          border: '1px solid rgba(46,232,181,0.18)',
          background: 'rgba(255,255,255,0.015)'
        }}>
            <AnimatePresence mode="wait">
              {activeTab === 'callback' && <motion.div key="callback" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.22
            }} className="p-6 md:p-8">
                  <div className="mb-3">
                    <Eyebrow>Speak to Silver or John</Eyebrow>
                  </div>
                  <p className="text-[#c8c8c8] text-[13px] leading-[1.6] mb-5">
                    Leave your number and one of the team will give you a call back. No bots, no sales scripts. Just a straight conversation about whether Sparvii is right for your business.
                  </p>
                  <ContactCallBackForm />
                </motion.div>}

              {activeTab === 'email' && <motion.div key="email" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.22
            }} className="p-6 md:p-8 space-y-5">
                  <div className="mb-5">
                    <Eyebrow>Email</Eyebrow>
                  </div>
                  <div className="p-5 rounded-sm" style={{
                background: 'rgba(46,232,181,0.05)',
                border: '1px solid rgba(46,232,181,0.2)'
              }}>
                    <div className="flex items-center gap-3 mb-2">
                      <Mail size={18} className="text-[#2ee8b5] shrink-0" />
                      <p className="text-[#2ee8b5] font-heading font-bold text-[22px] md:text-[28px] tracking-tight leading-none">
                        info@sparvii.com
                      </p>
                    </div>
                    <p className="text-[#c8c8c8] text-[12px] leading-[1.6] pl-7">
                      We reply within one business day.
                    </p>
                  </div>
                  <a href="mailto:info@sparvii.com" className={cn('inline-block w-full text-center py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all', 'bg-[#2ee8b5] text-[#0d0d0d] hover:bg-[#25ca9c] hover:shadow-[0_0_18px_rgba(46,232,181,0.4)] active:scale-95')}>
                    Send an Email
                  </a>
                </motion.div>}

              {activeTab === 'message' && <motion.div key="message" initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.22
            }} className="p-6 md:p-8">
                  <div className="mb-5">
                    <Eyebrow>Message Us</Eyebrow>
                  </div>
                  <AnimatePresence mode="wait">
                    {msgState === 'success' ? <motion.div key="success" initial={{
                  opacity: 0,
                  scale: 0.97
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} className="py-10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#2ee8b5]/10 border border-[#2ee8b5] flex items-center justify-center mx-auto mb-4">
                          <Check size={22} className="text-[#2ee8b5]" />
                        </div>
                        <p className="text-[#f0f0f0] font-heading font-bold text-[18px] tracking-tight">
                          Message received.
                        </p>
                        <p className="text-[#c8c8c8] text-[13px]">
                          We will be in touch soon.
                        </p>
                      </motion.div> : <motion.form key="form" onSubmit={handleMessageSubmit} className="space-y-2.5" initial={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }}>
                        <div className="space-y-1.5">
                          <label htmlFor="msg-name" className={labelClass}>
                            <span>Your name</span>
                            <TealAsterisk />
                          </label>
                          <input id="msg-name" type="text" value={msgName} onChange={e => setMsgName(e.target.value)} placeholder="First and last name" required className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="msg-company" className={labelClass}>
                            <span>Company name</span>
                          </label>
                          <input id="msg-company" type="text" value={msgCompany} onChange={e => setMsgCompany(e.target.value)} placeholder="Your business name (optional)" className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="msg-about" className={labelClass}>
                            <span>Tell us about your business</span>
                          </label>
                          <textarea id="msg-about" rows={3} value={msgAbout} onChange={e => setMsgAbout(e.target.value)} placeholder="What trade are you in? How many calls do you get a week? Anything else we should know? (optional)" className={cn(inputClass, 'resize-none')} />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="msg-phone" className={labelClass}>
                            <span>Phone number</span>
                          </label>
                          <input id="msg-phone" type="tel" value={msgPhone} onChange={e => setMsgPhone(e.target.value)} placeholder="04XX XXX XXX (optional)" className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="msg-message" className={labelClass}>
                            <span>Your message</span>
                            <TealAsterisk />
                          </label>
                          <textarea id="msg-message" rows={4} value={msgMessage} onChange={e => setMsgMessage(e.target.value)} placeholder="What would you like to talk about?" required className={cn(inputClass, 'resize-none')} />
                        </div>
                        <button disabled={msgState === 'sending'} className={cn('w-full py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all', msgState === 'idle' ? 'bg-[#2ee8b5] text-[#0d0d0d] hover:bg-[#25ca9c] hover:shadow-[0_0_18px_rgba(46,232,181,0.4)] active:scale-95' : 'bg-white/10 text-white cursor-default')}>
                          {msgState === 'idle' ? 'Send Message' : 'Sending...'}
                        </button>
                        <p className="text-[10px] text-white/40 italic">
                          No spam. We reply within one business day.
                        </p>
                      </motion.form>}
                  </AnimatePresence>
                </motion.div>}
            </AnimatePresence>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>;
};

// --- Main Page Component ---

export const SparviiLanding: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#c8c8c8] selection:bg-[#2ee8b5]/30 selection:text-white font-sans antialiased overflow-x-hidden">
      <ScrollProgressBar />
      <Navbar />

      {/* SECTION 1: HERO */}
      <section id="home" className="relative min-h-[88vh] flex items-center pt-20 pb-16 px-5 md:px-9 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
        opacity: 0.04,
        backgroundImage: 'radial-gradient(#2ee8b5 1px, transparent 1px), radial-gradient(#2ee8b5 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0, 16px 16px'
      }} />
        <motion.div animate={{
        x: ['-10%', '10%', '-10%'],
        y: ['-5%', '8%', '-5%'],
        opacity: [0.5, 0.8, 0.5]
      }} transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[620px] h-[620px] z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(46,232,181,0.18) 0%, rgba(46,232,181,0.04) 40%, transparent 70%)',
        filter: 'blur(40px)'
      }} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="max-w-xl">
            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="mb-4">
              <Eyebrow>AI Receptionist for Tradies</Eyebrow>
            </motion.div>

            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.55,
            delay: 0.08
          }} className="text-[#f0f0f0] font-heading font-bold leading-[1.05] tracking-[-0.02em] mb-5 text-[36px] sm:text-[43px] md:text-[50px] lg:text-[54px]">
              Stop Losing Jobs to <span className="text-[#2ee8b5]">Missed Calls.</span>
            </motion.h1>

            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.55,
            delay: 0.16
          }} className="text-[13px] md:text-[14px] text-[#c8c8c8] leading-[1.6] mb-7 max-w-md">
              Sparvii answers every call, 24 hours a day, 7 days a week. Custom voice. Custom
              script. Booked straight into your calendar. Built for tradies, priced so it actually
              makes sense.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.55,
            delay: 0.24
          }} className="flex flex-col sm:flex-row gap-2.5">
              <button className="bg-[#2ee8b5] text-[#0d0d0d] px-4.5 py-2 font-bold text-[11px] uppercase tracking-[0.18em] hover:bg-[#25ca9c] transition-all shadow-[0_0_18px_rgba(46,232,181,0.18)] hover:shadow-[0_0_24px_rgba(46,232,181,0.4)] active:scale-95">
                See How It Works
              </button>
              <button className="border border-white/15 text-white hover:border-[#2ee8b5]/60 hover:bg-white/5 px-4.5 py-2 font-bold text-[11px] uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2">
                <span>Try It Yourself</span>
                <ArrowRight size={13} className="text-[#2ee8b5]" />
              </button>
            </motion.div>
          </div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7,
          delay: 0.32
        }} className="relative flex justify-center lg:justify-end">
            <motion.div animate={{
            y: [0, -6, 0]
          }} transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }} className="relative w-[216px] h-[450px] bg-[#0d0d0d] border-[6px] border-white/5 rounded-[34px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(46,232,181,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 flex flex-col items-center justify-center space-y-5">
                <div className="w-[72px] h-[72px] bg-[#2ee8b5]/10 rounded-full flex items-center justify-center relative">
                  <motion.div animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.6, 0, 0.6]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }} className="absolute inset-0 bg-[#2ee8b5]/20 rounded-full" />
                  <Phone size={29} className="text-[#2ee8b5]" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[#2ee8b5] font-bold text-[9px] uppercase tracking-[0.22em]">
                    Incoming Call
                  </p>
                  <p className="text-white text-base font-heading font-bold">New Customer</p>
                  <p className="text-[#c8c8c8] text-[11px] italic">AI Answering...</p>
                </div>
                <div className="w-full bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <div className="flex gap-2 mb-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2ee8b5] animate-pulse" />
                    <div className="h-1.5 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                    <div className="h-1.5 w-3/4 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-9 h-9 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                    <Phone className="rotate-[135deg] text-red-500" size={14} />
                  </div>
                  <div className="w-9 h-9 bg-[#2ee8b5]/20 border border-[#2ee8b5]/30 rounded-full flex items-center justify-center">
                    <Check className="text-[#2ee8b5]" size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <Marquee />

      {/* SECTION 2: AI RECEPTIONIST DEMO */}
      <section id="demo" className="py-16 md:py-20 px-5 md:px-9 relative bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible className="text-center mb-10">
            <div className="inline-block mb-3">
              <Eyebrow>Live Demo</Eyebrow>
            </div>
            <h2 className="text-[25px] md:text-[34px] font-heading font-bold text-[#f0f0f0] mb-2.5 tracking-[-0.02em] leading-[1.1]">
              Hear the AI Call You
            </h2>
            <p className="text-[#c8c8c8] text-[13px] md:text-[14px] leading-[1.6] max-w-xl mx-auto">
              Enter your number and our AI receptionist will call you within 30 seconds. This is exactly what your customers will hear when they ring your business.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-14 relative">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/5" />
            <FadeInWhenVisible delay={0.08} className="space-y-4">
              <Eyebrow>Get the AI to Call You</Eyebrow>
              <CallBackForm />
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.16} className="space-y-3.5">
              <Eyebrow>Try the demo line</Eyebrow>
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-[#c8c8c8] uppercase tracking-[0.18em]">
                  Call directly
                </p>
                <p className="text-[29px] md:text-[38px] font-heading font-bold text-[#2ee8b5] tabular-nums leading-none tracking-tight">
                  1300 000 000
                </p>
              </div>
              <p className="text-[13px] leading-[1.6]">
                Pick up the phone and call. Our AI answers just like it would for your business.
                Available any time.
              </p>
              <div className="flex items-center gap-2 text-[#c8c8c8]">
                <Clock size={13} className="text-[#2ee8b5]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                  Available 24/7. Give it a ring.
                </span>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-20 px-5 md:px-9 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible className="mb-12">
            <div className="mb-3">
              <Eyebrow>How It Works</Eyebrow>
            </div>
            <h2 className="text-[25px] md:text-[36px] font-heading font-bold text-[#f0f0f0] leading-[1.1] tracking-[-0.02em] max-w-2xl">
              Three steps. Done.
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-9 md:gap-10">
            {STEPS.map((step, idx) => <FadeInWhenVisible key={step.number} delay={idx * 0.08} className="relative">
                <div className="group border border-transparent hover:border-[#2ee8b5]/40 transition-colors p-4 -mx-4">
                  <span className="inline-block text-[32px] font-heading font-bold text-[#2ee8b5]/25 mb-3.5 transition-colors duration-300 group-hover:text-[#2ee8b5]/70 leading-none">
                    {step.number}
                  </span>
                  <h3 className="text-[13px] font-bold text-white mb-2 uppercase tracking-[0.12em]">
                    {step.title}
                  </h3>
                  <p className="text-[#c8c8c8] leading-[1.6] text-[13px]">{step.description}</p>
                </div>
              </FadeInWhenVisible>)}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING */}
      <section id="pricing" className="py-16 md:py-20 px-5 md:px-9 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible className="mb-10">
            <div className="mb-3">
              <Eyebrow>Pricing</Eyebrow>
            </div>
            <h2 className="text-[25px] md:text-[36px] font-heading font-bold text-[#f0f0f0] mb-2.5 tracking-[-0.02em] leading-[1.1]">
              Simple. Transparent. No surprises.
            </h2>
            <p className="text-[#c8c8c8] text-[13px] md:text-[14px] leading-[1.6] max-w-xl">
              We are cheap because we are efficient, not because we cut corners. We have built this
              hundreds of times. That experience is what keeps the price low, and every cent of that
              saving goes to you.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <FadeInWhenVisible delay={0.04}>
              <div className="flex flex-col h-full transition-colors group hover:border-[#2ee8b5]/40" style={{
              border: '1px solid rgba(46,232,181,0.18)',
              background: 'rgba(255,255,255,0.015)'
            }}>
                <div className="px-5 pt-5 pb-4 border-b border-white/5">
                  <span className="inline-block text-[#2ee8b5] text-[9px] font-bold uppercase tracking-[0.22em] px-1.5 py-[2px] mb-3" style={{
                  background: 'rgba(46,232,181,0.07)',
                  border: '1px solid rgba(46,232,181,0.18)'
                }}>
                    Standard
                  </span>
                  <p className="text-[#f0f0f0] font-heading font-bold text-[18px] md:text-[21px] leading-tight tracking-[-0.01em] mb-1">
                    <span>$100 setup</span>
                    <span className="text-[#c8c8c8] font-normal text-[13px]"> plus </span>
                    <span>$100 per month</span>
                  </p>
                  <p className="text-[#c8c8c8] text-[12px] mb-2.5">
                    A fully personalised AI receptionist. Built for your trade.
                  </p>
                  <p className="text-[11px] leading-[1.65]" style={{
                  color: '#777'
                }}>
                    This is not a generic chatbot. Standard includes a custom voice built around
                    your business, scripts written around your trade, integration with your job
                    management software, and a system that sounds like you picked up the phone
                    yourself. It is affordable because we have done it before, hundreds of times. We
                    know exactly what works. The only boundary is that Standard stays as an AI
                    receptionist. If you need more than that, Custom is the honest answer. We will
                    tell you before you spend a cent.
                  </p>
                </div>
                <div className="px-2.5 py-0.5 flex-1">
                  <PricingColumn side="left" stages={PRICING_STAGES} delay={0.08} />
                </div>
                <div className="px-5 py-3.5 border-t border-white/5">
                  <p className="text-[#c8c8c8]/70 font-heading font-medium text-[12px]">
                    $100 to start. $100 a month after that. Simple.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.12}>
              <div className="flex flex-col h-full transition-colors group hover:border-[#2ee8b5]/40" style={{
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.01)'
            }}>
                <div className="px-5 pt-5 pb-4 border-b border-white/5">
                  <span className="inline-block text-[#c8c8c8] text-[9px] font-bold uppercase tracking-[0.22em] px-1.5 py-[2px] mb-3" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    Custom
                  </span>
                  <p className="text-[#f0f0f0] font-heading font-bold text-[18px] md:text-[21px] leading-tight tracking-[-0.01em] mb-1">
                    Quoted upfront. Always.
                  </p>
                  <p className="text-[#c8c8c8] text-[12px] mb-2.5">
                    For when an AI receptionist is not enough.
                  </p>
                  <p className="text-[11px] leading-[1.65]" style={{
                  color: '#777'
                }}>
                    Custom is for businesses that need more than call answering. That could be an AI
                    email manager, a lead qualification pipeline, a multi-channel communication
                    system, or something else entirely. Custom does not mean better than Standard.
                    It means different scope. It could cost more, it could cost less. What will
                    never change is that we quote everything before we build anything, and we do not
                    start until you have agreed to every line of it.
                  </p>
                </div>
                <div className="px-2.5 py-0.5 flex-1">
                  <PricingColumn side="right" stages={PRICING_STAGES} delay={0.16} />
                </div>
                <div className="px-5 py-3.5 border-t border-white/5">
                  <p className="text-[#c8c8c8]/70 font-heading font-medium text-[12px]">
                    Quoted before we begin. Agreed before we build.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible delay={0.3} className="mt-10 text-center">
            <p className="text-[#c8c8c8] text-[13px] mb-4">
              Not sure which fits? Book a free 20-minute call. We will tell you honestly, even if
              the answer is neither.
            </p>
            <button className="bg-[#2ee8b5] text-[#0d0d0d] px-5 py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] hover:bg-[#25ca9c] transition-all hover:shadow-[0_0_24px_rgba(46,232,181,0.4)] active:scale-95 shadow-[0_0_18px_rgba(46,232,181,0.15)]">
              Book a Free Call
            </button>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* SECTION 5: THE TEAM */}
      <section id="team" className="py-16 md:py-20 px-5 md:px-9 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible className="mb-12">
            <div className="mb-3">
              <Eyebrow>The People Behind It</Eyebrow>
            </div>
            <h2 className="text-[25px] md:text-[36px] font-heading font-bold text-[#f0f0f0] tracking-[-0.02em] leading-[1.1] max-w-2xl">
              Real people. Not a faceless startup.
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 md:gap-14">
            {TEAM.map((member, idx) => <FadeInWhenVisible key={member.name} delay={idx * 0.1} className="flex flex-col md:flex-row gap-4 items-start">
                <motion.div animate={{
              boxShadow: ['0 0 10px rgba(46,232,181,0.1)', '0 0 18px rgba(46,232,181,0.25)', '0 0 10px rgba(46,232,181,0.1)']
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="w-[58px] h-[58px] rounded-full bg-[#0d0d0d] border border-[#2ee8b5] flex items-center justify-center shrink-0">
                  <span className="text-[#2ee8b5] font-heading text-[13px] font-bold tracking-wide">
                    {member.initials}
                  </span>
                </motion.div>
                <div className="space-y-2.5">
                  <div>
                    <h3 className="text-[16px] font-heading font-bold text-white mb-0.5 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-[#2ee8b5] text-[9px] font-bold uppercase tracking-[0.22em]">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-[#c8c8c8] text-[13px] leading-[1.6] italic">
                    <span>"{member.bio}"</span>
                  </p>
                </div>
              </FadeInWhenVisible>)}
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-16 md:py-24 px-5 md:px-9 bg-[#0d0d0d] relative overflow-hidden">
        <motion.div animate={{
        opacity: [0.4, 0.7, 0.4]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[310px] bg-[#2ee8b5]/8 blur-[100px] rounded-full -z-10" />
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <FadeInWhenVisible>
            <h2 className="text-[29px] md:text-[47px] font-heading font-bold text-[#f0f0f0] mb-4 leading-[1.05] tracking-[-0.02em]">
              Your competitors are already moving.
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#c8c8c8] leading-[1.6] max-w-xl mx-auto">
              The tradies who set this up now are the ones with full calendars in six months. Book a
              free call. We will show you exactly how it works for your trade, no obligation, no
              hard sell.
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.12}>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center">
              <button className="bg-[#2ee8b5] text-[#0d0d0d] px-5 py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] hover:bg-[#25ca9c] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(46,232,181,0.15)] hover:shadow-[0_0_28px_rgba(46,232,181,0.4)]">
                Book a Free Call
              </button>
              <button className="border border-white/15 text-white hover:border-[#2ee8b5]/60 hover:bg-white/5 px-5 py-2.5 font-sans font-bold text-[11px] uppercase tracking-[0.18em] transition-all">
                Email us at info@sparvii.com
              </button>
            </div>
            <p className="mt-5 text-[#c8c8c8]/40 uppercase tracking-[0.22em] text-[9px]">
              20 minutes. No obligation. We will tell you honestly if it is right for you.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <ContactSection />

      {/* FOOTER */}
      <footer className="py-12 px-5 md:px-9 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-9 mb-10">
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-base tracking-[0.02em] font-heading uppercase">
              SPARVII
            </h4>
            <p className="text-[#c8c8c8] max-w-xs text-[12px] leading-[1.6]">
              Affordable AI for the people who keep everything running.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <h5 className="text-white text-[9px] font-bold uppercase tracking-[0.22em]">
                Company
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h5 className="text-white text-[9px] font-bold uppercase tracking-[0.22em]">
                Support
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c8c8c8] hover:text-[#2ee8b5] transition-colors text-[12px]">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2.5 text-[#c8c8c8]/40 text-[9px] uppercase tracking-[0.22em]">
          <p>2025 Sparvii. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#2ee8b5] transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-[#2ee8b5] transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-[#2ee8b5] transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};