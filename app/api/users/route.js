export async function GET() {
    try {
        // Mock user data - in a real app, you would fetch this from a database
        const users = [
            { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" }
        ];
        
        return Response.json(users);
    } catch (error) {
        console.error("Error in users API route:", error);
        return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }
} 