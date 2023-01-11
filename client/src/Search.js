import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "./SearchForm";
import { getUrl } from "./useFetch";
import { isNullOrUndefined } from "./strings";

const Search = () => {
  const [data, setData] = useState({});
  const { search } = useParams(); //TODO
  const navigate = useNavigate();

  return (
    <div>
      <Form
        entity={search}
        onSubmitHandler={async (newNote) => {
          console.log({ newNote });
          const response = await fetch(
            getUrl("search?search=" + newNote.searchPhrase),
            {
              method: "GET",
            }
          );

          if (response.ok) {
            const items = await response.json();
            console.log(items);
            setData(items);
            navigate("/list");
          }
        }}
      />
    </div>
  );
};

export default Search;
