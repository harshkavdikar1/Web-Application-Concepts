var result = 0;

/**
 * Parses the JSON string
 * @param  {String} inputJSON JSON String
 * @return {Number}           The result of the input operation
 */
function calc(inputJSON){
    try {
        let jsonString = JSON.parse(inputJSON);
        return evalJSON(jsonString);
    }
    catch (err){
        console.error("Unable to process JSON");
    }
}

/**
 * Evaluates the JSON String
 * @param  {String} jsonString String version of json
 * @return {Number}            The result of the input operation
 */
function evalJSON(jsonString){
    let number = 0;
    if ("expr" in jsonString)
        number = evalJSON(jsonString.expr);
    else
        number = jsonString.number;
    result += evalExpression(jsonString.op, number);
    return result
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
