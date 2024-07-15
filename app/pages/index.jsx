import isInitialLoad from "@/utils/middleware/isInitialLoad";
import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  //DO NOT REMOVE THIS.
  return await isInitialLoad(context);
}

const HomePage = () => {
  const router = useRouter();

  return (
    <>
      <Page title="Demo for 28th" subtitle="I actually learnt it ™">
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">View Addons</Text>
                <Text>View created addons that are associated to products</Text>
                <InlineStack align="end" blockAlign="center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/view");
                    }}
                  >
                    View
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">Create Addons</Text>
                <Text>Create associations for products to add in addons</Text>
                <InlineStack align="end" blockAlign="center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/create");
                    }}
                  >
                    Create
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default HomePage;
