import _ from "lodash";
import React from "react";
import * as Yup from "yup";
import useStyles from "./ServiceParams.style";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik } from "formik";
import AdvancedInputField from "../../widgets/AdvancedInputField/AdvancedInputField";
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';

let validationSchema = Yup.object().shape({
  COMMAND: Yup.string(),
  code: Yup.number().typeError("required").required("required"),
  TAG_CODE: Yup.string().required("required"),
  type: Yup.string().required("required"),
  title: Yup.string().required("required"),
  data_unit_function: Yup.string().required("required"),
  hvac_brand: Yup.string().required("required"),
  hvac_param_name: Yup.string(),
  data_unit_function_factor: Yup.string(),
  min: Yup.number().nullable(),
  max: Yup.number().nullable(),
  showInGraph: Yup.boolean(),
  plotable: Yup.boolean(),
  writable: Yup.boolean(),
  value_type: Yup.number().nullable(),
  allBrands: Yup.boolean(),
  enabledInTriggers: Yup.boolean(),
  enum: Yup.string(),
  parsingCode: Yup.string().nullable().test("arrayOfNumbers", "array of numbers",
    function (value) {
      if (value?.split(",")?.some((number: any) => _.isNaN(+number) || number === "")) {
        return false
      }
      return true
    }),
  data_unit_of_measurement: Yup.string()
});

const defaultFieldsValues: any = {
  COMMAND: "",
  code: null,
  TAG_CODE: "",
  type: "",
  title: "",
  data_unit_function: "",
  hvac_brand: "",
  hvac_param_name: "",
  data_unit_function_factor: "",
  data_unit_of_measurement: "",
  min: null,
  max: null,
  enabledInTriggers: true,
  showInGraph: true,
  plotable: true,
  allBrands: false,
  writable: false,
  value_type: null,
  enum: "",
  parsingCode: null
}

export default function OneCustomer(props: any) {
  const styles: any = useStyles();
  const { close, parameter = null, options = {}, enumsOptions = [], addParam, updateParam, valueTypeOptions, createMethod } = props;
  const isEdit = !!parameter;
  const isNextOrDuplicate = createMethod === "duplicate" || createMethod === "next";

  return (
    <Dialog
      open={true}
      onClose={close}
      classes={{ paper: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogHeader}>{isEdit && !isNextOrDuplicate ? "Edit " : "Add "}Service Parameter</DialogTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={isEdit ?
          {
            ...parameter,
            enabledInTriggers: !!parameter.enabledInTriggers,
            showInGraph: !!parameter.showInGraph,
            plotable: !!parameter.plotable,
            writable: !!parameter.value_type,
            value_type: parameter.value_type,
            allBrands: !!parameter.allBrands,
            parsingCode: !!parameter.parsingCode ? parameter.parsingCode.toString() : "",
            TAG_CODE: parameter.TAG_CODE || "0x" + Number(parameter.code).toString(16) || ""
          }
          : defaultFieldsValues}
        enableReinitialize={true}
        onSubmit={(values: any, actions: any) => {
          const data = {
            COMMAND: values.COMMAND || "",
            code: values.code,
            TAG_CODE: values.TAG_CODE,
            type: values.type,
            title: values.title,
            data_unit_function: values.data_unit_function,
            hvac_brand: values.hvac_brand,
            hvac_param_name: values.hvac_param_name,
            data_unit_function_factor: values.data_unit_function_factor,
            data_unit_of_measurement: values.data_unit_of_measurement,
            min: values.min,
            max: values.max,
            enabledInTriggers: values.enabledInTriggers,
            showInGraph: values.showInGraph,
            plotable: values.plotable,
            value_type: values.writable ? values.value_type : null,
            allBrands: values.allBrands,
            enum: values.enum,
            parsingCode: values.parsingCode ? values.parsingCode?.split(",")?.map((item: any) => +item) : [],
          }

          if (isEdit && !isNextOrDuplicate) {
            updateParam(parameter.id, data)
          } else {
            addParam(data);
          }

          close();
        }}
      >
        {({ handleSubmit, ...props }) => {
          return (
            <form className={styles.siteDetailsForm} style={{ paddingLeft: "20px", overflow: "auto", paddingRight: "10px" }} onSubmit={handleSubmit}>
              {/* form fields */}
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  textField
                  type="number"
                  name="code"
                  label={`Dec Code`}
                  editable={true}
                  width={"47%"}
                  columnStyle
                  {...props}
                  handleChange={(event: any) => {
                    props.setFieldValue("code", event.target.value);
                    props.setFieldValue("TAG_CODE", "0x" + Number(event.target.value).toString(16));
                  }}
                />
                <AdvancedInputField
                  textField
                  type="string"
                  name="TAG_CODE"
                  label={`Hex Code`}
                  editable={true}
                  width={"47%"}
                  columnStyle
                  {...props}
                  handleChange={(event: any) => {
                    props.setFieldValue("code", parseInt(event.target.value, 16));
                    props.setFieldValue("TAG_CODE", event.target.value);
                  }}
                />
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  textField
                  name="title"
                  label={`Title`}
                  editable={true}
                  columnStyle
                  {...props}
                />
                <AdvancedInputField
                  select
                  name="COMMAND"
                  label={`Command`}
                  editable={true}
                  options={options.commands || []}
                  columnStyle
                  {...props}
                />
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  select
                  name="hvac_brand"
                  label={`Brand Name`}
                  editable={true}
                  options={options.brands || []}
                  columnStyle
                  {...props}
                />
                {/* <AdvancedInputField
                  textField
                  name="parsingCode"
                  label={`Parsing Code`}
                  editable={true}
                  columnStyle
                  {...props}
                /> */}
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  textField
                  name="hvac_param_name"
                  label={`HVAC Parameter Name`}
                  editable={true}
                  columnStyle
                  {...props}
                />
                <AdvancedInputField
                  select
                  name="type"
                  label={`Type`}
                  editable={true}
                  options={options.types || []}
                  columnStyle
                  {...props}
                />
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  textField
                  type="number"
                  name="min"
                  label={`Min Value`}
                  editable={true}
                  columnStyle
                  {...props}
                />
                <AdvancedInputField
                  textField
                  type="number"
                  name="max"
                  label={`Max value`}
                  editable={true}
                  columnStyle
                  {...props}
                />
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  select
                  name="data_unit_function"
                  label={`Unit Function`}
                  editable={true}
                  options={options.unitFunction || []}
                  columnStyle
                  {...props}
                />
                <AdvancedInputField
                  //is this number?
                  textField
                  name="data_unit_function_factor"
                  label={`Unit Function Factor`}
                  editable={true}
                  columnStyle
                  {...props}
                />
              </div>
              <div className={styles.rowFlex}>
                <AdvancedInputField
                  select
                  name="data_unit_of_measurement"
                  label={`Unit Measurement`}
                  editable={true}
                  options={options.unitMeasurement || []}
                  columnStyle
                  {...props}
                />
                <AdvancedInputField
                  select
                  name="enum"
                  label={`Enum`}
                  editable={true}
                  options={enumsOptions}
                  columnStyle
                  {...props}
                />
              </div>
              <div className={styles.rowFlex} style={{ height: "77px" }}>
                <FormControlLabel
                  control={<Checkbox color="default" checked={props.values.plotable} onChange={props.handleChange} />}
                  label="Plotable"
                  name="plotable"
                  {...props}
                />
                <FormControlLabel
                  control={<Checkbox color="default" checked={props.values.writable} onChange={props.handleChange} />}
                  label="Writable"
                  name="writable"
                  {...props}
                />
                <div style={{ width: "47%" }}>
                  {props.values.writable && <AdvancedInputField
                    select
                    name="value_type"
                    label={`value type`}
                    editable={true}
                    options={valueTypeOptions}
                    columnStyle
                    {...props}
                  />}
                </div>
              </div>
              <hr></hr>
              <div>
                <FormControlLabel
                  control={<Checkbox color="default" checked={props.values.enabledInTriggers} onChange={props.handleChange} />}
                  label="Enabled in Triggers"
                  name="enabledInTriggers"
                  {...props}
                />
                <FormControlLabel
                  control={<Checkbox color="default" checked={props.values.showInGraph} onChange={props.handleChange} />}
                  label="Show in Graph"
                  name="showInGraph"
                  {...props}
                />
                <FormControlLabel
                  control={<Checkbox color="default" checked={props.values.allBrands} onChange={props.handleChange} />}
                  label="All brands"
                  name="allBrands"
                  {...props}
                />
              </div>
              <DialogActions style={{
                paddingRight: "30px",
                position: "absolute",
                right: 0,
                bottom: 0
              }}
              >
                <Button className={styles.cancelStyle} onClick={close}>Cancel</Button>
                <Button className={styles.buttonStyle} type="submit">Submit</Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
      {/*sticky buttons holder*/}
      <div style={{ minHeight: "96px" }}>
      </div>
    </Dialog>
  );
}
