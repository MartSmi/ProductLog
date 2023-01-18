import React from "react";
import { useState } from "react";
import SearchForm from "./SearchForm";
import { getUrl } from "./useFetch";
import TableList from "./TableList";
import FormEditItem from "./FormEditItem";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Box from "@mui/material/Box";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
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

  const importAction = () => {
    axios.put(getUrl("import"));
  };

  const exportAction = () => {
    axios.put(getUrl("export"));
  };

  const actions = [
    { icon: <DownloadIcon />, name: "Import", onClick: importAction },
    { icon: <UploadIcon />, name: "Export", onClick: exportAction },
  ];

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
      <Box
        sx={{
          height: 320,
          transform: "translateZ(0px)",
          flexGrow: 1,
          position: "fixed",
          bottom: 0,
          right: 0,
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            position: "fixed",
            bottom: "5vw",
            right: "5vh",
          }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>
    </div>
  );
};

export default Search;
