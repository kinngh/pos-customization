import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(405).send({ error: true });
  }

  try {
    const addons = await prisma.addons.findMany({
      where: {
        shop: req.user_session.shop,
      },
    });

    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    });

    const shopDetails = await client.request(
      `{
        shop {
            id
        }
      }`
    );
    const shopId = shopDetails.data.shop.id;

    const writeToMetafield = await client.request(
      `
          mutation CreateAppDataMetafield(
            $metafieldsSetInput: [MetafieldsSetInput!]!
          ) {
            metafieldsSet(metafields: $metafieldsSetInput) {
              metafields {
                key
                ownerType
                type
                value
                namespace
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      {
        variables: {
          metafieldsSetInput: [
            {
              ownerId: shopId,
              namespace: "heura",
              key: "addons",
              value: JSON.stringify(addons),
              type: "json",
            },
          ],
        },
      }
    );

    return res.status(200).send({ error: false });
  } catch (e) {
    console.error(e);
    return res.status(403).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
