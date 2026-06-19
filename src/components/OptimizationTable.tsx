import { TOptimizationTableData, TTableHeaderData } from "../utils/types";

type TTableProps = {
  bodyItems: TOptimizationTableData[];
  headerItems: TTableHeaderData[];
};

const OptimizationTable = ({ bodyItems,}: TTableProps) => {
  return (
    <div className="border border-borderColor rounded-[10px]">
      <table className="w-full rounded-[10px]">
        <thead className="rounded-t-[10px] bg-[#FAFAFA] font-normal text-sm font-poppins">
          
          <tr >
            <th >Item</th>
            <th >Recommended</th>
            <th >Used</th>
            <th >Note</th>
          </tr>
        </thead>
        <tbody>
          {bodyItems.map(
            ({
              id,
              item,
              recommended,
              used,
              note,
             
            }: TOptimizationTableData) => (
              <tr key={id} className="border-b last:border-b-0">
                <td className="p-[3px] text-xs font-poppins font-light border-r border-r-borderColor">
                  {item}
                </td>
                <td className="p-[3px] text-xs font-poppins font-light border-r border-r-borderColor">
                  {recommended}
                </td>
                <td className="p-[3px] px-5 ml-2 text-xs text-white font-poppins font-light border-r border-r-borderColor w-[150px]">
  <div className="relative w-full bg-white rounded-full border border-[#ED1F24] h-5 overflow-hidden">
    <div
      className="h-full text-xs bg-[#ED1F24] rounded-full transition-all duration-300"
      style={{ width: `${used}%`, color:'white', fontSize:'0.7rem', paddingLeft:'8px', font:"small-caption"}} 
    >  {used}%</div>
  </div>
</td>

                <td className="p-[3px] text-xs font-poppins font-light">
                  {note}
                </td>
              </tr>
            )
          )}

          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default OptimizationTable;
