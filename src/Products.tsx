import { useEffect, useMemo, useState } from "react";
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

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

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
    return data ? data.pages.flatMap((page) => page.products) : [];
  }, [data]);

  function addToCart(productId: number, quantity: number) {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            loading: true,
          };
        }
        return product;
      })
    );
    fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async (response) => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(
          products.map((product) => {
            if (product.id === productId) {
              return {
                ...product,
                itemInCart: (product.itemInCart || 0) + quantity,
                loading: false,
              };
            }
            return product;
          })
        );
        onCartChange(cart);
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
        {productsList.map((product) => (
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
                    disabled={product.loading}
                    aria-label="delete"
                    size="small"
                    onClick={() => addToCart(product.id, -1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {product.itemInCart || 0}
                  </Typography>

                  <IconButton
                    disabled={product.loading}
                    aria-label="add"
                    size="small"
                    onClick={() => addToCart(product.id, 1)}
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
