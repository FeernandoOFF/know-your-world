import styles from '../styles/Home.module.css';
import { useGeoJsonData } from '../utils/useGeoData';
import { getCountryById } from '../utils/findCountryById';

import { motion } from 'framer-motion';
import { geoPath, geoOrthographic, select, drag, zoom, geoContains } from 'd3';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { rotateProjectionTo } from '../utils/rotateProjection';

// * Animations for the Globe when is a country or not

const globeVariants = {
  initial: {
    scale: 0.2,
  },
  empty: {
    scale: 1,
    x: 0,
    y: 100,
  },
  selected: {
    scale: 1,
    x: -500,
  },
};

function Globe({ currentCountry, setCurrentCountry }) {
  // ------------
  let width = 600;
  let height = 600;
  let initialScale = 250;
  let maxScale = 4594.79;
  let minScale = 94.73;
  let maxScroll = 1.2;
  let minScroll = 1;
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
  const [rotation, setRotation] = useState([0, -30]);

  const svgRef = useRef(null);

  // Projection
  // useMemo is important here because we want to create a projection only once
  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(initialScale)
        .center([0, 0])
        .rotate([0, -30])
        .translate([width / 1.2, height / 1.8]),
    [width, height, initialScale]
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

  /**
   * Watch rotation and prop and smoothly (using rotateProjactionTo)
   * update the rotation.
   *
   */
  useEffect(() => {
    if (!rotation) return;

    const countryPaths = select(svgRef.current).selectAll('path');

    rotateProjectionTo({
      selection: countryPaths,
      projection,
      path,
      rotation,
    });
  }, [rotation, path, projection]);

  function onCountryClick({ target: { id } }) {
    const selectedC = getCountryById(id);
    setCurrentCountry(selectedC);
    setRotation(selectedC.rotation);
  }

  if (isLoading) return <p>Is loading</p>;
  return (
    <motion.svg
      variants={globeVariants}
      animate={currentCountry ? 'selected' : 'empty'}
      initial="initial"
      transition={{
        duration: 0.8,
      }}
      ref={svgRef}
      className={styles.svg}
    >
      <circle
        className={styles.circle}
        cx={'50%'}
        cy={'41.5%'}
        r={initialScale}
      />
      <g>
        {data.features.map(({ id }) => (
          <path
            key={id}
            id={id}
            onClick={onCountryClick}
            className={`${styles.country} ${
              currentCountry?.id == id ? styles.selected : ''
            }`}
          />
        ))}
      </g>
    </motion.svg>
  );
}

export default Globe;
