function PreCalc(number = 0) {
    this.calcStack = [number];

    /**
     * Parses the JSON string
     * @param  {String} inputJSON JSON String
     * @return {Number}           The result of the input operation
     */
    this.calc = function (inputJSON) {
        try {
            let jsonString = JSON.parse(inputJSON);
            return this.evalJSON(jsonString);
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
    this.evalJSON = function (jsonString) {
        let number = 0;
        if (jsonString.op == "push")
            return this.pushStack(jsonString);

        if (jsonString.op == "pop")
            return this.popStack(jsonString);

        if (jsonString.op == "print") {
            this.printStack(jsonString);
            return;
        }

        if ("expr" in jsonString)
            number = this.evalJSON(jsonString.expr);
        else
            number = jsonString.number;

        return this.calcStack[this.calcStack.length - 1] + this.evalExpression(jsonString.op, number);
    }


    /**
     * push the element to the stack
     * @param  {String} jsonString String version of json
     * @return {Number}            The element that is just pushed to the stack
     */
    this.pushStack = function (jsonString) {
        let number = 0;
        if ("expr" in jsonString)
            number = this.evalJSON(jsonString.expr);
        else
            number = jsonString.number;
        this.calcStack.push(number);
        return number;
    }

    /**
     * pop the element from stack
     * @param  {String} jsonString String version of json
     * @return {Number}            The element that is popped from the stack
     */
    this.popStack = function (jsonString) {
        if ("expr" in jsonString)
            this.evalJSON(jsonString.expr);

        if (this.calcStack.length == 0)
            return "(what? You have an empty stack now)";
        return this.calcStack.pop();
    }

    /**
     * Prints the current state of stack
     * @param  {String} jsonString String version of json
     */
    this.printStack = function (jsonString) {
        if ("expr" in jsonString)
            this.evalJSON(jsonString.expr);

        let output = ""
        for (var i = this.calcStack.length - 1; i >= 0; i--)
            output += this.calcStack[i] + ',';
        console.log("Stack = [" + output.slice(0, -1) + "]");
    }

    /**
     * Evaluates the exression
     * @param  {String} op      operation to be performed
     * @param  {Number} number  Number on which operation is to performed
     * @return {Number}         The result of the input operation
     */
    this.evalExpression = function (op, number) {
        if (op=='add')
            return number;
        else if (op=='subtract')
            return -number;
        throw err;
    }
}