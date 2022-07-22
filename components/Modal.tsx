import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

const TransitionModal: React.FC<{
  modalState: {
    open: boolean;
    collectionId: string;
    name: string;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      collectionId: string;
      name: string;
    }>
  >;
  handleDeleteCollection: (collectionID: string) => void;
}> = ({ modalState, setModalState, handleDeleteCollection }) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalState.open}
        onClose={() => setModalState((state) => ({ ...state, open: false }))}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalState.open}>
          <Box sx={style}>
            <Stack gap={3}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Are you sure you want to delete {modalState.name} ?
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteCollection(modalState.collectionId);
                  setModalState({
                    name: modalState.name,
                    collectionId: "",
                    open: false,
                  });
                }}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
export default TransitionModal;
