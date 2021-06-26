import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";
import Badge from 'aws-northstar/components/Badge';

function OntologyAttributes({ match }) {
  const { path } = match;
  const [dataProducts, setDataProducts] = useState(null);
  const [selectedDataProduct, setSelectedDataProduct] = useState(null);
  const history = useHistory();

  const columnDefinitions = [
    {
      id: "name",
      width: 150,
      Header: "Name",
      accessor: "name",
    },
    {
      id: "description",
      width: 300,
      Header: "Description",
      accessor: "description",
    },
    {
      id: "domain",
      width: 150,
      Header: "Domain",
      accessor: "domain"
    },
    {
      id: "dataStore",
      width: 150,
      Header: "Data Store",
      accessor: "dataStore"
    },
    {
      id: "owner",
      width: 100,
      Header: "Owner",
      accessor: "owner",
    },
    {
      id: "searchTerms",
      width: 300,
      Header: "Synonyms",
      accessor: "searchTerms",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const status = row.original.searchTerms;
            return status.map( function(obj) {return <Badge content={obj.name} />} );
        }
        return null;
      }  
    },
  ];

  const handleEdit = () => {
    history.push(`/dataProducts/edit/${selectedDataProduct[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/dataProducts/edit`);
  };

  const tableActions = (
    <Inline>
      <Button onClick={() => alert("Delete button clicked")}>Delete</Button>
      <Button variant="primary" onClick={handleEdit}>
        Edit
      </Button>
      <Button variant="primary" onClick={handleCreate}>
        Register
      </Button>
    </Inline>
  );

  useEffect(() => {
    Service.getAll('dataProducts').then((result) => setDataProducts(result.data));
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="List of Data Products"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={dataProducts}
      onSelectionChange={setSelectedDataProduct}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default OntologyAttributes;
