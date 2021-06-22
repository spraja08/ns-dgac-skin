import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import Service from "../../services/Service";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import FormRenderer, {
  componentTypes,
  validatorTypes,
} from "aws-northstar/components/FormRenderer";
import Container from "aws-northstar/layouts/Container";

function EditDGaC({ match }) {
  const { path } = match;
  const [dgac, setDgac] = useState(null);
  const history = useHistory();
  const { dgacId } = useParams();

  useEffect(() => {
    Service.getResourceById('dgac', dgacId).then((result) => setDgac(result.data));
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
          }
        ]
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "name",
        label: "NAME",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          }
        ]
      },
      {
        component: componentTypes.TEXTAREA,
        name: "description",
        label: "DESCRIPTION",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          }
        ]
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "operation",
        label: "OPERATION",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          }
        ]
      },
      {
        component: componentTypes.SELECT,
        name: "category",
        label: "CATEGORY",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          }
        ],
        options: [
          {
              label: 'Privacy',
              value: 'Privacy'
          },
          {
              label: 'Quality',
              value: 'Quality'
          },
        ],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "udf",
        label: "UDF",
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          }
        ]
      }
    ]
  };

  const onSubmit = async (params) => {
    const success = await Service.updateResourceById('dgac', params, params.id);
    console.log(success);
    if( success.status === 200 ) 
        window.location.href = '/dgac';
    }

  const onCancel = () => {
    history.push(`/dgac`);
  }

  return (
    <Container>
      <FormRenderer
        schema={schema}
        initialValues={dgac}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Container>
  );
}

export default withRouter(EditDGaC);
