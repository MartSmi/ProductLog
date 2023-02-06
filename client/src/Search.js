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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const [itemClicked, setItemClicked] = useState(null);
  const [isItemUpdating, setIsItemUpdating] = useState(false);

  const handleSubmit = async (searchPhrase) => {
    const response = await fetch(
      getUrl("search?search=" + searchPhrase.trim()),
      {
        method: "GET",
      }
    );

    setItemClicked(null);
    if (response.ok) {
      const result = await response.json();
      const items = result["items"];
      console.log(items);
      setSearchResults(items);
      if (items.length === 1) {
        setItemClicked(items[0]);
      }
    }
    setGotResponse(true);
    setIsSubmitting(false);
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

  function showItems() {
    if (gotResponse) {
      if (!searchResults.length) {
        return <p>Found nothing</p>;
      } else if (itemClicked !== null) {
        return (
          <FormEditItem
            item={searchResults.find((item) => item.EAN == itemClicked.EAN)}
            handleItemUpdate={handleItemUpdate}
            isItemUpdating={isItemUpdating}
          />
        );
      } else if (searchResults.length) {
        return (
          <TableList
            items={searchResults}
            onClickHandler={itemOnClickHandler}
          />
        );
      }
    }
  }
  return (
    <div>
      <SearchForm
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
      <div>{showItems()}</div>
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
