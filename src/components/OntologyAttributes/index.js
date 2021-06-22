import React, { useState, useEffect } from "react";
import Service from "../../services/Service";
import Table from "aws-northstar/components/Table";
import Button from "aws-northstar/components/Button";
import Inline from "aws-northstar/layouts/Inline";
import { useHistory } from "react-router";
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Badge from 'aws-northstar/components/Badge';

function OntologyAttributes({ match }) {
  const { path } = match;
  const [ontologyAttributes, setOntologyAttributes] = useState(null);
  const [selectedOntologyAttribute, setSelectedOntologyAttribute] = useState(null);
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
      width: 250,
      Header: "Description",
      accessor: "description",
    },
    {
      id: "type",
      width: 100,
      Header: "Type",
      accessor: "type",
    },
    {
      id: "governed",
      width: 100,
      Header: "Governed",
      accessor: "governed",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const status = row.original.governed;
            if( status == true )
                return <StatusIndicator  statusType='positive'></StatusIndicator>;
            else
                return <StatusIndicator  statusType='negative'></StatusIndicator>;
        }
        return null;
    }
    },
    {
      id: "PII",
      width: 50,
      Header: "PII",
      accessor: "PII",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const status = row.original.PII;
            if( status == true )
                return <StatusIndicator  statusType='positive'></StatusIndicator>;
            else
                return <StatusIndicator  statusType='negative'></StatusIndicator>;
        }
        return null;
      }  
    },
    {
      id: "synonyms",
      width: 300,
      Header: "Synonyms",
      accessor: "Synonyms",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const status = row.original.synonyms;
            return status.map( function(obj) {return <Badge content={obj.name} />} );
        }
        return null;
      }  
    },
    {
      id: "domains",
      width: 200,
      Header: "Domains",
      accessor: "domains",
      Cell: ({ row  }) => {
        if (row && row.original) {
            const status = row.original.domains;
            return status.map( function(obj) {return <Badge content={obj} />} );
        }
        return null;
      } 
    },
  ];

  const handleEdit = () => {
    history.push(`/ontologyAttributes/edit/${selectedOntologyAttribute[0].id}`);
  };

  const handleCreate = () => {
    alert("Create button clicked");
    history.push(`/ontologyAttributes/edit`);
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
    Service.getAll('ontologyAttributes').then((result) => setOntologyAttributes(result.data));
  }, []);

  return (
    <Table
      actionGroup={tableActions}
      tableTitle="List of Ontology Attributes"
      multiSelect={false}
      columnDefinitions={columnDefinitions}
      items={ontologyAttributes}
      onSelectionChange={setSelectedOntologyAttribute}
      getRowId={React.useCallback((data) => data.id, [])}
    />
  );
}

export default OntologyAttributes;
