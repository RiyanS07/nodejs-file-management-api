const {sendSuccess, sendFailure} = require("../responseHandler");

function createMockResponse(){
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
}

describe("Response Handler", () => {
    test("should send a success response", () =>{
        const res = createMockResponse();

        sendSuccess(res, 200, "Success", {id:1});

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Success",
            data: {id:1}
        });
    });

    test("should send a failure response", () =>{
        const res = createMockResponse();

        sendFailure(res, 400, "invalid input");

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "invalid input",
            error: null
        });
    });
});