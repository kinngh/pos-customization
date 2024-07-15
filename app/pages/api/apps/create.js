import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is POST");
    return res.status(405).send({ error: true });
  }

  try {
    const addOnData = req.body;

    await prisma.addons.upsert({
      where: { id: addOnData.baseProduct },
      update: {
        addons: addOnData.addons,
      },
      create: {
        id: addOnData.baseProduct,
        addons: addOnData.addons,
        shop: req.user_session.shop,
      },
    });

    return res.status(200).send({ error: false });
  } catch (e) {
    console.error(e);
    return res.status(403).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
