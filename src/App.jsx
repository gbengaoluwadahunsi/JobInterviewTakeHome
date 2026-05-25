import { useState, useEffect, useRef } from 'react'

// ─── Icon helper ───
function Icon({ name, fill = false, className = '' }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={fill ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
        >
            {name}
        </span>
    )
}

// ─── Navigation Tabs ───
const NAV_TABS = ['Dashboard', 'Question Bank', 'Analytics', 'Interview Prep']
const SENIORITY_LEVELS = ['Intern', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal', 'Executive']

// ─── Top Navigation Bar ───
function NavBar({ currentTab, onTabChange, onLogoClick, isDark, toggleTheme }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleTabClick = (tab) => {
        onTabChange(tab)
        setMobileMenuOpen(false)
    }

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel-elevated border-b border-outline-variant/10">
            <div className="flex justify-between items-center h-[72px] px-margin-mobile md:px-margin-desktop max-w-container mx-auto relative">
                {/* Logo */}
                <div className="flex items-center gap-xl z-10">
                    <button
                        onClick={onLogoClick}
                        className="flex items-center gap-sm text-headline-md font-geist font-extrabold gradient-text-brand tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <img src="/logo.png" alt="HireFlow Logo" className="w-[32px] h-[32px] rounded-md icon-no-invert" />
                        HireFlow AI
                    </button>
                </div>

                {/* Centered Links (Desktop) */}
                <div className="hidden md:flex items-center gap-sm absolute left-1/2 transform -translate-x-1/2 z-10 w-max">
                    {NAV_TABS.map(tab => (
                        <NavLink
                            key={tab}
                            label={tab}
                            active={currentTab === tab}
                            onClick={() => handleTabClick(tab)}
                        />
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-md z-10">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        className="p-sm rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-bright/20 transition-all duration-200 active:scale-95 flex items-center justify-center"
                    >
                        <Icon name={isDark ? 'light_mode' : 'dark_mode'} className="text-[22px]" />
                    </button>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-sm rounded-lg text-on-surface-variant hover:bg-surface-bright/20 transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="text-[24px]" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-outline-variant/10 px-margin-mobile py-md animate-fade-in">
                    <div className="flex flex-col gap-xs">
                        {NAV_TABS.map(tab => (
                            <NavLink
                                key={tab}
                                label={tab}
                                active={currentTab === tab}
                                onClick={() => handleTabClick(tab)}
                                mobile
                            />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

function NavLink({ label, active = false, mobile = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                font-geist text-body-md transition-all duration-200 rounded-lg cursor-pointer
                ${mobile ? 'px-md py-sm w-full text-left' : 'px-md py-sm'}
                ${active
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/15'
                }
            `}
        >
            {label}
        </button>
    )
}

// ─── Category Card ───
function CategoryCard({ icon, iconBg, title, description, delay, onExplore }) {
    return (
        <div className={`glass-panel rounded-xl p-lg flex flex-col items-start gap-md group hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] transition-all duration-300 cursor-pointer animate-fade-in-up ${delay}`}>
            <div className={`p-md rounded-lg ${iconBg}`}>
                <Icon name={icon} className="text-[28px]" />
            </div>
            <h3 className="font-geist text-headline-md text-on-surface font-semibold">{title}</h3>
            <p className="font-geist text-body-md text-on-surface-variant flex-grow leading-relaxed">{description}</p>
            <button onClick={onExplore} className="flex items-center gap-xs text-primary text-label-md font-geist font-medium group-hover:gap-sm transition-all duration-200 cursor-pointer">
                Explore Bank <Icon name="arrow_forward" className="text-[16px]" />
            </button>
        </div>
    )
}

// ─── Recent Generation Row ───
function RecentRow({ title, subtitle, count, onClick }) {
    return (
        <div onClick={onClick} className="flex items-center justify-between py-md px-sm hover:bg-surface-bright/5 rounded-lg transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-md">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse-glow" />
                <div>
                    <p className="font-geist text-body-md text-on-surface font-medium group-hover:text-primary transition-colors">{title}</p>
                    <p className="font-geist text-label-md text-on-surface-variant">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-md">
                <span className="font-geist text-label-md text-on-surface-variant bg-surface-container-high px-sm py-xs rounded-md">{count} Qs</span>
                <button className="text-on-surface-variant hover:text-on-surface opacity-0 group-hover:opacity-100 transition-all">
                    <Icon name="more_vert" className="text-[20px]" />
                </button>
            </div>
        </div>
    )
}

// ─── Loading State ───
function LoadingState({ progress }) {
    return (
        <div className="flex flex-col items-center justify-start min-h-[60vh] animate-fade-in pt-xl">
            {/* Spinning Icon */}
            <div className="relative mb-lg">
                <div className="w-16 h-16 rounded-full glass-panel-elevated flex items-center justify-center animate-pulse-glow">
                    <Icon name="autorenew" className="text-[28px] text-primary animate-spin-slow" />
                </div>
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
            </div>

            <h2 className="font-geist text-display-md md:text-headline-lg text-on-surface font-extrabold mb-md text-center gradient-text">
                Analyzing role requirements...
            </h2>
            <p className="font-geist text-body-lg text-on-surface-variant text-center max-w-lg mb-lg">
                Reviewing the role title and generating tailored interview questions.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-lg mb-xl">
                <div className="flex justify-between items-center mb-sm">
                    <span className="font-geist text-label-md text-on-surface-variant tracking-widest uppercase">Generation Progress</span>
                    <span className="font-geist text-label-md text-primary font-semibold">{progress}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="progress-fill h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Skeleton Cards */}
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-gutter">
                <div className="glass-panel rounded-xl p-lg space-y-md">
                    <div className="flex items-center gap-sm">
                        <div className="skeleton w-8 h-8 rounded-full" />
                        <div className="skeleton h-4 w-32" />
                    </div>
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-5 w-4/5" />
                    <div className="skeleton h-5 w-3/5" />
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-5 w-2/3" />
                    <div className="flex gap-sm mt-md">
                        <div className="skeleton h-9 w-24 rounded-lg" />
                        <div className="skeleton h-9 w-24 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-gutter">
                    <div className="glass-panel rounded-xl p-lg space-y-sm">
                        <div className="skeleton h-4 w-20" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-4/5" />
                        <div className="skeleton h-4 w-full" />
                    </div>
                    <div className="glass-panel rounded-xl p-lg space-y-sm">
                        <div className="flex items-center gap-sm">
                            <div className="skeleton w-10 h-10 rounded-lg" />
                            <div className="skeleton h-4 w-24" />
                        </div>
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Error State ───
function ErrorState({ error, onRetry, onReturn }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="glass-panel-elevated rounded-xl p-xl max-w-md w-full text-center gradient-border">
                <div className="w-16 h-16 rounded-full border border-tertiary/30 flex items-center justify-center mx-auto mb-lg bg-tertiary/5">
                    <Icon name="warning" className="text-[32px] text-tertiary" />
                </div>
                <h2 className="font-geist text-headline-md text-on-surface font-bold mb-md">Something went wrong</h2>
                <p className="font-geist text-body-md text-on-surface-variant mb-xl leading-relaxed">
                    {error || 'We encountered an unexpected issue while processing your request. Our systems have logged the error.'}
                </p>
                <div className="flex gap-md">
                    <button
                        onClick={onRetry}
                        className="flex-1 flex items-center justify-center gap-sm px-lg py-md rounded-lg glass-panel text-on-surface font-geist text-label-md font-medium hover:bg-surface-bright/20 transition-all duration-200 active:scale-95"
                    >
                        <Icon name="refresh" className="text-[18px]" />
                        Retry
                    </button>
                    <button
                        onClick={onReturn}
                        className="flex-1 flex items-center justify-center gap-sm px-lg py-md rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary font-geist text-label-md font-bold glow-button"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Question Card ───
function QuestionCard({ question, index, total }) {
    const isFirst = index === 0

    return (
        <div className={`glass-panel rounded-xl p-md relative group hover:shadow-[0_10px_30px_rgba(99,102,241,0.06)] transition-all duration-300 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}>
            {/* Number Badge */}
            <div className={`absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center font-geist text-label-sm font-bold shadow-lg transition-all
                ${isFirst
                    ? 'bg-primary-container text-on-primary-container shadow-primary-container/30'
                    : 'bg-surface-container-high border border-outline-variant/50 text-on-surface'
                }`}
            >
                {index + 1}
            </div>

            {/* Question Text */}
            <div className="ml-xs mb-sm">
                <h2 className="font-geist text-body-lg text-on-surface font-semibold leading-snug group-hover:text-primary transition-colors duration-200">
                    "{question.question || question}"
                </h2>
            </div>

            {/* Look For / Red Flags */}
            {question.lookFor && question.redFlags && (
                <div className="ml-xs grid grid-cols-1 md:grid-cols-2 gap-md border-t border-outline-variant/15 pt-sm">
                    <div>
                        <h4 className="font-geist text-label-sm text-on-surface-variant mb-xs flex items-center gap-xs tracking-wide uppercase">
                            <Icon name="psychology" className="text-[14px] text-primary" /> Look For
                        </h4>
                        <ul className="font-geist text-label-md text-on-surface space-y-xs">
                            {question.lookFor.map((item, i) => (
                                <li key={i} className="flex items-start gap-xs">
                                    <span className="w-1 h-1 rounded-full bg-primary mt-[8px] flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-geist text-label-sm text-on-surface-variant mb-xs flex items-center gap-xs tracking-wide uppercase">
                            <Icon name="warning" className="text-[14px] text-tertiary" /> Red Flags
                        </h4>
                        <ul className="font-geist text-label-md text-tertiary space-y-xs">
                            {question.redFlags.map((item, i) => (
                                <li key={i} className="flex items-start gap-xs">
                                    <span className="w-1 h-1 rounded-full bg-tertiary mt-[8px] flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Main App ───
export default function App() {
    const [jobTitle, setJobTitle] = useState('Customer Success Manager')
    const [seniorityLevel, setSeniorityLevel] = useState('Mid-Level')
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [warning, setWarning] = useState(null)
    const [progress, setProgress] = useState(0)
    const [currentTab, setCurrentTab] = useState('Dashboard')
    const [history, setHistory] = useState([])
    const [isDark, setIsDark] = useState(true)
    const progressRef = useRef(null)
    const requestRef = useRef(0)

    // Handle theme initialization and toggling
    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
            root.classList.remove('light')
        } else {
            root.classList.add('light')
            root.classList.remove('dark')
        }
    }, [isDark])

    // Derived analytics
    const totalGenerations = history.length
    const totalQuestions = history.reduce((sum, h) => sum + h.count, 0)
    const uniqueRoles = new Set(history.map(h => h.title.toLowerCase())).size

    // Simulated progress during loading
    useEffect(() => {
        if (loading) {
            setProgress(0)
            progressRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressRef.current)
                        return 90
                    }
                    return prev + Math.random() * 12 + 3
                })
            }, 400)
        } else {
            if (progressRef.current) clearInterval(progressRef.current)
            if (questions.length > 0) setProgress(100)
        }
        return () => {
            if (progressRef.current) clearInterval(progressRef.current)
        }
    }, [loading])

    const generateQuestions = async ({ title, append = false }) => {
        const trimmedTitle = title.trim()
        const requestId = requestRef.current + 1
        requestRef.current = requestId

        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoading(true)
        setError(null)
        setWarning(null)
        if (!append) setQuestions([])

        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), 30000)

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || ''
            const response = await fetch(`${baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle: trimmedTitle, seniorityLevel }),
                signal: controller.signal,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong while generating questions.')
            }

            if (requestRef.current !== requestId) return

            const nextQuestions = data.questions || []
            setQuestions(prev => append ? [...prev, ...nextQuestions] : nextQuestions)
            setWarning(data.warning || null)
            if (nextQuestions.length) {
                setHistory(prev => [{ title: trimmedTitle, count: nextQuestions.length, timestamp: Date.now() }, ...prev])
            }
        } catch (err) {
            if (requestRef.current !== requestId) return

            const message = err.name === 'AbortError'
                ? 'The AI service took too long to respond. Please try again.'
                : err.message
            setError(message)
        } finally {
            window.clearTimeout(timeoutId)
            if (requestRef.current === requestId) setLoading(false)
        }
    }

    const handleSubmit = async (e, titleOverride) => {
        if (e) e.preventDefault()
        const title = (titleOverride || jobTitle).trim()
        if (!title.trim()) return

        setJobTitle(title)
        await generateQuestions({ title })
    }

    const handleGenerateMore = async () => {
        const title = jobTitle.trim()
        if (!title.trim()) return

        await generateQuestions({ title, append: true })
    }

    const generateForTitle = (title) => {
        handleSubmit(null, title)
    }

    const handleReset = () => {
        requestRef.current += 1
        setQuestions([])
        setError(null)
        setWarning(null)
        setProgress(0)
        setLoading(false)
        setCurrentTab('Dashboard')
    }

    const handleRetry = () => {
        setError(null)
        handleSubmit()
    }

    // Handle tab navigation
    const handleTabChange = (tab) => {
        setCurrentTab(tab)
    }

    // ─── Export PDF ───
    const handleExportPDF = () => {
        const now = new Date()
        const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

        const questionsHtml = questions.map((q, i) => {
            const questionText = q.question || q
            const lookForItems = q.lookFor ? q.lookFor.map(item => `<li>${item}</li>`).join('') : ''
            const redFlagItems = q.redFlags ? q.redFlags.map(item => `<li style="color:#dc2626;">${item}</li>`).join('') : ''

            return `
                <div style="border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin-bottom:20px; page-break-inside:avoid; background:#fafbfc;">
                    <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:16px;">
                        <div style="width:32px; height:32px; border-radius:50%; background:${i === 0 ? '#6366f1' : '#e2e8f0'}; color:${i === 0 ? '#fff' : '#1e293b'}; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; flex-shrink:0;">${i + 1}</div>
                        <h3 style="margin:0; font-size:16px; color:#1e293b; font-weight:600; line-height:1.5;">"${questionText}"</h3>
                    </div>
                    ${q.lookFor && q.redFlags ? `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; border-top:1px solid #e2e8f0; padding-top:16px;">
                        <div>
                            <h4 style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6366f1; margin:0 0 8px 0; font-weight:600;">✦ Look For</h4>
                            <ul style="margin:0; padding-left:16px; font-size:13px; color:#334155; line-height:1.8;">${lookForItems}</ul>
                        </div>
                        <div>
                            <h4 style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#dc2626; margin:0 0 8px 0; font-weight:600;">⚠ Red Flags</h4>
                            <ul style="margin:0; padding-left:16px; font-size:13px; color:#dc2626; line-height:1.8;">${redFlagItems}</ul>
                        </div>
                    </div>
                    ` : ''}
                </div>
            `
        }).join('')

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${jobTitle} Interview Kit - HireFlow AI</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    * { box-sizing: border-box; }
                    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin:0; padding:40px; color:#1e293b; background:#fff; }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #6366f1; padding-bottom:20px; margin-bottom:32px;">
                    <div>
                        <div style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#6366f1; font-weight:600; margin-bottom:4px;">✦ Generated Interview Kit</div>
                        <h1 style="margin:0; font-size:28px; font-weight:800; color:#0f172a; text-transform:capitalize;">${jobTitle}</h1>
                        <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">Seniority: ${seniorityLevel} · Generated on ${dateStr}</p>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:800; background:linear-gradient(135deg,#6366f1,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">HireFlow AI</div>
                        <div style="font-size:11px; color:#94a3b8;">Precision Interviewing Platform</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;">
                    <div style="background:#f1f5f9; border-radius:8px; padding:16px; text-align:center;">
                        <div style="font-size:24px; font-weight:800; color:#6366f1;">${questions.length}</div>
                        <div style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Questions</div>
                    </div>
                    <div style="background:#f1f5f9; border-radius:8px; padding:16px; text-align:center;">
                        <div style="font-size:14px; font-weight:700; color:#0f172a; text-transform:capitalize;">${seniorityLevel}</div>
                        <div style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Seniority</div>
                    </div>
                    <div style="background:#f1f5f9; border-radius:8px; padding:16px; text-align:center;">
                        <div style="font-size:14px; font-weight:700; color:#0f172a;">SaaS / Tech</div>
                        <div style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Industry</div>
                    </div>
                </div>

                ${questionsHtml}

                <div style="border-top:1px solid #e2e8f0; padding-top:20px; margin-top:32px; text-align:center; font-size:11px; color:#94a3b8;">
                    Generated by HireFlow AI · ${dateStr} · hireflow.ai
                </div>
            </body>
            </html>
        `

        const printWindow = window.open('', '_blank')
        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print()
            }, 300)
        }
    }

    // ─── Render: Determine which view to show ───
    const renderContent = () => {
        // Loading
        if (loading) {
            return <LoadingState progress={Math.round(progress)} />
        }

        // Error
        if (error) {
            return <ErrorState error={error} onRetry={handleRetry} onReturn={handleReset} />
        }

        // Results — shown on Dashboard (after generate) or Question Bank tab
        if (questions.length > 0 && (currentTab === 'Dashboard' || currentTab === 'Question Bank')) {
            return (
                <div className="flex flex-col lg:flex-row gap-xl animate-fade-in">
                    {/* Sidebar Context */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 animate-slide-in-left">
                        <div className="glass-panel rounded-xl p-lg sticky top-[96px]">
                            <h3 className="font-geist text-headline-md text-on-surface font-semibold mb-lg">Role Context</h3>
                            <div className="space-y-lg">
                                <div>
                                    <p className="font-geist text-label-md text-on-surface-variant mb-xs tracking-wide uppercase">Title</p>
                                    <p className="font-geist text-body-md text-on-surface capitalize font-medium">{jobTitle}</p>
                                </div>
                                <div>
                                    <p className="font-geist text-label-md text-on-surface-variant mb-sm tracking-wide uppercase">Level</p>
                                    <span className="inline-flex items-center px-md py-xs rounded-full bg-secondary-container/20 text-secondary font-geist text-label-md border border-secondary/20">
                                        {seniorityLevel}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-geist text-label-md text-on-surface-variant mb-sm tracking-wide uppercase">Industry</p>
                                    <span className="inline-flex items-center px-md py-xs rounded-full bg-tertiary-container/15 text-tertiary font-geist text-label-md border border-tertiary/20">
                                        SaaS / Tech
                                    </span>
                                </div>
                                <div>
                                    <p className="font-geist text-label-md text-on-surface-variant mb-xs tracking-wide uppercase">Status</p>
                                    <div className="flex items-center gap-xs">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="font-geist text-label-md text-primary font-medium">Generated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Main */}
                    <div className="flex-grow">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-lg">
                            <div>
                                <div className="flex items-center gap-sm mb-sm">
                                    <Icon name="auto_awesome" className="text-[18px] text-primary" fill />
                                    <span className="font-geist text-label-md text-primary tracking-[0.15em] uppercase font-semibold">Generated Set</span>
                                </div>
                                <h1 className="font-geist text-headline-lg md:text-headline-lg text-on-surface font-extrabold leading-tight tracking-tight capitalize">
                                    {jobTitle} Interview Kit
                                </h1>
                                <p className="font-geist text-body-md text-on-surface-variant mt-xs max-w-2xl leading-relaxed">
                                    Tailored behavioral and technical questions focused on evaluating key competencies for this role.
                                </p>
                            </div>
                            <div className="flex gap-sm w-full md:w-auto">
                                <button
                                    onClick={() => { setCurrentTab('Dashboard'); handleReset(); }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-xs px-lg py-sm rounded-lg glass-panel text-on-surface font-geist text-label-md font-medium hover:bg-surface-bright/20 transition-all duration-200 active:scale-95"
                                >
                                    <Icon name="edit" className="text-[18px]" />
                                    Edit Prompt
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-xs px-lg py-sm rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary font-geist text-label-md font-bold glow-button"
                                >
                                    <Icon name="description" className="text-[18px]" fill />
                                    Export PDF
                                </button>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="glass-panel rounded-xl p-md mb-xl flex flex-col md:flex-row items-stretch md:items-center gap-sm"
                        >
                            <div className="flex items-center flex-grow bg-surface-container-high/40 rounded-lg border border-outline-variant/20">
                                <Icon name="search" className="text-[22px] text-outline ml-sm shrink-0" />
                                <input
                                    className="w-full bg-transparent border-none text-on-surface font-geist text-body-md focus:ring-0 outline-none placeholder-outline py-sm px-sm"
                                    placeholder="Enter a new job title..."
                                    type="text"
                                    value={jobTitle}
                                    onChange={e => setJobTitle(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <select
                                value={seniorityLevel}
                                onChange={e => setSeniorityLevel(e.target.value)}
                                disabled={loading}
                                className="w-full md:w-auto bg-surface-container-high border border-outline-variant/30 text-on-surface font-geist text-label-md rounded-lg px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer appearance-none disabled:opacity-40"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23908fa0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' }}
                            >
                                {SENIORITY_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={loading || !jobTitle.trim()}
                                className="w-full md:w-auto flex items-center justify-center gap-xs px-lg py-sm rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary font-geist text-label-md font-bold glow-button whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <Icon name="auto_awesome" className="text-[18px]" fill />
                                Generate
                            </button>
                        </form>

                        {warning && (
                            <div className="glass-panel rounded-lg border border-secondary/20 px-md py-sm mb-xl text-secondary font-geist text-body-md">
                                {warning}
                            </div>
                        )}

                        {/* Question Cards */}
                        <div className="space-y-lg">
                            {questions.map((q, index) => (
                                <QuestionCard key={index} question={q} index={index} total={questions.length} />
                            ))}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-md mt-xl pt-xl border-t border-outline-variant/10">
                            <button
                                onClick={handleGenerateMore}
                                disabled={loading}
                                className="flex items-center gap-sm px-xl py-md rounded-xl glass-panel text-on-surface font-geist text-body-md font-medium hover:bg-surface-bright/15 hover:border-primary/30 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Icon name="add" className="text-[20px] text-primary" />
                                {loading ? 'Generating...' : 'Generate More Questions'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-sm px-xl py-md rounded-xl text-on-surface-variant font-geist text-body-md hover:text-on-surface transition-colors"
                            >
                                <Icon name="search" className="text-[20px]" />
                                New Search
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        // ─── Analytics Page ───
        if (currentTab === 'Analytics') {
            return (
                <div className="animate-fade-in">
                    <div className="mb-xl">
                        <h1 className="font-geist text-[40px] md:text-display-lg text-on-surface font-extrabold leading-tight tracking-tight mb-sm">Analytics</h1>
                        <p className="font-geist text-body-lg text-on-surface-variant max-w-2xl">Track your interview question performance and hiring funnel metrics.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
                        {[
                            { label: 'Total Generations', value: String(totalGenerations), icon: 'auto_awesome', color: 'text-primary', bg: 'bg-primary-container/15' },
                            { label: 'Questions Created', value: String(totalQuestions), icon: 'quiz', color: 'text-secondary', bg: 'bg-secondary-container/15' },
                            { label: 'Roles Covered', value: String(uniqueRoles), icon: 'work', color: 'text-tertiary', bg: 'bg-tertiary-container/15' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-panel rounded-xl p-lg">
                                <div className="flex items-center justify-between mb-md">
                                    <span className="font-geist text-label-md text-on-surface-variant tracking-wide uppercase">{stat.label}</span>
                                    <div className={`p-sm rounded-lg ${stat.bg} ${stat.color}`}>
                                        <Icon name={stat.icon} className="text-[20px]" />
                                    </div>
                                </div>
                                <p className="font-geist text-[40px] text-on-surface font-extrabold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="glass-panel rounded-xl p-xl text-center">
                        <div className="w-16 h-16 rounded-full glass-panel-elevated flex items-center justify-center mx-auto mb-lg">
                            <Icon name="bar_chart" className="text-[28px] text-primary" />
                        </div>
                        <h3 className="font-geist text-headline-md text-on-surface font-semibold mb-sm">Detailed Analytics Coming Soon</h3>
                        <p className="font-geist text-body-md text-on-surface-variant max-w-md mx-auto">We're building comprehensive dashboards to help you track candidate performance, question effectiveness, and hiring outcomes.</p>
                    </div>
                </div>
            )
        }

        // ─── Interview Prep Page ───
        if (currentTab === 'Interview Prep') {
            return (
                <div className="animate-fade-in">
                    <div className="mb-xl">
                        <h1 className="font-geist text-[40px] md:text-display-lg text-on-surface font-extrabold leading-tight tracking-tight mb-sm">Interview Prep</h1>
                        <p className="font-geist text-body-lg text-on-surface-variant max-w-2xl">Prepare structured interview sessions with AI-generated guides and scoring rubrics.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-xl">
                        {[
                            { title: 'Interview Playbooks', desc: 'Step-by-step guides for conducting structured interviews across different role types.', icon: 'menu_book', color: 'text-primary', bg: 'bg-primary-container/15' },
                            { title: 'Scoring Rubrics', desc: 'Standardized evaluation criteria to ensure fair and consistent candidate assessment.', icon: 'grade', color: 'text-secondary', bg: 'bg-secondary-container/15' },
                            { title: 'Mock Interviews', desc: 'Practice sessions with AI-simulated candidates to sharpen your interviewing skills.', icon: 'record_voice_over', color: 'text-tertiary', bg: 'bg-tertiary-container/15' },
                            { title: 'Feedback Templates', desc: 'Professional post-interview feedback templates for hiring committees.', icon: 'rate_review', color: 'text-primary', bg: 'bg-primary-container/15' },
                        ].map((card) => (
                            <div key={card.title} className="glass-panel rounded-xl p-lg group hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] transition-all duration-300 cursor-pointer">
                                <div className={`p-md rounded-lg ${card.bg} ${card.color} inline-flex mb-md`}>
                                    <Icon name={card.icon} className="text-[28px]" />
                                </div>
                                <h3 className="font-geist text-headline-md text-on-surface font-semibold mb-sm">{card.title}</h3>
                                <p className="font-geist text-body-md text-on-surface-variant leading-relaxed">{card.desc}</p>
                                <div className="flex items-center gap-xs text-primary text-label-md font-geist font-medium mt-md group-hover:gap-sm transition-all duration-200">
                                    Coming Soon <Icon name="arrow_forward" className="text-[16px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // ─── Question Bank Page (no results yet) ───
        if (currentTab === 'Question Bank' && questions.length === 0) {
            return (
                <div className="animate-fade-in">
                    <div className="mb-xl">
                        <h1 className="font-geist text-[40px] md:text-display-lg text-on-surface font-extrabold leading-tight tracking-tight mb-sm">Question Bank</h1>
                        <p className="font-geist text-body-lg text-on-surface-variant max-w-2xl">Browse and manage your generated interview question sets.</p>
                    </div>
                    <div className="glass-panel rounded-xl p-xl text-center">
                        <div className="w-16 h-16 rounded-full glass-panel-elevated flex items-center justify-center mx-auto mb-lg">
                            <Icon name="quiz" className="text-[28px] text-primary" />
                        </div>
                        <h3 className="font-geist text-headline-md text-on-surface font-semibold mb-sm">No Questions Yet</h3>
                        <p className="font-geist text-body-md text-on-surface-variant max-w-md mx-auto mb-lg">Generate your first interview question set from the Dashboard to see them here.</p>
                        <button
                            onClick={() => setCurrentTab('Dashboard')}
                            className="inline-flex items-center gap-sm px-xl py-md rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary font-geist text-label-md font-bold glow-button"
                        >
                            <Icon name="arrow_back" className="text-[18px]" />
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )
        }

        // ─── Default: Dashboard / Empty State ───
        return (
            <>
                {/* Hero Section */}
                <section className="relative mb-xl text-center flex flex-col items-center justify-center animate-fade-in py-[100px] rounded-3xl overflow-hidden glass-panel border border-outline-variant/20 mt-md">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img src="/hero-bg.png" alt="Interview Background" className="w-full h-full object-cover opacity-40 select-none mix-blend-overlay dark:mix-blend-normal" />
                        <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/60 to-surface pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center w-full px-sm">
                        <h1 className="font-geist text-[40px] md:text-[56px] lg:text-display-lg font-extrabold gradient-text mb-md leading-tight tracking-tight drop-shadow-lg">
                            Precision Interviewing
                        </h1>
                        <p className="font-geist text-body-lg text-on-surface-variant max-w-2xl mb-xl leading-relaxed drop-shadow-md">
                            Generate highly calibrated, context-aware interview questions tailored to specific roles and seniority levels in seconds.
                        </p>

                        {/* Search Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-3xl glass-panel-elevated rounded-xl p-sm flex flex-col md:flex-row items-center gap-sm focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(128,131,255,0.25)] transition-all duration-300"
                        >
                            <div className="flex items-center flex-grow bg-transparent">
                                <Icon name="search" className="text-[22px] text-outline ml-sm shrink-0" />
                                <input
                                    id="job-title-input"
                                    className="w-full bg-transparent border-none text-on-surface font-geist text-body-lg focus:ring-0 outline-none placeholder-outline py-md"
                                    placeholder="Enter a job title (e.g., Customer Success Manager)..."
                                    type="text"
                                    value={jobTitle}
                                    onChange={e => setJobTitle(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <select
                                id="seniority-level-select"
                                value={seniorityLevel}
                                onChange={e => setSeniorityLevel(e.target.value)}
                                disabled={loading}
                                className="w-full md:w-auto bg-surface-container-high border border-outline-variant/30 text-on-surface font-geist text-label-md rounded-lg px-md py-sm md:py-md focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer appearance-none disabled:opacity-40"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23908fa0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' }}
                            >
                                {SENIORITY_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            <button
                                id="generate-button"
                                type="submit"
                                disabled={loading || !jobTitle.trim()}
                                className="w-full md:w-auto px-xl py-sm md:py-md rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary font-geist text-label-md font-bold glow-button whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Generate
                            </button>
                        </form>
                    </div>
                </section>

                {/* Category Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl mt-xl">
                    <CategoryCard
                        icon="psychology"
                        iconBg="bg-secondary-container/15 text-secondary"
                        title="Cognitive"
                        description="Assess problem-solving, critical thinking, and adaptability with scenario-based challenges."
                        delay="stagger-1"
                        onExplore={() => {
                            const title = jobTitle.trim() || 'Software Engineer'
                            setJobTitle(title)
                            handleSubmit(null, `${title} - Cognitive & Problem Solving`)
                        }}
                    />
                    <CategoryCard
                        icon="code"
                        iconBg="bg-primary-container/15 text-primary"
                        title="Technical"
                        description="Language-specific algorithms, system design, and deep-dive technical probing questions."
                        delay="stagger-2"
                        onExplore={() => {
                            const title = jobTitle.trim() || 'Software Engineer'
                            setJobTitle(title)
                            handleSubmit(null, `${title} - Technical & System Design`)
                        }}
                    />
                    <CategoryCard
                        icon="diversity_3"
                        iconBg="bg-tertiary-container/15 text-tertiary"
                        title="Behavioral"
                        description="Evaluate cultural fit, leadership, and conflict resolution using the STAR method."
                        delay="stagger-3"
                        onExplore={() => {
                            const title = jobTitle.trim() || 'Software Engineer'
                            setJobTitle(title)
                            handleSubmit(null, `${title} - Behavioral & STAR Method`)
                        }}
                    />
                </section>

                {/* Recent Generations */}
                <section className="glass-panel rounded-xl p-lg animate-fade-in-up stagger-4">
                    <div className="flex justify-between items-center mb-md">
                        <h2 className="font-geist text-headline-md text-on-surface font-semibold">Recent Generations</h2>
                        <button
                            onClick={() => setCurrentTab('Question Bank')}
                            className="font-geist text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                            View All
                        </button>
                    </div>
                    {history.length === 0 ? (
                        <p className="font-geist text-body-md text-on-surface-variant py-md text-center">No generations yet. Enter a job title above to get started.</p>
                    ) : (
                        <div className="divide-y divide-outline-variant/10">
                            {history.slice(0, 5).map((h, i) => (
                                <RecentRow
                                    key={i}
                                    title={h.title}
                                    subtitle={`Generated ${new Date(h.timestamp).toLocaleTimeString()}`}
                                    count={h.count}
                                    onClick={() => generateForTitle(h.title)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </>
        )
    }

    return (
        <div className="flex flex-col min-h-screen relative z-10 transition-colors duration-300">
            <NavBar
                currentTab={currentTab}
                onTabChange={handleTabChange}
                onLogoClick={handleReset}
                isDark={isDark}
                toggleTheme={() => setIsDark(!isDark)}
            />

            {/* Main Content */}
            <main className="flex-grow pt-[120px] pb-xl px-margin-mobile md:px-margin-desktop max-w-container mx-auto w-full">
                {renderContent()}
            </main>

            {/* Footer */}
            <footer className="w-full py-xl border-t border-outline-variant/10 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
                    <div className="font-geist text-label-md text-on-surface font-semibold mb-md md:mb-0">
                        HireFlow AI
                    </div>
                    <div className="flex flex-wrap justify-center gap-lg font-geist text-label-md text-on-surface-variant">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Cookie Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Support</a>
                    </div>
                    <div className="font-geist text-label-md text-on-surface-variant mt-md md:mt-0 text-center">
                        © {new Date().getFullYear()} HireFlow AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
