import styles from '../styles/Home.module.css';
import { useGeoJsonData } from '../utils/useGeoData';
import { getCountryById } from '../utils/findCountryById';

import { geoPath, geoOrthographic, select, drag, zoom, geoContains } from 'd3';
import React, { useEffect, useRef, useMemo, useState } from 'react';

function Home() {
  // ------------
  let width = 600;
  let height = 600;
  let initialRotation = [0, -30];
  let initialScale = 250;
  let maxScale = 4594.79;
  let minScale = 94.73;
  let maxScroll = 20;
  let minScroll = 0.3;
  let zoomInValue = 1.1487;
  let zoomOutValue = 0.87055;
  let sensitivity = 75;
  let rotationValue = 5;
  // rotation,
  // selectedCountry,
  // onCountryClick,
  // onRandomCountryClick,
  // onLocationClick,
  // showWidgets,
  // -----------

  const [{ data, isLoading }] = useGeoJsonData();
  const [currentCountry, setCurrentCountry] = useState(null);
  // const [currentCountry, setCurrentCountry] = useState(getCountryById(1));

  const svgRef = useRef(null);

  // Projection
  // useMemo is important here because we want to create a projection only once
  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(initialScale)
        .center([0, 0])
        .rotate(initialRotation)
        .translate([width / 2, height / 2]),
    [width, height, initialRotation, initialScale]
  );
  const path = geoPath().projection(projection);

  /**
   * Initial globe set up.
   *
   * Draws the globe and using d3 attaches drag and zoom event handlers.
   *
   * Additionaly, watches 'width' prop to update whenever window's width
   * changes.
   */
  useEffect(() => {
    if (!data.features.length) return;

    // Selectors
    const svg = select(svgRef.current);
    const globeCircle = svg.select('circle');
    const countryPaths = svg.selectAll(`path`);

    // Drag
    const dragBehaviour = drag().on('drag', (event) => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();

      // Update projection
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      path.projection(projection);
      countryPaths.attr('d', path);
    });

    // Zoom
    const zoomBehaviour = zoom().on('zoom', (event) => {
      const scrollValue = event.transform.k;

      // Reached max/min zoom
      if (scrollValue >= maxScroll) event.transform.k = maxScroll;
      if (scrollValue <= minScroll) event.transform.k = minScroll;
      else {
        // Update projection
        projection.scale(initialScale * event.transform.k);

        // Update path generator with new projection
        path.projection(projection);

        // Update selectors
        countryPaths.attr('d', path);
        globeCircle.attr('r', projection.scale());
      }
    });

    // Apply scroll and drag behaviour
    svg.call(dragBehaviour).call(zoomBehaviour);

    // Update country paths
    countryPaths.data(data.features).join('path').attr('d', path);
    globeCircle.attr('r', projection.scale());
  }, [
    width,
    data,
    path,
    projection,
    initialScale,
    minScroll,
    maxScroll,
    sensitivity,
  ]);

  function onCountryClick({ target: { id } }) {
    setCurrentCountry(id);
  }

  if (isLoading) return <p>Is loading</p>;
  return (
    <div className={styles.main}>
      <h2>Hey</h2>
      <svg ref={svgRef} className={styles.svg}>
        <circle
          className={styles.circle}
          cx={width / 2}
          cy={height / 2}
          r={initialScale}
        />
        <g>
          {data.features.map(({ id }) => (
            <path
              key={id}
              id={id}
              onClick={onCountryClick}
              className={`${styles.country} ${
                currentCountry === id ? styles.selected : ''
              }`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Home;
