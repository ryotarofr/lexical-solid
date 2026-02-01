import "./PlainTextEditor.css";
import { clientOnly } from "@solidjs/start";

const Editor = clientOnly(() => import("../components/PlainTextEditor"));

export default function () {
  return (
    <>
      <p>Plain Text Example</p>
      <p>Note: this is an experimental port of @lexical/react</p>
      <Editor />
    </>
  );
}
