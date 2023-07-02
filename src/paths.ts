import "module-alias/register";
import {addAliases} from "module-alias";

addAliases({
    "@entities-lib": `${__dirname}/../../entities-lib`,
    "@root": `${__dirname}/..`,
});
