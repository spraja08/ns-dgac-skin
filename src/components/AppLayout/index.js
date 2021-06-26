import React, { FunctionComponent, useMemo } from "react";
import AppLayoutBase from "aws-northstar/layouts/AppLayout";
import HeaderBase from "aws-northstar/components/Header";
import SideNavigationBase, {
  SideNavigationItemType,
} from "aws-northstar/components/SideNavigation";
import BreadcrumbGroup from "aws-northstar/components/BreadcrumbGroup";
import Box from "aws-northstar/layouts/Box";
import NotificationButton from "aws-northstar/advanced/NotificationButton";
import ButtonDropdown from "aws-northstar/components/ButtonDropdown";
import Badge from "aws-northstar/components/Badge";

const AppLayout = ({ children }) => {
  const menuItems = [
    { text: "My Account", onClick: () => console.log("My account") },
    { text: "My DataProducts", onClick: () => console.log("My DataProducts") },
    { text: "Sign Out", onClick: () => console.log("Sign out") },
  ];

  const rightContent = (
    <Box display="flex" alignItems="center">
      <NotificationButton onDismissNotification={console.log} />
      <ButtonDropdown content="rspamzn" items={menuItems} darkTheme />
    </Box>
  );

  const Header = useMemo(
    () => (
      <HeaderBase
        title="Federated Computational Governance"
        logoPath="/logo-light-full.png"
        rightContent={rightContent}
      />
    ),
    []
  );
  const Breadcrumbs = useMemo(() => <BreadcrumbGroup rootPath="Home" />, []);
  const SideNavigation = useMemo(() => {
    return (
      <SideNavigationBase
        header={{ text: "DGaC Building Blocks", href: "/" }}
        items={[
          { text: "Home", type: SideNavigationItemType.LINK, href: "/" },
          { text: "Users", type: SideNavigationItemType.LINK, href: "/users" },
          { text: "Roles", type: SideNavigationItemType.LINK, href: "/roles" },
          { text: "Business Domains", type: SideNavigationItemType.LINK, href: "/dataDomains" },
          { text: "DGaC Constructs", type: SideNavigationItemType.LINK, href: "/dgac" },
          { text: "Business Ontology", type: SideNavigationItemType.LINK, href: "/ontologyAttributes" },

          { type: SideNavigationItemType.DIVIDER },
          { text: "Data Products", type: SideNavigationItemType.LINK, href: "/dataProducts" },
          { type: SideNavigationItemType.DIVIDER },
          { text: "Query Workbench", type: SideNavigationItemType.LINK, href: "/query" },
          { type: SideNavigationItemType.DIVIDER },
          {
            type: SideNavigationItemType.LINK,
            text: "Notifications",
            href: "/notifications",
            info: <Badge color="red" content="23"></Badge>,
          },
          {
            type: SideNavigationItemType.LINK,
            text: "Documentation",
            href: "https://amazon.awsapps.com/workdocs/index.html#/document/362ef575ee7816b87d8361adc4cf7a4ad0374f1a24877bd537c7d6bffb77faa3",
          },
        ]}
      ></SideNavigationBase>
    );
  }, []);

  return (
    <AppLayoutBase
      header={Header}
      navigation={SideNavigation}
      breadcrumbs={Breadcrumbs}
    >
      {children}
    </AppLayoutBase>
  );
};

export default AppLayout;
