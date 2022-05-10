import GlobeStyles from './Globe.module.css';

import { useGeoJsonData } from '../../utils/useGeoData';
import { getCountryById } from '../../utils/findCountryById';
import { rotateProjectionTo } from '../../utils/rotateProjection';

import { motion } from 'framer-motion';
import { geoPath, geoOrthographic, select, drag, zoom, geoContains } from 'd3';
import React, { useEffect, useRef, useMemo, useState } from 'react';

// * Animations for the Globe when is a country or not

const globeVariants = {
  initial: {
    scale: 0.2,
  },
  empty: {
    scale: 1,
    x: 0,
    y: 80,
  },
  selected: {
    scale: 1,
    x: -400,
  },
};

function Globe({ currentCountry, setCurrentCountry }) {
  // ------------
  let width = 600;
  let height = 600;
  // let initialScale = 150;
  let initialScale = 250;
  let maxScale = 4594.79;
  let minScale = 94.73;
  let maxScroll = 1.2;
  let minScroll = 1;
  let zoomInValue = 1.1487;
  let zoomOutValue = 0.87055;
  let sensitivity = 90;
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
    // .translate([width / 3, height / 1.9]),
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
    console.log('Selected C', selectedC);
    setCurrentCountry(selectedC);
    setRotation(selectedC.rotation);
  }

  if (isLoading) return <p>Is loading</p>;
  return (
    <div className={GlobeStyles.container}>
      {currentCountry && (
        <motion.h2
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4 }}
          className={GlobeStyles.text}
        >
          {currentCountry.name}
        </motion.h2>
      )}
      {!currentCountry && (
        <>
          <motion.b
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.4 }}
            className={GlobeStyles.worldTextLeft}
          >
            W
            <motion.i
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              style={{
                fontSize: '3rem',
                position: 'absolute',
                top: '-2rem',
                left: 0,
              }}
            >
              Know Your
            </motion.i>
          </motion.b>
          <motion.span
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.5 }}
            className={GlobeStyles.worldTextRight}
          >
            RLD
          </motion.span>
        </>
      )}
      <motion.svg
        variants={globeVariants}
        animate={currentCountry ? 'selected' : 'empty'}
        initial="initial"
        transition={{
          duration: 0.8,
        }}
        ref={svgRef}
        className={GlobeStyles.svg}
      >
        <circle
          className={GlobeStyles.circle}
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
              className={`${GlobeStyles.country} ${
                currentCountry?.id == id ? GlobeStyles.selected : ''
              }`}
            />
          ))}
        </g>
      </motion.svg>
    </div>
  );
}

export default Globe;
