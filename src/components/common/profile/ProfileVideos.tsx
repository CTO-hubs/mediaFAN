import { Flex, Text, Box, CircularProgress } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { usePostsForSpecialType } from "../../../hooks/usePosts";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import Post from "../../posts/Post";
import { useLikePosts as getLikePost } from "../../../hooks/useFeeds";

export default function ProfileVideos() {
  const pageSize = 10,
    type = 2;
  const { username } = useParams<{ username: string }>();
  const {
    data: videos,
    fetchNextPage,
    hasNextPage,
  } = usePostsForSpecialType(username as string, { pageSize, type });

  const [likePosts, setLikePosts] = useState<number[]>([]);

  const getLikePosts = async () => {
    const postIds: number[] = [];
    videos?.pages?.forEach((page) => {
      page &&
        page.forEach((post) => {
          postIds.push(post.id);
        });
    });
    const likePostIds = await getLikePost(postIds);
    setLikePosts(likePostIds);
  };

  useEffect(() => {
    getLikePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <InfiniteScroll
      dataLength={(videos?.pages.length ?? 0) * pageSize}
      next={handleLoadMore}
      hasMore={hasNextPage ?? false}
      loader={
        <Box height="5rem" display="flex" justifyContent="center" p={2}>
          <CircularProgress isIndeterminate />
        </Box>
      }
      endMessage={
        <Text fontSize="lg" fontWeight={600} textAlign="center">
          All videos displayed
        </Text>
      }
    >
      <Flex
        w={{ base: "100%", md: "500px" }}
        maxW="100%"
        flexDirection="column"
        justifyContent="center"
        align="center"
        m="auto"
        p="0px"
        gap="20px"
        pb="50px"
      >
        {videos?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((post) => (
              <Post
                key={post.id}
                post={post}
                likePostIds={likePosts}
                handleChangeLikePostIds={setLikePosts}
              />
            ))}
          </React.Fragment>
        ))}
      </Flex>
    </InfiniteScroll>
  );
}
