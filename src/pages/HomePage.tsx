import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "../SearchAppBar";
import { Categories } from "../Categories";
import { Cart } from "../types";
import { Products } from "../Products";

const HomePage = () => {
  // Set initial state, remove undefined, less errors
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalPrice: 0,
    totalItems: 0,
    loading: false,
  });

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
      />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories />
        <Box flex={1}>
          <Products cart={cart} onCartChange={onCartChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
