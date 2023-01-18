import React from "react";
import { useState } from "react";
import Form from "./SearchForm";
import { getUrl } from "./useFetch";
import TableList from "./TableList";
import FormEditItem from "./FormEditItem";

const Search = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const [itemClicked, setItemClicked] = useState("");
  const handleChange = (event) => {
    setSearchPhrase(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch(getUrl("search?search=" + searchPhrase), {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      const items = result["items"];
      console.log(items);
      setSearchResults(items);
    }
    setGotResponse(true);
    setIsSubmitting(false);
    itemClicked(0);
  };

  const itemOnClickHandler = (item) => {
    setItemClicked(item);
    console.log(searchResults.find((item) => item.EAN == itemClicked));
  };

  return (
    <div>
      <Form
        searchPhrase={searchPhrase}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
      <div>
        {itemClicked ? (
          <FormEditItem
            data={[searchResults.find((item) => item.EAN == itemClicked)]}
          />
        ) : !searchResults.length ? (
          gotResponse && <p>Found nothing</p>
        ) : (
          <TableList data={searchResults} onClickHandler={itemOnClickHandler} />
        )}
      </div>
    </div>
  );
};

export default Search;
