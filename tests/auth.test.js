const request = require("supertest");
const app = require("../server");

describe("Authentication API", () =>{
    test("should reject access without a token", async () =>{
        const response = await request(app).get("/files");

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Access denied. Token required.");
    });

    test("Should reject login with incorrect credentials", async () => {
        const response = await request(app)
        .post("/login")
        .send({
            username: "wrong_user",
            password: "wrong_password"
        });
        expect(response.status).toBe(401);
    });

    test("should reject login when credentials are missing", async () => {
        const response = await request(app)
        .post("/login")
        .send({});

        expect(response.status).toBe(400);
    });
});