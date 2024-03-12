import { useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { HeavyComponent } from "./HeavyComponent.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import useFilterStore from "./state/useFilterStore.ts";
import { Cart, Product } from "./types";

interface IProps {
  cart: Cart;
  onCartChange: (cart: Cart) => void;
}

export const Products = ({ cart, onCartChange }: IProps) => {
  /* Not needed, use cart */
  /* const [products, setProducts] = useState<Product[]>([]); */

  // Simplify filter state. Use a global state.
  const search = useFilterStore((state) => state.search);
  const activeCategory = useFilterStore((state) => state.activeCategory);

  // React query to implement caching for the data
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["products", search, activeCategory],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  // Add pagination to the request
  const fetchPage = async (pageParam: number) => {
    try {
      const results = await fetch(
        `/products?page=${pageParam}&limit=12${search ? `&q=${search}` : ""}${
          activeCategory ? `&category=${activeCategory}` : ""
        }`
      );
      const parsedResults = await results.json();
      return { ...parsedResults, page: pageParam };
    } catch (error) {}
  };

  // Join all the page in a single array with all the products
  const productsList = useMemo(() => {
    const products = data ? data.pages.flatMap((page) => page.products) : [];
    const productsWithQuantity = products.map((product) => {
      const cartItem = cart.items.find(
        (item) => item.product.id === product.id
      );
      return { product, quantity: cartItem?.quantity || 0 };
    });

    return productsWithQuantity;
  }, [data, cart]);

  function addToCart(product: Product, quantity: number) {
    // Optimistic updates

    // Get prev state in case of error on update
    const prevCart: Cart = cart;

    // Check if product is present
    const index = cart.items.findIndex(
      (item) => item.product.id === product.id
    );

    // Create a copy of the array to apply modifications
    const updatedItems = [...cart.items];

    // If the product is not found in the cart items push a new item
    if (index === -1 && quantity !== 0) {
      updatedItems.push({ product: product, quantity: quantity });
    } else if (index !== -1) {
      // If the product is found update its quantity
      updatedItems[index].quantity += quantity;
      // Remove the item if the quantity becomes 0
      /* Not needed, that is done by the backend response */
      /* if (updatedItems[index].quantity === 0) {
        updatedItems.splice(index, 1);
      } */
    }

    const updatedCart = {
      items: updatedItems,
      totalPrice: updatedItems.reduce((acc, item) => {
        // Calculate the total price of items
        const itemPrice = item.product.price * item.quantity;
        return acc + itemPrice;
      }, 0),
      totalItems: updatedItems.reduce((acc, item) => {
        // Calculate the total quantity of each item
        return acc + item.quantity;
      }, 0),
      loading: true,
    };
    console.log(3, updatedCart);

    onCartChange(updatedCart);

    console.log(4);

    // ˜For example if we change the link the data is reset to the previous state
    fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product.id, quantity }),
    }).then(async (response) => {
      if (response.ok) {
        const cart = await response.json();
        onCartChange({ ...cart, loading: false });
      } else {
        // if response is not ok restore previous cart status
        onCartChange(prevCart);
      }
    });
  }

  // Execute infinite query when the user scroll to the end of the page - 300px
  const handleScroll = () => {
    const body = document.body;
    const windowHeight = window.innerHeight;
    const scrollPosition = body.scrollTop || document.documentElement.scrollTop;
    const totalHeight = body.scrollHeight;
    if (
      windowHeight + scrollPosition >= totalHeight - 300 &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  // Handling scrolling event that enable the infinite query
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box overflow="scroll" height="100%">
      <Grid container spacing={2} p={2}>
        {productsList.map(({ product, quantity }) => (
          <Grid key={product.id} item xs={4}>
            {/* Do not remove this */}
            <HeavyComponent />
            <Card key={product.id} style={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant="h6" component="div">
                  ${product.price}
                </Typography>
                <Box flexGrow={1} />
                <Box
                  position="relative"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Box
                    position="absolute"
                    left={0}
                    right={0}
                    top={0}
                    bottom={0}
                    textAlign="center"
                  >
                    {product.loading && <CircularProgress size={20} />}
                  </Box>
                  <IconButton
                    disabled={product.loading || cart.loading}
                    aria-label="delete"
                    size="small"
                    onClick={() =>
                      !cart.loading ? addToCart(product, -1) : null
                    }
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {quantity || 0}
                  </Typography>

                  <IconButton
                    disabled={product.loading || cart.loading}
                    aria-label="add"
                    size="small"
                    onClick={() =>
                      !cart.loading ? addToCart(product, 1) : null
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
