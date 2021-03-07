
import {
    calculateDuration,
    createDataTime,
    createCustomHTMLTooltip,
    createSingleDataInput,
    createAllDataInput
}
    from './Timeline'

describe("Create date function", () => {
    test("it should give correct date when given time string 8:00", () => {
        const input = "8:00";
        const output = new Date(0, 0, 0, 8, 0, 0);
        expect(createDataTime(input)).toEqual(output);
    });
});

describe("Create date function", () => {
    test("it should give correct date when given time string 0:00", () => {
        const input = "0:00";
        const output = new Date(0, 0, 0, 0, 0, 0);
        expect(createDataTime(input)).toEqual(output);
    });
});

describe("Create date function", () => {
    test("it should give correct date when given time string 24:00", () => {
        const input = "24:00";
        const output = new Date(0, 0, 0, 24, 0, 0);
        expect(createDataTime(input)).toEqual(output);
    });
});

describe("Create duration function", () => {
    test("it should give correct duration when given start time 8:30 and end time 10:30 ", () => {
        const input1 = "8:30";
        const input2 = "10:30";
        const output = "2:00"
        expect(calculateDuration(input1, input2)).toEqual(output);
    });
});

describe("Create duration function", () => {
    test("it should give correct duration when given start time 8:59 and end time 10:01 ", () => {
        const input1 = "09:59";
        const input2 = "10:01";
        const output = "0:02"
        expect(calculateDuration(input1, input2)).toEqual(output);
    });
});

describe("Create duration function", () => {
    test("it should give correct duration when given start time 8:01 and end time 10:59 ", () => {
        const input1 = "1:00";
        const input2 = "23:00";
        const output = "22:00";
        expect(calculateDuration(input1, input2)).toEqual(output);
    });
});

describe("Create duration function", () => {
    test("it should give correct duration when given start time 8:01 and end time 10:59 ", () => {
        const input1 = "1:00";
        const input2 = "23:00";
        const output = "22:00";
        expect(calculateDuration(input1, input2)).toEqual(output);
    });
});

describe("Create tooltip function", () => {
    test("it should give correct tooltip given the correct parameters ", () => {
        const input1 = "345";
        const input2 = "6:00";
        const input3 = "12:00";
        const input4 = "6:00";
        const input5 = "Eindhoven";
        const input6 = "port";
        const input7 = "Janna";
        const input8 = "1A";
        const output = '<ul class="flex-container">' +
            '<li class="flex-item" style="text-align: center" ><h4><b>345</b></h4></li>' +
            '<li class="flex-item"><b>Start: </b>6:00</li>' +
            '<li class="flex-item"><b>End: </b>12:00</li>' +
            '<li class="flex-item"><b>Duration: </b>6:00</li>' +
            '<li class="flex-item"><b>Destination: </b>Eindhoven</li>' +
            '<li class="flex-item"><b>Order Type: </b>port</li>' +
            '<li class="flex-item"><b>Customer: </b>Janna</li>' +
            '<li class="flex-item"><b>Container ID: </b>1A</li>' +
            '</ul>'
        expect(createCustomHTMLTooltip(input1, input2, input3, input4, input5, input6, input7, input8)).toEqual(output);
    });
});

describe("Create tooltip function", () => {
    test("it should give correct tooltip given the parameters 2 ", () => {
        const input1 = "117";
        const input2 = "4:00";
        const input3 = "14:00";
        const input4 = "10:00";
        const input5 = "Rotterdam";
        const input6 = "port";
        const input7 = "Hans";
        const input8 = "1A";
        const output = '<ul class="flex-container">' +
            '<li class="flex-item" style="text-align: center" ><h4><b>117</b></h4></li>' +
            '<li class="flex-item"><b>Start: </b>4:00</li>' +
            '<li class="flex-item"><b>End: </b>14:00</li>' +
            '<li class="flex-item"><b>Duration: </b>10:00</li>' +
            '<li class="flex-item"><b>Destination: </b>Rotterdam</li>' +
            '<li class="flex-item"><b>Order Type: </b>port</li>' +
            '<li class="flex-item"><b>Customer: </b>Hans</li>' +
            '<li class="flex-item"><b>Container ID: </b>1A</li>' +
            "</ul>"
        expect(createCustomHTMLTooltip(input1, input2, input3, input4, input5, input6, input7, input8)).toEqual(output);
    });
});

describe("Create single data point function", () => {
    test("it should give correct data point with given parameters", () => {
        const input1 = "Truck Janna";
        const input2 = '345';
        const input3 = "6:00"
        const input4 = "12:00"
        const input5 = "Eindhoven"
        const input6 = "port";
        const input7 = "Janna";
        const input8 = "1A";
        const output = ["Truck Janna",
            '345',
            '<ul class="flex-container">' +
            '<li class="flex-item" style="text-align: center" ><h4><b>345</b></h4></li>' +
            '<li class="flex-item"><b>Start: </b>6:00</li>' +
            '<li class="flex-item"><b>End: </b>12:00</li>' +
            '<li class="flex-item"><b>Duration: </b>6:00</li>' +
            '<li class="flex-item"><b>Destination: </b>Eindhoven</li>' +
            '<li class="flex-item"><b>Order Type: </b>port</li>' +
            '<li class="flex-item"><b>Customer: </b>Janna</li>' +
            '<li class="flex-item"><b>Container ID: </b>1A</li>' +
            '</ul>',
            new Date(0, 0, 0, 6, 0, 0),
            new Date(0, 0, 0, 12, 0, 0)]
        expect(createSingleDataInput(input1, input2, input3, input4, input5, input6, input7, input8)).toEqual(output);
    });
});

describe("Create single data point function", () => {
    test("it should give correct data point with given parameters 2", () => {
        const input1 = "Truck Janna";
        const input2 = '117';
        const input3 = "4:00"
        const input4 = "14:00"
        const input5 = "Rotterdam"
        const input6 = "port";
        const input7 = "Hans";
        const input8 = "1A";
        const output = ["Truck Janna",
            '117',
            '<ul class="flex-container">' +
            '<li class="flex-item" style="text-align: center" ><h4><b>117</b></h4></li>' +
            '<li class="flex-item"><b>Start: </b>4:00</li>' +
            '<li class="flex-item"><b>End: </b>14:00</li>' +
            '<li class="flex-item"><b>Duration: </b>10:00</li>' +
            '<li class="flex-item"><b>Destination: </b>Rotterdam</li>' +
            '<li class="flex-item"><b>Order Type: </b>port</li>' +
            '<li class="flex-item"><b>Customer: </b>Hans</li>' +
            '<li class="flex-item"><b>Container ID: </b>1A</li>' +
            '</ul>',
            new Date(0, 0, 0, 4, 0, 0),
            new Date(0, 0, 0, 14, 0, 0)]
        expect(createSingleDataInput(input1, input2, input3, input4, input5, input6, input7, input8)).toEqual(output);
    });
});

describe("Create all data point function", () => {
    test("it should give correct data point with given parameters 2", () => {
        const startArray = [{ type: 'string', id: 'Truck' },
        { type: 'string', id: 'Name' },
        { type: 'string', role: 'tooltip', 'p': { 'html': true } },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' },];
        const input1 = ["Truck Janna", "Truck Janna"];
        const input2 = ["345", "117"];
        const input3 = ["6:00", "4:00"]
        const input4 = ["12:00", "14:00"]
        const input5 = ["Eindhoven", "Rotterdam"]
        const input6 = ["port", "port"]
        const input7 = ["Janna", "Hans"]
        const input8 = ["1A", "1A"]
        const output = [startArray, ["Truck Janna",
            '345',
            '<ul class="flex-container">' +
            '<li class="flex-item" style="text-align: center" ><h4><b>345</b></h4></li>' +
            '<li class="flex-item"><b>Start: </b>6:00</li>' +
            '<li class="flex-item"><b>End: </b>12:00</li>' +
            '<li class="flex-item"><b>Duration: </b>6:00</li>' +
            '<li class="flex-item"><b>Destination: </b>Eindhoven</li>' +
            '<li class="flex-item"><b>Order Type: </b>port</li>' +
            '<li class="flex-item"><b>Customer: </b>Janna</li>' +
            '<li class="flex-item"><b>Container ID: </b>1A</li>' +
            '</ul>',
            new Date(0, 0, 0, 6, 0, 0),
            new Date(0, 0, 0, 12, 0, 0)],
            ["Truck Janna",
                '117',
                '<ul class="flex-container">' +
                '<li class="flex-item" style="text-align: center" ><h4><b>117</b></h4></li>' +
                '<li class="flex-item"><b>Start: </b>4:00</li>' +
                '<li class="flex-item"><b>End: </b>14:00</li>' +
                '<li class="flex-item"><b>Duration: </b>10:00</li>' +
                '<li class="flex-item"><b>Destination: </b>Rotterdam</li>' +
                '<li class="flex-item"><b>Order Type: </b>port</li>' +
                '<li class="flex-item"><b>Customer: </b>Hans</li>' +
                '<li class="flex-item"><b>Container ID: </b>1A</li>' +
                '</ul>',
                new Date(0, 0, 0, 4, 0, 0),
                new Date(0, 0, 0, 14, 0, 0)]]
        expect(createAllDataInput(input1, input2, input3, input4, input5, input6, input7, input8)).toEqual(output);
    });
});

