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

function EditDataDomain({ match }) {
  const { path } = match;
  const [dataDomain, setDataDomain] = useState(null);
  const history = useHistory();
  const { dataDomainId } = useParams();
  const [sourceTypes, setSourceTypes] = useState([]);

  useEffect(() => {
    Service.getResourceById("businessDomains", dataDomainId).then((result) =>
      setDataDomain(result.data)
    );

    let sourceValues = [];
    Service.getAll("dataSourceTypes").then((result) => {
      result.data.map((thisType) => {
        let item = {};
        item["value"] = thisType.id;
        item["label"] = thisType.name;
        sourceValues.push(item);
      });
    });
    setSourceTypes(sourceValues);
  }, []);

  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: "id",
        label: "ID",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "name",
        label: "NAME",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: componentTypes.TEXTAREA,
        name: "description",
        label: "DESCRIPTION",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: componentTypes.FIELD_ARRAY,
        name: "dataStores",
        label: "DATA STORES",
        noItemsMessage: "Please add new item",
        fields: [
          {
            component: componentTypes.TEXT_FIELD,
            name: "id",
            label: "Id",
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: "name",
            label: "Name",
          },
          {
            component: componentTypes.SELECT,
            name: "type",
            label: "Source Type",
            options: sourceTypes,
            multiSelect: false,
            checkboxes: false,
            isRequired: true,
            validate: [
                {
                    type: validatorTypes.REQUIRED,
                },
            ],
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: "connection-url",
            label: "Connection-URL",
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: "connection-user",
            label: "userid",
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: "connection-password",
            label: "password",
            type: "password"
          },
        ],
      },
    ],
  };

  const onSubmit = async (params) => {
    const success = await Service.updateResourceById(
      "businessDomains",
      params,
      params.id
    );
    console.log(success);
    if (success.status === 200) window.location.href = "/dataDomains";
  };

  const onCancel = () => {
    history.push(`/dataDomains`);
  };

  return (
    <Container>
      <FormRenderer
        schema={schema}
        initialValues={dataDomain}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Container>
  );
}

export default withRouter(EditDataDomain);
