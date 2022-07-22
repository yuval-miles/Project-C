import React, { FC, useEffect, useRef } from "react";

import {
  TextField,
  Stack,
  Slider,
  FormControl,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { updateOptions, options } from "../store/slices/optionsSlice";
import { useSetGrid } from "../hooks/useSetGrid";
import { trpc } from "../utils/trpc";

const SideBarOptions: FC = () => {
  const initialLoad = useRef(true);
  const { options, collectionID }: { options: options; collectionID: string } =
    useSelector(
      (state: RootState) => ({
        options: state.options,
        collectionID: state.collection.collectionID,
      }),
      shallowEqual
    );
  const dispatch: AppDispatch = useDispatch();
  const setGrid = useSetGrid();
  const updateCollectionSettings = trpc.useMutation([
    "Collections.updateCollectionSettings",
  ]);
  useEffect(() => {
    if (!initialLoad.current)
      updateCollectionSettings.mutate({
        collectionID,
        collectionSettings: {
          collectionType: options.collectionType,
          gridRows: options.gridRows,
          gridColumns: options.gridColumns,
          checkboxArr: options.checkboxArr,
          padding: options.padding,
        },
      });
    initialLoad.current = true;
    return () => {
      initialLoad.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.checkboxArr,
    options.collectionType,
    options.gridColumns,
    options.gridRows,
    options.padding,
  ]);
  const handleTextFieldChange =
    (field: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      let test: number = 0;
      if (e.code.includes("Digit")) {
        test = Math.min(
          Math.max(
            parseInt(options[field as keyof options].toString() + e.key),
            1
          ),
          20
        );
        dispatch(
          updateOptions({
            [field]: test,
          })
        );
      }
      if (e.code === "Backspace") {
        let str = options[field as keyof options]
          .toString()
          .substring(0, options[field as keyof options].toString().length - 1);
        dispatch(updateOptions({ [field]: !str ? 0 : parseInt(str) }));
        if (str === "") test = 0;
        else test = parseInt(str);
      }
      switch (field) {
        case "gridRows":
          if (test)
            setGrid(
              options.collectionType,
              test as number,
              options.gridColumns
            );
          break;
        case "gridColumns":
          if (test)
            setGrid(options.collectionType, options.gridRows, test as number);
          break;
        default:
          break;
      }
    };
  const handleChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value) {
      setGrid(value, options.gridRows, options.gridColumns);
      dispatch(updateOptions({ collectionType: value }));
    } else {
      if (options.checkboxArr.indexOf(e.target.name) === -1)
        dispatch(
          updateOptions({
            checkboxArr: [...options.checkboxArr, e.target.name],
          })
        );
      else {
        const newArr = options.checkboxArr.filter((el) => el !== e.target.name);
        dispatch(updateOptions({ checkboxArr: newArr }));
      }
    }
  };
  const handleSliderChange =
    (field: string) => (event: Event, newValue: number | number[]) => {
      if (newValue !== options[field as keyof options]) {
        dispatch(updateOptions({ [field]: newValue }));
        switch (field) {
          case "gridRows":
            if (newValue)
              setGrid(
                options.collectionType,
                newValue as number,
                options.gridColumns
              );
            break;
          case "gridColumns":
            if (newValue)
              setGrid(
                options.collectionType,
                options.gridRows,
                newValue as number
              );
            break;
          default:
            break;
        }
      }
    };
  return (
    <section>
      <Stack direction={"column"} spacing={3}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            Collection Type
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={handleChangeEvent}
            row
          >
            <FormControlLabel
              value="collage"
              control={<Radio checked={options.collectionType === "collage"} />}
              label="Collage"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
            <FormControlLabel
              value="top42"
              control={<Radio checked={options.collectionType === "top42"} />}
              label="Top 42"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
            <FormControlLabel
              value="top40"
              control={<Radio checked={options.collectionType === "top40"} />}
              label="Top 40"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
            <FormControlLabel
              value="top100"
              control={<Radio checked={options.collectionType === "top100"} />}
              label="Top 100"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
          </RadioGroup>
        </FormControl>
        {options.collectionType === "collage" && (
          <Stack direction={"column"} spacing={3}>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <TextField
                label="Rows"
                value={options.gridRows}
                style={{ width: "70px" }}
                onKeyDown={handleTextFieldChange("gridRows")}
              />
              <Slider
                defaultValue={5}
                max={20}
                min={0}
                value={options.gridRows}
                aria-label="gridRows"
                valueLabelDisplay="auto"
                onChange={handleSliderChange("gridRows")}
              />
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <TextField
                label="Columns"
                value={options.gridColumns}
                style={{ width: "110px" }}
                onKeyDown={handleTextFieldChange("gridColumns")}
              />
              <Slider
                defaultValue={7}
                max={20}
                min={0}
                value={options.gridColumns}
                aria-label="gridColumns"
                valueLabelDisplay="auto"
                onChange={handleSliderChange("gridColumns")}
              />
            </Stack>
          </Stack>
        )}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeEvent(e, "")
                }
                checked={options.checkboxArr.includes("album titles")}
              />
            }
            label="album titles"
            name="album titles"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeEvent(e, "")
                }
                checked={options.checkboxArr.includes("numbered")}
              />
            }
            label="numbered"
            name="numbered"
          />
        </FormGroup>
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <TextField
            label="Padding"
            value={options.padding}
            style={{ width: "110px" }}
            onKeyDown={handleTextFieldChange("padding")}
          />
          <Slider
            defaultValue={5}
            max={20}
            min={0}
            value={options.padding}
            aria-label="gridRows"
            valueLabelDisplay="auto"
            onChange={handleSliderChange("padding")}
          />
        </Stack>
      </Stack>
    </section>
  );
};

export default React.memo(SideBarOptions);
