'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#EDE9DE] text-[#0B1220]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.in { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <Nav />
      <Hero />
      <LedgerRule />
      <Features />
      <HowItWorks />
      <CtaBand />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-[#12213B] text-[#EDE9DE]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-tight">
          ESTAM Records
        </span>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <a href="#features" className="hover:text-[#B8874B] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#B8874B] transition-colors">How it works</a>
          <Link href="/signin" className="hover:text-[#B8874B] transition-colors">Sign in</Link>
        </nav>
        <Link
          href="/register"
          className="bg-[#B8874B] text-[#12213B] px-4 py-2 rounded-md text-sm font-semibold font-body hover:bg-[#c99a5f] transition-colors"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-[#12213B]">
          Every student record,<br />in one ledger.
        </h1>
        <p className="font-body text-lg text-[#5B6472] mt-6 max-w-md leading-relaxed">
          Registration, attendance, and grades — tracked in one place, updated
          in real time, and always ready when a student or administrator
          needs to check it.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            href="/register"
            className="bg-[#12213B] text-[#EDE9DE] px-6 py-3 rounded-md font-body font-semibold hover:bg-[#1a2f52] transition-colors"
          >
            Create free account
          </Link>
          <Link
            href="/signin"
            className="border border-[#12213B]/20 text-[#12213B] px-6 py-3 rounded-md font-body font-semibold hover:bg-[#12213B]/5 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <TranscriptCard />
    </section>
  );
}

interface CourseOverview {
  totalCourses: number;
  totalEnrollments: number;
  sampleCourses: { code: string; name: string; credits: number }[];
}

function TranscriptCard() {
  const [data, setData] = useState<CourseOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/courses/public-overview`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-[#12213B]/10 border border-[#12213B]/10 p-8 rotate-1">
      <div className="flex items-center justify-between border-b border-dashed border-[#12213B]/20 pb-4 mb-6">
        <div>
          <p className="font-mono text-xs text-[#5B6472] uppercase tracking-wide">Live overview</p>
          <p className="font-display text-xl font-semibold text-[#12213B] mt-1">ESTAM University</p>
        </div>
        <span className="font-mono text-xs bg-[#1F4B3F]/10 text-[#1F4B3F] px-2.5 py-1 rounded-md font-semibold">
          LIVE
        </span>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-14 bg-[#12213B]/5 rounded-lg" />
            <div className="h-14 bg-[#12213B]/5 rounded-lg" />
          </div>
          <div className="h-6 bg-[#12213B]/5 rounded" />
          <div className="h-6 bg-[#12213B]/5 rounded" />
          <div className="h-6 bg-[#12213B]/5 rounded" />
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Stat label="Courses offered" value={data.totalCourses.toString()} />
            <Stat label="Enrollments" value={data.totalEnrollments.toString()} />
          </div>

          <div className="space-y-3">
            {data.sampleCourses.map((c) => (
              <div key={c.code} className="flex items-center justify-between text-sm font-body">
                <span className="text-[#5B6472]">
                  <span className="font-mono text-xs text-[#12213B]/60 mr-2">{c.code}</span>
                  {c.name}
                </span>
                <span className="font-mono font-semibold text-[#1F4B3F]">{c.credits} cr</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="font-body text-sm text-[#5B6472]">
          Course data will appear here once available.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-[#12213B]/5 rounded-lg py-3">
      <p className="font-mono text-2xl font-semibold text-[#12213B]">{value}</p>
      <p className="font-body text-xs text-[#5B6472] mt-1">{label}</p>
    </div>
  );
}

function LedgerRule() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="border-t border-[#12213B]/15" />
      <div className="border-t border-[#12213B]/15 mt-1" />
    </div>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Features() {
  const items = [
    {
      code: 'REG-100',
      title: 'Registration & verification',
      desc: 'Students register, verify their email with a one-time code, and are signed in automatically — no extra steps.',
    },
    {
      code: 'CRS-200',
      title: 'Courses & enrollment',
      desc: 'Students enroll in courses directly. Enrollment counts, credit totals, and rosters stay in sync automatically.',
    },
    {
      code: 'ATT-300',
      title: 'Attendance tracking',
      desc: 'Mark attendance per course, per day. Students see their own real-time attendance rate the moment it changes.',
    },
    {
      code: 'GRD-400',
      title: 'Grades & GPA',
      desc: 'Enter scores, publish grades on your schedule, and let credit-weighted GPA calculate itself.',
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <p className="font-mono text-xs text-[#B8874B] uppercase tracking-widest mb-3">What's inside</p>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#12213B] mb-12 max-w-xl">
        Four modules. One record per student.
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <FeatureCard key={item.code} {...item} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ code, title, desc }: { code: string; title: string; desc: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'in' : ''} bg-white rounded-xl border border-[#12213B]/10 p-7`}
    >
      <p className="font-mono text-xs text-[#1F4B3F] font-semibold mb-3">{code}</p>
      <h3 className="font-display text-xl font-semibold text-[#12213B] mb-2">{title}</h3>
      <p className="font-body text-[#5B6472] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { step: '01', title: 'Register and verify', desc: 'Create an account and confirm it with the code sent to your email.' },
    { step: '02', title: 'Enroll in courses', desc: 'Browse available courses and enroll — your dashboard updates immediately.' },
    { step: '03', title: 'Track your record', desc: 'Attendance and grades appear as they\u2019re recorded, with your GPA calculated for you.' },
  ];

  return (
    <section id="how-it-works" className="bg-[#12213B] text-[#EDE9DE] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs text-[#B8874B] uppercase tracking-widest mb-3">How it works</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-12 max-w-xl">
          From registration to report card.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <StepCard key={s.step} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, title, desc, isLast }: { step: string; title: string; desc: string; isLast: boolean }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'in' : ''} relative`}>
      <p className="font-mono text-4xl font-semibold text-[#B8874B] mb-4">{step}</p>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="font-body text-[#EDE9DE]/70 text-sm leading-relaxed">{desc}</p>
      {!isLast && (
        <div className="hidden md:block absolute top-0 -right-4 w-px h-full bg-[#EDE9DE]/10" />
      )}
    </div>
  );
}

function CtaBand() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8874B] mb-6">
        <span className="font-display text-2xl text-[#B8874B]">E</span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#12213B] mb-4">
        Your records, kept properly.
      </h2>
      <p className="font-body text-[#5B6472] mb-8 max-w-md mx-auto">
        Set up your account in under a minute — no paperwork required.
      </p>
      <Link
        href="/register"
        className="inline-block bg-[#12213B] text-[#EDE9DE] px-8 py-3.5 rounded-md font-body font-semibold hover:bg-[#1a2f52] transition-colors"
      >
        Create free account
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#12213B]/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm font-semibold text-[#12213B]">ESTAM Records</span>
        <p className="font-body text-xs text-[#5B6472]">Student Records System</p>
      </div>
    </footer>
  );
}