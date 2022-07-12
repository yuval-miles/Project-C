import React, { FC, useCallback, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { updateOptions } from "../store/slices/optionsSlice";
import { updateSearchBar, fetchResults } from "../store/slices/searchBarSlice";
import { RootState, AppDispatch } from "../store/store";
import SideBarOptions from "./SideBarOptions";
import {
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import styles from "../styles/sidebar.module.css";
import { Box } from "@mui/system";
import { debounce } from "../hooks/useDebounce";
import SearchResults from "./SearchResults";

const SideBar: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { gridOptions, searchBar } = useSelector(
    (state: RootState) => ({
      gridOptions: state.options,
      searchBar: state.searchBar,
    }),
    shallowEqual
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getResults = useCallback(
    debounce((query: string) => {
      dispatch(fetchResults(query));
    }, 300),
    []
  );
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean | null
  ) => {
    if (checked !== null) dispatch(updateOptions({ showOptions: checked }));
    else {
      dispatch(updateSearchBar({ input: event.target.value }));
      getResults(event.target.value);
    }
  };
  return (
    <div className={styles.sidebar}>
      <Stack gap={2}>
        <Typography variant="h5">Collection settings</Typography>
        <FormControlLabel
          checked={gridOptions.showOptions}
          control={<Switch onChange={handleChange} />}
          label="Show Options"
        />
        <Collapse in={gridOptions.showOptions}>
          {
            <Box>
              <SideBarOptions />
            </Box>
          }
        </Collapse>
        <Divider />
        <TextField
          label="Search for an album..."
          value={searchBar.input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, null)
          }
        />
        <SearchResults />
      </Stack>
    </div>
  );
};

export default SideBar;
