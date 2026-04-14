"use client";

import { useMemo, useState } from "react";

type PositionName =
  | "Vice President"
  | "Treasurer"
  | "Secretary"
  | "Event Coordinator"
  | "Marketing & Outreach"
  | "Tech Lead"
  | "Professional Development";

type FormState = {
  fullName: string;
  email: string;
  major: string;
  academicYear: string;
  whyJoin: string;
  strongFit: string;
  initiativeStory: string;
  goalForYear: string;
  hoursPerWeek: string;
  weeklyMeetings: string;
  enrolledFullYear: string;
  availabilityNotes: string;
};

const positions: {
  name: PositionName;
  icon: string;
  subtitle: string;
  desc: string;
  responsibilities: string[];
  skills: string[];
}[] = [
  {
    name: "Vice President",
    icon: "🏛️",
    subtitle: "Leadership · Operations",
    desc: "The VP acts as the president's right hand, stepping in when needed and ensuring board operations run smoothly across all teams.",
    responsibilities: [
      "Support the president in all chapter decisions",
      "Facilitate and lead board meetings",
      "Serve as chapter liaison to national ColorStack",
      "Oversee inter committee collaboration",
      "Step in as acting president when unavailable",
    ],
    skills: ["Leadership", "Communication", "Organization"],
  },
  {
    name: "Treasurer",
    icon: "💰",
    subtitle: "Finance · Administration",
    desc: "The Treasurer manages all chapter finances, from applying for funding to tracking every dollar spent on events and operations.",
    responsibilities: [
      "Manage and track the chapter's annual budget",
      "Submit funding requests to the university",
      "Process reimbursements and vendor payments",
      "Report financial status at board meetings",
      "Identify sponsorship and external funding opportunities",
    ],
    skills: ["Budgeting", "Attention to Detail", "Spreadsheets"],
  },
  {
    name: "Secretary",
    icon: "📋",
    subtitle: "Communications · Records",
    desc: "The Secretary keeps the chapter organized and informed, from documenting decisions to coordinating internal communications across the board.",
    responsibilities: [
      "Take and distribute minutes for all board meetings",
      "Manage chapter email inbox and correspondence",
      "Maintain records, files, and meeting calendars",
      "Send reminders and follow ups to board members",
      "Track action items from meetings to completion",
    ],
    skills: ["Writing", "Organization", "Follow through"],
  },
  {
    name: "Event Coordinator",
    icon: "🎉",
    subtitle: "Events · Programming",
    desc: "The Event Coordinator brings the chapter to life, planning everything from casual hangouts to large career events that make members feel at home.",
    responsibilities: [
      "Plan and execute 2 to 4 events per semester",
      "Coordinate venues, catering, and logistics",
      "Collaborate with other boards on joint events",
      "Manage event RSVPs and day of coordination",
      "Gather and incorporate member feedback",
    ],
    skills: ["Event Planning", "Logistics", "Creativity"],
  },
  {
    name: "Marketing & Outreach",
    icon: "📣",
    subtitle: "Brand · Growth",
    desc: "Marketing & Outreach is the public face of ColorStack, growing our membership, building our brand, and making sure students know they belong here.",
    responsibilities: [
      "Manage Instagram, LinkedIn, and other social channels",
      "Design flyers, graphics, and promotional materials",
      "Lead tabling and recruitment drives",
      "Coordinate with clubs and departments for cross promotion",
      "Track engagement and membership growth metrics",
    ],
    skills: ["Social Media", "Design", "Storytelling"],
  },
  {
    name: "Tech Lead",
    icon: "💻",
    subtitle: "Technology · Infrastructure",
    desc: "The Tech Lead ensures our chapter runs on reliable tools and that members have access to technical resources, workshops, and a strong digital presence.",
    responsibilities: [
      "Maintain and update the chapter website",
      "Manage digital tools",
      "Organize and lead technical skill building workshops",
      "Identify and onboard useful technology for the board",
      "Support members with interview prep resources",
    ],
    skills: ["Web Dev", "Tech Tools", "Teaching"],
  },
  {
    name: "Professional Development",
    icon: "🚀",
    subtitle: "Career · Mentorship",
    desc: "The Professional Development lead connects members to internships, full time roles, and mentors, making sure every ColorStack member has a clear path forward.",
    responsibilities: [
      "Organize resume reviews, mock interviews, and workshops",
      "Build relationships with company recruiters",
      "Coordinate mentorship pairing",
      "Curate and share opportunities",
      "Plan career fairs and networking nights",
    ],
    skills: ["Career Coaching", "Networking", "Mentorship"],
  },
];

const faqItems = [
  {
    q: "Can I apply for more than one position?",
    a: "Yes. You can rank as many positions as you'd like. We'll use your ranking to find the best fit during our review process.",
  },
  {
    q: "Do I need prior board or leadership experience?",
    a: "Not at all. We look for passion, commitment, and a willingness to grow.",
  },
  {
    q: "What's the time commitment?",
    a: "Most positions require 3 to 5 hours per week including board meetings, event planning, and role specific duties.",
  },
  {
    q: "Will there be an interview?",
    a: "Yes. Shortlisted applicants will be contacted for a 20 to 30 minute interview.",
  },
  {
    q: "I'm a freshman. Can I still apply?",
    a: "Absolutely. We welcome students from all years.",
  },
  {
    q: "What happens after I submit?",
    a: "The current board will review all applications after June 1. Interview invites and final results will be announced shortly after by email.",
  },
];

function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rankings, setRankings] = useState<PositionName[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    major: "",
    academicYear: "",
    whyJoin: "",
    strongFit: "",
    initiativeStory: "",
    goalForYear: "",
    hoursPerWeek: "",
    weeklyMeetings: "",
    enrolledFullYear: "",
    availabilityNotes: "",
  });

  const rankedPositions = useMemo(
    () => rankings.map((position, index) => ({ position, rank: index + 1 })),
    [rankings]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRanking(position: PositionName) {
    setRankings((prev) => {
      const exists = prev.includes(position);
      if (exists) return prev.filter((p) => p !== position);
      return [...prev, position];
    });
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    setTimeout(() => {
      const el = document.getElementById("apply");
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }, 0);
  }

  function validatePage(page: number) {
    if (page === 0) {
      if (rankings.length === 0) {
        setSubmitError("Please rank at least one position.");
        return false;
      }
    }

    if (page === 1) {
      if (!form.fullName || !form.email || !form.major || !form.academicYear) {
        setSubmitError("Please complete all About You fields.");
        return false;
      }
    }

    if (page === 2) {
      if (
        !form.whyJoin ||
        !form.strongFit ||
        !form.initiativeStory ||
        !form.goalForYear
      ) {
        setSubmitError("Please answer all short answer questions.");
        return false;
      }
    }

    if (page === 4) {
      if (
        !form.hoursPerWeek ||
        !form.weeklyMeetings ||
        !form.enrolledFullYear
      ) {
        setSubmitError("Please complete the availability section.");
        return false;
      }
    }

    setSubmitError("");
    return true;
  }

  function nextPage() {
    if (!validatePage(currentPage)) return;
    goToPage(currentPage + 1);
  }

  function prevPage() {
    goToPage(currentPage - 1);
  }

  async function handleSubmit() {
    if (!validatePage(4)) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const body = new FormData();
      body.append("fullName", form.fullName);
      body.append("email", form.email);
      body.append("major", form.major);
      body.append("academicYear", form.academicYear);
      body.append("rankedPositions", JSON.stringify(rankedPositions));
      body.append("whyJoin", form.whyJoin);
      body.append("strongFit", form.strongFit);
      body.append("initiativeStory", form.initiativeStory);
      body.append("goalForYear", form.goalForYear);
      body.append("hoursPerWeek", form.hoursPerWeek);
      body.append("weeklyMeetings", form.weeklyMeetings);
      body.append("enrolledFullYear", form.enrolledFullYear);
      body.append("availabilityNotes", form.availabilityNotes);

      if (resumeFile) {
        body.append("resume", resumeFile);
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setIsSubmitted(true);
      window.scrollTo({
        top: document.getElementById("apply")?.offsetTop
          ? document.getElementById("apply")!.offsetTop - 70
          : 0,
        behavior: "smooth",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --black: #0a0a0a;
          --black-2: #111111;
          --black-3: #1a1a1a;
          --black-4: #242424;
          --gold: #f5a623;
          --gold-dark: #c4831a;
          --gold-light: #fdf3e0;
          --gold-dim: rgba(245, 166, 35, 0.1);
          --gold-border: rgba(245, 166, 35, 0.28);
          --white: #ffffff;
          --text: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.5);
          --text-soft: rgba(255, 255, 255, 0.75);
          --border: rgba(255, 255, 255, 0.08);
          --radius: 12px;
          --radius-lg: 18px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: Arial, sans-serif;
          background: var(--black);
          color: var(--text);
          line-height: 1.6;
          font-size: 15px;
        }

        nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 62px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-logo-text {
          font-size: 17px;
          color: #fff;
          font-weight: 700;
        }

        .nav-logo-text em {
          color: var(--gold);
          font-style: normal;
        }

        .nav-links {
          display: flex;
          gap: 1.75rem;
        }

        .nav-links a {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .nav-links a:hover {
          color: var(--gold);
        }

        .nav-apply {
          background: var(--gold);
          color: #000 !important;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
        }

        .hero {
          position: relative;
          overflow: hidden;
          background: var(--black);
          padding: 6rem 2rem 5rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 12px;
          font-weight: 600;
          padding: 5px 16px;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
        }

        .hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1.25rem;
        }

        .hero h1 em {
          color: var(--gold);
          font-style: italic;
        }

        .hero p {
          color: var(--text-soft);
          font-size: 16px;
          max-width: 500px;
          margin: 0 auto 2rem;
        }

        .hero-dates {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 2.5rem;
        }

        .date-chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          color: var(--text-soft);
          font-size: 13px;
          padding: 6px 16px;
          border-radius: 20px;
        }

        .date-chip strong {
          color: var(--gold);
        }

        .hero-cta,
        .btn-next,
        .btn-submit {
          background: var(--gold);
          color: #000;
          border: none;
          text-decoration: none;
          cursor: pointer;
          font-weight: 700;
        }

        .hero-cta {
          display: inline-block;
          font-size: 15px;
          padding: 14px 36px;
          border-radius: 30px;
        }

        section {
          padding: 5rem 2rem;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-tag {
          display: inline-block;
          background: var(--gold-dim);
          color: var(--gold);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 0.75rem;
          border: 1px solid var(--gold-border);
        }

        .section-header h2 {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .section-header p {
          color: var(--text-muted);
          max-width: 540px;
          margin: 0 auto;
          font-size: 15px;
        }

        #positions {
          background: var(--black-2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .positions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .pos-card {
          background: var(--black-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }

        .pos-icon {
          font-size: 22px;
          margin-bottom: 0.75rem;
        }

        .pos-title {
          font-size: 18px;
          margin-bottom: 0.4rem;
          color: #fff;
          font-weight: 700;
        }

        .pos-subtitle {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }

        .pos-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 1rem;
        }

        .pos-responsibilities {
          list-style: none;
          margin-bottom: 1rem;
        }

        .pos-responsibilities li {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.45);
          padding: 3px 0 3px 14px;
          position: relative;
          line-height: 1.5;
        }

        .pos-responsibilities li::before {
          content: "→";
          position: absolute;
          left: 0;
          font-size: 10px;
          color: var(--gold);
          opacity: 0.6;
          top: 4px;
        }

        .pos-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .skill-tag {
          font-size: 11px;
          font-weight: 500;
          color: var(--gold);
          padding: 3px 9px;
          border-radius: 20px;
          border: 1px solid var(--gold-border);
          background: var(--gold-dim);
        }

        #apply {
          background: var(--black);
        }

        .form-wrap {
          background: var(--black-2);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .form-progress {
          display: flex;
          background: var(--black-3);
          border-bottom: 1px solid var(--border);
        }

        .progress-step {
          flex: 1;
          padding: 0.85rem 0.5rem;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
        }

        .progress-step.active {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }

        .progress-step.done {
          color: rgba(245, 166, 35, 0.45);
        }

        .form-page {
          padding: 2.5rem;
        }

        .form-page h3 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .page-desc {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 2rem;
        }

        .field {
          margin-bottom: 1.5rem;
        }

        .field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 6px;
        }

        .req {
          color: var(--gold);
          margin-left: 2px;
        }

        .hint {
          font-weight: 400;
          color: var(--text-muted);
          font-size: 12px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: #fff;
          background: var(--black-3);
          outline: none;
        }

        .field textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.6;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rank-grid,
        .radio-grid {
          display: grid;
          gap: 8px;
        }

        .rank-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          cursor: pointer;
          background: var(--black-3);
        }

        .rank-item.selected {
          border-color: var(--gold);
          background: var(--gold-dim);
        }

        .rank-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(245, 166, 35, 0.1);
          color: var(--gold);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rank-item.selected .rank-num {
          background: var(--gold);
          color: #000;
          font-weight: 700;
        }

        .rank-item-label {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .rank-item-sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        .radio-opt {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          cursor: pointer;
          background: var(--black-3);
          font-size: 14px;
          color: var(--text-soft);
        }

        .upload-zone {
          border: 1.5px dashed var(--gold-border);
          border-radius: 12px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: var(--black-3);
        }

        .upload-filename {
          margin-top: 0.75rem;
          font-size: 13px;
          color: var(--gold);
          font-weight: 500;
        }

        .word-count {
          display: flex;
          justify-content: flex-end;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 5px;
        }

        .word-count.over {
          color: #ff6b6b;
        }

        .form-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          gap: 1rem;
        }

        .btn-back {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          padding: 10px 22px;
          border-radius: 30px;
          cursor: pointer;
        }

        .btn-next {
          font-size: 14px;
          padding: 11px 28px;
          border-radius: 30px;
        }

        .btn-submit {
          font-size: 15px;
          padding: 13px 32px;
          border-radius: 30px;
        }

        .success-screen {
          padding: 4rem 2.5rem;
          text-align: center;
        }

        .checkmark {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: var(--gold);
        }

        .success-screen h3 {
          font-size: 2rem;
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .success-screen p {
          color: var(--text-muted);
          font-size: 15px;
          max-width: 420px;
          margin: 0 auto 2rem;
        }

        .timeline-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .timeline-step {
          background: var(--black-3);
          border-radius: var(--radius);
          padding: 1rem;
          border: 1px solid var(--border);
        }

        .ts-date {
          font-size: 11px;
          font-weight: 600;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .ts-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
        }

        #faq {
          background: var(--black-2);
          border-top: 1px solid var(--border);
        }

        .faq-list {
          max-width: 640px;
          margin: 0 auto;
        }

        .faq-item {
          border-bottom: 1px solid var(--border);
        }

        .faq-q {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-soft);
          padding: 1.25rem 0;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-a {
          padding: 0 0 1.25rem;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        footer {
          background: var(--black-3);
          border-top: 1px solid var(--border);
          text-align: center;
          padding: 2rem;
          font-size: 13px;
          color: var(--text-muted);
        }

        footer strong {
          color: #fff;
        }

        footer a {
          color: var(--gold);
          text-decoration: none;
        }

        .error-msg {
          margin-top: 1rem;
          color: #ff8c8c;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .two-col {
            grid-template-columns: 1fr;
          }

          .nav-links {
            display: none;
          }

          .hero {
            padding: 4rem 1.5rem 3.5rem;
          }

          .form-page,
          .success-screen {
            padding: 1.5rem;
          }

          .progress-step {
            font-size: 9px;
            padding: 0.6rem 0.2rem;
          }

          .timeline-steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav>
        <a className="nav-logo" href="#">
          <span className="nav-logo-text">
            <em>ColorStack</em> @ Calstate LA
          </span>
        </a>
        <div className="nav-links">
          <a href="#positions">Positions</a>
          <a href="#apply">Apply</a>
          <a href="#faq">FAQ</a>
        </div>
        <a className="nav-apply" href="#apply">
          Apply now
        </a>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="pulse" />
            Applications now open
          </div>
          <h1>
            Join the <em>ColorStack</em>
            <br />
            Board 2026 to 2027
          </h1>
          <p>
            Help build community, opportunity, and belonging for Black and
            Latinx students in computing at Cal State LA.
          </p>
          <div className="hero-dates">
            <div className="date-chip">
              Applications close <strong>June 1</strong>
            </div>
            <div className="date-chip">
              Interviews <strong>TBD</strong>
            </div>
            <div className="date-chip">
              Results <strong>TBD</strong>
            </div>
          </div>
          <a className="hero-cta" href="#apply">
            Start your application
          </a>
        </div>
      </section>

      <section id="positions">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Open Positions</div>
            <h2>Find your role on the board</h2>
            <p>
              Seven positions are open for the 2026 to 2027 academic year. Read
              each description before applying.
            </p>
          </div>

          <div className="positions-grid">
            {positions.map((position) => (
              <div className="pos-card" key={position.name}>
                <div className="pos-icon">{position.icon}</div>
                <div className="pos-title">{position.name}</div>
                <div className="pos-subtitle">{position.subtitle}</div>
                <div className="pos-desc">{position.desc}</div>
                <ul className="pos-responsibilities">
                  {position.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="pos-skills">
                  {position.skills.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Apply Now</div>
            <h2>Board Application</h2>
            <p>
              Complete all sections carefully. Applications close{" "}
              <strong style={{ color: "var(--gold)" }}>June 1</strong>.
            </p>
          </div>

          <div className="form-wrap">
            <div className="form-progress">
              {["1. Positions", "2. About You", "3. Essays", "4. Resume", "5. Availability"].map(
                (label, index) => (
                  <div
                    key={label}
                    className={`progress-step ${
                      currentPage === index
                        ? "active"
                        : currentPage > index || isSubmitted
                        ? "done"
                        : ""
                    }`}
                  >
                    {label}
                  </div>
                )
              )}
            </div>

            {!isSubmitted && currentPage === 0 && (
              <div className="form-page">
                <h3>Choose your positions</h3>
                <p className="page-desc">
                  Click positions you're interested in to rank them. First click
                  is Rank 1, second is Rank 2, and so on.
                </p>

                <div className="rank-grid">
                  {positions.map((position) => {
                    const idx = rankings.indexOf(position.name);
                    const selected = idx > -1;

                    return (
                      <div
                        key={position.name}
                        className={`rank-item ${selected ? "selected" : ""}`}
                        onClick={() => toggleRanking(position.name)}
                      >
                        <div className="rank-num">{selected ? idx + 1 : "—"}</div>
                        <div>
                          <div className="rank-item-label">{position.name}</div>
                          <div className="rank-item-sub">{position.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="form-nav">
                  <span />
                  <button className="btn-next" type="button" onClick={nextPage}>
                    Next: About You
                  </button>
                </div>
              </div>
            )}

            {!isSubmitted && currentPage === 1 && (
              <div className="form-page">
                <h3>About you</h3>
                <p className="page-desc">
                  Basic information so we know who&apos;s applying.
                </p>

                <div className="two-col">
                  <div className="field">
                    <label>
                      Full name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Cal State LA email <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@calstatela.edu"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="two-col">
                  <div className="field">
                    <label>
                      Major <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={form.major}
                      onChange={(e) => updateField("major", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Academic year <span className="req">*</span>
                    </label>
                    <select
                      value={form.academicYear}
                      onChange={(e) =>
                        updateField("academicYear", e.target.value)
                      }
                    >
                      <option value="">Select year...</option>
                      <option>Freshman</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                      <option>Graduate Student</option>
                    </select>
                  </div>
                </div>

                <div className="form-nav">
                  <button className="btn-back" type="button" onClick={prevPage}>
                    Back
                  </button>
                  <button className="btn-next" type="button" onClick={nextPage}>
                    Next: Essays
                  </button>
                </div>
              </div>
            )}

            {!isSubmitted && currentPage === 2 && (
              <div className="form-page">
                <h3>Short answer questions</h3>
                <p className="page-desc">
                  Be specific and authentic. Word limits are soft guidelines.
                </p>

                <div className="field">
                  <label>
                    Why do you want to join the ColorStack board?
                    <span className="req">*</span>
                  </label>
                  <textarea
                    placeholder="Share your motivation and what you hope to contribute..."
                    value={form.whyJoin}
                    onChange={(e) => updateField("whyJoin", e.target.value)}
                  />
                  <div
                    className={`word-count ${
                      wordCount(form.whyJoin) > 250 ? "over" : ""
                    }`}
                  >
                    <span>{wordCount(form.whyJoin)}</span>&nbsp;/ 250 words
                  </div>
                </div>

                <div className="field">
                  <label>
                    What experience or skills make you a strong fit for your top
                    position?
                    <span className="req">*</span>
                  </label>
                  <textarea
                    placeholder="Highlight relevant experience, skills, or projects..."
                    value={form.strongFit}
                    onChange={(e) => updateField("strongFit", e.target.value)}
                  />
                  <div
                    className={`word-count ${
                      wordCount(form.strongFit) > 250 ? "over" : ""
                    }`}
                  >
                    <span>{wordCount(form.strongFit)}</span>&nbsp;/ 250 words
                  </div>
                </div>

                <div className="field">
                  <label>
                    Describe a time you took initiative. What was the outcome?
                    <span className="req">*</span>
                  </label>
                  <textarea
                    placeholder="Walk us through a specific example..."
                    value={form.initiativeStory}
                    onChange={(e) =>
                      updateField("initiativeStory", e.target.value)
                    }
                  />
                  <div
                    className={`word-count ${
                      wordCount(form.initiativeStory) > 200 ? "over" : ""
                    }`}
                  >
                    <span>{wordCount(form.initiativeStory)}</span>&nbsp;/ 200
                    words
                  </div>
                </div>

                <div className="field">
                  <label>
                    What&apos;s one goal you&apos;d want ColorStack @ Cal State
                    LA to achieve this year? How would you help make it happen?
                    <span className="req">*</span>
                  </label>
                  <textarea
                    placeholder="Be specific about the goal and your plan..."
                    value={form.goalForYear}
                    onChange={(e) => updateField("goalForYear", e.target.value)}
                  />
                  <div
                    className={`word-count ${
                      wordCount(form.goalForYear) > 200 ? "over" : ""
                    }`}
                  >
                    <span>{wordCount(form.goalForYear)}</span>&nbsp;/ 200 words
                  </div>
                </div>

                <div className="form-nav">
                  <button className="btn-back" type="button" onClick={prevPage}>
                    Back
                  </button>
                  <button className="btn-next" type="button" onClick={nextPage}>
                    Next: Resume
                  </button>
                </div>
              </div>
            )}

            {!isSubmitted && currentPage === 3 && (
              <div className="form-page">
                <h3>Upload your resume</h3>
                <p className="page-desc">
                  PDF preferred. Max 5MB. Make sure your resume is up to date
                  before submitting.
                </p>

                <div className="upload-zone">
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                    📄
                  </div>
                  <p>
                    <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Upload your resume
                    </span>
                  </p>
                  <p style={{ marginTop: 4, fontSize: 13 }}>
                    PDF, DOC, or DOCX · Max 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setResumeFile(e.target.files?.[0] ?? null)
                    }
                    style={{ marginTop: "1rem" }}
                  />
                </div>

                {resumeFile && (
                  <div className="upload-filename">
                    ✓ Uploaded: {resumeFile.name}
                  </div>
                )}

                <div className="form-nav">
                  <button className="btn-back" type="button" onClick={prevPage}>
                    Back
                  </button>
                  <button className="btn-next" type="button" onClick={nextPage}>
                    Next: Availability
                  </button>
                </div>
              </div>
            )}

            {!isSubmitted && currentPage === 4 && (
              <div className="form-page">
                <h3>Availability</h3>
                <p className="page-desc">
                  Help us understand your bandwidth for the year ahead.
                </p>

                <div className="field">
                  <label>
                    How many hours per week can you commit to ColorStack?
                    <span className="req">*</span>
                  </label>
                  <div className="radio-grid">
                    {[
                      "2 to 4 hours per week",
                      "4 to 6 hours per week",
                      "6+ hours per week",
                    ].map((value) => (
                      <label className="radio-opt" key={value}>
                        <input
                          type="radio"
                          name="hours"
                          checked={form.hoursPerWeek === value}
                          onChange={() => updateField("hoursPerWeek", value)}
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>
                    Are you available for weekly board meetings?
                    <span className="req">*</span>
                  </label>
                  <div className="radio-grid">
                    {[
                      "Yes, I can commit to weekly meetings",
                      "Depends on the day or time",
                      "I have some scheduling constraints",
                    ].map((value) => (
                      <label className="radio-opt" key={value}>
                        <input
                          type="radio"
                          name="meetings"
                          checked={form.weeklyMeetings === value}
                          onChange={() => updateField("weeklyMeetings", value)}
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>
                    Will you be enrolled at Cal State LA for the full 2026 to
                    2027 academic year?
                    <span className="req">*</span>
                  </label>
                  <div className="radio-grid">
                    {["Yes, full year", "Unsure", "No"].map((value) => (
                      <label className="radio-opt" key={value}>
                        <input
                          type="radio"
                          name="enrolled"
                          checked={form.enrolledFullYear === value}
                          onChange={() =>
                            updateField("enrolledFullYear", value)
                          }
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>
                    Anything that might affect your availability this year?
                    <span className="hint"> optional</span>
                  </label>
                  <textarea
                    placeholder="Internships, part time work, classes, personal commitments..."
                    value={form.availabilityNotes}
                    onChange={(e) =>
                      updateField("availabilityNotes", e.target.value)
                    }
                  />
                </div>

                <div className="form-nav">
                  <button className="btn-back" type="button" onClick={prevPage}>
                    Back
                  </button>
                  <button
                    className="btn-submit"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit application"}
                  </button>
                </div>
              </div>
            )}

            {isSubmitted && (
              <div className="success-screen">
                <div className="checkmark">✓</div>
                <h3>Application submitted!</h3>
                <p>
                  Thank you for applying to the ColorStack board. We&apos;ll
                  review your application and be in touch soon.
                </p>

                <div className="timeline-steps">
                  <div className="timeline-step">
                    <div className="ts-date">June 1</div>
                    <div className="ts-label">Applications close</div>
                  </div>
                  <div className="timeline-step">
                    <div className="ts-date">TBD</div>
                    <div className="ts-label">Interview invites sent</div>
                  </div>
                  <div className="timeline-step">
                    <div className="ts-date">TBD</div>
                    <div className="ts-label">Results announced</div>
                  </div>
                </div>

                <p style={{ marginTop: "1.5rem", fontSize: 13 }}>
                  Questions? Email{" "}
                  <a href="mailto:bissano@calstatela.edu">
                    bissano@calstatela.edu
                  </a>
                </p>
              </div>
            )}

            {submitError && <div className="form-page error-msg">{submitError}</div>}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">FAQ</div>
            <h2>Common questions</h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={item.q}>
                <button
                  className="faq-q"
                  onClick={() =>
                    setOpenFaq((prev) => (prev === index ? null : index))
                  }
                >
                  <span>{item.q}</span>
                  <span>{openFaq === index ? "×" : "+"}</span>
                </button>
                {openFaq === index && <div className="faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>
          <strong>ColorStack @ Cal State LA</strong> · 2026 to 2027 Board
          Applications
        </p>
        <p style={{ marginTop: 6 }}>
          Questions? <a href="mailto:bissano@calstatela.edu">bissano@calstatela.edu</a>
        </p>
      </footer>
    </>
  );
}