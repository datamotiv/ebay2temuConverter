import {
  // optimizationTableBodyData,
  optimizationTableHeaderData,
} from "../utils/data";
import OptimizationTable from "../components/OptimizationTable";


type EbayReportData = {
  objectbrand: string | null;
  categoryID: string | null;
  categoryTitle: string | null;
  compatibility: string | null;
  currency: string | null;
  ean: string | null;
  fitments: string | null;
  imageURL: string | null;
  itemNumber: string | null;
  itemSpecifics: string | null;
  listingDate: string | null;
  mandatorySpecs: string | null;
  manufacturer: string | null;
  mpn: string | null;
  price: string | null;
  quantitySold: number | null;
  recommendedSpecs: string | null;
  score: number | null;
  specifications: string | null;
  title: string | null;
  upc: string | null;
  usedRecommendedSpecs: string | null;
};

type OptimizationProps = {
  optimizeData: number;
  EbayReportData: EbayReportData;
};
const Optimization = ({  EbayReportData }: OptimizationProps) => {
  
  return (
    // on left
    <div className=" w-full">
  <div className="flex justify-between items-start">
    <div className="w-full">
      <h3 className="text-lg text-secondary  font-semibold mb-2">
        Specific Item Score
      </h3>
      <OptimizationTable
        headerItems={optimizationTableHeaderData}
        bodyItems={
          Array.isArray(EbayReportData?.specifications)
            ? EbayReportData.specifications.map((spec, index) => ({
                id: `spec-${index}`,
                item: spec.item || "Unknown item", // Adjust based on the structure of your spec
                recommended: spec.recommended || "N/A", // Adjust accordingly
                used: spec.used || "N/A",
                note: spec.note || "No notes",
                optimizationType: spec.optimizationType || "spec",
              }))
            : []
        }
      />
    </div>
  </div>
</div>

  );
};

export default Optimization;
