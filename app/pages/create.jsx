import {
  BlockStack,
  Button,
  Card,
  Layout,
  Page,
  Text,
  TextField,
  DataTable,
  Icon,
  InlineStack,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateAddons = () => {
  const router = useRouter();
  const [baseProduct, setBaseProduct] = useState();
  const [addonGroups, setAddonGroups] = useState([]);
  const [saving, setSaving] = useState(false);

  async function openResourcePicker(initQuery, multiple = false) {
    const selected = await window?.shopify?.resourcePicker({
      type: "product",
      query: initQuery,
      filter: {
        hidden: false,
        variants: false,
      },
      action: "select",
      multiple,
    });
    return selected;
  }

  async function handleBaseProductSelection(initQuery) {
    const selected = await openResourcePicker(initQuery);
    if (selected) {
      setBaseProduct({ ...selected[0] });
    }
  }

  async function handleAddAddonGroup() {
    const newGroup = {
      title: "",
      products: [],
    };
    setAddonGroups([...addonGroups, newGroup]);
  }

  function handleRemoveAddonGroup(groupIndex) {
    const updatedGroups = addonGroups.filter(
      (_, index) => index !== groupIndex
    );
    setAddonGroups(updatedGroups);
  }

  async function handleAddProducts(groupIndex) {
    const selected = await openResourcePicker("", true);
    if (selected) {
      const updatedGroups = [...addonGroups];
      updatedGroups[groupIndex].products = [
        ...updatedGroups[groupIndex].products,
        ...selected.map((product) => ({
          id: product.id,
          title: product.title,
          image: product.images[0]?.originalSrc || "",
          price: product.variants[0]?.price || "",
        })),
      ];
      setAddonGroups(updatedGroups);
    }
  }

  function handleRemoveProduct(groupIndex, productIndex) {
    const updatedGroups = [...addonGroups];
    updatedGroups[groupIndex].products = updatedGroups[
      groupIndex
    ].products.filter((_, index) => index !== productIndex);
    setAddonGroups(updatedGroups);
  }

  function handleGroupTitleChange(groupIndex, newTitle) {
    const updatedGroups = [...addonGroups];
    updatedGroups[groupIndex].title = newTitle;
    setAddonGroups(updatedGroups);
  }

  async function handleSave() {
    try {
      setSaving(true);

      const payload = {
        baseProduct: baseProduct?.id,
        addons: addonGroups.map((group) => ({
          groupTitle: group.title,
          products: group.products.map(({ id, title, price }) => ({
            id,
            title,
            price,
          })),
        })),
      };
      const response = await fetch("/api/apps/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save addons");
      }

      const result = await response.json();
      console.log("Addons saved successfully:", result);
      window?.shopify?.toast?.show("Saved successfully");
    } catch (error) {
      console.error("Error saving addons:", error);
      window?.shopify?.toast?.show("Error while saving addons");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page
      title="Create Addons"
      primaryAction={{ content: "Save", onAction: handleSave, loading: saving }}
      backAction={{
        onAction: () => {
          router.push("/");
        },
      }}
    >
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card>
            <BlockStack gap="200">
              <TextField
                label="Base Product"
                value={baseProduct?.title || ""}
                onChange={(value) => {
                  handleBaseProductSelection(value);
                }}
                connectedRight={
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleBaseProductSelection("");
                    }}
                  >
                    Search
                  </Button>
                }
              />
            </BlockStack>
          </Card>
        </Layout.Section>
        {baseProduct ? (
          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack>
                <Text>Title: {baseProduct?.title}</Text>
                <Text>Variants: {baseProduct?.totalVariants}</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        ) : null}
        {addonGroups.map((group, groupIndex) => (
          <Layout.Section variant="fullWidth">
            <BlockStack gap="400">
              <Card key={groupIndex}>
                <BlockStack gap="400">
                  <InlineStack blockAlign="center" align="space-between">
                    <Text variant="headingLg">
                      {group?.title
                        ? group.title
                        : `Add On Group ${groupIndex + 1}`}
                    </Text>
                    <Button
                      onClick={() => handleRemoveAddonGroup(groupIndex)}
                      tone="critical"
                      variant="secondary"
                    >
                      Remove Group
                    </Button>
                  </InlineStack>
                  <BlockStack gap="200">
                    <TextField
                      label="Addon Group Title"
                      value={group.title}
                      onChange={(value) =>
                        handleGroupTitleChange(groupIndex, value)
                      }
                    />
                  </BlockStack>
                  <Button
                    onClick={() => handleAddProducts(groupIndex)}
                    variant="primary"
                  >
                    Add Products
                  </Button>
                  <DataTable
                    columnContentTypes={["text", "text", "numeric", "numeric"]}
                    headings={["Image", "Title", "Price", " "]}
                    rows={group.products.map((product, productIndex) => [
                      <img
                        src={product.image}
                        alt={product.title}
                        width="50"
                        height="50"
                      />,
                      product.title,
                      `$${product.price}`,
                      <Button
                        tone="critical"
                        onClick={() =>
                          handleRemoveProduct(groupIndex, productIndex)
                        }
                      >
                        <Icon source={DeleteIcon} />
                      </Button>,
                    ])}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        ))}
        {baseProduct ? (
          <Layout.Section variant="fullWidth">
            <Button onClick={handleAddAddonGroup} fullWidth variant="primary">
              Add Addon Group
            </Button>
          </Layout.Section>
        ) : null}
      </Layout>
    </Page>
  );
};

export default CreateAddons;
