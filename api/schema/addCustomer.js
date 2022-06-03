const ajvInstance = require("./ajv-instance");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        address: { type: "string" },
        mobile: { type: "string" }
    },
    required: ["name", "address", "mobile"],
    additionalProperties: false
}

module.exports = ajvInstance.compile(schema)