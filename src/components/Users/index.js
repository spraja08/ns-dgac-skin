import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";
import Badge from 'aws-northstar/components/Badge';

function Users({ match }) {
  const { path } = match;
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
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
      id: "email",
      width: 200,
      Header: "Email",
      accessor: "email"
    },
    {
      id: "domains",
      width: 300,
      Header: "Business Domains",
      accessor: "domains",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const list = row.original.domains;
            return list.map( obj => {return <Badge content={obj}/>} );
        }
        return null;
      }  
    },
    {
      id: "roles",
      width: 300,
      Header: "Roles",
      accessor: "roles",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const list = row.original.roles;
            return list.map( obj => {return <Badge content={obj}/>} );
        }
        return null;
      }  
    },
  ];

  const handleEdit = () => {
    history.push(`/users/edit/${selectedUser[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/users/edit`);
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
   Service.getAll('users').then((result) => setUsers(result.data)); 
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="List of Users"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={users}
      onSelectionChange={setSelectedUser}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default Users;
