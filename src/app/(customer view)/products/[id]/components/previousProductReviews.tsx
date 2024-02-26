"use client"
import { getPreviousProductReviews } from "@/actions/reviews";
import { GetReviewDTO } from "@/types/review";
import { ListItem, ListItemButton, Stack, Box, Typography, ListDivider, Avatar, List, Button, ButtonGroup } from "@mui/joy";
import { Rating } from "@mui/material";

import { useState, useEffect } from "react";
import { number } from "zod";

export default function PreviousProductReviews(props: {
    productId: number;
}) {

  const [reviews, setReviews] = useState<GetReviewDTO[]>([]);
  const [offset, setOffset] = useState(0);

  function fetchNextReviews() {
    setOffset(offset + 5);
  }

  function fetchPreviousReviews() {
    setOffset(offset - 5);
  }

    useEffect(() => {
        getPreviousProductReviews(props.productId, 10, offset).then((res) => {
          setReviews(res);
        });
    }, [offset, props.productId]);

    console.log(reviews);
  return (
    <>
      <List>
        {reviews.map((review) => {
          return (
            <>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "initial",
                  gap: 1,
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Avatar src={review.image || undefined}>
                    {review.name.split(" ")[0][0] +
                      review.name.split(" ")[1][0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-sm">{review.name}</Typography>
                    <Rating
                      name="rating"
                      value={review.rating}
                      precision={0.1}
                      sx={{
                        maxWidth: "fit-content",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      lineHeight: 1.5,
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      level="body-xs"
                      display={{ xs: "none", md: "block" }}
                      noWrap
                    >
                      {review.created_at.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  level="body-sm"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {review.review_text}
                </Typography>
              </ListItem>
              <ListDivider sx={{ margin: 0 }} />
            </>
          );
        })}
      </List>
      <ButtonGroup>
        <Button onClick={() => fetchPreviousReviews()}>Fetch previous reviews</Button>
        <Button onClick={() => fetchNextReviews()}>Fetch more reviews</Button>
      </ButtonGroup>
    </>
  );
}
