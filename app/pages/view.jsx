import prisma from "@/utils/prisma";
import validateJWT from "@/utils/validateJWT";
import {
  BlockStack,
  Card,
  DataTable,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/router";

const ViewAddons = ({ addons }) => {
  const router = useRouter();

  return (
    <Page
      title="View Addons"
      backAction={{
        onAction: () => {
          router.push("/");
        },
      }}
    >
      <Layout>
        {addons.map((baseProduct) => (
          <Layout.Section key={baseProduct.id}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">
                  Base Product: {baseProduct.id}
                </Text>
                {baseProduct.addons.map((group, index) => (
                  <BlockStack key={index} gap="200">
                    <Text variant="headingMd" as="h3">
                      {group.groupTitle}
                    </Text>
                    <DataTable
                      columnContentTypes={["text", "text", "numeric"]}
                      headings={["Product ID", "Title", "Price"]}
                      rows={group.products.map((product) => [
                        product.id,
                        product.title,
                        `$${parseFloat(product.price).toFixed(2)}`,
                      ])}
                    />
                  </BlockStack>
                ))}
              </BlockStack>
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
};

export default ViewAddons;

export async function getServerSideProps(context) {
  try {
    let authHeader = context.req.headers.authorization;
    authHeader = validateJWT(authHeader.split(" ")[1]);

    const shop = authHeader.dest.replace("https://", "");

    const addons = await prisma.addons.findMany({
      where: {
        shop: shop,
      },
      select: {
        id: true,
        addons: true,
        shop: false,
      },
    });

    return {
      props: {
        addons: addons,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        serverError: true,
      },
    };
  }
}
