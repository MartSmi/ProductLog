import React from "react";
import { useState } from "react";
import Form from "./SearchForm";
import { getUrl } from "./useFetch";
import { isNullOrUndefined } from "./strings";
import TableList from "./TableList";

const Search = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
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
        {!searchResults.length ? (
          gotResponse && <p>Found nothing</p>
        ) : (
          <TableList data={searchResults} />
        )}
      </div>
    </div>
  );
};

export default Search;
