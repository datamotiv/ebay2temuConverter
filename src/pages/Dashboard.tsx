/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link2, Plus, RefreshCcw, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import MigrationReadinessPanel from '../components/dashboard/MigrationReadinessPanel';
import ShippingTemplateModal from '../components/dashboard/ShippingTemplateModal';
import { connectTemu } from '../services/temuService';

type Platform = 'ebay' | 'temu';

const EBAY_AUTH_URL =
  'https://auth.ebay.com/oauth2/authorize?state=GUID:8258dd0a-e29a-49a4-92dc-35308e7a8df2&client_id=AndrewRo-Emotived-PRD-3786bc793-b1c0583d&response_type=code&redirect_uri=Andrew_Rowson-AndrewRo-Emotiv-hnvajdx&scope=https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly&prompt=login';

const platformOptions: { label: string; value: Platform }[] = [
  { label: 'Link with eBay Store', value: 'ebay' },
  { label: 'Link with Temu Store', value: 'temu' },
];

interface Account {
  accountId: number;
  sellerId: number;
  provider: string;
  name: string | null;
  status: string;
}

const PROVIDER_CFG: Record<
  string,
  {
    Icon: any;
    iconBg: string;
    iconColor: string;
    role: string;
    defaultName: string;
    provider: string;
  }
> = {
  EBAY: {
    Icon: Store,
    iconBg: '#EFF4FF',
    iconColor: '#1D4ED8',
    role: 'Source Account',
    defaultName: 'eBay Store',
    provider: 'EBAY',
  },
  TEMU: {
    Icon: ShoppingBag,
    iconBg: '#FEF2F2',
    iconColor: '#F0533B',
    role: 'Target Account',
    defaultName: 'TEMU Store',
    provider: 'TEMU',
  },
};

const FALLBACK_CFG = {
  Icon: Store,
  iconBg: '#F1F5F9',
  iconColor: '#475569',
  role: 'Connected Account',
  defaultName: 'Marketplace',
};

const AccountCard = ({
  account,
  onSync,
  onManage,
}: {
  account: Account;
  onSync: () => void;
  onManage?: () => void;
}) => {
  const cfg = PROVIDER_CFG[account.provider?.toUpperCase()] ?? FALLBACK_CFG;
  const isActive = account.status?.toLowerCase() === 'active';
  const manageDisabled = cfg.provider !== 'TEMU' || !onManage;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: cfg.iconBg }}
          >
            <cfg.Icon className="h-5 w-5" style={{ color: cfg.iconColor }} />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#0F172A]">
              {account.name || cfg.defaultName}
            </h3>
            <p className="text-[13px] text-[#64748B]">{cfg.role}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${
            isActive ? 'text-[#059669]' : 'text-[#94A3B8]'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#CBD5E1]'}`} />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={manageDisabled ? undefined : onManage}
          disabled={manageDisabled}
          className={`flex-1 rounded-lg border border-[#E2E8F0] py-2.5 text-[14px] font-semibold transition ${
            manageDisabled
              ? 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed'
              : 'bg-white text-[#334155] hover:bg-[#F8FAFC]'
          }`}
        >
          Manage
        </button>
        <button
          onClick={onSync}
          aria-label={`Sync ${account.name || cfg.defaultName}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC]"
        >
          <RefreshCcw className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const sidebarActive =
    urlTab === 'migrations' ? 'migrations' : urlTab === 'readiness' ? 'listings' : 'listings';

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [, setError] = useState('');
  const [, setLoading] = useState(false);

  const [showConnect, setShowConnect] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [connectingTemu, setConnectingTemu] = useState(false);
  const [showMarketplacePicker, setShowMarketplacePicker] = useState(false);
  const [temuConnectedToast, setTemuConnectedToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('connected') === 'temu') {
      setTemuConnectedToast(true);
      navigate('/dashboard', { replace: true });
      const t = setTimeout(() => setTemuConnectedToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams, navigate]);

  // Only one TEMU account is allowed; eBay stores can be connected freely.
  const hasTemu = accounts.some((a) => a.provider?.toUpperCase() === 'TEMU');
  const hasEbay = accounts.some((a) => a.provider?.toUpperCase() === 'EBAY');

  // Open a marketplace's OAuth/login flow in a new tab.
  const openPlatform = async (platform: Platform) => {
    if (platform === 'temu' && (hasTemu || !hasEbay)) return;
    setShowConnect(false);

    if (platform === 'temu') {
      try {
        setConnectingTemu(true);
        const res: any = await connectTemu(0);
        if (res?.authUrl) {
          window.open(res.authUrl, '_blank');
        }
      } catch (error) {
        console.error('Failed to connect Temu:', error);
      } finally {
        setConnectingTemu(false);
      }
      return;
    }

    window.open(EBAY_AUTH_URL, '_blank');
  };

  // Fetch the seller's connected marketplace accounts.
  const fetchAccountSummary = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Access token not found');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/v1/auth/accounts/summary`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to fetch account summary');
      const data = await response.json();
      setAccounts(data.accounts || []);
      localStorage.setItem('accountsData', JSON.stringify(data.accounts));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F9FC] font-poppins text-[#0F172A]">
      <AppSidebar active={sidebarActive} />

      {/* Main */}
      <main className="flex-1 px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#0F172A]">
              Accounts &amp; Migration Results
            </h1>
            <p className="mt-1 text-[15px] text-[#64748B]">
              Manage connected marketplaces and review your latest synchronization operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowConnect((v) => !v)}
                disabled={connectingTemu}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Link2 className="h-[18px] w-[18px]" />
                {connectingTemu ? 'Connecting…' : 'Connect Account'}
              </button>
              {showConnect && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowConnect(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.2)]">
                    {platformOptions.map((p) => {
                      const isTemuConnected = p.value === 'temu' && hasTemu;
                      const needsEbay = p.value === 'temu' && !hasEbay;
                      const disabled = isTemuConnected || needsEbay;
                      return (
                        <div key={p.value} className="relative group">
                          <button
                            onClick={() => openPlatform(p.value)}
                            disabled={disabled}
                            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-[#334155] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          >
                            <span className={disabled ? 'text-[#94A3B8]' : ''}>{p.label}</span>
                            {isTemuConnected && (
                              <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-medium text-[#16A34A]">
                                Connected
                              </span>
                            )}
                          </button>
                          {needsEbay && (
                            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1E293B] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                              Connect eBay first
                              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Account cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.accountId}
              account={account}
              onSync={fetchAccountSummary}
              onManage={
                account.provider?.toUpperCase() === 'TEMU'
                  ? () => setShippingModalOpen(true)
                  : undefined
              }
            />
          ))}

          {/* Add marketplace */}
          {showMarketplacePicker ? (
            <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Choose a marketplace
                </p>
                <button
                  onClick={() => setShowMarketplacePicker(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#334155]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {/* eBay tile */}
                <button
                  onClick={() => { openPlatform('ebay'); setShowMarketplacePicker(false); }}
                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-4 py-3 text-left transition hover:border-[#1D4ED8] hover:bg-[#EFF4FF]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF]">
                    <Store className="h-4 w-4 text-[#1D4ED8]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0F172A]">eBay Store</p>
                    <p className="text-[12px] text-[#64748B]">Source for listings</p>
                  </div>
                </button>

                {/* Temu tile */}
                <div className="group relative">
                  <button
                    onClick={() => { openPlatform('temu'); setShowMarketplacePicker(false); }}
                    disabled={hasTemu || !hasEbay}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#E2E8F0] px-4 py-3 text-left transition hover:border-[#F0533B] hover:bg-[#FFF4F2] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E2E8F0] disabled:hover:bg-transparent"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2]">
                      <ShoppingBag className="h-4 w-4 text-[#F0533B]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">TEMU Store</p>
                      <p className="text-[12px] text-[#64748B]">
                        {hasTemu ? 'Already connected' : 'Migration target'}
                      </p>
                    </div>
                    {hasTemu && (
                      <span className="ml-auto shrink-0 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-medium text-[#16A34A]">
                        Connected
                      </span>
                    )}
                  </button>
                  {!hasTemu && !hasEbay && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1E293B] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                      Connect eBay first
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowMarketplacePicker(true)}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-transparent p-5 text-center transition hover:border-[#1D4ED8] hover:bg-[#F8FAFC]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4FF]">
                <Plus className="h-6 w-6 text-[#1D4ED8]" />
              </div>
              <h3 className="mt-4 text-[17px] font-bold text-[#0F172A]">Add Marketplace</h3>
              <p className="mt-1 max-w-[220px] text-[13px] text-[#64748B]">
                Connect another eBay or TEMU store to expand your network.
              </p>
            </button>
          )}
        </div>

        {/* eBay listings readiness + migrations workspace */}
        <MigrationReadinessPanel accounts={accounts} />
      </main>

      <ShippingTemplateModal open={shippingModalOpen} onClose={() => setShippingModalOpen(false)} />

      {/* Temu connection success toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_30px_-4px_rgba(15,23,42,0.18)] border border-[#E5E7EB] transition-all duration-500 ${
          temuConnectedToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
          <svg className="h-5 w-5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#0F172A]">TEMU store connected</p>
          <p className="mt-0.5 text-[13px] text-[#64748B]">Your TEMU seller account is ready to sync.</p>
        </div>
        <button
          onClick={() => setTemuConnectedToast(false)}
          className="ml-2 text-[#94A3B8] transition hover:text-[#334155]"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
