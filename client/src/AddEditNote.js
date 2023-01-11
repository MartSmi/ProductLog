import React from 'react';
import {useParams, useNavigate} from "react-router-dom";
import RenderData from "./RenderData";
import Form from './Form';
import useFetch, {getUrl} from "./useFetch";
import {isNullOrUndefined} from "./strings";

const AddEditNote = () => {
  const {noteId} = useParams();
  const {note = {
    title: '',
    content: '',
    lang: '',
    isLive: false,
    category: '',
    author: '',
  }} = useFetch('note/' + noteId, isNullOrUndefined(noteId));
  const navigate = useNavigate();

  return (
    <div>
      <RenderData
        data={note}
      />
      <Form
        entity={note}
        onSubmitHandler={async newNote => {
          console.log({newNote})
          const response = await fetch(getUrl('note'), {
            method: isNullOrUndefined(newNote.id) ? 'POST' : 'PUT',
            body: JSON.stringify(newNote),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            await response.json()
            navigate('/note-list')
          }
        }}
        onDeleteHandler={async (id) => {
          if (!isNullOrUndefined(id)) {
            await fetch(getUrl('note'), {
              method: 'DELETE',
              body: JSON.stringify({id}),
              headers: {
                'Content-Type': 'application/json'
              }
            });

            navigate('/note-list')
          }
        }}
      />
    </div>
  );
};

export default AddEditNote;
