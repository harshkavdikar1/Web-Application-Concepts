var result = 0;

/**
 * Parses the JSON string
 * @param  {String} inputJSON JSON String
 * @return {Number}      The result of the input operation
 */
function calc(inputJSON){
    try {
        let jsonString = JSON.parse(inputJSON);
        result += evalExpression(jsonString.op, jsonString.number);
        return result
    }
    catch (err){
        console.error("Unable to process JSON");
    }
}

/**
 * Evaluates the exression
 * @param  {String} op      operation to be performed
 * @param  {Number} number  Number on which operation is to performed
 * @return {Number}         The result of the input operation
 */
function evalExpression(op, number){
    if (op=='add')
        return number;
    else if (op=='subtract')
        return -number;
    throw err;
}