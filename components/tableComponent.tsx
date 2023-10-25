import React from 'react';

type TableProps = {
  data: { [key: string]: string };
};

const TableComponent: React.FC<TableProps> = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(data).map(([key, value], index) => (
        <tr key={index}>
          <td>{key}</td>
          <td>{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableComponent;