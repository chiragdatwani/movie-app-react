import React, { useState, useEffect } from "react";
import "./MovieInfo.css";
import MovieList from "./MovieList";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { addMovie } from "../actions/index";

function MovieInfo(props) {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [yt, setYt] = useState("");

  const addedToWatchlist =
    props.watchList.filter((movie) => movie.id == id).length > 0;

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=a1c8048951164cc08dff8c1ea6d7fcfc`
      );
      const ytResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=a1c8048951164cc08dff8c1ea6d7fcfc`
      );
      setMovie(response.data);

      setYt(ytResponse.data.results[0].key);
    }
    fetchData();
  }, [id]);
  return (
    <div className="page__container">
      <div className="movie_card">
        <div className="info_section">
          <div className="movie_header">
            <img
              className="locandina"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="movie-logo"
            />
            <h1>{movie.title}</h1>
            <h4>
              {movie.release_date
                ? movie.release_date.slice(0, 4)
                : "Loading..."}
            </h4>

            <p className="type">
              {movie.genres
                ? movie.genres.map((g) => g.name).join(", ")
                : "Loading..."}
            </p>
            <p className="minutes">{`${movie.runtime} min`}</p>
            {addedToWatchlist ? (
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "unset" }}
              >
                <Button variant="contained" color="secondary">
                  Added to WatchList
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  if (props.currentUser) {
                    props.addMovie(movie, props.currentUser.uid);
                  }
                  window.alert("Sign In to add to WatchList");
                }}
                variant="outlined"
                color="secondary"
              >
                Add to Watchlist
              </Button>
            )}
          </div>
          <div className="movie_desc">
            <p className="text">{movie.overview}</p>
            <div className="external-links">
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="imdb-logo"
                  src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                  alt="imdb-logo"
                />
              </a>
              <a
                href={`https://www.youtube.com/watch?v=${yt}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="yt-logo"
                  src="https://www.logo.wine/a/logo/YouTube/YouTube-White-Logo.wine.svg"
                  alt="youtube-logo"
                />
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`,
          }}
          className="blur_back bright_back"
        ></div>
      </div>
      <MovieList
        title="You might also like"
        fetchUrl={`https://api.themoviedb.org/3/movie/${id}/similar?api_key=a1c8048951164cc08dff8c1ea6d7fcfc`}
        trim
        red
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    watchList: state.watchlist,
  };
};
export default connect(mapStateToProps, { addMovie })(MovieInfo);
