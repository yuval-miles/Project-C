import React, { FC, useCallback, useMemo, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { updateOptions } from "../store/slices/optionsSlice";
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
import { debounce } from "../functions/debounce";
import SearchResults from "./SearchResults";
import { trpc } from "../utils/trpc";

const SideBar: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { gridOptions } = useSelector(
    (state: RootState) => ({
      gridOptions: state.options,
    }),
    shallowEqual
  );
  const [query, setQuery] = useState<string>("");
  const { data, isLoading, refetch } = trpc.useQuery(["Albums.get", query], {
    refetchOnWindowFocus: false,
    enabled: false,
    keepPreviousData: true,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getResults = useCallback(
    debounce(() => {
      refetch();
    }, 300),
    []
  );
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean | null
  ) => {
    if (checked !== null) dispatch(updateOptions({ showOptions: checked }));
    else {
      setQuery(event.target.value);
      getResults();
    }
  };
  return (
    <div className={styles.sidebar}>
      <Stack gap={2} height={"100vh"}>
        <Typography variant="h5">Collection settings</Typography>
        <FormControlLabel
          checked={gridOptions.showOptions}
          control={<Switch onChange={handleChange} />}
          label="Show Options"
        />
        <Collapse in={gridOptions.showOptions} className={styles.options}>
          {
            <Box>
              <SideBarOptions />
            </Box>
          }
        </Collapse>
        <Divider />
        <TextField
          label="Search for an album..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, null)
          }
        />
        {typeof data?.response !== "string" ? (
          <SearchResults results={data?.response.album} />
        ) : data?.response === "Empty query" ? (
          <></>
        ) : (
          <Typography>{data.response}</Typography>
        )}
      </Stack>
    </div>
  );
};

export default SideBar;
