import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import clsx from "clsx";
import _ from "lodash";
import React, { useEffect, useState, useCallback } from "react";
import { t } from "ttag";
import { useStoreActions, useStoreState } from "../../models/RootStore";
import ServiceNavigationBar from "../../widgets/Menu/ServiceNavigationBar";
import useStyles from "./ServiceParams.style";
import { Lookup } from "../../components/Lookup";
import { ServiceParameters as sdkServiceParameters } from "coolremote-sdk";
import { EditIcon } from "../../iconImages";
import AddEditParamDialog from "./AddEditServiceParam";
import { ContentCopy, SkipNext, Sort } from '@mui/icons-material';
import { SortUp } from "../../icons";

const formatEnumsToOptions = (enums: any) => {
  return Object.values(enums).map(({ name: value }: any) => ({ value, label: value }))
};
const formatValueTypesToOptions = (enums: any) => {
  return Object.keys(enums).map((valueType: string) => ({ value: enums[valueType], label: valueType }))
};
const formatTypesToOptions = (types: any) => {
  const options: any = {};

  Object.keys(types).forEach((typeKey: string) => {
    options[typeKey] = [];
    const typeValues = types[typeKey];

    typeValues.forEach((value: any) => {
      if (!value) {
        return;
      }
      options[typeKey].push({ value, label: value })
    });
  })

  return options
}

export default function ServiceParams(props: any) {
  const styles: any = useStyles();

  const [selectedParameter, setSelectedParameter] = useState<any>(null);
  const [createMethod, setCreateMethod] = useState<string>("");
  const [serviceParameters, setServiceParameters] = useState<any>({});
  const [filteredParameters, setFilteredParameters] = useState<any>([]);
  const [valueTypes, setValueTypes] = useState<any>({});
  const [enums, setEnums] = useState<any>({});
  const [types, setTypes] = useState<any>({});
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sorting, setSorting] = useState<any>({ by: "code", isAsc: true });
  const [lookupAnchor, setLookupAnchor] = useState<any>(null);
  const [enabledFilters, setEnabledFilters] = useState<any>({
    title: [],
    code: [],
    TAG_CODE: [],
    brand: [],
    type: [],
    status: []
  });
  const [filters, setFilters] = useState<any>({
    title: [],
    code: [],
    TAG_CODE: [],
    brand: [],
    type: [],
    status: ["true", "false"]
  });
  const { addMessage } = useStoreActions((action) => action.errorMessage);
  const { serviceParamValueTypes } = useStoreState((s) => s.types);

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    const titles: any = {};
    const codes: any = {};
    const TAG_CODES: any = {};
    const brands: any = {};
    const types: any = {};

    Object.values(serviceParameters).forEach((parameter: any) => {
      const { id, title, code, TAG_CODE, hvac_brand, COMMAND } = parameter;
      titles[title] = true;
      codes[code] = true;
      TAG_CODES[TAG_CODE] = true;
      brands[hvac_brand] = true;
      types[COMMAND || ""] = true;
    });

    setFilters({
      title: Object.keys(titles),
      code: Object.keys(codes),
      TAG_CODE: Object.keys(TAG_CODES),
      brand: Object.keys(brands),
      type: Object.keys(types),
      status: ["true", "false"]
    });

  }, [serviceParameters]);

  useEffect(() => {
    const filteredParameters = _(serviceParameters)
      .filter(({ title }) => enabledFilters.title.length ? enabledFilters.title.includes(title) : true)
      .filter(({ code }) => enabledFilters.code.length ? enabledFilters.code.includes(code + "") : true)
      .filter(({ TAG_CODE }) => enabledFilters.TAG_CODE.length ? enabledFilters.TAG_CODE.includes(TAG_CODE + "") : true)
      .filter(({ hvac_brand = "" }) => enabledFilters.brand.length ? enabledFilters.brand.includes(hvac_brand) : true)
      .filter(({ COMMAND = "" }) => enabledFilters.type.length ? enabledFilters.type.includes(COMMAND) : true)
      .filter(({ pending = false }) => enabledFilters.status.length ? enabledFilters.status.includes(pending ? "true" : "false") : true)
      .value();
    setFilteredParameters(filteredParameters);

  }, [enabledFilters, serviceParameters]);

  const fetchData = async () => {
    const APIs = [
      sdkServiceParameters.getAll(),
      sdkServiceParameters.getEnums(),
      sdkServiceParameters.getTypes()
    ]

    const resp: any = await Promise.allSettled(APIs);
    const [serviceParameters, enums, types] = resp;
    setValueTypes(formatValueTypesToOptions(serviceParamValueTypes || {}));
    setServiceParameters(serviceParameters.value || {});
    setTypes(formatTypesToOptions(types.value || {}));
    setEnums(formatEnumsToOptions(enums.value || {}));
  }

  const handleLookupPopup = useCallback((event: any, column: string) => {
    setLookupAnchor(column ? { anchor: event.currentTarget, columnName: column } : null);
  }, []);

  const onApply = (selectedFilters: any) => {
    setEnabledFilters({
      ...enabledFilters,
      [lookupAnchor.columnName]: selectedFilters
    });
    setPage(0)
    setLookupAnchor(null);
  };

  const addParam = (data: any) => {
    sdkServiceParameters.create(data)
      .then((param: any) => setServiceParameters({ ...serviceParameters, [param.id]: param }))
      .catch((err: any) => addMessage({ message: err.message }));

  }

  const updateParam = (id: any, data: any) => {
    sdkServiceParameters.update(id, data)
      .then((param: any) => setServiceParameters({ ...serviceParameters, [id]: param }))
      .catch((err: any) => addMessage({ message: err.message }));

  }

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  const updateSort = (column: string) => {
    const sortObj: any = sorting;
    if (sortObj.by === column) {
      sortObj.isAsc = !sortObj.isAsc;
    }
    else {
      sortObj.by = column;
      sortObj.isAsc = true;
    }

    setSorting({ ...sorting, ...sortObj });
  };

  return (
    <>
      <ServiceNavigationBar title={t`Service Paramters`}  {...props}>

        <div className={styles.addButtonContainer}>
          <Button
            className={styles.buttonStyle}
            onClick={() => setSelectedParameter("addNewParameter")}
          >{t`Add New Parameter`}</Button>
        </div>
        <Paper elevation={0} className={styles.paperPadding}>
          <TableContainer>
            <Table stickyHeader className="" aria-label="customized table">
              <TableHead className={styles.tableHead}>
                <TableRow>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                    onClick={(e: any) => handleLookupPopup(e, "title")}
                  >
                    <div className={styles.headContainer}>
                      {t`Title`}
                      <FilterList
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.title.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                  >
                    <div className={styles.headContainer}>
                      <div className={styles.sortIconBase} onClick={() => updateSort("code")} >
                        {
                          sorting.by === "code" ?
                            <SortUp flip={sorting.isAsc} /> :
                            <Sort />
                        }
                      </div>
                      {t`Dec Code`}
                      <FilterList
                        onClick={(e: any) => handleLookupPopup(e, "code")}
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.code.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                  >
                    <div className={styles.headContainer}>
                      <div className={styles.sortIconBase} onClick={() => updateSort("TAG_CODE")} >
                        {
                          sorting.by === "TAG_CODE" ?
                            <SortUp flip={sorting.isAsc} /> :
                            <Sort />
                        }
                      </div>
                      {t`Hex Code`}
                      <FilterList
                        onClick={(e: any) => handleLookupPopup(e, "TAG_CODE")}
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.TAG_CODE.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                    onClick={(e: any) => handleLookupPopup(e, "brand")}
                  >
                    <div className={styles.headContainer}>
                      {t`Brand`}
                      <FilterList
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.brand.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                    onClick={(e: any) => handleLookupPopup(e, "type")}
                  >
                    <div className={styles.headContainer}>
                      {t`Type`}
                      <FilterList
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.type.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.headCells}
                    onClick={(e: any) => handleLookupPopup(e, "status")}
                  >
                    <div className={styles.headContainer}>
                      {t`Pending`}
                      <FilterList
                        className={clsx(styles.filterStyle, {
                          [styles.blueFilter]: enabledFilters.status.length
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    align="center"
                    className={styles.headCells}
                  >{t`NEXT`}</TableCell>
                  <TableCell
                    align="center"
                    className={styles.headCells}
                  >{t`DUPLICATE`}</TableCell>
                  <TableCell
                    align="center"
                    className={styles.headCells}
                  >{t`Edit`}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* _.orderBy(Object.values(units.ODU), [sorting.ODU.by], [sorting.ODU.isAsc ? "asc" : "desc"]).map((unit: any, index: any) => { */}

                {_.orderBy(filteredParameters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sorting.by], [sorting.isAsc ? "asc" : "desc"]).map((parameter: any) => {
                  // {filteredParameters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((parameter: any) => {
                  const { id, title, code, TAG_CODE, hvac_brand, COMMAND, pending = false } = parameter;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={id}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >
                        {title}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >
                        {code}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >
                        {TAG_CODE}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >
                        {hvac_brand}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >
                        {COMMAND}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className={styles.rowCell}
                      >{pending ? "true" : "false"}</TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className={styles.rowCell}
                      >
                        <IconButton title="next" onClick={() => { setSelectedParameter({ code: parameter.code + 1 }); setCreateMethod("next") }}>
                          <SkipNext color={"disabled"} />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className={styles.rowCell}
                      >
                        <IconButton title="duplicate" onClick={() => { setSelectedParameter(parameter); setCreateMethod("duplicate") }}>
                          <ContentCopy color={"disabled"} />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className={styles.rowCell}
                      >
                        <IconButton title="edit" onClick={() => setSelectedParameter(parameter)}>
                          <img src={EditIcon} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            style={{ minHeight: 52 }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Object.keys(filteredParameters).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </ServiceNavigationBar >
      {lookupAnchor && (
        <Lookup
          filtersList={filters[lookupAnchor.columnName]}
          appliedFilters={enabledFilters[lookupAnchor.columnName]}
          onApply={onApply}
          lookupAnchor={lookupAnchor.anchor}
          onClose={() => setLookupAnchor(null)}
          clearAllFilters={() => setEnabledFilters({
            title: [],
            code: [],
            TAG_CODE: [],
            brand: [],
            type: [],
            status: []
          })}
          hasFilters={!!Object.values(enabledFilters).flat().length}
        />
      )
      }
      {!!selectedParameter &&
        <AddEditParamDialog
          options={types}
          enumsOptions={enums}
          valueTypeOptions={valueTypes}
          close={() => setSelectedParameter(null)}
          parameter={selectedParameter === "addNewParameter" ? null : selectedParameter}
          addParam={addParam}
          updateParam={updateParam}
          createMethod={createMethod}
        />
      }
    </>
  );
}
