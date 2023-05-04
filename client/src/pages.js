import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Logo from './LogoNoWords.png';

function Home() {
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(data => setTodo(data));
  }, []);

  const generatePlot = () => {
    const data = [
      {
        x: ['Task'],
        y: [todo.completed ? 1 : 0],
        type: 'bar',
      },
    ];

    const layout = {
      title: 'Completed Task',
      xaxis: { title: 'Task' },
      yaxis: { title: 'Completed' },
    };

    return <Plot data={data} layout={layout} />;
  };

  return (
    <div>
      {todo ? (
        <div>
          <h2>{todo.title}</h2>
          <p>Completed: {todo.completed.toString()}</p>
          {generatePlot()}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function About() {
  return (
    <div>
    <h1>About</h1>
    <div class="labels">
    <p>Welcome to FiveFortyOne, where we analyze data about congress members and congressional bills. Our goal is to provide informative and engaging visualizations that help you make sense of the complex world of American politics.</p>

<p>At our core, we believe that data is key to understanding the decisions made by our elected officials, and we are committed to providing accurate and unbiased analysis of the numbers that shape our democracy. Whether you're interested in tracking voting patterns, analyzing legislative trends, or simply exploring the vast and intricate world of congressional data, we've got you covered.</p>

<p>Our team of expert data analysts and visualization specialists is dedicated to creating compelling and informative graphics that help you better understand the issues that matter most to you. From our interactive maps to our insightful charts and graphs, we strive to make our data accessible to everyone, regardless of their level of expertise.</p>

<p>So whether you're a political junkie looking to stay on top of the latest developments in Congress, a journalist seeking insights into the workings of our government, or simply a concerned citizen eager to better understand the complex issues facing our nation, we invite you to explore our site and discover the power of data-driven analysis.</p>
<img src={Logo} />
    </div>

    </div>
  );
}

export { Home, About };
