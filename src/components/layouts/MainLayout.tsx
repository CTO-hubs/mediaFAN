import { SnackbarProvider } from "notistack";
import { FunctionComponent, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import AuthHeader from "../common/Home/Sections/Header";
import Footer from "../common/Home/Sections/Footer";
import UserLayout from "./UserLayout";
import { Box, Image, Flex, Text, Spinner, VStack } from "@chakra-ui/react";

// const DMPage = React.lazy(() => Promise.resolve(<Outlet />));

interface MainLayoutProps {}

const MainLayout: FunctionComponent<MainLayoutProps> = () => {
  const location = useLocation();
  const { data: user, isLoading } = useUser();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [locationSet, setLocationSet] = useState(false);

  useEffect(() => {
    setLocationSet(true);
  }, [location]);

  useEffect(() => {
    if (!isLoading) {
      if (location.pathname === "/") {
        if (user) {
          window.location.href = "/feed";
          setPageLoaded(true);
        } else {
          if (import.meta.env.VITE_ENV == "DEV") {
            window.location.href = "/feed";
          } else {
            window.location.replace(import.meta.env.VITE_DJFAN_HOME_URL);
          }
        }
      } else {
        setPageLoaded(true);
      }
    }
  }, [isLoading]);

  if (isLoading || !pageLoaded) {
    return (
      <>
        <Flex justifyContent="center" alignItems="center" h="100vh" backgroundColor="#000" flexWrap="wrap">
          <VStack spacing={10}>
            <Box>
              <Image w="130px" src="https://files.djfan.app/images/logo/DJFAN_HOR_WHITE.svg" />
            </Box>
            <Box>
              <Spinner thickness="4px" speed="0.9s" emptyColor="gray.200" color="blue.500" size="md" />
              ""
              <Text as="span" style={{ padding: "6px", fontSize: "28px", color: "#FFF", position: "relative", top: "-3px" }}>
                Loading
              </Text>
            </Box>
          </VStack>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        {user ? (
          <UserLayout />
        ) : (
          <>
            <AuthHeader /> <Outlet />
          </>
        )}
        <SnackbarProvider />
        {!user && <Footer />}
      </>
    );
  }
};

export default MainLayout;
