const fs = require('fs');
const path = require('path');
const { apiCodegen } = require('../node_modules/convex/dist/cjs/cli/codegen_templates/api.js');
const { serverCodegen } = require('../node_modules/convex/dist/cjs/cli/codegen_templates/server.js');

const outDir = path.join(__dirname, '..', 'src', 'convex', '_generated');
fs.mkdirSync(outDir, { recursive: true });

const modules = [
  'addresses.ts',
  'auth.ts',
  'auth/emailOtp.ts',
  'cart.ts',
  'http.ts',
  'orders.ts',
  'products.ts',
  'profile.ts',
  'users.ts'
];

const apiRes = apiCodegen(modules, { useTypeScript: true });
fs.writeFileSync(path.join(outDir, 'api.ts'), apiRes.TS);
fs.writeFileSync(path.join(outDir, 'api.js'), 'import { anyApi } from "convex/server";\nexport const api = anyApi;\nexport const internal = anyApi;\n');
fs.writeFileSync(path.join(outDir, 'api.d.ts'), apiRes.TS);

const serverRes = serverCodegen({ useTypeScript: true });
fs.writeFileSync(path.join(outDir, 'server.ts'), serverRes.TS);
fs.writeFileSync(path.join(outDir, 'server.d.ts'), serverRes.TS);

const dataModelContent = `/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run \`npx convex dev\`.
 * @module
 */

import type { DataModelFromSchemaDefinition, DocumentByName, TableNamesInDataModel, SystemTableNames } from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;

/**
 * An identifier for a document in Convex.
 *
 * Convex documents are uniquely identified by their \`Id\`, which is accessible
 * on the \`_id\` field. To learn more, see [Document IDs](https://docs.convex.dev/using/document-ids).
 *
 * Documents can be loaded using \`db.get(tableName, id)\` in query and mutation functions.
 *
 * IDs are just strings at runtime, but this type can be used to distinguish them from other
 * strings when type checking.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>;

/**
 * A type describing your Convex data model.
 *
 * This type includes information about what tables you have, the type of
 * documents stored in those tables, and the indexes defined on them.
 *
 * This type is used to parameterize methods like \`queryGeneric\` and
 * \`mutationGeneric\` to make them type-safe.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
`;

fs.writeFileSync(path.join(outDir, 'dataModel.d.ts'), dataModelContent);
fs.writeFileSync(path.join(outDir, 'dataModel.ts'), dataModelContent);
console.log('Convex generated files created successfully');
