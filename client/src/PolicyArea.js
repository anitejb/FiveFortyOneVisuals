import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const PolicyArea = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:1089/bills/policy_area')
        .then(response => response.json())
        .then(d => setData(d));
    }, []);

    if (data) {
        // Transform the data
        const policyAreas = Array.from(new Set(data.map(d => d.policy_area)));
        const policyAreaData = policyAreas.map(policyArea => {
        const filteredData = data.filter(d => d.policy_area === policyArea);
        const counts = filteredData.reduce((obj, d) => {
            const key = `${d.year}-${d.month}`;
            obj[key] = (obj[key] || 0) + 1;
            return obj;
        }, {});
        const x = Object.keys(counts).sort();
        console.log(x);
        const y = x.map(key => counts[key]);
        return { x, y, name: policyArea };
        });

        // Create the plot
        const plotData = policyAreaData.map(d => ({
            x: d.x,
            y: d.y,
            name: d.name,
            type: 'line',
        }));
        const layout = {
            title: 'Number of Bills by Policy Area',
            xaxis: {
                title: 'Month/Year',
                type: 'date',
                tickformat: '%b %Y',
            },
            yaxis: {
                title: 'Number of Bills',
            },
            width: 1000,
            height: 600,
        };

        return (
            <div>
            <h1>Policy Areas</h1>
            <div class="labels">
            </div>
            <div class="plot">
            <Plot data={plotData} layout={layout} />
            </div>
            </div>
        )
    } else {
        return <div>Loading data...</div>;
    }
}

export { PolicyArea };
