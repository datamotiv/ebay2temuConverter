/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link2, Plus, RefreshCcw, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import MigrationReadinessPanel from '../components/dashboard/MigrationReadinessPanel';
import ShippingTemplateModal from '../components/dashboard/ShippingTemplateModal';
import WelcomeUser from './WelcomeUser';

type Platform = 'ebay' | 'temu';

const platformUrls: Record<Platform, string> = {
  ebay: 'https://auth.ebay.com/oauth2/authorize?state=GUID:8258dd0a-e29a-49a4-92dc-35308e7a8df2&client_id=AndrewRo-Emotived-PRD-3786bc793-b1c0583d&response_type=code&redirect_uri=Andrew_Rowson-AndrewRo-Emotiv-hnvajdx&scope=https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly&prompt=login',
  temu: 'https://www.temu.com/login.html',
};

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

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [, setError] = useState('');
  const [, setLoading] = useState(false);

  const [showConnect, setShowConnect] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);

  // New-user onboarding (account-connection flow)
  const [isNewUser, setIsNewUser] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    const newUser = localStorage.getItem('isNewUser') === 'true';
    if (newUser) {
      setIsNewUser(true);
      setShowWelcomeDialog(true);
      localStorage.removeItem('isNewUser');
    }
  }, []);

  const handleLinkEbay = () => {
    setShowWelcomeDialog(false);
    navigate('/connect-ebay');
  };

  // Only one TEMU account is allowed; eBay stores can be connected freely.
  const hasTemu = accounts.some((a) => a.provider?.toUpperCase() === 'TEMU');

  // Open a marketplace's OAuth/login flow in a new tab.
  const openPlatform = (platform: Platform) => {
    if (platform === 'temu' && hasTemu) return;
    const url = platformUrls[platform];
    if (url) window.open(url, '_blank');
    setShowConnect(false);
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
      <AppSidebar active="dashboard" />

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
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#334155] transition hover:bg-[#F8FAFC]"
              >
                <Link2 className="h-[18px] w-[18px]" />
                Connect Account
              </button>
              {showConnect && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowConnect(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.2)]">
                    {platformOptions.map((p) => {
                      const disabled = p.value === 'temu' && hasTemu;
                      return (
                        <button
                          key={p.value}
                          onClick={() => openPlatform(p.value)}
                          disabled={disabled}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-[#334155] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:text-[#94A3B8] disabled:hover:bg-transparent"
                        >
                          {p.label}
                          {disabled && (
                            <span className="text-[11px] font-normal text-[#94A3B8]">
                              Connected
                            </span>
                          )}
                        </button>
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
          <button
            onClick={() => setShowConnect(true)}
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
        </div>

        {/* eBay listings readiness + migrations workspace */}
        <MigrationReadinessPanel accounts={accounts} />
      </main>

      <ShippingTemplateModal open={shippingModalOpen} onClose={() => setShippingModalOpen(false)} />

      {isNewUser && (
        <WelcomeUser
          open={showWelcomeDialog}
          onClose={() => setShowWelcomeDialog(false)}
          onLinkEbay={handleLinkEbay}
        />
      )}
    </div>
  );
};

export default Dashboard;
