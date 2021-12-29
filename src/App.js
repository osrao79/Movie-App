import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import "./App.css";

export const API_KEY = "a9118a3a";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  justify-content:space-around
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 300px;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
  length: 100px
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly; ;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

const Close = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: black;
  background: lightgray;
  height: fit-content;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(50);
  const [totalPosts, settotalPosts] = useState(0);
  const [state, setState] = useState(true);
  // const [currentPosts, setcurrentPosts] = useState(initialState)
  const [refresh, setRefresh] = useState(false)

  const [timeoutId, updateTimeoutId] = useState();

  const url =
    "https://d3dyfaf3iutrxo.cloudfront.net/general/upload/8cc907c1bb9b404e8cb181825938fc23-data.json";

  useEffect(() => {
    fetch(url, {
      "Access-Control-Allow-Origin": "https://localhost:3000",
    })
      .then((r) => r.json())
      .then((r) => {
        updateMovieList(r);
        settotalPosts(r.length);
      });
  }, [refresh]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    movieList && movieList.slice(indexOfFirstPost, indexOfLastPost);

useEffect(() => {
 console.log("called")
}, [state])

  console.log(currentPage);

useEffect(() => {
  updateMovieList((movieList) =>
      movieList.filter((x) => x.Title.includes(searchQuery))
    );
}, [searchQuery])

  const onTextChange = (e) => {
    updateSearchQuery(e.target.value);
    onMovieSelect("");
    console.log("called")
    
    // updateMovieList(movieList => movieList.filter(x => x.Year===Number(searchQuery)))
    // let data = []
    //   movieList.filter((item)=>{
    //  if (item.Title.includes(searchQuery)){
    //    data.push(item)
    //  }
    //  else if(item.Year===searchQuery){
    //   data.push(item)
    //  }
    //  updateMovieList(data)
    // })
  };
  // console.log()

const sortByTitle = ()=>{
  movieList.sort(function(a, b) {
    return a.Title.localeCompare(b.Title)
  });
  setState(!state)
}
const sortByIMDB = ()=>{
  movieList.sort(function(a, b) {
    return b.imdbRating.localeCompare(a.imdbRating)
  });
  console.log(movieList)
  setState(!state)
}

const sortByYear = ()=>{
  movieList.sort(function(a, b) {
    return a.Year.localeCompare(b.Year)
  });
  setState(!state)
}

  console.log(movieList.length);
  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="/react-movie-app/movie-icon.svg" />
          React Movie App
        </AppName>
        <SearchBox>
          
          <SearchIcon src="/react-movie-app/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
          {
            searchQuery.length> 0 ? <Close onClick={() => {setRefresh(!refresh) ;updateSearchQuery('')}}>X</Close> : null
          }
          
        </SearchBox>
      </Header>
      <div className="btn-cont">
        <div>Sort:</div>
        <button className="srt-btn" onClick={sortByTitle}>Title</button>
        <button className="srt-btn" onClick={sortByYear}>Year</button>
        <button className="srt-btn" onClick={sortByIMDB}>imdb Rating</button>
      </div>
      {selectedMovie && (
        <MovieInfoComponent
          selectedMovie={selectedMovie}
          onMovieSelect={onMovieSelect}
        />
      )}
      <MovieListContainer>
        {currentPosts?.length ? (
          currentPosts.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/react-movie-app/movie-icon.svg" />
        )}
      </MovieListContainer>
      <div className="divMAin">
        {pageNumbers.map((item) => {
          return (
            <button className="btn" onClick={() => paginate(item)}>
              {item}
            </button>
          );
        })}
      </div>
      {/* <div>Google</div> */}
    </Container>
  );
}

export default App;
