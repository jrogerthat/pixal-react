import React from 'react';
import ReactDOM from 'react-dom';
import { Vega } from 'react-vega';

const spec = {
  "width": 400,
  "height": 200,
  "data": [{ "name": "table" }],
  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],
}

