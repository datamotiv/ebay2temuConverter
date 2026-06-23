/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../Redux/features/auth/temuAuthApi";

interface ProfileForm {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
}

const Settings = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
  });

  // Pre-fill with the user's data. Prefer the profile endpoint; fall back to the
  // name cached in localStorage at sign-up/login (ignored if it looks like an email).
  useEffect(() => {
    const storedName = localStorage.getItem("userName") ?? "";
    const fallbackName = storedName.includes("@") ? "" : storedName;
    const [sFirst = "", ...sRest] = fallbackName.split(" ");

    const apiName = (profile?.name ?? "").trim();
    const [aFirst = "", ...aRest] = apiName.split(" ");

    setForm({
      firstName: profile?.firstName ?? aFirst ?? sFirst,
      lastName: profile?.lastName ?? (aRest.join(" ") || sRest.join(" ")),
      companyName: profile?.companyName ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
    });
  }, [profile]);

  const handleChange =
    (field: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Phone: allow only digits and + ( ) - and spaces.
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      phoneNumber: e.target.value.replace(/[^\d+()\-\s]/g, ""),
    }));

  // Normalize a pasted/typed phone to digits with an optional leading "+".
  const normalizePhone = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const digits = trimmed.replace(/\D/g, "");
    if (!digits) return "";
    return trimmed.startsWith("+") ? `+${digits}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required.");
      return;
    }
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName: form.companyName.trim(),
        phoneNumber: normalizePhone(form.phoneNumber) || undefined,
      }).unwrap();
      localStorage.setItem(
        "userName",
        `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
      );
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[#334155]";

  return (
    <div className="flex min-h-screen bg-[#F7F9FC] font-poppins text-[#0F172A]">
      <AppSidebar active="settings" />

      {/* Main */}
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Settings</h1>
            <p className="mt-1.5 text-[16px] text-[#64748B]">
              Update your account details.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      placeholder="Jane"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      placeholder="Doe"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Company Name</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={handleChange("companyName")}
                    placeholder="Acme Corp"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+44 7700 900000"
                    className={inputClass}
                  />
                </div>

                {profile?.email && (
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className={`${inputClass} cursor-not-allowed text-[#94A3B8]`}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex min-w-[160px] items-center justify-center rounded-lg bg-[#1D4ED8] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? (
                      <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
