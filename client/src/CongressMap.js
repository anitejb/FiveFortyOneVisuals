import React, { useState, useEffect } from 'react';
// import Plotly from 'plotly.js/dist/plotly';
import Plot from 'react-plotly.js';

function CongressMap(props) {

  // Define state variables
  const [data, setData] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [currentMembersOnly, setCurrentMembersOnly] = useState(false);
  const [selectedBirthYearMin, setSelectedBirthYearMin] = useState([1990]);
  const [selectedBirthYearMax, setSelectedBirthYearMax] = useState([2023]);
  const [selectedCurrYear, setSelectedCurrYear] = useState([2023]);

  // Define function to calculate the average age of congresspeople from a state
  function calculateAvgAge(state) {
    const filteredData = data.filter(d => {
      if (currentMembersOnly && !d.current_member) {
        return false;
      }
      if (selectedParty && d.party !== selectedParty) {
        return false;
      }
      if (d.birth_year < selectedBirthYearMin || d.birth_year > selectedBirthYearMax) {
        return false;
      }
      return d.state === state;
    });
    const totalAge = filteredData.reduce((acc, curr) => acc + curr.age_start, 0);
    const numMembers = filteredData.length;
    return numMembers > 0 ? totalAge / numMembers : null;
  }

  function calculateAvgCurrAge(state) {
    const filteredData = data.filter(d => {
      if (currentMembersOnly && !d.current_member) {
        return false;
      }
      if (selectedParty && d.party !== selectedParty) {
        return false;
      }
      if (d.year_start > selectedCurrYear || d.year_end < selectedCurrYear) {
        return false;
      }
      return d.state === state;
    });
    const totalAge = filteredData.reduce((acc, curr) => acc + (selectedCurrYear - curr.birth_year), 0);
    const numMembers = filteredData.length;
    return numMembers > 0 ? totalAge / numMembers : null;
  }

  function calculateAvgTerm(state) {
    const filteredData = data.filter(d => {
      if (currentMembersOnly && !d.current_member) {
        return false;
      }
      if (selectedParty && d.party !== selectedParty) {
        return false;
      }
      if (d.year_start > selectedCurrYear || d.year_end < selectedCurrYear) {
        return false;
      }
      return d.state === state;
    });
    const totalAge = filteredData.reduce((acc, curr) => acc + (selectedCurrYear - curr.year_start), 0);
    const numMembers = filteredData.length;
    return numMembers > 0 ? totalAge / numMembers : null;
  }

  // Define function to calculate the minimum age of congresspeople from a state
  function calculateMinAge(state) {
    const filteredData = data.filter(d => {
      if (currentMembersOnly && !d.current_member) {
        return false;
      }
      if (selectedParty && d.party !== selectedParty) {
        return false;
      }
      if (d.birth_year < selectedBirthYearMin || d.birth_year > selectedBirthYearMax) {
        return false;
      }
      return d.state === state;
    });
    const ages = filteredData.map(d => d.age_start);
    return ages.length > 0 ? Math.min(...ages) : null;
  }

  // Define function to calculate the maximum age of congresspeople from a state
  function calculateMaxAge(state) {
    const filteredData = data.filter(d => {
      if (currentMembersOnly && !d.current_member) {
        return false;
      }
      if (selectedParty && d.party !== selectedParty) {
        return false;
      }
      if (d.birth_year < selectedBirthYearMin || d.birth_year > selectedBirthYearMax) {
        return false;
      }
      return d.state === state;
    });
    const ages = filteredData.map(d => d.age_start);
    return ages.length > 0 ? Math.max(...ages) : null;
  }

  // Define function to update the map based on user input
  function updateMap() {
    setSelectedParty(document.getElementById('party-toggle').value);
    // setCurrentMembersOnly(document.getElementById('current-member-toggle').checked);
    // setSelectedBirthYearMin([document.getElementById('birth-year-slider-min').value]);
    // setSelectedBirthYearMax([document.getElementById('birth-year-slider-max').value]);
    setSelectedCurrYear([document.getElementById('curr-year-slider').value]);
  }

  // Load data when component mounts
  // useEffect(() => {
  //   Plotly.d3.json(props.dataUrl, (json) => {
  //     setData(json);
  //   });
  // }, [props.dataUrl]);
  useEffect(() => {
    fetch('http://localhost:1089/members/state')
      .then(response => response.json())
      .then(d => setData(d));
  }, []);

  // Render the map
  if (data) {
    const states = Object.keys(data.reduce((acc, curr) => {
      if (curr.current_member) {
        acc[curr.state] = true;
      }
      return acc;
    }, {})).sort();

    const avgAges = states.map(state => calculateAvgAge(state));
    const minAges = states.map(state => calculateMinAge(state));
    const maxAges = states.map(state => calculateMaxAge(state));
    const avgCurrAges = states.map(state => calculateAvgCurrAge(state));
    const avgTerm = states.map(state => calculateAvgTerm(state));

    const chartData = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: states.map(state => state.toUpperCase()),
      // z: avgAges,
      z: avgCurrAges,
      // zmin: Math.min(...avgAges.filter(avgAge => avgAge !== null)),
      // zmax: Math.max(...avgAges.filter(avgAge => avgAge !== null)),
      zmin: 40,
      zmax: 75,
      colorscale: 'YlGnBu',
      hoverinfo: 'location+z+text',
      text: states.map(state => {
        const avgAge = calculateAvgAge(state);
        const minAge = calculateMinAge(state);
        const maxAge = calculateMaxAge(state);
        const currAge = calculateAvgCurrAge(state);
        return ``;
        // return `${state}<br>Avg Age: ${avgAge !== null ? avgAge.toFixed(2) + ' years' : 'N/A'}<br>Curr Age: ${currAge !== null ? currAge.toFixed(2) + ' years' : 'N/A'}<br>Min Age: ${minAge !== null ? minAge + ' years' : 'N/A'}<br>Max Age: ${maxAge !== null ? maxAge + ' years' : 'N/A'}`;
      }),
      colorbar: {
        title: 'Average Age',
        ticksuffix: 'years'
      }
    }];

    const layout = {
      title: 'Average Age of Congresspeople by State',
      geo: {
        scope: 'usa',
        projection: {
          type: 'albers usa'
        },
        showlakes: true,
        lakecolor: 'rgb(255, 255, 255)'
      },
      width: 1000,
      height: 600,
    };

    const chart2Data = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: states.map(state => state.toUpperCase()),
      // z: avgAges,
      z: avgTerm,
      // zmin: Math.min(...avgAges.filter(avgAge => avgAge !== null)),
      // zmax: Math.max(...avgAges.filter(avgAge => avgAge !== null)),
      zmin: 0,
      zmax: 20,
      colorscale: 'YlGnBu',
      hoverinfo: 'location+z+text',
      text: states.map(state => {
        const avgAge = calculateAvgAge(state);
        const minAge = calculateMinAge(state);
        const maxAge = calculateMaxAge(state);
        const currAge = calculateAvgCurrAge(state);
        return ``;
        // return `${state}<br>Avg Age: ${avgAge !== null ? avgAge.toFixed(2) + ' years' : 'N/A'}<br>Curr Age: ${currAge !== null ? currAge.toFixed(2) + ' years' : 'N/A'}<br>Min Age: ${minAge !== null ? minAge + ' years' : 'N/A'}<br>Max Age: ${maxAge !== null ? maxAge + ' years' : 'N/A'}`;
      }),
      colorbar: {
        title: 'Average Term',
        ticksuffix: 'years'
      }
    }];

    const chart2layout = {
      title: 'Average Term of Congresspeople by State',
      geo: {
        scope: 'usa',
        projection: {
          type: 'albers usa'
        },
        showlakes: true,
        lakecolor: 'rgb(255, 255, 255)'
      },
      width: 1000,
      height: 600,
    };

    // return <h1>Congress Page</h1>;

    return (
      <div>
        <div>{/* <div class="floater"> */}
        <h1>Congressional Ages</h1>
        <div class="labels">
        <div className="input-group">
          <label>Filter by party:</label>
          <select id="party-toggle" onChange={updateMap}>
            <option value="">All</option>
            <option value="Democrat">Democrat</option>
            <option value="Republican">Republican</option>
          </select>
        </div>
        {/* <div className="input-group">
          <label>Current members only:</label>
          <input id="current-member-toggle" type="checkbox" checked={currentMembersOnly} onChange={updateMap} />
        </div> */}
        <div className="input-group">
          {/* <label>Filter by birth year range:</label>
          <input
            id="birth-year-slider-min"
            type="range"
            min="1890"
            max="2023"
            step="1"
            defaultValue="1890"
            onChange={updateMap}
          />
          <input
            id="birth-year-slider-max"
            type="range"
            min="1890"
            max="2023"
            step="1"
            defaultValue="2023"
            onChange={updateMap}
          />
          <div>{selectedBirthYearMin} - {selectedBirthYearMax}</div> */}
          <label>Filter by year: {selectedCurrYear}</label>
          <input
            id="curr-year-slider"
            type="range"
            min="1990"
            max="2023"
            step="1"
            defaultValue="2023"
            onChange={updateMap}
          />
        </div>
        </div>
        </div>
        <div class="plot">
        <Plot
          data={chartData}
          layout={layout}
          config={{ displayModeBar: false }}
        />
        <Plot
          data={chart2Data}
          layout={chart2layout}
          config={{ displayModeBar: false }}
        />
        </div>
      </div>
    );
  } else {
    return <div>Loading data...</div>;
  }
}

export { CongressMap };
