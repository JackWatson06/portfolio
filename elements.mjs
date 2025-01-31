import { defineMetadata } from "html-validate";

export default defineMetadata({
  form: {
    inherit: "form",
    attributes: {
      action: {
        enum: [/^.*$/],
      },
    },
  },
});
