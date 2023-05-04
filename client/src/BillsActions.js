import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const BillsActions = () => {
    const [data, setData] = useState(null);
    const [chamber, setChamber] = useState('all');
    const [party, setParty] = useState('all');
    const [becameLaw, setBecameLaw] = useState(false);

    useEffect(() => {
        fetch('http://localhost:1089/bills/actions')
        .then(response => response.json())
        .then(d => setData(d));
    }, []);

    function updateBecameLaw() {
        setBecameLaw(document.getElementById('became-law-toggle').checked);
    }

    const chamberOptions = [
        { value: "all", label: "All" },
        { value: "House", label: "House" },
        { value: "Senate", label: "Senate" },
      ];

      const partyOptions = [
        { value: "all", label: "All" },
        { value: "D", label: "Democrat" },
        { value: "R", label: "Republican" },
        { value: "I", label: "Independent" },
        { value: "L", label: "Libertarian" }
      ];

    if (data) {
        const filteredData = data.filter(
            (d) =>
              (chamber === 'all' || d.origin_chamber === chamber) &&
              (party === 'all' || d.party === party) &&
              (d.became_law === becameLaw)
        );

        const histogramData = filteredData.reduce((acc, d) => {
            if (!acc[d.congress]) {
              acc[d.congress] = { D: 0, R: 0, I: 0, L: 0 };
            }
            acc[d.congress][d.party]++;
            return acc;
        }, {});
        console.log(histogramData)

        const parties = ['D', 'R', 'I', 'L'];
        const colors = ['#1f77b4', '#d62728', '#2ca02c', '#9467bd'];
        
        const traces = parties.map((party, i) => {
            const values = Object.values(histogramData).map(obj => obj[party]);
            return {
                x: Object.keys(histogramData),
                y: values,
                name: party,
                type: 'bar',
                marker: {
                color: colors[i],
                },
            };
        });

        return (
            <div>
              <h1>Congressional Legislation Histogram</h1>
              <div>
                <div class="labels">
                <label htmlFor="chamber">Chamber: </label>
                <select
                  id="chamber"
                  value={chamber}
                  onChange={(e) => setChamber(e.target.value)}
                >
                  {chamberOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="party">Party: </label>
                <select
                  id="party"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                >
                  {partyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label>Became Law: </label>
                <input id="became-law-toggle" type="checkbox" checked={becameLaw} onChange={updateBecameLaw} />
              </div>
              </div>
              <div class="plot">
              <Plot
                data={traces}
                layout={{
                  width: 1000,
                  height: 600,
                  barmode: 'stack',
                  xaxis: { title: 'Congress' },
                  yaxis: { title: 'Number of Bills' },
                }}
              />
              </div>
            </div>
        );
    } else {
        return <div>Loading data...</div>;
    }
};

export { BillsActions };
