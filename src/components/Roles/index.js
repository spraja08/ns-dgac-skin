import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";

function Roles({ match }) {
  const { path } = match;
  const [roles, setRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const history = useHistory();

  const columnDefinitions = [
    {
      id: "id",
      width: 200,
      Header: "Id",
      accessor: "id"
    },
    {
      id: "name",
      width: 200,
      Header: "Name",
      accessor: "name",
    },
    {
      id: "description",
      width: 600,
      Header: "Description",
      accessor: "description",
    },
  ];

  const handleEdit = () => {
    history.push(`/roles/edit/${selectedRole[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/roles/edit`);
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
    Service.getAll('roles').then((result) => setRoles(result.data));
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="List of Roles"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={roles}
      onSelectionChange={setSelectedRole}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default Roles;
