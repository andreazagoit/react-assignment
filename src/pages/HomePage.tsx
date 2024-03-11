import { useState } from "react";
import { Cart, Products } from "../Products";
import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "../SearchAppBar";
import { Categories } from "../Categories";

const HomePage = () => {
  const [cart, setCart] = useState<Cart>();

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
          <Products onCartChange={onCartChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
