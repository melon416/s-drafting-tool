import validateJS from 'validate.js';
import { setValidateJS, transform } from 'amlib/dist/validation';
import { addID } from 'amlib/dist/validation/id';
import { addString } from 'amlib/dist/validation/string';
import { addInt } from 'amlib/dist/validation/int';
import { addArray } from 'amlib/dist/validation/array';
import { fixDateTime } from 'amlib/dist/validation/datetime';
import { addBool } from 'amlib/dist/validation/bool';
import { fixEmail } from 'amlib/dist/validation/email';

export { createValidator } from 'amlib/dist/validation';

setValidateJS(validateJS);

addID(validateJS);
addString(validateJS);
addInt(validateJS);
addArray(validateJS, transform);
addBool(validateJS);

fixDateTime(validateJS);
fixEmail(validateJS);
