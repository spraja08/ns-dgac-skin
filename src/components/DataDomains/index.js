import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";
import Badge from 'aws-northstar/components/Badge';

function DataDomains({ match }) {
  const { path } = match;
  const [dataDomains, setDataDomains] = useState(null);
  const [selectedUser, setSelectedDataDomains] = useState(null);
  const history = useHistory();

  const columnDefinitions = [
    {
      id: "name",
      width: 200,
      Header: "Name",
      accessor: "name"
    },
    {
      id: "description",
      width: 500,
      Header: "Description",
      accessor: "description",
    },
    {
      id: "dataStoreNames",
      width: 200,
      Header: "Data Store Names",
      accessor: "dataStoreNames",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const list = row.original.dataStores;
            return list.map( obj => {return <Badge content={obj.name}/>} );
        }
        return null;
      },
    },
      {
        id: "dataStoreTypes",
        width: 200,
        Header: "Data Store Types",
        accessor: "dataStoreTypes",
        Cell: ({ row  }) => {
          if (row && row.original) {
              const list = row.original.dataStores;
              return list.map( obj => {return <Badge content={obj.type}/>} );
          }
          return null;
        } 
      } 
  ];

  const handleEdit = () => {
    history.push(`/dataDomains/edit/${selectedUser[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/dataDomains/edit`);
  };

  const tableActions = (
    <Inline>
      <Button onClick={() => alert("Delete button clicked")}>Delete</Button>
      <Button variant="primary" onClick={handleEdit}>
        Edit
      </Button>
      <Button variant="primary" onClick={handleCreate}>
        Add
      </Button>
    </Inline>
  );

  useEffect(() => {
    Service.getAll('businessDomains').then((result) => setDataDomains(result.data));
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="List of Business Domains"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={dataDomains}
      onSelectionChange={setSelectedDataDomains}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default DataDomains;
