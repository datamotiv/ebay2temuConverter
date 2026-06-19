import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F4F7FF] via-[#F7F9FE] to-[#E9F0FE] px-6 font-poppins">
      <div className="w-full max-w-[520px] text-center">
        <p className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
          Error 404
        </p>

        <h1 className="mt-3 bg-gradient-to-br from-[#0F172A] to-[#1D4ED8] bg-clip-text text-[96px] font-extrabold leading-none tracking-tight text-transparent sm:text-[120px]">
          404
        </h1>

        <h2 className="mt-2 text-[26px] font-bold text-[#0F172A]">Page not found</h2>
        <p className="mx-auto mt-3 max-w-[420px] text-[16px] leading-relaxed text-[#475569]">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on
          track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] sm:w-auto"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
            Back to Login
          </Link>
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[15px] font-semibold text-[#334155] transition hover:bg-[#F8FAFC] sm:w-auto"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
