import { useState, useEffect, useRef } from 'react'
import {
  Sparkles, AlertTriangle, CheckCircle2, Circle, ChevronDown, ChevronRight,
  Download, FileText, Clock, Scale, Users, ArrowRight, Shield, MessageSquare,
  BookOpen, Zap, Check, X, Calendar, Phone, Star, BadgeCheck
} from 'lucide-react'
import type { Page } from '../App'
import { lawyers } from '../data/lawyers'

interface Props {
  issue: string
  navigate: (page: Page, query?: string) => void
}

// ─── Types ────────────────────────────────────────────
interface Assessment {
  issueType: string
  issueSummary: string
  practiceArea: string
  practiceAreaColor: string
  risk: 'Low' | 'Medium' | 'High'
  riskExplanation: string
  clarifyingQuestions: string[]
  immediateActions: string[]
  requiredDocuments: string[]
  processSteps: string[]
  applicableLaws: { name: string; summary: string; details: string }[]
  recommendedLawyerType: string
  recommendedLawyerId: string
}

// ─── AI Mock Logic ────────────────────────────────────
function analyzeIssue(issue: string): Assessment {
  const q = issue.toLowerCase()

  if (q.includes('salary') || q.includes('wages') || q.includes('employer') || q.includes('unpaid') || q.includes('pay')) {
    return {
      issueType: 'Employment Dispute',
      issueSummary: 'This appears to be a wage or salary dispute with an employer. Non-payment of wages is a serious violation of labour law and entitles the employee to legal remedies including recovery of dues, compensation, and potentially criminal action against the employer.',
      practiceArea: 'Employment Law',
      practiceAreaColor: 'badge-blue',
      risk: 'Medium',
      riskExplanation: 'This matter requires timely action. Delay in claiming unpaid wages may complicate recovery. Employers have specific obligations under labour statutes, and delay in initiating a claim may be interpreted as acquiescence.',
      clarifyingQuestions: [
        'Which state are you employed in?',
        'How many months of salary is outstanding?',
        'Is your employment formal (with offer letter) or informal?',
        'Has the employer communicated any reason for non-payment?',
        'Have you already issued a written demand to the employer?',
      ],
      immediateActions: [
        'Send a written demand notice to the employer via registered post',
        'File a complaint with the Labour Commissioner of your state',
        'Document all evidence of employment (offer letter, payslips, emails)',
        'Do not resign until you have received dues or taken legal action',
        'Seek advice about potential criminal action under Sections 27–30 of POSH',
      ],
      requiredDocuments: [
        'Appointment / Offer Letter',
        'Salary Slips or Pay Stubs',
        'Bank Statements (showing last payment received)',
        'Employment Contract or CTC Letter',
        'WhatsApp / Email Communication with Employer',
        'Identity Proof (Aadhaar / PAN)',
        'Company Registration Details',
      ],
      processSteps: [
        'Initial Consultation with Labour Lawyer',
        'Issue Written Demand Notice to Employer',
        'File Complaint with Labour Commissioner',
        'Conciliation & Settlement Proceedings',
        'Labour Court Adjudication (if no settlement)',
        'Recovery of Dues with Interest & Compensation',
      ],
      applicableLaws: [
        { name: 'Payment of Wages Act, 1936', summary: 'Mandates timely payment of wages and empowers recovery of withheld amounts.', details: 'An employer who fails to pay wages within the prescribed time period is liable to pay compensation up to 10 times the withheld amount. Section 15 provides for the recovery of wages through a claims authority.' },
        { name: 'Industrial Disputes Act, 1947', summary: 'Governs disputes between employers and employees including wage disputes.', details: 'Provides for conciliation, arbitration, and adjudication of industrial disputes. A workman can approach the Labour Commissioner, and if conciliation fails, the matter is referred to a Labour Court.' },
        { name: 'Bharatiya Nyaya Sanhita (BNS), 2023', summary: 'Criminal breach of trust provisions may apply to intentional wage withholding.', details: 'Where the withholding is deliberate and dishonest, provisions relating to criminal breach of trust under Section 316 of BNS may be applicable, enabling a police complaint or private complaint.' },
      ],
      recommendedLawyerType: 'Employment / Labour Law Specialist',
      recommendedLawyerId: '6',
    }
  }

  if (q.includes('landlord') || q.includes('tenant') || q.includes('rent') || q.includes('deposit') || q.includes('eviction') || q.includes('lease')) {
    return {
      issueType: 'Landlord-Tenant Dispute',
      issueSummary: 'This is a landlord-tenant dispute involving either non-refund of security deposit, wrongful eviction, or breach of rental agreement terms. Tenant rights are protected under state-specific Rent Control Acts and the general law of contract.',
      practiceArea: 'Property Law',
      practiceAreaColor: 'badge-violet',
      risk: 'Medium',
      riskExplanation: 'This matter generally benefits from timely legal attention. Responding before any stated deadline may help preserve your legal position. If a legal notice has been received, an early response is essential.',
      clarifyingQuestions: [
        'Which state/city is the property located in?',
        'Do you have a registered rental agreement?',
        'What is the specific dispute — deposit refund, eviction, or rent increase?',
        'Have you received a legal notice or eviction notice?',
        'How long have you been a tenant at this property?',
      ],
      immediateActions: [
        'Read any legal notice carefully and note all response deadlines',
        'Do not vacate the premises without written confirmation of deposit refund',
        'Collect all rental receipts, payment records, and communication',
        'Photograph the property condition to counter false damage claims',
        'Consult a lawyer before signing any documents provided by the landlord',
      ],
      requiredDocuments: [
        'Registered Rental / Lease Agreement',
        'Rent Receipts or Bank Transfer Records',
        'Legal Notice (if received)',
        'Photos / Videos of Property Condition',
        'WhatsApp / Email Communication with Landlord',
        'Utility Bills (to prove tenancy duration)',
        'Identity Proof (Aadhaar / PAN)',
      ],
      processSteps: [
        'Consultation with Property Lawyer',
        'Issue Reply Notice to Landlord (if notice received)',
        'Attempt Negotiated Settlement',
        'File Complaint in Rent Court / Civil Court',
        'Court Hearing and Evidence Submission',
        'Order for Refund / Compensation',
      ],
      applicableLaws: [
        { name: 'State Rent Control Act', summary: 'Governs landlord-tenant relations including eviction grounds and deposit refund timelines.', details: 'Most Indian states have their own Rent Control Acts. These typically restrict eviction to specific grounds and mandate deposit refund within 30–60 days of vacation.' },
        { name: 'Transfer of Property Act, 1882', summary: 'Defines rights and obligations of lessor and lessee.', details: 'Section 108 of the Transfer of Property Act specifies the duties of a lessor — including maintaining the property and returning the property without undue claim at the end of the lease period.' },
        { name: 'Indian Contract Act, 1872', summary: 'The rental agreement is a contract; breach entitles the aggrieved party to compensation.', details: 'Under Section 73 of the Indian Contract Act, a party suffering from breach of contract is entitled to compensation for loss naturally arising from the breach.' },
      ],
      recommendedLawyerType: 'Property Law Specialist',
      recommendedLawyerId: '4',
    }
  }

  if (q.includes('divorce') || q.includes('custody') || q.includes('maintenance') || q.includes('marriage') || q.includes('wife') || q.includes('husband') || q.includes('alimony')) {
    return {
      issueType: 'Family Law Matter',
      issueSummary: 'This is a family law matter involving matrimonial rights, divorce proceedings, child custody, or maintenance. Indian family law is governed by personal law statutes based on religion, and the rights of parties depend significantly on the specific facts and jurisdiction.',
      practiceArea: 'Family Law',
      practiceAreaColor: 'badge-amber',
      risk: 'High',
      riskExplanation: 'Family law matters, particularly those involving children or domestic violence, require urgent legal attention. Delay in filing or responding to applications can adversely affect your legal position, especially in custody and maintenance matters.',
      clarifyingQuestions: [
        'What is your religion? (This determines which personal law applies)',
        'How long have you been married?',
        'Are children involved in this dispute?',
        'Is there any domestic violence or abuse involved?',
        'Have any court proceedings already been initiated?',
      ],
      immediateActions: [
        'Do not leave the matrimonial home without legal advice if you are a woman',
        'Collect all financial documents — bank statements, property papers',
        'Preserve all evidence of domestic violence if applicable',
        'File for interim maintenance immediately if financial support is needed',
        'Contact a Domestic Violence helpline (181) if safety is a concern',
      ],
      requiredDocuments: [
        'Marriage Certificate',
        'Aadhaar / PAN of both parties',
        'Property and Asset Documents',
        'Income Proof of both parties',
        'Birth Certificates of Children (if applicable)',
        'Medical Records (if domestic violence is involved)',
        'Communication Records (WhatsApp, emails)',
      ],
      processSteps: [
        'Emergency Consultation with Family Law Specialist',
        'File for Interim Relief (maintenance / custody)',
        'Attempt Mediation or Counselling',
        'File Divorce / Maintenance Petition',
        'Evidence Stage and Cross-Examination',
        'Final Order from Family Court',
      ],
      applicableLaws: [
        { name: 'Hindu Marriage Act, 1955', summary: 'Governs marriage, divorce, and maintenance for Hindus, Sikhs, Jains, and Buddhists.', details: 'Section 13 provides grounds for divorce. Section 24 provides for interim maintenance during proceedings. Section 26 provides for custody of children during the case.' },
        { name: 'Protection of Women from Domestic Violence Act, 2005', summary: 'Provides civil remedies for domestic violence including protection orders and maintenance.', details: 'Enables a woman to seek protection orders, residence orders, and monetary relief from a Magistrate without filing a criminal case.' },
        { name: 'Guardian and Wards Act, 1890', summary: 'Governs child custody in cases involving minor children.', details: 'Courts determine custody based on the paramount consideration of the welfare of the child, not the rights of the parents.' },
      ],
      recommendedLawyerType: 'Family Law Specialist',
      recommendedLawyerId: '5',
    }
  }

  if (q.includes('fir') || q.includes('police') || q.includes('arrest') || q.includes('bail') || q.includes('criminal') || q.includes('case filed') || q.includes('complaint')) {
    return {
      issueType: 'Criminal Law Matter',
      issueSummary: 'This involves a criminal law matter — either filing an FIR, responding to a criminal complaint, or seeking bail. Criminal proceedings in India are now governed by the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), which replaced the CrPC.',
      practiceArea: 'Criminal Law',
      practiceAreaColor: 'badge-red',
      risk: 'High',
      riskExplanation: 'Criminal matters require urgent attention. Missing filing deadlines, responding to notices, or appearing before the magistrate can have serious consequences including non-bailable warrants. Immediate legal representation is strongly recommended.',
      clarifyingQuestions: [
        'Are you the complainant or the accused in this matter?',
        'Has an FIR already been registered?',
        'Have you received any notice from the police or court?',
        'What is the specific offence being alleged?',
        'Is there any immediate arrest threat?',
      ],
      immediateActions: [
        'Engage a criminal lawyer immediately — do not approach police without counsel',
        'Exercise your right to remain silent if questioned',
        'Do not sign any document without your lawyer\'s review',
        'If arrested, ensure your lawyer is informed immediately',
        'Apply for anticipatory bail if arrest is anticipated',
      ],
      requiredDocuments: [
        'Copy of FIR (if registered)',
        'Police Notice / Summons',
        'Any Court Documents Received',
        'Identity Proof (Aadhaar)',
        'Bail Application Documents',
        'Character Certificates / Affidavit',
        'Witness Statements (if available)',
      ],
      processSteps: [
        'Emergency Lawyer Consultation',
        'FIR / Complaint Review',
        'Bail Application (if applicable)',
        'Legal Notice Reply or Anticipatory Bail',
        'Police Investigation Phase',
        'Charge Sheet & Court Trial',
        'Arguments & Judgment',
      ],
      applicableLaws: [
        { name: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', summary: 'Replaced the CrPC; governs criminal procedure in India.', details: 'Section 173 governs FIR registration. Section 480 governs bail. BNSS introduces Zero FIR, e-FIR, and mandatory preliminary enquiry for offences punishable with 3–7 years.' },
        { name: 'Bharatiya Nyaya Sanhita (BNS), 2023', summary: 'Replaced the IPC; defines criminal offences and punishments.', details: 'BNS classifies offences and prescribes punishment. Understanding the specific section under which an FIR is filed determines whether the offence is bailable or non-bailable.' },
        { name: 'Constitution of India — Article 22', summary: 'Fundamental right to be informed of grounds of arrest and consult a lawyer.', details: 'Every arrested person has the right to be informed of the grounds of arrest, the right to consult and be defended by a legal practitioner of choice, and the right to be produced before a magistrate within 24 hours.' },
      ],
      recommendedLawyerType: 'Criminal Defense Specialist',
      recommendedLawyerId: '2',
    }
  }

  // Default / Generic
  return {
    issueType: 'General Legal Matter',
    issueSummary: 'Based on your description, this is a legal matter requiring professional assessment to determine the exact nature of the dispute, applicable laws, and recommended course of action. An initial consultation with a lawyer will help identify the most appropriate remedy.',
    practiceArea: 'General Legal Advice',
    practiceAreaColor: 'badge-blue',
    risk: 'Medium',
    riskExplanation: 'While the exact urgency depends on the specific facts, most legal matters benefit from timely professional advice. Delays can sometimes forfeit rights due to limitation periods.',
    clarifyingQuestions: [
      'What specific incident or event triggered this legal concern?',
      'Which state or city does this matter involve?',
      'Has any party sent you a formal notice or communication?',
      'Are any financial amounts involved? If so, how much?',
      'Has any court case been filed by any party yet?',
    ],
    immediateActions: [
      'Document all relevant facts in chronological order',
      'Preserve all communications, agreements, and receipts',
      'Do not take any irreversible action without legal advice',
      'Identify and note all important dates and deadlines',
      'Consult with a qualified lawyer for specific guidance',
    ],
    requiredDocuments: [
      'All Agreements or Contracts related to the matter',
      'Correspondence (Letters, Emails, WhatsApp)',
      'Payment Records or Receipts',
      'Identity Proof (Aadhaar / PAN)',
      'Any Legal Notices Received or Sent',
      'Photographs or Documentary Evidence',
    ],
    processSteps: [
      'Initial Legal Consultation',
      'Document Collection & Review',
      'Legal Notice or Reply (if needed)',
      'Negotiation / Settlement Attempt',
      'Filing of Case (if no settlement)',
      'Court Proceedings',
      'Judgment & Enforcement',
    ],
    applicableLaws: [
      { name: 'Limitation Act, 1963', summary: 'Prescribes time limits for initiating legal action.', details: 'Different types of legal claims have different limitation periods. For contract disputes, the general period is 3 years from the date of breach. Missing the limitation period may bar your legal remedy.' },
      { name: 'Indian Contract Act, 1872', summary: 'Governs contracts and their enforcement.', details: 'If your matter involves a breach of contract or agreement, the Indian Contract Act governs your rights to claim damages, specific performance, or rescission of the contract.' },
      { name: 'Constitution of India — Article 14 & 21', summary: 'Fundamental rights to equality and life with dignity.', details: 'Where any fundamental right is violated by the state or a state instrumentality, you may approach the High Court under Article 226 or the Supreme Court under Article 32 for constitutional remedies.' },
    ],
    recommendedLawyerType: 'General Practice Lawyer',
    recommendedLawyerId: '1',
  }
}

// ─── Sub-components ────────────────────────────────────

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const config = {
    Low: { cls: 'risk-low', dot: 'bg-emerald-400' },
    Medium: { cls: 'risk-medium', dot: 'bg-amber-400' },
    High: { cls: 'risk-high', dot: 'bg-rose-400' },
  }
  const c = config[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${c.cls}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
      {level} Risk
    </span>
  )
}

function Panel({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="glass-card p-6 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function LawCard({ law }: { law: { name: string; summary: string; details: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface-2)] transition-colors"
      >
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">{law.name}</div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">{law.summary}</div>
        </div>
        <ChevronDown size={16} className={`text-[var(--text-muted)] shrink-0 ml-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3">
          {law.details}
        </div>
      )}
    </div>
  )
}

function DocumentChecklist({ docs }: { docs: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(docs.map(() => false))

  const toggle = (i: number) => {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  const downloadChecklist = () => {
    const content = `LEGAL DOCUMENT CHECKLIST\n${'─'.repeat(40)}\n\n${docs.map((d, i) => `${checked[i] ? '✓' : '□'} ${d}`).join('\n')}\n\n─────────────────────────────────────────\nGenerated by CourtCounsel AI\nFor informational purposes only. This is not legal advice.\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'legal-document-checklist.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {docs.map((doc, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all text-left group"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked[i] ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-2)] group-hover:border-[var(--primary)]'}`}>
              {checked[i] && <Check size={12} className="text-white" />}
            </div>
            <span className={`text-sm transition-colors ${checked[i] ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text)]'}`}>
              {doc}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={downloadChecklist}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all"
      >
        <Download size={15} />
        Download Checklist
      </button>
    </div>
  )
}

function ProcessTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-6 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] to-transparent opacity-20" />
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4 relative">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10 text-xs font-bold ${
              i === 0 ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
            }`}>
              {i + 1}
            </div>
            <div className="pt-2 pb-4">
              <div className={`text-sm font-semibold ${i === 0 ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>{step}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────
export default function AnalyzePage({ issue, navigate }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [progress, setProgress] = useState(0)
  const [editedIssue, setEditedIssue] = useState(issue || '')
  const [showQuestions, setShowQuestions] = useState(false)

  const recommendedLawyer = lawyers.find(l => l.id === assessment?.recommendedLawyerId) || lawyers[0]

  useEffect(() => {
    if (!issue) { setIsLoading(false); return }
    // Simulate AI analysis with streaming progress
    setIsLoading(true)
    setProgress(0)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) { clearInterval(progressInterval); return 95 }
        return prev + Math.random() * 12
      })
    }, 150)

    const timer = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setAssessment(analyzeIssue(issue))
        setIsLoading(false)
      }, 300)
    }, 2200)

    return () => { clearTimeout(timer); clearInterval(progressInterval) }
  }, [issue])

  const handleReanalyze = () => {
    if (!editedIssue.trim()) return
    setIsLoading(true)
    setProgress(0)
    setAssessment(null)
    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 95 ? (clearInterval(progressInterval), 95) : prev + Math.random() * 12)
    }, 150)
    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => { setAssessment(analyzeIssue(editedIssue)); setIsLoading(false) }, 300)
    }, 2000)
  }

  if (!issue && !assessment) {
    return (
      <div className="min-h-screen gradient-bg-hero flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} className="text-[var(--primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>No Issue Provided</h2>
          <p className="text-[var(--text-muted)] mb-6">Please describe your legal issue on the homepage to get an AI assessment.</p>
          <button onClick={() => navigate('landing')} className="btn-primary">
            <ArrowRight size={16} /> Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* Loading State */}
      {isLoading && (
        <div className="min-h-screen gradient-bg-hero flex flex-col items-center justify-center gap-8 px-4">
          <div className="w-20 h-20 rounded-3xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center animate-pulse-glow">
            <Sparkles size={36} className="text-[var(--primary)] animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Analyzing Your Legal Issue</h2>
            <p className="text-[var(--text-muted)]">Our AI is reviewing applicable laws and generating your assessment…</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
              <span>Processing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-violet-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-[var(--text-faint)] animate-pulse">
            Reviewing Indian legislation · Identifying practice area · Generating checklist
          </div>
        </div>
      )}

      {/* Assessment Dashboard */}
      {!isLoading && assessment && (
        <div className="container-max py-8">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <button onClick={() => navigate('landing')} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-2">
                <ArrowRight size={12} className="rotate-180" /> Back to Home
              </button>
              <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                AI Legal Assessment
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">Generated based on your issue description</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge text-xs ${assessment.practiceAreaColor}`}>
                {assessment.practiceArea}
              </span>
              <RiskBadge level={assessment.risk} />
            </div>
          </div>

          {/* Issue Recap + Edit */}
          <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Your Issue</div>
              <div className="text-sm text-[var(--text)] font-medium">{issue || editedIssue}</div>
            </div>
            <button
              onClick={() => navigate('landing')}
              className="shrink-0 btn-secondary text-xs py-1.5 px-3"
            >
              <X size={13} /> Edit Issue
            </button>
          </div>

          {/* 2-Column Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. Issue Summary */}
              <Panel icon={<Scale size={16} />} title="Issue Detected" delay={100}>
                <div className="space-y-3">
                  <div className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {assessment.issueType}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{assessment.issueSummary}</p>
                </div>
              </Panel>

              {/* 2. Clarifying Questions */}
              <Panel icon={<MessageSquare size={16} />} title="Clarifying Questions" delay={200}>
                <div className="text-xs text-[var(--text-muted)] mb-3">For a complete assessment, your lawyer may need answers to these questions:</div>
                <div className="space-y-2">
                  {assessment.clarifyingQuestions.map((q, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                      <div className="text-xs text-[var(--text-muted)] font-semibold mb-1.5">Q{i + 1}</div>
                      <div className="text-sm text-[var(--text)] mb-2">{q}</div>
                      <textarea
                        rows={1}
                        value={answers[i] || ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                        placeholder="Your answer (optional)…"
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] resize-none outline-none focus:border-[var(--primary)]/50 placeholder:text-[var(--text-faint)] transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </Panel>

              {/* 4. Risk Explanation */}
              <Panel icon={<AlertTriangle size={16} />} title="Risk & Urgency" delay={300}>
                <div className="flex items-start gap-4">
                  <RiskBadge level={assessment.risk} />
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">{assessment.riskExplanation}</p>
                </div>
              </Panel>

              {/* 5. Immediate Actions */}
              <Panel icon={<Zap size={16} />} title="Suggested Immediate Actions" delay={400}>
                <div className="space-y-2.5">
                  {assessment.immediateActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-emerald-500" />
                      </div>
                      <span className="text-sm text-[var(--text-muted)] leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* 8. Applicable Laws */}
              <Panel icon={<BookOpen size={16} />} title="Applicable Laws & Statutes" delay={500}>
                <div className="text-xs text-[var(--text-muted)] mb-3">Laws specifically relevant to your described situation. Click to expand details.</div>
                <div className="space-y-2">
                  {assessment.applicableLaws.map((law, i) => (
                    <LawCard key={i} law={law} />
                  ))}
                </div>
              </Panel>

              {/* 7. Legal Process Timeline */}
              <Panel icon={<Clock size={16} />} title="Typical Legal Process" delay={600}>
                <div className="text-xs text-[var(--text-muted)] mb-4">The general stages for this type of matter:</div>
                <ProcessTimeline steps={assessment.processSteps} />
              </Panel>
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6">

              {/* 6. Document Checklist */}
              <Panel icon={<FileText size={16} />} title="Required Documents" delay={200}>
                <div className="text-xs text-[var(--text-muted)] mb-3">Check items you already have. Download the list as a text file.</div>
                <DocumentChecklist docs={assessment.requiredDocuments} />
              </Panel>

              {/* 9. Lawyer Recommendation */}
              <Panel icon={<Users size={16} />} title="Recommended Lawyer" delay={350}>
                <div className="text-xs text-[var(--text-muted)] mb-3">
                  Based on this issue, we recommend a{' '}
                  <span className="text-[var(--primary)] font-semibold">{assessment.recommendedLawyerType}</span>
                </div>

                {/* Lawyer Card */}
                <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="h-16 bg-gradient-to-r from-[var(--primary)] to-violet-600 relative" />
                  <div className="px-4 pb-4">
                    <div className="-mt-8 mb-3">
                      <img
                        src={recommendedLawyer.photo}
                        alt={recommendedLawyer.name}
                        className="w-14 h-14 rounded-xl border-4 border-[var(--card)] object-cover shadow"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-sm font-bold text-[var(--text)]">{recommendedLawyer.name}</div>
                          {recommendedLawyer.verified && <BadgeCheck size={14} className="text-[var(--primary)]" />}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">{recommendedLawyer.practiceAreas[0]}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[var(--primary)]">
                        <Star size={12} fill="currentColor" />
                        {recommendedLawyer.clientRating}
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-4 text-xs text-[var(--text-muted)]">
                      <div className="flex justify-between">
                        <span>Experience</span>
                        <span className="font-semibold text-[var(--text)]">{recommendedLawyer.yearsOfPractice} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cases</span>
                        <span className="font-semibold text-[var(--text)]">{recommendedLawyer.totalCases}+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Languages</span>
                        <span className="font-semibold text-[var(--text)]">{recommendedLawyer.languages.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available</span>
                        <span className="font-semibold text-emerald-500">Today</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('profile', recommendedLawyer.id)}
                        className="flex-1 btn-secondary text-xs py-2"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate('booking')}
                        className="flex-1 btn-primary text-xs py-2 justify-center"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('search')}
                  className="w-full mt-2 text-xs text-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors py-1.5 flex items-center justify-center gap-1"
                >
                  View all lawyers <ChevronRight size={12} />
                </button>
              </Panel>

              {/* CTA — Book Consultation */}
              <div className="glass-premium p-5 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                <Calendar size={24} className="text-[var(--primary)] mx-auto mb-3" />
                <div className="text-sm font-bold text-[var(--text)] mb-1">Ready to take action?</div>
                <div className="text-xs text-[var(--text-muted)] mb-4">Book a consultation to discuss your case with an expert.</div>
                <button onClick={() => navigate('booking')} className="btn-primary w-full justify-center text-sm">
                  Book Consultation <ArrowRight size={15} />
                </button>
              </div>

              {/* Ask AI More */}
              <div className="glass-card p-4 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <Sparkles size={20} className="text-[var(--primary)] mx-auto mb-2" />
                <div className="text-xs font-semibold text-[var(--text)] mb-1">Have more questions?</div>
                <div className="text-xs text-[var(--text-muted)] mb-3">Ask our AI legal assistant for deeper guidance.</div>
                <button onClick={() => navigate('chat')} className="btn-secondary w-full justify-center text-xs py-2">
                  Ask AI Assistant <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* 10. Disclaimer */}
          <div className="mt-8 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
            <Shield size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-[var(--text)] mb-1">Legal Disclaimer</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                This assessment provides <strong>general legal information only</strong> and is not legal advice. It does not create an advocate-client relationship. Applicable laws depend on the specific facts of your case, the jurisdiction involved, and other individual circumstances. The information here is informational in nature and should not be relied upon as a substitute for advice from a qualified legal professional. Laws and legal interpretations may change. Always consult a licensed advocate before taking legal action.
              </p>
            </div>
          </div>

          <div className="h-12" />
        </div>
      )}
    </div>
  )
}
