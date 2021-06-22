import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Service from "../../services/Service";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import FormRenderer, {
  componentTypes,
  validatorTypes,
} from "aws-northstar/components/FormRenderer";
import Container from 'aws-northstar/layouts/Container';
import ColumnLayout, { Column } from 'aws-northstar/layouts/ColumnLayout';
import Stack from 'aws-northstar/layouts/Stack';
import KeyValuePair from 'aws-northstar/components/KeyValuePair';
import Badge from 'aws-northstar/components/Badge';
import Inline from 'aws-northstar/layouts/Inline';
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Text from 'aws-northstar/components/Text';


function EditOntologyAttributes({ match }) {
  const { path } = match;
  const [ontologyAttribute, setOntologyAttribute] = useState(null);
  const [roleOptions, setRoleOptions] = useState(null);
  const [dgacPrivacyOptions, setDgacPrivacyOptions] = useState(null);
  const [dgacQualityOptions, setDgacQualityOptions] = useState(null);
  const history = useHistory();
  const { ontologyAttributeId } = useParams();

  useEffect(() => {
    Service.getResourceById("ontologyAttributes", ontologyAttributeId).then(
      (result) => setOntologyAttribute(result.data)
    );

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

    let tempDgacOptions = [];
    let tempDgacQualityOptions = [];

    Service.getAll("dgac").then((result) =>
      result.data.map((thisDgac) => {
        let item = {};
        item["value"] = thisDgac.id;
        item["label"] = thisDgac.name;
        if (thisDgac.category === "Privacy") {
          tempDgacOptions.push(item);
          setDgacPrivacyOptions(tempDgacOptions);
        } else {
          tempDgacQualityOptions.push(item);
          setDgacQualityOptions(tempDgacQualityOptions);
        }
      })
    );
  }, []);

  const onSubmit = async (params) => {
    const success = await Service.updateResourceById(
      "ontologyAttributes",
      params,
      params.id
    );
    console.log(success);
    if (success.status === 200) 
        history.push(`/ontologyAttributes`);
  };

  const onCancel = () => {
    history.push(`/ontologyAttributes`);
  };

  const synonyms = (jsonData) => {
    return (
    <Inline>
    {jsonData['synonyms'].map( ( obj ) => {return <Badge content={obj.name} />} ) }
    </Inline>
    );
  }

  const domains = (jsonData) => {
    return (
    <Inline>
    {jsonData['domains'].map( ( obj ) => {return <Badge content={obj} />} ) }
    </Inline>
    );
  }

  const statusInd = (status) => {
    if( status == true )
      return <StatusIndicator  statusType='positive'></StatusIndicator>;
    else
      return <StatusIndicator  statusType='negative'></StatusIndicator>;  
  }

  const privactRules = (jsonData, valueName) => {
    if(jsonData != null && Object.keys(jsonData).length > 0)
        return jsonData.map( ( obj ) => {return <KeyValuePair label={obj['roles']} value={obj[valueName]}></KeyValuePair> });
    else
        return;    
  }

  const qualityRules = (jsonData) => {
    if(jsonData != null && Object.keys(jsonData).length > 0)
        return jsonData.map( ( obj ) => {return <KeyValuePair label={obj.label} value=' '></KeyValuePair>});
    else
        return;    
  }

  const ReviewTemplate = (data) => {
    let jsonData = data['data'];
    return (
      <Stack>
      <Container>
        <ColumnLayout>
          <Column>
            <Stack>
              <KeyValuePair label="Id" value={jsonData['id']}></KeyValuePair>
              <KeyValuePair label="Name" value={jsonData['name']}></KeyValuePair>
              <KeyValuePair label="Description" value={jsonData['description']}></KeyValuePair>
              <KeyValuePair label="Type" value={jsonData['type']}></KeyValuePair>
            </Stack>
           </Column> 
          <Column>
            <Stack>
              <KeyValuePair label="Synonyms" value={synonyms(jsonData)}></KeyValuePair>
              <KeyValuePair label="Domains" value={domains(jsonData)}></KeyValuePair>
              <KeyValuePair label="PII" value={statusInd(jsonData['PII'])}></KeyValuePair>
              <KeyValuePair label="Governed" value={statusInd(jsonData['governed'])}></KeyValuePair>
            </Stack>
           </Column> 
        </ColumnLayout>
      </Container>
      <Container>
        <ColumnLayout>
          <Column>
            <Stack>
              <Text>DGaC - Column Masking</Text>
              {privactRules(jsonData['DGac']['columnMasking'], 'dgac')}
            </Stack>
           </Column> 
          <Column>
            <Stack>
              <Text>DGaC - Row Filtering</Text>
              {privactRules(jsonData['DGac']['rowFiltering'], 'filterValues')}
            </Stack>
           </Column> 
           <Column>
            <Stack>
              <Text>DGaC - Quality</Text>
              {qualityRules(jsonData['DGac']['quality'])}
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
                name: "type",
                label: "Type",
                options: [
                  { label: "Attribute", value: "attribute" },
                  { label: "Entity", value: "entity" },
                ],
                validate: [
                  {
                    type: validatorTypes.REQUIRED,
                  },
                ],
              },
              {
                component: componentTypes.SWITCH,
                name: "governed",
                label: "Governed",
              },
              {
                component: componentTypes.SWITCH,
                name: "PII",
                label: "PII",
              },
              {
                component: componentTypes.FIELD_ARRAY,
                label: "Synonyms",
                name: "synonyms",
                noItemsMessage: "Please add new item",
                validate: [
                  {
                    type: validatorTypes.MIN_ITEMS,
                    threshold: 1,
                  },
                  {
                    type: validatorTypes.REQUIRED,
                  },
                ],
                fields: [
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "name",
                    label: "Values",
                    validate: [
                      {
                        type: validatorTypes.REQUIRED,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "DGaC - Column Masking",
            title: "DGaC - Column Masking",
            fields: [
              {
                component: componentTypes.EXPANDABLE_SECTION,
                name: "DGac",
                label: "Values",
                fields: [
                  {
                    component: componentTypes.FIELD_ARRAY,
                    name: "columnMasking",
                    noItemsMessage: "Please add new item",
                    fields: [
                      {
                        component: componentTypes.SELECT,
                        name: "roles",
                        label: "Role",
                        multiSelect: false,
                        options: roleOptions,
                        checkboxes: false,
                      },
                      {
                        component: componentTypes.SELECT,
                        name: "dgac",
                        label: "DGaC",
                        multiSelect: false,
                        options: dgacPrivacyOptions,
                        checkboxes: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "DGaC - Row Filtering",
            title: "DGaC - Row Filtering",
            fields: [
              {
                component: componentTypes.EXPANDABLE_SECTION,
                name: "DGac",
                label: "Values",
                fields: [
                  {
                    component: componentTypes.FIELD_ARRAY,
                    name: "rowFiltering",
                    noItemsMessage: "Please add new item",
                    fields: [
                      {
                        component: componentTypes.SELECT,
                        name: "roles",
                        label: "Role",
                        multiSelect: false,
                        options: roleOptions,
                        checkboxes: false,
                      },
                      {
                        component: componentTypes.TEXT_FIELD,
                        name: "filterValues",
                        label: "Filter By",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "DGaC - Quality",
            title: "DGaC - Quality",
            fields: [
              {
                component: componentTypes.EXPANDABLE_SECTION,
                name: "DGac",
                label: "Values",
                fields: [
                  {
                    component: componentTypes.SELECT,
                    name: "quality",
                    label: "Quality",
                    multiSelect: true,
                    options: dgacQualityOptions,
                    checkboxes: true,
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
      initialValues={ontologyAttribute}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
export default withRouter(EditOntologyAttributes);
