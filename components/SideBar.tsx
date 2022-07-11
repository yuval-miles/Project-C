import React, { FC } from "react";
import {
  Typography,
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
import styles from "../styles/sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { updateOptions, options } from "../store/slices/optionsSlice";

const SideBar: FC = () => {
  const options = useSelector((state: RootState) => state.options);
  const dispatch: AppDispatch = useDispatch();

  const handleTextFieldChange =
    (field: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code.includes("Digit"))
        dispatch(
          updateOptions({
            [field]: Math.min(
              Math.max(
                parseInt(options[field as keyof options].toString() + e.key),
                1
              ),
              20
            ),
          })
        );
      if (e.code === "Backspace") {
        let str: string = options[field as keyof options]
          .toString()
          .substring(0, options[field as keyof options].toString().length - 1);
        dispatch(updateOptions({ [field]: !str ? 0 : parseInt(str) }));
      }
    };
  const handleChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value) dispatch(updateOptions({ collectionType: value }));
    else {
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
      if (newValue !== options[field as keyof options])
        dispatch(updateOptions({ [field]: newValue }));
    };
  return (
    <section className={styles.sidebar}>
      <Stack direction={"column"} spacing={3}>
        <Typography variant="h5">Collection settings</Typography>
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
                aria-label="gridRows"
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

export default SideBar;
