import { CsvToHtmlTable } from "react-csv-to-table";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Service from "../../services/Service";
import { useHistory } from "react-router";
import FormRenderer, {
  componentTypes,
  validatorTypes,
} from "aws-northstar/components/FormRenderer";
import Container from 'aws-northstar/layouts/Container';
import Stack from 'aws-northstar/layouts/Stack';

function Query({ match }) {
  const { path } = match;
  const [role, setRole] = useState(null);
  const history = useHistory();
  const [roleOptions, setRoleOptions] = useState([]);
  const [contract, setContract] = useState('');
  const [sqlResults, setSqlResults] = useState('');

  useEffect(() => {
    let tempRoleOptions = [];
    Service.getAll("roles").then((result) =>
      result.data.map((thisRole) => {
        let item = {};
        item["value"] = thisRole.id;
        item["label"] = thisRole.name;
        tempRoleOptions.push(item);
        setRoleOptions(tempRoleOptions);
      })
    );
  }, []);

  const ResultsReviewTemplate = (data) => {
    return (
      <CsvToHtmlTable
            data={sqlResults}
            csvDelimiter=","
            tableClassName="table table-striped table-hover"
          />
    );
  };

  const ContractReviewTemplate = (data) => {
    return (
      <CsvToHtmlTable
            data={contract}
            csvDelimiter=","
            tableClassName="table table-striped table-hover"
          />
    );
  };

  const schema = {
    fields: [
      {
        component: componentTypes.SUB_FORM,
        name: "querySection",
        fields: [
          {
            component: componentTypes.TEXTAREA,
            name: "sql",
            label: "Your SQL Here",
            isRequired: true,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
          },
          {
            component: componentTypes.SELECT,
            name: "selectedRole",
            label: "Select a Role",
            isRequired: true,
            options: roleOptions,
            multiSelect: false,
          },
        ],
      },
      {
        component: componentTypes.EXPANDABLE_SECTION,
        title: "Contract",
        name: "contractSection",
        variant: "container",
        fields: [
          {
            component: componentTypes.REVIEW,
            name: "contract",
            Template: ContractReviewTemplate,
          },
        ],
      },
      {
        component: componentTypes.SUB_FORM,
        name: "resultsSection",
        variant: "container",
        fields: [
          {
            component: componentTypes.REVIEW,
            name: "sqlResults",
            Template: ResultsReviewTemplate,
          },
        ],
      },

    ],
  };

  const onSubmit = async (params) => {
    let thisQuery = {
      sql: params.sql,
      role: params.selectedRole,
    };

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(thisQuery),
    };
    let thisurl = "http://54.254.182.252:5000/query";
    fetch(thisurl, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setSqlResults(data["results"]);
      })
      .catch(console.log);

      thisurl = "http://54.254.182.252:5000/contract";
      fetch(thisurl, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setContract(data["results"]);
        })
        .catch(console.log);
  };

  const onCancel = () => {
    history.push(`/query`);
  };

  return (
    <Container>
      <FormRenderer
        schema={schema}
        initialValues={role}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Container>
  );
}

export default withRouter(Query);
