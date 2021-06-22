import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";
import Badge from 'aws-northstar/components/Badge';

function DGaC({ match }) {
  const { path } = match;
  const [dgac, setDgac] = useState(null);
  const [selectedDgac, setSelectedDgac] = useState(null);
  const history = useHistory();

  const columnDefinitions = [

    {
      id: "name",
      width: 300,
      Header: "Name",
      accessor: "name",
    },
    {
      id: "description",
      width: 400,
      Header: "Description",
      accessor: "description",
    },
    {
      id: "operation",
      width: 100,
      Header: "Operation",
      accessor: "operation",
    },
    {
      id: "category",
      width: 100,
      Header: "Category",
      accessor: "category",
    },
    {
      id: "udf",
      width: 200,
      Header: "UDF",
      accessor: "udf",
      Cell: ({ row  }) => {
        if (row && row.original) {
            return <Badge content={row.original.udf} />;
        }
        return null;
      }  
    },
  ];

  const handleEdit = () => {
    history.push(`/dgac/edit/${selectedDgac[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/dgac/edit`);
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
    Service.getAll('dgac').then((result) => setDgac(result.data));
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="Data Governace as Code Constructs"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={dgac}
      onSelectionChange={setSelectedDgac}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default DGaC;
