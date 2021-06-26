import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Service from "../../services/Service";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import FormRenderer, {
  componentTypes,
  validatorTypes,
} from "aws-northstar/components/FormRenderer";
import Container from "aws-northstar/layouts/Container";
import ColumnLayout, { Column } from "aws-northstar/layouts/ColumnLayout";
import Stack from "aws-northstar/layouts/Stack";
import KeyValuePair from "aws-northstar/components/KeyValuePair";
import Badge from "aws-northstar/components/Badge";
import Inline from "aws-northstar/layouts/Inline";
import Text from "aws-northstar/components/Text";
import MarkdownViewer from "aws-northstar/components/MarkdownViewer";

function EditDataProduct({ match }) {
  const { path } = match;
  const [dataProduct, setDataDomain] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [metaDataOptions, setMetaDataOptions] = useState([]);
  const [ontologyAttributeOptions, setOntologyAttributeOptions] = useState([]);
  const [ontologyAttributes, setOntologyAttributes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [dataDomainOptions, setDataDomainOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [dgacs, setDgacs] = useState([]);

  const history = useHistory();
  const { dataProductId } = useParams();

  useEffect(() => {
    Service.getResourceById("dataProducts", dataProductId).then((result) => {
      setDataDomain(result.data);
      setMetaData(result.data["columns"]);

      let options = [];
      result.data["columns"].map((obj) => {
        let item = {};
        item["value"] = obj.id;
        item["label"] = obj.name;
        options.push(item);
        setMetaDataOptions(options);
      });
    });

    let tempOptions = [];
    let options = {};
    Service.getAll("ontologyAttributes").then((result) =>
      result.data.map((thisItem) => {
        let item = {};
        item["value"] = thisItem.id;
        item["label"] = thisItem.name;
        tempOptions.push(item);
        options[thisItem.id] = thisItem;
        setOntologyAttributeOptions(tempOptions);
        setOntologyAttributes(options);
      })
    );

    let domainOptions = [];
    Service.getAll("businessDomains").then((result) =>
      result.data.map((thisItem) => {
        let item = {};
        item["value"] = thisItem.id;
        item["label"] = thisItem.name;
        domainOptions.push(item);
        setDataDomainOptions(domainOptions);
      })
    );

    let userOptions = [];
    Service.getAll("users").then((result) =>
      result.data.map((thisItem) => {
        let item = {};
        item["value"] = thisItem.id;
        item["label"] = thisItem.name;
        userOptions.push(item);
        setUserOptions(userOptions);
      })
    );

    let allRoles = {};
    Service.getAll("roles").then((result) =>
      result.data.map((thisItem) => {
        allRoles[thisItem.id] = thisItem.name;
        setRoles(allRoles);
      })
    );

    Service.getAll("dgac").then((result) => {
      let allDgacs = {};
      result.data.map((thisDgac) => {
        let item = {};
        allDgacs[thisDgac.id] = thisDgac.name;
        setDgacs(allDgacs);
      });
    });
  }, []);

  const onSubmit = async (params) => {
    params['columns'] = metaData;
    const success = await Service.updateResourceById(
      "dataProducts",
      params,
      params.id
    );
    console.log(success);
    if (success.status === 200) history.push(`/dataProducts`);
  };

  const onCancel = () => {
    history.push(`/dataProducts`);
  };

  const synonyms = (jsonData) => {
    return (
      <Inline>
        {jsonData["searchTerms"].map((obj) => {
          return <Badge content={obj.name} />;
        })}
      </Inline>
    );
  };

  const domains = (jsonData) => {
    return (
      <Inline>
        {jsonData["domains"].map((obj) => {
          return <Badge content={obj} />;
        })}
      </Inline>
    );
  };

  const privacyRules = (jsonData, valueName) => {
    if (jsonData != null && Object.keys(jsonData).length > 0)
      return jsonData.map((obj) => {
        return (
          <KeyValuePair
            label={roles[obj["roles"]]}
            value={
              <Badge
                content={
                  dgacs[obj[valueName]] != null
                    ? dgacs[obj[valueName]]
                    : obj[valueName]
                }
              />
            }
          ></KeyValuePair>
        );
      });
    else return;
  };

  const tableMetaData = () => {
    if (metaData != null && Object.keys(metaData).length > 0)
      return metaData.map((obj) => (
        <KeyValuePair
          label={obj["id"] + " (" + obj["type"] + ")"}
          value=" "
        ></KeyValuePair>
      ));
    else return;
  };

  const ontologyMapping = (dgacMapping) => {
    if (dgacMapping != null && Object.keys(dgacMapping).length > 0)
      return dgacMapping.map((obj, index) => {
        return (
          <stack>
            <KeyValuePair
              label={index+1 + ') ' + obj["columnId"] + " is mapped to " + ontologyAttributes[obj["DGaCMapping"]]["name"]}
              value={privacyRules(ontologyAttributes[obj["DGaCMapping"]]["DGac"]["columnMasking"],"dgac")}
            ></KeyValuePair>
          </stack>
        );
      });
    else return;
  };

  const ReviewTemplate = (data) => {
    let jsonData = data["data"];
    return (
      <Stack>
        <Container>
          <ColumnLayout>
            <Column>
              <Stack>
                <KeyValuePair label="Id" value={jsonData["id"]}></KeyValuePair>
                <KeyValuePair
                  label="Name"
                  value={jsonData["name"]}
                ></KeyValuePair>
                <KeyValuePair
                  label="Description"
                  value={jsonData["description"]}
                ></KeyValuePair>
              </Stack>
            </Column>
            <Column>
              <Stack>
                <KeyValuePair
                  label="Domain"
                  value={jsonData["domain"]}
                ></KeyValuePair>
                <KeyValuePair
                  label="Owner"
                  value={jsonData["owner"]}
                ></KeyValuePair>
                <KeyValuePair
                  label="Synonyms"
                  value={synonyms(jsonData)}
                ></KeyValuePair>
              </Stack>
            </Column>
          </ColumnLayout>
        </Container>
        <Container>
          <ColumnLayout>
            <Column>
              <Stack>
                <Text>MetaData</Text>
                {tableMetaData(jsonData["columns"])}
              </Stack>
            </Column>
            <Column>
              <Stack>
                <Text>Data Governance Mapping</Text>
                {ontologyMapping(jsonData["dgacMapping"])}
              </Stack>
            </Column>
          </ColumnLayout>
        </Container>
        <Container>
          <ColumnLayout>
            <Column>
              <Stack>
                <MarkdownViewer>{jsonData["documentation"]}</MarkdownViewer>
              </Stack>
            </Column>
          </ColumnLayout>
        </Container>
      </Stack>
    );
  };

  const schema = {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "wizard",
        fields: [
          {
            name: "summary",
            title: "Summary",
            fields: [
              {
                component: componentTypes.TEXT_FIELD,
                name: "id",
                label: "ID",
                validate: [
                  {
                    type: validatorTypes.REQUIRED,
                  },
                ],
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "name",
                label: "Name",
                validate: [
                  {
                    type: validatorTypes.REQUIRED,
                  },
                ],
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "description",
                label: "Description",
                validate: [
                  {
                    type: validatorTypes.REQUIRED,
                  },
                ],
              },
              {
                component: componentTypes.SELECT,
                name: "businessDomain",
                label: "Domain",
                options: dataDomainOptions,
                multiSelect: false,
              },
              {
                component: componentTypes.SELECT,
                name: "businessOwner",
                label: "Owner",
                options: userOptions,
                multiSelect: false,
              },
              {
                component: componentTypes.FIELD_ARRAY,
                label: "Search Terms",
                name: "searchTerms",
                noItemsMessage: "Please add new item",
                fields: [
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "name",
                    label: "Values",
                  },
                ],
              },
              {
                component: componentTypes.TEXTAREA,
                name: "documentation",
                label: "Documentatoin",
              },
            ],
          },
          {
            name: "metaData",
            title: "MetaData",
            fields: [
              {
                component: componentTypes.TABLE,
                name: "columns",
                label: "Columns",
                items: metaData,
                columnDefinitions: [
                  {
                    id: "id",
                    width: 200,
                    Header: "Id",
                    accessor: "id",
                  },
                  {
                    id: "name",
                    width: 200,
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    id: "type",
                    width: 200,
                    Header: "Data Type",
                    accessor: "type",
                  },
                ],
              },
            ],
          },
          {
            name: "dgacMappingSection",
            title: "Data Governance Mapping (DGaC)",
            fields: [
              {
                component: componentTypes.FIELD_ARRAY,
                name: "dgacMapping",
                noItemsMessage: "Please add new item",
                fields: [
                  {
                    component: componentTypes.SELECT,
                    name: "columnId",
                    label: "Column",
                    options: metaDataOptions,
                    multiSelect: false,
                  },
                  {
                    component: componentTypes.SELECT,
                    name: "DGaCMapping",
                    label: "Ontology Mapping",
                    options: ontologyAttributeOptions,
                    multiSelect: false,
                  },
                ],
              },
            ],
          },
          {
            name: "Review and Submit",
            title: "Review and Submit",
            fields: [
              {
                component: componentTypes.REVIEW,
                name: "review",
                Template: ReviewTemplate,
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <FormRenderer
      schema={schema}
      initialValues={dataProduct}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
export default withRouter(EditDataProduct);
