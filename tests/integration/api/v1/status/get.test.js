import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("Get /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();
      expect(responseBody.updated_at).toEqual(
        new Date(responseBody.updated_at).toISOString(),
      );
      expect(responseBody.db_version).toEqual("16.0");
      expect(responseBody.max_connections).toEqual(100);
      expect(responseBody.active_connections).toEqual(1);
    });
  });
});
