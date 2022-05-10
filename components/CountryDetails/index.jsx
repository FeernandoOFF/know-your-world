import { motion } from 'framer-motion';
import styles from './Country.module.css';
import { getSingleCountry, useGetSingleCountry } from '../../utils/api';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'd3';

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
      duration: 0.7,
      staggerChildren: 0.4,
      delay: 0.5,
      when: 'beforeChildren',
    },
  },
};
const dataPointVariants = {
  hidden: {
    opacity: 0,
  },
  selected: {
    opacity: 1,
    scale: 1.2,
    boxShadow: 'rgb(255 255 255 / 0.5) 0px 0px 7px 6px',
  },
  show: {
    opacity: 1,
    scale: 1,
  },
};

function CountryDetails({ country, setCurrentCountry }) {
  const [data, setData] = useState(null);
  const [dataActive, setDataActive] = useState('description');
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
              title={'General Data'}
              onClick={() => setDataActive('description')}
              selected={dataActive === 'description'}
            />
            <DataItem
              title={'Description'}
              onClick={() => setDataActive('data')}
              selected={dataActive === 'data'}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 2 } }}
              className={styles.textContainer}
            >
              <div>
                {dataActive === 'data' ? (
                  <p>{data.extract}</p>
                ) : (
                  <div>
                    <p>
                      <b>Capital:</b> {countryData?.capital}
                    </p>
                    <p>
                      <b>Population:</b> {format(',d')(countryData?.population)}
                    </p>
                    <p>
                      <b>Area:</b> {format(',d')(countryData?.area)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default CountryDetails;

const DataItem = ({ selected, onClick, title }) => {
  return (
    <motion.div
      variants={dataPointVariants}
      onClick={onClick}
      // animate={s ? 'selected' : 'show'}
      // initial={'hidden'}
      className={styles.dataPoint}
    >
      <div className={styles.dataItem}>{title} </div>
    </motion.div>
  );
};
