exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse the request body
    const { password } = JSON.parse(event.body);

    // Get the admin password from environment variables
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Validate password
    const isValid = password && password === correctPassword;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valid: isValid,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }
};
