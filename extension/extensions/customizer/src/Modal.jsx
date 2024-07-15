import {
  Navigator,
  reactExtension,
  Screen,
  ScrollView,
  Text, useApi
} from "@shopify/ui-extensions-react/point-of-sale";
import React from "react";

const Modal = () => {
  //There's nothing to access the metafields????????????????????
  const {} = useApi()
  return (
    <>
      <Navigator>
        <Screen name="HelloWorld" title="Furniture Customizer">
          <ScrollView>
            <Text>This has something to do with the thing</Text>
          </ScrollView>
        </Screen>
      </Navigator>
    </>
  );
};

export default reactExtension("pos.home.modal.render", () => <Modal />);
