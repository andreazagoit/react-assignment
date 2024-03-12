import { Box, List } from "@mui/material";
import useFilterStore from "../state/useFilterStore";
import CategoryMenuItem from "./CategoryMenuItem";
import { categories } from "../assets/data/categories";
import { Category } from "../types";

const drawerWidth = 180;

export const Categories = () => {
  /* Global store variables */
  const activeCategory = useFilterStore((state) => state.activeCategory);
  const setCategory = useFilterStore((state) => state.setCategory);

  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey" }}>
      <List>
        {/* When no category is selected */}
        <CategoryMenuItem
          text="All"
          active={activeCategory === undefined}
          setActive={() => setCategory(undefined)}
        />
        {/* Create a menu element for every category */}
        {categories.map((text) => (
          <CategoryMenuItem
            key={text}
            text={text}
            active={activeCategory === text}
            setActive={() => setCategory(text as Category)}
          />
        ))}
      </List>
    </Box>
  );
};
