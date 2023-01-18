import React from "react";
import { useState } from "react";
import SearchForm from "./SearchForm";
import { getUrl } from "./useFetch";
import TableList from "./TableList";
import FormEditItem from "./FormEditItem";
import axios from "axios";

const Search = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const [itemClicked, setItemClicked] = useState(null);
  const [isItemUpdating, setIsItemUpdating] = useState(false);

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
    setItemClicked(null);
  };

  const itemOnClickHandler = (item) => {
    setItemClicked(item);
    console.log(item);
  };

  const handleItemUpdate = (quantity) => {
    setIsItemUpdating(true);
    axios
      .put(getUrl("update"), {
        item: {
          name: itemClicked.name,
          EAN: itemClicked.EAN,
          artNumber: itemClicked.artNumber,
          store: itemClicked.store,
          quantity,
        },
      })
      .then((resp) => {
        searchResults.forEach((item) => {
          if (item.EAN === itemClicked.EAN) {
            item.quantity = quantity;
          }
        });
        setIsItemUpdating(false);
      });
  };

  return (
    <div>
      <SearchForm
        searchPhrase={searchPhrase}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
      <div>
        {itemClicked !== null ? (
          <FormEditItem
            item={searchResults.find((item) => item.EAN == itemClicked.EAN)}
            handleItemUpdate={handleItemUpdate}
            isItemUpdating={isItemUpdating}
          />
        ) : !searchResults.length ? (
          gotResponse && <p>Found nothing</p>
        ) : (
          <TableList
            items={searchResults}
            onClickHandler={itemOnClickHandler}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
