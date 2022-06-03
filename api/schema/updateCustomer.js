const ajvInstance = require("./ajv-instance");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        address: { type: "string" }
    },
    required: [],
    additionalProperties: false
}

module.exports = ajvInstance.compile(schema)