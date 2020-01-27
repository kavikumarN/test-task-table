import React, { useState } from "react";
import Loading from "./Loading";
import Table from "./Table";
import AdditionalInfo from "./AdditionalInfo";
import DataSelector from "./DataSelector";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState("desc");
  const [column, setColumn] = useState(null);
  const [row, setRow] = useState(null);
  const [isDataSelected, setIsDataSelected] = useState(false);

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (err) {
      setIsError(true);
      setError(err.message);
      console.log(error);
    }
    setIsLoading(false);
  }
  function compareBy(key) {
    return function(a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }
  function sortBy(key) {
    setDirection(direction === "asc" ? "desc" : "asc");
    const arrayCopy = data.concat();
    arrayCopy.sort(compareBy(key));
    if (direction === "asc") {
      setData(arrayCopy);
    } else {
      arrayCopy.reverse();
      setData(arrayCopy);
    }
    setColumn(key);
  }
  const setArrow = key => {
    let className = "sort-direction";

    if (key === column) {
      className += direction === "asc" ? " asc" : " desc";
    }

    return className;
  };
  const onSelect = row => {
    console.log(row);
    setRow(row);
  };
  function onChoose(url) {
    setIsDataSelected(true);
    setIsLoading(true);
    fetchData(url);
  }
  if (!isDataSelected) {
    return (
      <div className="container">
        <DataSelector onChoose={onChoose} />
      </div>
    );
  }
  return (
    <div className="container">
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          data={data}
          setArrow={setArrow}
          sortBy={sortBy}
          onSelect={onSelect}
        />
      )}

      {row ? <AdditionalInfo person={row} /> : null}
      {isError && (
        <div>
          <p>Ошибка: {error}</p>
          <h2>Извините, что-то пошло не так, попробуйте ещё раз</h2>
        </div>
      )}
    </div>
  );
}

export default App;
