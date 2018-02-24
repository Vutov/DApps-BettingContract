import * as React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'


export class Controls extends React.Component<any, any> {
  public static FieldGroup({ id, label, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  }
}