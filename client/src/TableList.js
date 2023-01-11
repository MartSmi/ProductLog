import React from 'react';
import {titleFromName} from './strings';
import './table-list.css';

const TableList = ({
                     data,
                     title,
                     onClickHandler,
                     idField = 'id',
                     fieldFormatter = {},
                   }) => {
  if (!data || data.length === 0) {
    return null
  }
  const firstRow = data[0];
  const dataColumnNamesToRender = Object.getOwnPropertyNames(firstRow)
    .filter(propName => propName !== idField);

  const headerRow = dataColumnNamesToRender.map((propName, i) => <th
    key={i}
  >
    {
      titleFromName(propName)
    }
  </th>);

  return (
    <table>
      <caption>
        {
          title
        }
      </caption>
      <thead>
      <tr>
        {
          headerRow
        }
      </tr>
      </thead>
      <tbody>
      {
        data.map((dataRow, i) => <tr
          key={i}
          onClick={() => onClickHandler && onClickHandler(dataRow[idField])}
        >
          {
            dataColumnNamesToRender.map((dataColumnName, i) => <td
              key={i}
            >
              {
                (fieldFormatter[dataColumnName] ?? (v => v))(dataRow[dataColumnName], dataRow)
              }
            </td>)
          }
        </tr>)
      }
      </tbody>
    </table>
  );
};

export default TableList;
