import {
  ArrowLeftRight,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  HelpCircle,
  Link2,
  Rocket,
  Settings,
  Store,
  Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', Icon: ArrowLeftRight, key: 'dashboard', to: '/dashboard' },
];

interface Step {
  Icon: any;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    Icon: Link2,
    title: '1 · Connect your accounts',
    body: 'On the dashboard, click Connect Account (or the Add Marketplace card) and choose eBay or TEMU. You can link multiple eBay source stores, but only a single TEMU target store. Each connected account appears as a card showing its live status.',
  },
  {
    Icon: Truck,
    title: '2 · Set your TEMU shipping template',
    body: "Open the TEMU account card and click Manage to pick the shipping template applied to every migrated listing. The currently-active template is shown first and marked 'current'. Choose one and Save before migrating.",
  },
  {
    Icon: Store,
    title: '3 · Browse listings by category',
    body: 'In the Listings Readiness tab, pick an eBay store, then open a category to see its listings. Listings load 50 per page — use the pager to move through larger categories.',
  },
  {
    Icon: ClipboardCheck,
    title: '4 · Check readiness',
    body: 'Each listing is validated automatically and shows a badge: Ready, Ready (warnings), Published (already on TEMU), or Not Ready. Only Ready and Ready-with-warnings listings can be selected for migration.',
  },
  {
    Icon: CreditCard,
    title: '5 · Select & review pricing',
    body: 'Tick the listings you want to migrate. A bar shows how many are selected and the total cost. Pricing is per listing by volume: £1 up to 100, £0.80 up to 500, £0.50 up to 5,000, and £0.30 beyond.',
  },
  {
    Icon: Rocket,
    title: '6 · Start the migration',
    body: "Click Migrate selected to review the cost, then Confirm & Start Migration. The app switches to the Migrations tab where you can watch live progress, expand a job to see each item's status, and Retry failed items if needed.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Why can't I select a listing?",
    a: "Listings marked Not Ready or Published can't be migrated. Not Ready means validation found a blocking issue; Published means the listing already exists on TEMU.",
  },
  {
    q: 'Can I connect more than one store?',
    a: 'Yes — connect as many eBay source stores as you like. TEMU is limited to one target store, so its connect option is disabled once linked.',
  },
  {
    q: 'Do I pay before migrating?',
    a: 'Pricing is shown up front in the confirmation modal. Billing integration is being finalised; for now the migration starts immediately after you confirm.',
  },
  {
    q: 'A migration item failed — what now?',
    a: 'Open the job in the Migrations tab to read the error on each failed item, then use Retry failed to re-run just the failures.',
  },
];

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7F9FC] font-poppins text-[#0F172A]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-[256px] flex-col bg-[#0B1426] px-4 py-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8]">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
          <span className="text-[19px] font-bold text-white">eBay2Temu</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, Icon, key, to }) => (
            <button
              key={key}
              onClick={() => navigate(to)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#94A3B8] transition hover:bg-[#131F36] hover:text-white"
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-[#1B2B47] pt-4">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#94A3B8] transition hover:bg-[#131F36] hover:text-white"
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </button>
          <button className="flex items-center gap-3 rounded-lg bg-[#1B2B47] px-3 py-2.5 text-[15px] font-medium text-white">
            <BookOpen className="h-[18px] w-[18px]" />
            Documentation
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[256px] flex-1 px-8 py-8">
        <div className="mx-auto max-w-[860px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Documentation</h1>
            <p className="mt-1.5 text-[16px] text-[#64748B]">
              A quick guide to migrating your eBay listings to TEMU.
            </p>
          </div>

          {/* Overview */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#0F172A]">What is eBay2Temu?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
              eBay2Temu copies your existing eBay listings over to TEMU. You connect your stores,
              review which listings are ready to move, choose the ones you want, and the platform
              publishes them to TEMU for you — tracking the progress of every item along the way.
            </p>
          </div>

          {/* Steps */}
          <h2 className="mt-10 mb-4 text-[18px] font-bold text-[#0F172A]">Getting started</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STEPS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF4FF]">
                  <Icon className="h-5 w-5 text-[#1D4ED8]" />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-[#0F172A]">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{body}</p>
              </div>
            ))}
          </div>

          {/* Readiness legend */}
          <h2 className="mt-10 mb-4 text-[18px] font-bold text-[#0F172A]">Readiness statuses</h2>
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            {[
              {
                label: 'Ready',
                cls: 'bg-[#ECFDF5] text-[#059669]',
                desc: 'Passed validation — can be migrated.',
              },
              {
                label: 'Ready (warnings)',
                cls: 'bg-[#FFF4E5] text-[#B58900]',
                desc: 'Can be migrated, but review the warnings first.',
              },
              {
                label: 'Published',
                cls: 'bg-[#E8EDFF] text-[#2563EB]',
                desc: 'Already exists on TEMU — nothing to do.',
              },
              {
                label: 'Not Ready',
                cls: 'bg-[#FDECEA] text-[#DC2626]',
                desc: 'A blocking issue prevents migration.',
              },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center gap-4 px-5 py-3.5 ${
                  i > 0 ? 'border-t border-[#F1F5F9]' : ''
                }`}
              >
                <span
                  className={`inline-flex w-[150px] shrink-0 items-center justify-center rounded-md px-2.5 py-1 text-[13px] font-medium ${row.cls}`}
                >
                  {row.label}
                </span>
                <span className="text-[14px] text-[#475569]">{row.desc}</span>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="mt-10 mb-4 flex items-center gap-2 text-[18px] font-bold text-[#0F172A]">
            <HelpCircle className="h-5 w-5 text-[#475569]" />
            FAQ
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold text-[#0F172A]">{q}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm">
            <p className="text-[15px] text-[#475569]">Ready to migrate your first listings?</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              <Rocket className="h-[18px] w-[18px]" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
