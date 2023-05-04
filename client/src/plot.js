import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const dataUrl = "https://example.com/data.json";

class PolicyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(dataUrl)
      .then(response => response.json())
      .then(data => this.setState({ data: data }));
  }

  render() {
    const { data } = this.state;

    // Transform the data
    const policyAreas = Array.from(new Set(data.map(d => d.policy_area)));
    const policyAreaData = policyAreas.map(policyArea => {
      const filteredData = data.filter(d => d.policy_area === policyArea);
      const counts = filteredData.reduce((obj, d) => {
        const key = `${d.year}-${d.month}`;
        obj[key] = (obj[key] || 0) + 1;
        return obj;
      }, {});
      const x = Object.keys(counts);
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
      updatemenus: [
        {
          buttons: [
            {
              label: 'All Origin Chambers',
              method: 'update',
              args: [{ visible: policyAreaData.map(() => true) }],
            },
            {
              label: 'Senate Only',
              method: 'update',
              args: [{ visible: policyAreaData.map(d => d.name.includes('Senate')) }],
            },
            {
              label: 'House Only',
              method: 'update',
              args: [{ visible: policyAreaData.map(d => d.name.includes('House')) }],
            },
          ],
          direction: 'down',
          showactive: true,
          xanchor: 'left',
          yanchor: 'top',
        },
        {
          buttons: [
            {
              label: 'All Parties',
              method: 'update',
              args: [{ visible: policyAreaData.map(() => true) }],
            },
            {
              label: 'Democrats Only',
              method: 'update',
              args: [{ visible: policyAreaData.map(d => d.name.includes('Democrat')) }],
            },
            {
              label: 'Republicans Only',
              method: 'update',
              args: [{ visible: policyAreaData.map(d => d.name.includes('Republican')) }],
            },
          ],
          direction: 'down',
          showactive: true,
          xanchor: 'left',
          yanchor: 'top',
          y: 1.15,
        },
      ],
      sliders: [
        {
          active: 0,
          steps: policyAreaData.map((d, i) => ({
            method: 'update',
            args: [{ visible: policyAreaData.map(() => false) }, { visible: [true].concat(Array(i).fill(false).concat(Array(policyAreaData.length - i - 1).fill(true))) }],
            label: d.name,
          })),
        },
      ],
    };

    return <Plotly data={plotData} layout={layout} />;
