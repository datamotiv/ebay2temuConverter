import GaugeChart from 'react-gauge-chart';

const SingleListingScore = () => {
    const chartStyle = {
        height: 250,
      }
  return (
<div className="flex flex-col items-center mt-4 w-[300px] justify-between ">
  {/* Gauge Chart */}
  <div style={{ width: '250px', height: '100px' }}>
    <GaugeChart
      id="gauge-chart2"
      style={chartStyle}
      nrOfLevels={3}
      percent={0.86}
      arcWidth={0.3}
      arcPadding={0.03}
      arcsLength={[0.3, 0.5, 0.2]}
      colors={['#5BE12C', '#F5CD19', '#EA4228']}
    />
  </div>

  {/* Text on the Right Side */}
<div className="mt-4 mb-2 flex flex-col space-y-2">
        <div className="flex flex-col items-center">
          <span className="text-black-200 text-xs font-semibold">Optimization Score</span>
          <span className="font-bold">{37}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#00CC00] text-xs capitalize font-semibold">Optimization Opportunity</span>
          <span className="font-bold text-[#00CC00]">{100 - 37}%</span>
        </div>
      </div>
</div>

  )
}

export default SingleListingScore;