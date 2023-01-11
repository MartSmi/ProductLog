import React from 'react';
import TableList from "./TableList";
import {Link} from "react-router-dom";
import useFetch from "./useFetch";

const NoteList = () => {
  const {notes} = useFetch('note')

  return (
    <TableList
      data={notes}
      fieldFormatter={{
        title: (title, dataRow) => [
          <Link
            to={`/edit-note/${dataRow.id}`}
            key='1'
          >
            edit
          </Link>,
          <span key="2">
            &nbsp;{
              title
            }
          </span>
        ],
        dateCreated: date => new Date(date).toLocaleString()
      }}
    />
  );
};

export default NoteList;
