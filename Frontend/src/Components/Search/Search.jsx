import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";
import "./search.css";
import axios from "axios";
import Result from "../Result/Result";

import { sym } from "./data";

const Search = () => {
  const valueGabber = useRef("");
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [trackList, setTrackList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [predictedList, setPredictedList] = useState([]);

  useEffect(() => {
    const filtered = sym.filter((item) => toFilter(item));
    const newFiltered = filtered.slice(0, 10);
    setData(newFiltered);
  }, [text]);

  useEffect(() => {
    const fetchApi = async () => {
      const postData = { list: trackList };
      try {
        const res = await axios.post("http://127.0.0.1:5000/", postData);
        console.log(res["data"]);
        setPredictedList(res["data"]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, [trackList]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = (e) => {
    const { value } = e.target.dataset;
    const newList = [value, ...trackList];
    console.log(value);
    setIsFocused(false);
    setTrackList(newList);
  };

  const removeBtn = (e) => {
    const { value } = e.target.dataset;
    const newList = [...trackList];
    console.log(value);
    const index = newList.indexOf(value);
    if (index > -1) {
      // only splice array when item is found
      newList.splice(index, 1); // 2nd parameter means remove one item only
    }
    setTrackList(newList);
  };

  const handleBlur = () => {
    if (isFocused) {
      const timer = setTimeout(() => {
        setIsFocused(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  };

  const toFilter = (item) => {
    try {
      if (item.substring(0, text.length).toLowerCase() === text.toLowerCase()) {
        return item;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      
      <div className="searchContainer">
        <input
          type="text"
          className="searchInput"
          placeholder="Symptoms"
          ref={valueGabber}
          onChange={(e) => handleChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
        {/* <FaSearch
          style={{ fontSize: "30px", marginTop: "10px", marginLeft: "-10px" }}
        /> */}
      </div>

      <div
        className="displayContainer"
        style={isFocused ? { display: "block" } : { display: "none" }}
      >
        {data.map((item) => {
          return (
            <div className="showContainer" key={item}>
              <FaSearch style={{ paddingTop: "10px", fontSize: "30px" }} />
              <button
                className="showContainer"
                style={{ backgroundColor: "transparent" }}
                key={item}
                data-value={item}
                onClick={handleClick}
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      <div className="selectedContainer">
        {trackList.map((item) => {
          return (
            <div className="selectedItems" key={item}>
              <p
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  paddingTop: "20px",
                }}
              >
                {item}
              </p>

              <ImCross
                onClick={removeBtn}
                data-value={item}
                style={{
                  fontSize: "20px",
                  marginTop: "25px",
                  cursor: "pointer",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="resultContainer">
        {predictedList.map((item) => {
          const { disease, sym } = item;
          return (
            <>
              <Result key={item} disease={disease} sym={sym} />
            </>
          );
        })}
      </div>
    </>
  );
};

export default Search;
