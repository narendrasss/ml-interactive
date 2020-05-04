import React, { useEffect, useState } from "react";
import csv from "jquery-csv";
import "./App.css";

import { Plot } from "./components/Plot";
import { Scatter } from "./components/Scatter";
import { getError } from "./models/DecisionStump";

const DATASET = "data/data.csv";

const dimensions = {
  width: window.innerWidth * 0.5,
  height: 600,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
};

const App = () => {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [split, setSplit] = useState([1, 0]);

  useEffect(() => {
    fetch(DATASET)
      .then((res) => res.text())
      .then((data) => {
        const parsed = csv.toObjects(data);
        setDataset(
          parsed.map((x) => {
            const floats = Object.entries(x).map((x) => [x[0], parseFloat(x[1])]);
            return Object.fromEntries(floats);
          })
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSplitChange = (newSplit) => setSplit(newSplit);
  const error = getError(
    split,
    dataset.map((d) => [d.price_per_sqft, d.elevation, d.in_sf])
  );

  return (
    <div className="App">
      <Plot dimensions={dimensions}>
        <Scatter
          dataset={dataset}
          getX={(d) => d.price_per_sqft}
          getY={(d) => d.elevation}
          onSplitChange={handleSplitChange}
          split={split}
        />
      </Plot>
      <div>Training error: {error.toFixed(2)}</div>
    </div>
  );
};

export { App };
