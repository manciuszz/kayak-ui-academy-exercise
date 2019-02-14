import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './autocomplete.css';

const MIN_INPUT = 3;
const MAX_RESULTS = 8;

const FilmStripIcon = params => (
  <svg width="30px" height="30px" version="1.1" viewBox="0 0 485.211 485.21" xmlns="http://www.w3.org/2000/svg" className={params.className}>
    <path d="m333.59 242.6l-181.96 90.979v-181.96l181.96 90.978zm151.62-212.28v424.56h-485.21v-424.56h485.21zm-181.96 60.651h60.653v-30.327h-60.653v30.327zm-90.973 0h60.65v-30.327h-60.65v30.327zm-90.978 0h60.651v-30.327h-60.651v30.327zm-90.977 0h60.651v-30.327h-60.651v30.327zm60.651 303.26h-60.651v30.322h60.651v-30.322zm90.977 0h-60.651v30.322h60.651v-30.322zm90.978 0h-60.65v30.322h60.65v-30.322zm90.975 0h-60.653v30.322h60.653v-30.322zm90.981 0h-60.653v30.322h60.653v-30.322zm0-272.93h-424.56v242.6h424.56v-242.6zm0-60.653h-60.653v30.327h60.653v-30.327z"/>
  </svg>
);

const SearchIcon = params => (
  <svg width="30px" height="30px" version="1.1" viewBox="0 0 56.966 56.966" xmlns="http://www.w3.org/2000/svg" className={params.className}>
    <path d="m55.146 51.887l-13.558-14.101c3.486-4.144 5.396-9.358 5.396-14.786 0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c0.571 0.593 1.339 0.92 2.162 0.92 0.779 0 1.518-0.297 2.079-0.837 1.192-1.147 1.23-3.049 0.083-4.242zm-31.162-45.887c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"/>
  </svg>
);

const Autocomplete = () => {
  const [state, setState] = useState({ query: '', movies: [], active: false, hint: '' });

  const updateState = newState =>
    new Promise(resolve => {
      setState(prevState => {
        const mergedState = {
          ...prevState,
          ...newState
        };
        resolve(mergedState);
        return mergedState;
      });
    });

  const addMovies = movies =>
    updateState({
      movies: movies.slice(0, MAX_RESULTS),
      hint: movies.length === 0 ? 'No results found' : ''
    });

  const completeQuery = query =>
    `https://api.themoviedb.org/3/search/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&query=${query}&page=1&include_adult=false`;

  const fetchMovies = query =>
    fetch(completeQuery(query))
      .then(res => res.json())
      .then(res => addMovies(res.results));

  const handleChange = ({ target: { value } }) => {
    const inputLength = value.trim().length;
    updateState({
      query: value,
      active: inputLength > 0,
      hint: inputLength < MIN_INPUT ? 'Search phrase must be at least 3 characters long' : '',
      movies: inputLength < MIN_INPUT ? [] : state.movies
    }).then(newState => {
      const query = newState.query.replace(/\s+/g, ' ').trim();
      // if (newState.query.length === query.length) { ... } // Probably a bad query input
      if (query && !newState.hint) {
        return fetchMovies(query);
      }
    });
  };

  const setItem = title =>
    updateState({
      query: title,
      active: false
    });

  const MovieBlock = ({ id, title, vote_average, release_date }) => (
    <div className={styles.item} key={id} onClick={() => setItem(title)}>
      <div className={styles.item__name}>{title}</div>
      <div className={styles.item__info}>{`${parseFloat(vote_average).toFixed(1)} Rating, ${release_date.slice(0, 4)}`}</div>
    </div>
  );

  MovieBlock.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.number
  };

  MovieBlock.defaultProps = {
    id: PropTypes.number,
    title: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.number
  };

  const SearchBlock = properties =>
    !properties.active && (
      <div className={`${styles.icon__wrap} ${styles['icon--search']}`}>
        <SearchIcon className={styles.icon} />
      </div>
    );

  const MovieList = properties =>
    properties.active && (
      <div className={styles.movieList}>
        {properties.hint && <div className={`${styles.item} ${styles.item__name}`}>{properties.hint}</div>}
        {properties.movies.map(MovieBlock)}
      </div>
    );

  const InputBlock = properties => (
    <div className={properties.active ? styles.input__wrap : ''}>
      {properties.active && (
        <div className={`${styles.icon__wrap} ${styles.icon__inputWrap}`}>
          <FilmStripIcon className={`${styles.icon} ${styles['icon--black']}`} />
        </div>
      )}
      <input autoFocus={properties.active} autoComplete="off" value={properties.query} onChange={handleChange} className={styles[!properties.active ? 'input' : 'input--active']} placeholder="Enter a movie name" />
      {properties.active && <div className={styles.item__hint}>Enter a movie name</div>}
    </div>
  );

  const SearchBar = properties => (
    <div className={styles.searchBar}>
      <div className={styles.icon__wrap}>
        <FilmStripIcon className={`${styles.icon} ${styles['icon--white']}`} />
      </div>
      <InputBlock {...properties} />
    </div>
  );

  const Content = properties => (
    <div className={`${styles.content} ${!properties.active ? styles['content--active'] : ''}`}>
      <SearchBar {...properties} />
      <MovieList {...properties} />
      <SearchBlock {...properties} />
    </div>
  );

  return (
    <div className={styles.container}>
      <Content {...state} />
    </div>
  );
};

export default Autocomplete;
