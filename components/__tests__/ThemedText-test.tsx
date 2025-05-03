import * as React from "react";
import renderer from "react-test-renderer";
import { BaseText } from "../ui";

it(`renders correctly`, () => {
  const tree = renderer.create(<BaseText>Snapshot test!</BaseText>).toJSON();

  expect(tree).toMatchSnapshot();
});
