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

function EditRole({ match }) {
  const { path } = match;
  const [role, setRole] = useState(null);
  const history = useHistory();
  const { roleId } = useParams();

  useEffect(() => {
    Service.getResourceById('roles', roleId).then((result) => setRole(result.data));
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
      }
    ]
  };

  const onSubmit = async (params) => {
    const success = await Service.updateResourceById('roles', params, params.id);
    console.log(success);
    if( success.status === 200 ) 
        window.location.href = '/roles';
    }

  const onCancel = () => {
    history.push(`/roles`);
  }

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

export default withRouter(EditRole);
