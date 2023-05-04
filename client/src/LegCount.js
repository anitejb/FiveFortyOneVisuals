import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const LegCount = () => {
    const [data, setData] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [showNormalized, setShowNormalized] = useState(true);

    const handlePartySelect = (event) => {
        setSelectedParty(event.target.value === 'All' ? null : event.target.value);
    };

    const handleStateSelect = (event) => {
        setSelectedState(event.target.value === 'All' ? null : event.target.value);
    };

    function handleShowNormalized() {
        setShowNormalized(document.getElementById('normalized-toggle').checked);
    }

    useEffect(() => {
        fetch('http://localhost:1089/members/leg_count')
        .then(response => response.json())
        .then(d => setData(d));
    }, []);

    if (data) {
        function calculateLinearRegression(xValues, yValues) {
            const n = xValues.length;
            let sumX = 0;
            let sumY = 0;
            let sumXY = 0;
            let sumX2 = 0;
          
            for (let i = 0; i < n; i++) {
              sumX += xValues[i];
              sumY += yValues[i];
              sumXY += xValues[i] * yValues[i];
              sumX2 += xValues[i] * xValues[i];
            }
    
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return [slope, intercept];
        }

        function calculateRobustLinearRegression(xValues, yValues, maxMADs = 3) {
            const n = xValues.length;
            const medianX = median(xValues);
            const medianY = median(yValues);
            const absResiduals = [];
          
            for (let i = 0; i < n; i++) {
              const x = xValues[i];
              const y = yValues[i];
              const predictedY = slope * x + intercept;
              const residual = Math.abs(y - predictedY);
              absResiduals.push(residual);
            }
          
            const medianAbsResidual = median(absResiduals);
            const MAD = median(absResiduals.map(r => Math.abs(r - medianAbsResidual)));
            const maxResidual = maxMADs * MAD;
          
            let sumX = 0;
            let sumY = 0;
            let sumXY = 0;
            let sumX2 = 0;
            let count = 0;
          
            for (let i = 0; i < n; i++) {
              const x = xValues[i];
              const y = yValues[i];
              const predictedY = slope * x + intercept;
              const residual = Math.abs(y - predictedY);
          
              if (residual <= maxResidual) {
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
                count++;
              }
            }
          
            const slope = (count * sumXY - sumX * sumY) / (count * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / count;
          
            return [ slope, intercept ];
        }

        function median(arr) {
            const sortedArr = arr.slice().sort((a, b) => a - b);
            const mid = Math.floor(sortedArr.length / 2);
            return sortedArr.length % 2 === 0 ? (sortedArr[mid - 1] + sortedArr[mid]) / 2 : sortedArr[mid];
        }
          

        function getTop10(party, state) {
            let filteredData = data;
            if (party) {
            filteredData = filteredData.filter(d => d.party === party);
            }
            if (state) {
            filteredData = filteredData.filter(d => d.state === state);
            }
            return filteredData
            .sort((a, b) => b.sponsored_count_norm - a.sponsored_count_norm)
            .slice(0, 10);
        }

        const topTen = getTop10(selectedParty, selectedState);
        const maxVal = Math.max(...topTen.map((d) => d.sponsored_count_norm));
        const barWidth = maxVal / 20;

        // Calculate the image size based on the bar width
        const imageSize = barWidth;

        const topTenImages = topTen.map((congressperson) => ({
            source: congressperson.photo,
            x: congressperson.sponsored_count_norm,
            y: congressperson.name,
            sizex: imageSize,
            sizey: imageSize,
            xanchor: "center",
            yanchor: "middle",
            xref: "x",
            yref: "y",
        }));

        // Create the data object for the plot
        const top10data = topTen.map((d) => ({
            x: [d.sponsored_count_norm],
            y: [d.name],
            type: "bar",
            orientation: "h",
            hoverinfo: "none",
            marker: {
                color: d.party === "Democrat" ? "blue" : "red",
            },
        }));

        const top10layout = {
            title: "Top 10 Congresspeople by Sponsored Count (Normalized)",
            xaxis: {
              title: "Sponsored Count (Normalized)",
              range: [0, 1.1 * Math.max(...topTen.map((d) => d.sponsored_count_norm))],
            },
            yaxis: { automargin: true , autorange: "reversed"},
            barmode: "stack",
            height: 600,
            margin: { t: 50, r: 50, b: 50, l: 150 },
            images: [
                ...topTenImages.map((image) => ({
                    source: image.source,
                    x: image.x,
                    y: image.y,
                    sizex: image.sizex,
                    sizey: image.sizey,
                    xanchor: image.xanchor,
                    yanchor: image.yanchor,
                    xref: image.xref,
                    yref: image.yref,
                }))
            ],
            showlegend: false,
            width: 1000,
            height: 600,
        };

        // TWO
        function getTop10NotNorm(party, state) {
            let filteredData = data;
            if (party) {
            filteredData = filteredData.filter(d => d.party === party);
            }
            if (state) {
            filteredData = filteredData.filter(d => d.state === state);
            }
            return filteredData
            .sort((a, b) => b.sponsored_legislation_count - a.sponsored_legislation_count)
            .slice(0, 10);
        }

        const topTen2 = getTop10NotNorm(selectedParty, selectedState);
        console.log(topTen2.map((d) => d.sponsored_legislation_count));
        const maxVal2 = Math.max(...topTen2.map((d) => d.sponsored_legislation_count));
        const barWidth2 = maxVal2 / 20;

        // Calculate the image size based on the bar width
        const imageSize2 = barWidth2;

        const topTenImages2 = topTen2.map((congressperson) => ({
            source: congressperson.photo,
            x: congressperson.sponsored_legislation_count,
            y: congressperson.name,
            sizex: imageSize2,
            sizey: imageSize2,
            xanchor: "center",
            yanchor: "middle",
            xref: "x",
            yref: "y",
        }));

        // Create the data object for the plot
        const top10data2 = topTen2.map((d) => ({
            x: [d.sponsored_legislation_count],
            y: [d.name],
            type: "bar",
            orientation: "h",
            hoverinfo: "none",
            marker: {
                color: d.party === "Democrat" ? "blue" : "red",
            },
        }));

        const top10layout2 = {
            title: "Top 10 Congresspeople by Sponsored Count",
            xaxis: {
              title: "Sponsored Count",
              range: [0, 1.1 * Math.max(...topTen2.map((d) => d.sponsored_legislation_count))],
            },
            yaxis: { automargin: true, autorange: "reversed"},
            barmode: "stack",
            height: 600,
            margin: { t: 50, r: 50, b: 50, l: 150 },
            images: [
                ...topTenImages2.map((image) => ({
                    source: image.source,
                    x: image.x,
                    y: image.y,
                    sizex: image.sizex,
                    sizey: image.sizey,
                    xanchor: image.xanchor,
                    yanchor: image.yanchor,
                    xref: image.xref,
                    yref: image.yref,
                }))
            ],
            showlegend: false,
            width: 1000,
            height: 600,
        };


        // END TWO

        const filteredData = data.filter((d) => {
            if (selectedParty && d.party !== selectedParty) {
                return false;
            }
            if (selectedState && d.state !== selectedState) {
                return false;
            }
            return true;
        });

        const filteredDataDems = data.filter((d) => {
            if (d.party !== 'Democrat') {
                return false;
            }
            if (selectedState && d.state !== selectedState) {
                return false;
            }
            return true;
        });

        const filteredDataReps = data.filter((d) => {
            if (d.party !== 'Republican') {
                return false;
            }
            if (selectedState && d.state !== selectedState) {
                return false;
            }
            return true;
        });

        const filteredDataInds = data.filter((d) => {
            if (d.party !== 'Independent') {
                return false;
            }
            if (selectedState && d.state !== selectedState) {
                return false;
            }
            return true;
        });

        const [plotSlopeDems, plotInterceptDems] = calculateLinearRegression(filteredDataDems.map((d) => d.sponsored_count_norm), filteredDataDems.map((d) => d.cosponsored_count_norm));
        const [plotSlopeReps, plotInterceptReps] = calculateLinearRegression(filteredDataReps.map((d) => d.sponsored_count_norm), filteredDataReps.map((d) => d.cosponsored_count_norm));
        const [plotSlopeInds, plotInterceptInds] = calculateLinearRegression(filteredDataInds.map((d) => d.sponsored_count_norm), filteredDataInds.map((d) => d.cosponsored_count_norm));
        const plotData = [
            {
            name: "Data",
            type: 'scatter',
            mode: 'markers',
            x: filteredData.map((d) => d.sponsored_count_norm),
            y: filteredData.map((d) => d.cosponsored_count_norm),
            marker: {
                color: filteredData.map((d) => (d.party === 'Republican' ? 'red' : (d.party === 'Democrat' ? 'blue' : 'green'))),
                size: 10
            },
            text: filteredData.map((d) => `${d.name}<br>${d.state}, ${d.party}<br>${d.years_served}<br>`),
            hovertemplate: '%{text}'
            },
            {
                name: "Democrat Slope",
                type: 'scatter',
                mode: 'lines',
                x: filteredDataDems.map((d) => d.sponsored_count_norm),
                y: filteredDataDems.map((d) => d.sponsored_count_norm * plotSlopeDems + plotInterceptDems),
                line: {
                    color: "blue",
                    width: 3
                }
            },
            {
                name: "Republican Slope",
                type: 'scatter',
                mode: 'lines',
                x: filteredDataReps.map((d) => d.sponsored_count_norm),
                y: filteredDataReps.map((d) => d.sponsored_count_norm * plotSlopeReps + plotInterceptReps),
                line: {
                    color: "red",
                    width: 3
                }
            },
            {
                name: "Independent Slope",
                type: 'scatter',
                mode: 'lines',
                x: filteredDataInds.map((d) => d.sponsored_count_norm),
                y: filteredDataInds.map((d) => d.sponsored_count_norm * plotSlopeInds + plotInterceptInds),
                line: {
                    color: "green",
                    width: 3
                }
            }
        ];

        const plotLayout = {
            title: 'Congressional Scatterplot (Normalized)',
            xaxis: {
            title: 'Sponsored Count (Normalized)',
            autorange: true,
            type: 'linear',
            fixedrange: false
            },
            yaxis: {
            title: 'Cosponsored Count (Normalized)',
            autorange: true,
            type: 'linear',
            fixedrange: false
            },
            margin: { l: 50, r: 50, b: 50, t: 50 },
            hovermode: 'closest',
            sliders: [{
            pad: {t: 30},
            transition: {duration: 500},
            currentvalue: {
                visible: true,
                prefix: 'Zoom: ',
                xanchor: 'right',
                font: {size: 20, color: '#666'}
            }
            }],
            width: 1000,
            height: 600,
        };

        const plot2Data = [
            {
            type: 'scatter',
            mode: 'markers',
            x: filteredData.map((d) => d.sponsored_legislation_count),
            y: filteredData.map((d) => d.cosponsored_legislation_count),
            marker: {
                color: filteredData.map((d) => (d.party === 'Republican' ? 'red' : (d.party === 'Democrat' ? 'blue' : 'green'))),
                size: filteredData.map((d) => d.years_served),
                sizemode: 'area',
                sizeref: 0.1,
            },
            text: filteredData.map((d) => `${d.name}<br>${d.state}, ${d.party}<br>${d.years_served}<br>`),
            hovertemplate: '%{text}'
            }
        ];

        const plot2Layout = {
            title: 'Congressional Scatterplot',
            xaxis: {
            title: 'Sponsored Count',
            autorange: true,
            type: 'linear',
            fixedrange: false
            },
            yaxis: {
            title: 'Cosponsored Count',
            autorange: true,
            type: 'linear',
            fixedrange: false
            },
            margin: { l: 50, r: 50, b: 50, t: 50 },
            hovermode: 'closest',
            sliders: [{
            pad: {t: 30},
            transition: {duration: 500},
            currentvalue: {
                visible: true,
                prefix: 'Zoom: ',
                xanchor: 'right',
                font: {size: 20, color: '#666'}
            }
            }],
            width: 1000,
            height: 600,
        };

        return (
            <div>
            <h1>Legislation Count</h1>
            <div class="labels">
            {/* <div style={{ marginRight: "10px" }}> */}
                <label htmlFor="party-select">Party:</label>
                <select id="party-select" value={selectedParty || 'All'} onChange={handlePartySelect}>
                <option value="All">All</option>
                <option value="Republican">Republican</option>
                <option value="Democrat">Democrat</option>
                <option value="Independent">Independent</option>
                </select>
            {/* </div> */}
            {/* <div style={{ marginLeft: "10px" }}> */}
                <label htmlFor="state-select">State:</label>
                <select id="state-select" value={selectedState || 'All'} onChange={handleStateSelect}>
                <option value="All">All</option>
                {Array.from(new Set(data.map((d) => d.state)))
                    .map((state) => state)
                    .sort()
                    .map((state) => (<option key={state} value={state}>{state}</option>)
                )}
                </select>
                <label>Show Normalized</label>
                <input id="normalized-toggle" type="checkbox" checked={showNormalized} onChange={handleShowNormalized} />
            {/* </div> */}
            </div>
            <div class="plot">
            {showNormalized ? (
                <div>
                <Plot data={plotData} layout={plotLayout} />
                <Plot data={top10data} layout={top10layout} />
                </div>
            ) : (
                <div>
                <Plot data={plot2Data} layout={plot2Layout} />
                <Plot data={top10data2} layout={top10layout2} />
                </div>
            )}

            </div>
            </div>
        )
    } else {
        return <div>Loading data...</div>;
    }
}

export { LegCount };
