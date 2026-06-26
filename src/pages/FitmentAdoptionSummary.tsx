import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgressBarTwo from '../components/CircularProgressBarTwo';
import FitmentScoreChart from '../components/FitmentScoreChart';
import Navbar from '../components/Navbar';
import SummaryFitmentTable from '../components/summaryFitmentTable/summaryFitmentTable';
import SupportMessage from '../components/SupportMessage';
import { useSummaryQuery } from '../Redux/features/summary/summaryApi';
import { useAppSelector } from '../Redux/hooks';
import { useDispatch } from 'react-redux';
import { setSummaryFitmentCategories } from '../Redux/features/fitmentScoreSlice';
import { useListDashboardListingsQuery } from '../Redux/features/migrations/migrationsApi';

const EBAY_ICON = 'https://ir.ebaystatic.com/rs/v/fxxj3ttftm5ltcqnto1o4baovyl.png';

const FitmentAdoptionSummary = () => {
  const { data: summaryData } = useSummaryQuery({});

  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpenModal } = useAppSelector((state) => state.paymentModal);

  const isToggle = useState(location.state?.isToggle || false);
  const [, setScore] = useState(summaryData?.score);

  useEffect(() => {
    if (summaryData) setScore(summaryData.score);
  }, [summaryData]);

  // Fetch all listings from our integration backend
  const { data: listingsData } = useListDashboardListingsQuery({ limit: 500 });

  // Group flat listings by category
  const groupedCategories = useMemo(() => {
    if (!listingsData?.data?.length) return [];

    const map = new Map<number, any>();

    listingsData.data.forEach((listing) => {
      const catId = listing.categoryId ?? 0;
      if (!map.has(catId)) {
        map.set(catId, {
          id: catId,
          icon: EBAY_ICON,
          site: 'ebay',
          category: listing.categoryTitle ?? 'Unknown',
          categoryId: catId,
          searchResultId: listing.id,
          amountOfListings: 0,
          amountFitmentEnabled: 0,
          amountNotFitmentEnabled: 0,
          percentage: 0,
        });
      }
      const cat = map.get(catId)!;
      cat.amountOfListings++;
      if (listing.hasFitments) cat.amountFitmentEnabled++;
      else cat.amountNotFitmentEnabled++;
    });

    for (const cat of map.values()) {
      cat.percentage =
        cat.amountOfListings > 0
          ? Math.round((cat.amountFitmentEnabled / cat.amountOfListings) * 100)
          : 0;
    }

    return Array.from(map.values());
  }, [listingsData?.data]);

  // Overall fitment score across all listings
  const overallFitmentScore = useMemo(() => {
    if (!listingsData?.data?.length) return 0;
    const enabled = listingsData.data.filter((l) => l.hasFitments).length;
    return Math.round((enabled / listingsData.data.length) * 100);
  }, [listingsData?.data]);

  // Push grouped categories to Redux so SummaryFitmentTable can read them
  useEffect(() => {
    dispatch(setSummaryFitmentCategories(groupedCategories));
  }, [groupedCategories, dispatch]);

  return (
    <div className={isOpenModal ? 'overflow-y-hidden' : ''}>
      {/* Navbar Section */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>

      <div className="p-[25px]">
        <div className="flex gap-[30px] flex-row">
          {/* Listing Optimization Section */}
          <div
            className={`${
              isToggle ? 'flex flex-col gap-4' : 'flex flex-col gap-4'
            }`}
          >
            {/* FITMENT ADOPTION Section */}
            <div
              className={`${
                isToggle ? 'flex flex-col w-[260px]' : 'flex flex-col w-[270px]'
              }`}
            >
              <div className="border  border-borderColor  p-2.5 flex flex-col h-[300px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <p className="text-md text-center text-[#0F0C22] font-poppins font-medium">
                  Fitment Adoption
                  <Tooltip title="This identifies and confirms your auto parts listings that specifies compatible vehicle makes, models, and years, as a % of your store">
                    <InfoIcon style={{ fontSize: 11, color: 'grey' }} />
                  </Tooltip>
                </p>
                <CircularProgressBarTwo
                  percentage={overallFitmentScore}
                />
              </div>
            </div>

            {/* fitment score chart */}
            <div
              className={`${
                isToggle ? 'flex flex-col w-[260px]' : 'flex flex-col w-[270px]'
              }`}
            >
              <div className="border  border-borderColor  p-2.5 flex flex-col h-[330px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <FitmentScoreChart />
              </div>
            </div>
          </div>

          {/* Right Table: eBay Seller Details */}

          <div className="border border-borderColor rounded-[15px] p-[25px] min-w-[950px] min-h-[330px] static z-[0]">
            <SummaryFitmentTable
              categories={groupedCategories}
              fetchSummaryFitment={undefined}
              setPaginationCurrentPage={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Support Message */}
      <div style={{ position: 'sticky', zIndex: '2000' }}>
        <SupportMessage />
      </div>
    </div>
  );
};

export default FitmentAdoptionSummary;
