import Sidebar from "@components/organism/Sidebar";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Stack height="100vh" direction="row" overflow="hidden">
      <Sidebar />
      {children}
    </Stack>
  );
};

export default Layout;
