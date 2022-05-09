import { motion } from 'framer-motion';
import styles from './Country.module.css';
import { getSingleCountry, useGetSingleCountry } from '../../utils/api';
import { useEffect, useState } from 'react';
import axios from 'axios';

const descriptionVariants = {
  hidden: {
    x: -300,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

const dataLineVariants = {
  hidden: {
    height: '0%',
  },
  show: {
    height: '500px',
    transition: {
      duration: 0.8,
      staggerChildren: 0.3,
      delay: 0.5,
      when: 'beforeChildren',
    },
  },
};

function CountryDetails({ country, setCurrentCountry }) {
  const [data, setData] = useState(null);
  const [dataActive, setDataActive] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (!country) return;
    axios(
      'https://en.wikipedia.org/api/rest_v1/page/summary/' + country.name
    ).then(({ data }) => {
      setData(data);
    });

    axios('https://restcountries.com/v2/alpha/' + country.alpha).then(
      ({ data: d }) => {
        setCountryData(d);
      }
    );
  }, [country]);
  return (
    <motion.div
      variants={descriptionVariants}
      transition={{ duration: 1, delay: 0.2 }}
      initial="hidden"
      animate="show"
      className={styles.container}
    >
      {data && (
        <div className={styles.dataContainer}>
          <div className={styles.top}>
            <div className={styles.title}>
              <img
                src={data.thumbnail.source}
                alt={data.name}
                width={80}
                height={40}
              />
              <h3> {country.name} </h3>
            </div>
            <button
              style={{
                background: 'transparent',
                color: 'white',
                fontSize: '2rem',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentCountry(null)}
            >
              X
            </button>
          </div>
          <motion.div variants={dataLineVariants} className={styles.dataLine}>
            <DataItem
              onClick={() => setDataActive(1)}
              selected={1 == dataActive}
              clear={() => {
                setDataActive(null);
              }}
              data={<p> {data.extract} </p>}
              title={'Resume'}
            />
            <DataItem
              onClick={() => setDataActive(2)}
              selected={2 == dataActive}
              clear={() => {
                setDataActive(null);
              }}
              data={
                <div>
                  {/* <p>{JSON.stringify(countryData)} </p> */}
                  <p>Capital: {countryData?.capital} </p>
                  <p>Population: {countryData?.population} </p>
                  <p>Area: {countryData?.area} </p>
                </div>
              }
              title={'General Data'}
            />
          </motion.div>

          {/* <div className={styles.description}>
            <p>{data.extract} </p>
          </div> */}
          {/* <img src={data.originalimage.source} alt="" /> */}
        </div>
      )}
    </motion.div>
  );
}

export default CountryDetails;

const DataItem = ({ selected, data, onClick, title, clear }) => {
  const dataItemVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
    },
  };
  return (
    <motion.div
      variants={dataItemVariants}
      className={styles.dataItem}
      onClick={onClick}
    >
      {!selected && (
        <p
          style={{
            position: 'absolute',
            right: '3rem',
            top: '-80%',
            fontSize: '1.2rem',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {title}
        </p>
      )}
      {selected && (
        <div className={styles.itemContent}>
          <button
            onClick={clear}
            style={{
              background: 'transparent',
              float: 'right',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            x
          </button>
          {data}
        </div>
      )}
    </motion.div>
  );
};
