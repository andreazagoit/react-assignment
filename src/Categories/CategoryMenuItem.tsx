import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface IProps {
  text: string;
  active: boolean;
  setActive: () => void;
}

const CategoryMenuItem = ({ text, active, setActive }: IProps) => {
  return (
    <ListItem
      key={text}
      disablePadding
      sx={{
        backgroundColor: active ? "primary.light" : "transparent",
      }}
    >
      <ListItemButton onClick={setActive}>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default CategoryMenuItem;
